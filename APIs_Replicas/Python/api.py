#pip install flask
import flask
import json
import time
from flask.json import jsonify
#pip install mysql-connector-python
import mysql.connector
from flask import request
#pip install --upgrade google-cloud-pubsub
from google.cloud import pubsub_v1
from datetime import datetime

mydb = mysql.connector.connect(
  host="34.122.159.115",
  user="root",
  password="password",
  database="mydb"
)
myDbCursor = mydb.cursor()

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path('sapient-ground-324600', 'dbUpdates-sub')


app = flask.Flask(__name__)
app.config["DEBUG"] = True

data = []

@app.route('/', methods=['GET'])
def home():
    return "<h1>SOPES 1 - Proyecto 1</h1>"

@app.route('/iniciarCarga', methods=['POST'])
def iniciarCarga():
    bodyJson = request.json
    data.append(bodyJson)
    return '{ "ok":"true"}'

@app.route('/subirCargaPython', methods=['GET'])
def getItem():
    sqlQuery = "INSERT INTO Tweet (Nombre,Comentario,Fecha,Hashtags,Upvotes,Downvotes) VALUES (%s,%s,%s,%s,%s,%s)"
    startTime = time.time()
    hashTagsString = ''
    count =0
    for item in data:
        for hashtag in item["hashtags"]:
            hashTagsString = hashTagsString+hashtag+','
        hashTagsString[:-1]
        val = (item["nombre"],item["comentario"],datetime.strptime(item["fecha"],'%d-%m-%Y').strftime('%Y/%m/%d'),hashTagsString,item["upvotes"],item["downvotes"])
        myDbCursor.execute(sqlQuery,val)
        mydb.commit()
        count=count+1
        hashTagsString = ''
    endTime = time.time() - startTime

    pubSubData = '{'+ f'"guardados":{count},"api":"Python","tiempoDeCarga":{endTime},"bd":"MySQL"' +'}'
    pubSubData = pubSubData.encode("utf-8")
    publisher.publish('projects/sapient-ground-324600/topics/dbUpdates',pubSubData)

    return pubSubData

app.run()

