#pip install flask
import flask
import os
import json
import time
from flask.json import jsonify
#pip install mysql-connector-python
import mysql.connector
from flask import request
#pip install --upgrade google-cloud-pubsub
from google.cloud import pubsub_v1
from datetime import datetime
#pip install pymongo
from pymongo import MongoClient

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './GCPKey.json'

client = MongoClient("mongodb://proyecto1-mongodb:FLAJuykpeNXSGoSgvUAq8CdQKwTG6TuiPvucxg3GbusrdEbD4ugMNqGvQmLYuz94iMyxPS4TFn8agUZ971bGrw==@proyecto1-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@proyecto1-mongodb@")
db=client.mydb

mydb = mysql.connector.connect(
  host="34.123.196.134",
  user="root",
  password="l9j6oytdaq9DGhbO@",
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

@app.route('/subirCargaPythonCloudRun', methods=['GET'])
def getItem():
    sqlQuery = "INSERT INTO Tweet (Nombre,Comentario,Fecha,Hashtags,Upvotes,Downvotes) VALUES (%s,%s,%s,%s,%s,%s)"
    startTime = time.time()
    hashTagsString = ''
    auxData=data.copy()
    data.clear()
    countMySql=0
    countMongoDb=0

    # MySQL Operations
    for item in auxData:
        for hashtag in item["hashtags"]:
            hashTagsString = hashTagsString+'#'+hashtag+','
        hashTagsString[:-1]
        val = (item["nombre"],item["comentario"],datetime.strptime(item["fecha"],'%d-%m-%Y').strftime('%Y/%m/%d'),hashTagsString,item["upvotes"],item["downvotes"])
        myDbCursor.execute(sqlQuery,val)
        mydb.commit()
        hashTagsString = ''
        countMySql=countMySql+1
    mySqlEndTime = time.time() - startTime

    # MongoDB Operations
    startTime = time.time()
    for item in auxData:
        for hashtag in item["hashtags"]:
            hashTagsString = hashTagsString+'#'+hashtag+','
        hashTagsString[:-1]
        val = {
            "Nombre":item["nombre"],
            "Comentario":item["comentario"],
            "Fecha":datetime.strptime(item["fecha"],'%d-%m-%Y').strftime('%Y/%m/%d'),
            "Hashtags":hashTagsString,
            "Upvotes":item["upvotes"],
            "Downvotes":item["downvotes"]
        }
        db.tweet.insert_one(val)
        hashTagsString = ''
        countMongoDb=countMongoDb+1
    mongoDbEndTime = time.time() - startTime

    # MySQL PubSub
    pubSubData = '{'+ f'"guardados":{countMySql},"api":"Python CloudRun","tiempoDeCarga":{mySqlEndTime},"bd":"MySQL"' +'}'
    pubSubData = pubSubData.encode("utf-8")
    publisher.publish('projects/sapient-ground-324600/topics/dbUpdates',pubSubData)

    # MongoDB PubSub
    pubSubData = '{'+ f'"guardados":{countMongoDb},"api":"Python CloudRun","tiempoDeCarga":{mongoDbEndTime},"bd":"MongoDB"' +'}'
    pubSubData = pubSubData.encode("utf-8")
    publisher.publish('projects/sapient-ground-324600/topics/dbUpdates',pubSubData)

    return pubSubData

app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
