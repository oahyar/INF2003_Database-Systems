import json
from pymongo import MongoClient

def importToDB(clientConnectionString, sourceFile):
    databaseClient = MongoClient(clientConnectionString, username="admin", password="devenv22!")
    databaseInstance = databaseClient.TraffiCam
    cameraCollection = databaseInstance.cameras

    with open(sourceFile, 'r') as inputFile:
        geoJsonData = json.load(inputFile)

    importCounter = 0

    for featureObject in geoJsonData["features"]:
        cameraCollection.insert_one(featureObject["properties"])
        importCounter += 1
    
    print(f"Successfully imported {importCounter} entries.")

importToDB("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1", "cleanedData/mergedFile.json")