import requests
import random
import time
import influxdb_client, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
from dotenv import load_dotenv
import os

#Obtenemos el usuario y contraseña del .env

load_dotenv()

username = os.getenv("MY_USERNAME")
password = os.getenv("MY_PASSWORD")

API_URL = "http://localhost:8080/api/inversores/group/"

token = "psO1oImBZWlAxJqMTwqtsdRMHHVaAajVWbD-MIPrDqFktIwA5iVlJgsJ6pjf9iJ2bCRUSxL44HCt4xSlsjstOw=="
org = "mdomgar"
url = "http://192.168.0.38:8086"

def insertInflux(info):
    #Realizo la conexión con Influx
    write_client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)

    bucket = "SolarData"
    
    write_api = write_client.write_api(write_options=SYNCHRONOUS)


    try:
        #Hacemos un bucle for para recorrer el array de info
            point = (
                #Guardaremos los datos como medicion1 (nombre generico)
                Point("medicion1")
                #Guardamos device_id como un tag y cuando la fila sea NE insertara los datos
                .tag("deviceId", info["inversor"]["deviceId"])
                #Guardamos station_label como un tag y cuando la fila sea station_label insertara los datos
                .tag("stationLabel", info["inversor"]["stationLabel"])
                .field("totalIncome", info["totalIncome"])
                .field("totalPower", info["totalPower"])
                .field("dayPower", info["dayPower"])
                .field("activePower", info["activePower"])
                .field("mpptPower", info["mpptPower"])
            )

            for i in range (1, 6):
                point = point.field(f"pv{i}_u", info.get(f"pv{i}_u"))
                point = point.field(f"pv{i}_i", info.get(f"pv{i}_i"))
                
            
            print(f"Writing point: {info}")
            write_api.write(bucket=bucket, org=org, record=point)
            time.sleep(1)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        write_client.close()


while True:
    # Genera un número aleatorio entre 1 y 10
    group_id = random.randint(1, 10)

    # Construiye la URL con el group_id
    url_api = f"{API_URL}{group_id}"

    response = requests.get(url_api, auth=(username, password))

    if response.status_code == 200:
        data_json = response.json()
        print(f"Data for group_id {group_id}:")
        print(data_json)
        for data in data_json:
            print(f"Obtaining data from device {data["inversor"]["deviceId"]}")
            insertInflux(data)
        
    else:
        print(f"Error {response.status_code}: No se pudieron obtener datos para group_id {group_id}")

    time.sleep(300)