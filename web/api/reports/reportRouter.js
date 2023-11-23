const express = require('express');
const { authToken } = require('../../services/authentication');
const reportController = require('./reportController');
const reportRouter = express.Router();

reportRouter.get('/', authToken, reportController.getAllReports);
reportRouter.get('/:id', authToken, reportController.getSingleReport);
reportRouter.post('/submit', authToken, reportController.createReport);
reportRouter.put('/:id/accept', authToken, reportController.approveReport);
reportRouter.put('/:id/reject', authToken, reportController.rejectReport);
// reportRouter.delete('/:id', authToken);

module.exports = { reportRouter };
