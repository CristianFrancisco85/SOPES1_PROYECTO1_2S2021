#pip install flask
import flask
import json
from flask.json import jsonify
#pip install mysql-connector-python
import mysql.connector
from flask import request
#pip install --upgrade google-cloud-pubsub
from google.cloud import pubsub_v1

mydb = mysql.connector.connect(
  host="34.122.159.115",
  user="root",
  password="password",
  database="mydb"
)
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
    return "<h1>Distant Reading Archive</h1><p>This type API for distant reading of science fiction novels.</p>"

@app.route('/getData', methods=['GET'])
def getItem():
    pubSubData = f"Message number {len(data)}"
    pubSubData = pubSubData.encode("utf-8")
    future = publisher.publish('projects/sapient-ground-324600/topics/dbUpdates',pubSubData)
    print(future.result())

    return jsonify(data)

app.run()

