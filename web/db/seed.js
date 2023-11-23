const dbService = require('../services/dbServices');
const mongoose = require('mongoose');
const cameraSchema = require('../api/camera/cameraSchema');
const fs = require('fs');

mongoose.connect('mongodb://devacc:devenv22!@127.0.0.1:27017/TraffiCam', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'TraffiCam',
});
//     'mongodb://devacc:devenv22!@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&authSource=TraffiCam'

function createUserTable() {
    try {
        console.log('trying');
        const stmt =
            'CREATE TABLE userTable (userID INT AUTO_INCREMENT PRIMARY KEY,userRole INT NOT NULL,userPassword VARCHAR(255) NOT NULL,firstName VARCHAR(255) NOT NULL,lastName VARCHAR(255) NOT NULL,userEmail VARCHAR(255) NOT NULL)';
        dbService.pool.query(stmt);
        console.log('Done User');
    } catch (e) {
        console.error(e);
    }
}
function createCameraReportTable() {
    try {
        const stmt =
            "CREATE TABLE cameraReportTable ( reportID INT AUTO_INCREMENT PRIMARY KEY, cameraType INT NOT NULL, cameraLocation VARCHAR(255) NOT NULL, cameraPicLink VARCHAR(255) NOT NULL, cameraReportStatus ENUM('Approved', 'Rejected', 'Pending') NOT NULL DEFAULT 'Pending', submitterID INT NOT NULL,FOREIGN KEY (submitterID) REFERENCES userTable(userID) ON DELETE CASCADE, submittedDate DATETIME DEFAULT CURRENT_TIMESTAMP)";
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

// TODO: Insert camera data

function addCamerasToDB(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const json = JSON.parse(data);

        // Assuming 'features' is the array you want to iterate over
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

addCamerasToDB('./mergedFile.json');

module.exports = {
    createUserTable,
    createCameraReportTable,
    createCameraApprovalTable,
};
