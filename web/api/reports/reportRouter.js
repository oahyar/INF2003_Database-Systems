const express = require('express');
const { authToken } = require('../../services/authentication');
const reportController = require('./reportController');
const reportRouter = express.Router();

reportRouter.get('/', authToken, reportController.getAllReports);
reportRouter.get('/one', authToken, reportController.getSingleReport);
reportRouter.post('/submit', authToken, reportController.createReport);
reportRouter.put('/accept', authToken, reportController.approveReport);
reportRouter.put('/reject', authToken, reportController.rejectReport);
reportRouter.delete('/delete', authToken, reportController.deleteReport);

module.exports = reportRouter;
