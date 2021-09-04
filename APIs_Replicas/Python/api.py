#pip install flask
import flask
import json
from flask.json import jsonify
#pip install mysql-connector-python
import mysql.connector
from flask import request

mydb = mysql.connector.connect(
  host="34.122.159.115",
  user="root",
  password="password",
  database="mydb"
)

print(mydb)

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
    return jsonify(data)

app.run()

