import json
import requests
LOADBALANCER_URL = 'https://pythonapi-cj34bwpl3a-uc.a.run.app'

myDataFile = open('../data.json',)
JSONData = json.load(myDataFile)

URL = f'{LOADBALANCER_URL}/iniciarCarga'

input("Presiona cualquier tecla para enviar trafico...")

for i in JSONData:

    x = requests.post(URL, data = json.dumps(i),headers={'Content-Type': 'application/json'})
    if(x.status_code>=400):
        print('Error')     

apisEndPoints = ['subirCargaPythonCloudRun']

input("Presiona cualquier tecla para subir datos...")

for i in apisEndPoints:
    URL = f'{LOADBALANCER_URL}/{i}'
    x = requests.get(URL, data = json.dumps(i))
    if(x.status_code>=400):
        print(f'Error en /{i}') 
    else:
        print(f'OK /{i}') 

myDataFile.close()