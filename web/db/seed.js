const dbService = require('../services/dbServices');
const mongoose = require('mongoose');
const cameraSchema = require('../api/camera/cameraSchema');
const fs = require('fs');
const path = require('path');

mongoose.connect(config.mongoURI, {
    user: config.mongoUser,
    pass: config.pass,
});

function createUserTable() {
    try {
        console.log('trying');
        const stmt =
            'CREATE TABLE userTable (userID INT AUTO_INCREMENT PRIMARY KEY,userRole INT NOT NULL DEFAULT 1,userPassword VARCHAR(255) NOT NULL,firstName VARCHAR(255) NOT NULL,lastName VARCHAR(255) NOT NULL,username VARCHAR(255) NOT NULL UNIQUE)';
        dbService.pool.query(stmt);
        console.log('Done User');
    } catch (e) {
        console.error(e);
    }
}
function createCameraReportTable() {
    try {
        const stmt =
            "CREATE TABLE cameraReportTable (reportID INT AUTO_INCREMENT PRIMARY KEY,cameraType INT NOT NULL,cameraLatitude DECIMAL(10, 7) NOT NULL,cameraLongitude DECIMAL(10, 7) NOT NULL,cameraReportStatus ENUM('Approved', 'Rejected', 'Pending') NOT NULL DEFAULT 'Pending',submitterID INT NOT NULL,FOREIGN KEY (submitterID) REFERENCES userTable(userID) ON DELETE CASCADE,submittedDate DATETIME DEFAULT CURRENT_TIMESTAMP);";
        dbService.pool.query(stmt);
    } catch (error) {
        console.error(error);
    }
}

function createCameraApprovalTable() {
    try {
        const stmt =
            'CREATE TABLE cameraApprovalTable (approvalID INT AUTO_INCREMENT PRIMARY KEY, reportID INT NOT NULL UNIQUE, FOREIGN KEY (approvalID) REFERENCES userTable(userID) ON DELETE CASCADE, FOREIGN KEY (reportID) REFERENCES cameraReportTable(reportID) ON DELETE CASCADE);';
        dbService.pool.query(stmt);
    } catch (error) {
        console.error(error);
    }
}

function addCamerasToDB(filePath) {
    filePath = path.join(__dirname, filePath);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const json = JSON.parse(data);

        if (json.features && Array.isArray(json.features)) {
            json.features.forEach((cameraData) => {
                const newCamera = new cameraSchema(cameraData);
                newCamera
                    .save()
                    .then((doc) => console.log('Camera saved:', doc))
                    .catch((err) => console.error('Error saving camera:', err));
            });
        } else {
            console.error('No features array found in JSON file');
        }
    });
}

function clearData(){
    cameraSchema.deleteMany({}).then(()=>{
        console.log("Cleared Cameras");
    }).catch((err)=>{
        console.log(err)
    });
}

function seed(){
    addCamerasToDB('mergedFile.json');
}

clearData();
seed();

module.exports = {
    seed,
};
