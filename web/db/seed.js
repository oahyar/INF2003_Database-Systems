const dbService = require('../services/dbServices');



function createUserTable() {
    console.log('Creating User...');
    try {
        console.log("trying");
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



// TODO: Insert data


module.exports = {
    createUserTable,
    createCameraReportTable,
    createCameraApprovalTable,
};
