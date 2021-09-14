import json
import requests

input("Presiona Enter para enviar trafico...")
  
myDataFile = open('../data.json',)
JSONData = json.load(myDataFile)

url = 'http://127.0.0.1:5000/iniciarCarga'

for i in JSONData:

    x = requests.post(url, data = json.dumps(i),headers={'Content-Type': 'application/json'})
    if(x.status_code>=400):
        print('Error')

myDataFile.close()