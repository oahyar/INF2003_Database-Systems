const dbService = require('../../services/dbServices');

function getAllReports(req, res, next) {
    dbService.pool.query(
        'SELECT * FROM cameraReportTable',
        (err, rows, fields) => {
            if (err) {
                throw new Error(err);
            } else if (rows.length <= 0) {
                return res.send('No reports to deliver');
            } else {
                let reports = rows;
                return res.send(reports);
            }
        }
    );
}

function getSingleReport(req, res, next) {
    dbService.pool.query(
        'SELECT * FROM cameraReportTable WHERE reportID = ?',
        [req.body.reportID],
        (err, rows, fields) => {
            if (err) {
                throw new Error(err);
            } else if (rows.length <= 0) {
                return res.send('Report doesnt exists');
            } else {
                let reports = rows[0];
                res.send(reports);
            }
        }
    );
}

function approveReport(req, res, next) {
    // TODO: Once report approve update mongodb
    dbService.pool.query(
        'UPDATE cameraReportTable SET cameraReportStatus = "Approved" WHERE reportID = ?',
        [req.body.reportID],
        (err, rows, fields) => {
            if (err) {
                throw new Error(err);
            } else {
                res.sendStatus(201);
            }
        }
    );
}

function rejectReport(req, res, next) {
    dbService.pool.query(
        'UPDATE cameraReportTable SET cameraReportStatus = "Rejected" WHERE reportID = ?',
        [req.body.reportID],
        (err, rows, fields) => {
            if (err) {
                throw new Error('An error occured when rejecting reports');
            } else {
                res.sendStatus(201);
            }
        }
    );
}

function createReport(req, res, send) {
    let report = {
        cameraType: req.body.cameraType,
        cameraLatitude: req.body.cameraLatitude,
        cameraLongitude: req.body.cameraLongitude,
        submitterID: req.body.submitterID,
    };
    dbService.pool.query(
        'INSERT INTO cameraReportTable (cameraType, cameraLatitude, cameraLongitude, submitterID) VALUES (?, ?, ?, ?)',
        [
            report.cameraType,
            report.cameraLatitude,
            report.cameraLongitude,
            report.submitterID,
        ],
        (err, rows, fields) => {
            if (err) {
                throw new Error(err);
                // throw new Error('An error occured when creating report');
            } else {
                res.sendStatus(201);
            }
        }
    );
}

function deleteReport(req, res, next) {
    let reportID = req.body.reportID;

    dbService.pool.query(
        'DELETE FROM cameraReportTable WHERE reportID = ?',
        [reportID],
        (err, rows, fields) => {
            if (err) {
                throw new Error(err);
            } else {
                res.send('Delete completed');
            }
        }
    );
}

module.exports = {
    getAllReports,
    getSingleReport,
    approveReport,
    rejectReport,
    createReport,
    deleteReport,
};
