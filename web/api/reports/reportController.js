const dbService = require('../../services/dbServices');

function getAllReports(req, res, next) {
    dbService.pool.query(
        'SELECT * FROM cameraReportTable',
        (err, rows, fields) => {
            if (err || rows.length <= 0) {
                res.status(500).send({
                    message:
                        err ??
                        'Some error occurred while fetching camera reports',
                });
            } else {
                let reports = rows[0];
                res.send(reports);
            }
        }
    );
}

function getSingleReport(req, res, next) {
    dbService.pool.query(
        'SELECT * FROM cameraReportTable WHERE reportID = ?',
        [req.params.id],
        (err, rows, fields) => {
            if (err || rows.length <= 0) {
                res.status(500).send({
                    message: err ?? 'Some error occurred while fetching report',
                });
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
        'UPDATE cameraReportTable SET cameraReportStatus = Approved WHERE reportID = ?',
        [req.params.id],
        (err, rows, fields) => {
            if (err) {
                throw new Error('An error occured when approving reports');
            } else {
                res.send(200);
            }
        }
    );
}

function rejectReport(req, res, next) {
    dbService.pool.query(
        'UPDATE cameraReportTable SET cameraReportStatus = Rejected WHERE reportID = ?',
        [req.params.id],
        (err, rows, fields) => {
            if (err) {
                throw new Error('An error occured when rejecting reports');
            } else {
                res.send(200);
            }
        }
    );
}

function createReport(req, res, send) {
    let report = {
        cameraType: req.body.cameraType,
        cameraLocation: req.body.cameraLocation,
        cameraPicLink: req.body.cameraPicLink,
        submitterID: req.body.submitterID,
    };
    dbService.pool.query(
        'INSERT INTO cameraReportTable (cameraType, cameraLocation, cameraPicLink, submitterID) VALUES (?,?,?,?)',
        [report.cameraType, report.cameraLocation, report.cameraPicLink, report.submitterID],
        (err, rows, fields) => {
            if (err) {
                throw new Error('An error occured when creating report');
            } else {
                res.send(200);
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
};
