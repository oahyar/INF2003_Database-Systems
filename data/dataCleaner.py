import json
import re

def removeHTMLTags(inputString):                                                                                        # Function to remove HTML tags from strings
    cleanr = re.compile('<.*?>')
    return re.sub(cleanr, '', inputString)

def loadGeoJsonFile(inputFilePath, outputFilePath):                                                                     # Function to load and clean GeoJson files

    with open(inputFilePath, 'r') as inputFile:                                                                         # Open the GeoJSON file in read mode
        geoJsonData = json.load(inputFile)                                                                              # Load the GeoJSON file content
    
    for featureObject in geoJsonData["features"]:                                                                       # For each "feature" Json object in the "features" object,
        propertiesJsonAttribute = featureObject.get("properties", {})                                                   # Get the properties attribute of that "feature" Json object
        descriptionJsonAttribute = propertiesJsonAttribute.get("Description", "")                                       # Get the description attribute within that properties attribute
        
        propertiesJsonAttribute["Description"] = removeHTMLTags(descriptionJsonAttribute)                               # Removing HTML tags from the description attribute
        propertiesJsonAttribute["Description"] = propertiesJsonAttribute["Description"].replace("Attributes ", "")      # Removing unnecessary data from the modified description attribute

    with open(outputFilePath, 'w') as outputFile:                                                                       # Opening / creating output file
        json.dump(geoJsonData, outputFile, indent=4)                                                                    # Writing modified content to output file

    print(f"Cleaned GeoJSON data has been saved to {outputFilePath}")                                                   # Success message

def splitDescription(descriptionString):                                                            # Function to split the description attribute string into Json attributes
    newAttributes = {}                                                                              # Declare an empty dictionary to store new Json attributes
    listOfStringParts = descriptionString.split()                                                   # Splitting the description attribute string by spaces and storing into a list of parts
    i = 0                                                                                           # Initialize counter

    while i < len(listOfStringParts):                                                               # Loop through each word, 
        keyword = listOfStringParts[i]                                                              # Declare current word as the keyword,

        if keyword in listOfDelimiters:                                                             # If the keyword matches any of the keywords declared in the list of delimiters, 
            attributeName = keyword                                                                 # Declare the keyword as an attribute,
            i += 1                                                                                  # Increase loop counter,
            attributeValue = ""
            
            while i < len(listOfStringParts) and listOfStringParts[i] not in listOfDelimiters:      # While the subsequent parts do not match any word from the list of delimiters,
                attributeValue += listOfStringParts[i] + " "                                        # Concatenate them,
                i += 1                                                                              # Increase loop counter,

            attributeValue = attributeValue.rstrip()                                                # Strip trailing spaces,

            try:                                                                                    # Try converting attribute value into integer,
                attributeValue = int(attributeValue)

            except ValueError:                                                                      # If ValueError is thrown then let it be,
                attributeValue = attributeValue                                                     

            newAttributes[attributeName] = attributeValue                                           # Add new key - value pair to the new Json attributes dictionary

    return newAttributes                                                                            # Return the new Json attributes dictionary

def loadCleanedGeoJsonFile(inputFilePath, outputFilePath, cameraType):                              # Function to further clean cleaned GeoJson files
    
    try:
        with open(inputFilePath, 'r') as inputFile:                                                 # Open the GeoJSON file in read mode
            geoJsonData = json.load(inputFile)                                                      # Load the GeoJSON file content

        for featureObject in geoJsonData["features"]:                                               # For each "feature" Json object in the "features" object,
            propertiesJsonAttribute = featureObject.get("properties", {})                           # Get the properties attribute of that "feature" Json object
            descriptionJsonAttribute = propertiesJsonAttribute.get("Description", "")               # Get the description attribute within that properties attribute

            newJsonAttributes = splitDescription(descriptionJsonAttribute)                          # Split the description attribute string into Json attributes
            propertiesJsonAttribute.pop("Description", None)                                        # Remove the description attribute entirely
            propertiesJsonAttribute.pop("Name", None)                                               # Remove the description attribute entirely
            additionalJsonAttribute = {"Type":cameraType}
            propertiesJsonAttribute.update(additionalJsonAttribute)
            propertiesJsonAttribute.update(newJsonAttributes)                                       # Update properties attribute with new attributes
            propertiesJsonAttribute.pop("INC_CRC", None)                                            # Remove the description attribute entirely
            propertiesJsonAttribute.pop("FMEL_UPD_D", None)                                         # Remove the description attribute entirely
            propertiesJsonAttribute.pop("LATITUDE", None)                                           # Remove the description attribute entirely
            propertiesJsonAttribute.pop("LONGITUDE", None)                                          # Remove the description attribute entirely
            

        with open(outputFilePath, 'w') as outputFile:                                               # Opening / creating output file
            json.dump(geoJsonData, outputFile, indent=4)                                            # Writing modified content to output file

        print(f'Updated JSON data saved to {outputFilePath}')                                       # Success message

    except Exception as e:
        print(f'An error occurred: {str(e)}')                                                       # Failure message

def mergeJsonFiles(inputArray, outputFilePath):                                                     # Initialize an empty list to store the feature collections
    
    mergedFeatures = []

    for filePath in inputArray:
        with open('cleanedData/cleaned_twice_' + filePath, 'r') as f:
            geoJsonData = json.load(f)
            geoJsonData = sorted(geoJsonData["features"], key=lambda feature: feature.get("properties", {}).get("ID", ""))
            mergedFeatures.extend(geoJsonData)

    mergedData = {"features": mergedFeatures}

    with open(outputFilePath, 'w') as output:
        json.dump(mergedData, output, indent=4)

    print(f'All JSON data cleaned, merged and saved to {outputFilePath}')


listOfDelimiters = ["ID", "ROAD_NAME", "DIRECTION", "LATITUDE", "LONGITUDE", "DESCP", "INC_CRC", "FMEL_UPD_D"]
listOfInputFiles = ['SingaporePoliceForceDigitalTrafficRedLightCameras.geojson', 'SingaporePoliceForceFixedSpeedCameras.geojson', 'SingaporePoliceForceMobileSpeedCameras.geojson']

# for inputFile in listOfInputFiles:
#     loadGeoJsonFile(inputFile, 'cleanedData/cleaned_' + inputFile)
#     loadCleanedGeoJsonFile('cleanedData/cleaned_' + inputFile, 'cleanedData/cleaned_twice_' + inputFile)

for i in range(0, len(listOfInputFiles)):
    loadGeoJsonFile(listOfInputFiles[i], 'cleanedData/cleaned_' + listOfInputFiles[i])
    loadCleanedGeoJsonFile('cleanedData/cleaned_' + listOfInputFiles[i], 'cleanedData/cleaned_twice_' + listOfInputFiles[i], i+1)

mergeJsonFiles(listOfInputFiles, 'cleanedData/mergedFile.json')