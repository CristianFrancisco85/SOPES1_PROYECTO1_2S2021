import json
import requests
ENDPOINT = ''

myDataFile = open('../data.json',)
JSONData = json.load(myDataFile)

ENDPOINT = input("Ingrese EndPonit: ")

URL = f'{ENDPOINT}/iniciarCarga'
input("Presiona Enter para enviar trafico...")

okPost=0
errorPost=0

for i in JSONData["data"]:
    x = requests.post(URL, data = json.dumps(i),headers={'Content-Type': 'application/json'})
    if(x.status_code>=300):
        errorPost=errorPost+1
    else:
        okPost=okPost+1
print(f'Solicitudes Exitosas:{okPost}')
print(f'Solicitudes Fracasadas:{errorPost}')

apisEndPoints = ['subirCargaPythonCloudRun','subirCargaPython','subirCargaPythonDocker','subirCargaPythonContainerd','subirCargaGolangCloudRun','subirCargaGolang','subirCargaGolangDocker','subirCargaGolangContainerd','subirCargaRust','subirCargaRustDocker','subirCargaRustContainerd']

input("Presiona Enter para subir datos...")

for i in apisEndPoints:
    URL = f'{ENDPOINT}/{i}'
    x = requests.get(URL)
    if(x.status_code>=400):
        print(f'Error en /{i}') 
    else:
        print(f'OK /{i}') 

myDataFile.close()