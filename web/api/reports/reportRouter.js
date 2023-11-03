const express = require('express');
const { authToken } = require('../../services/authentication');
const reportRouter = express.Router();

reportRouter.get('/', authToken);
reportRouter.get('/:id', authToken);
reportRouter.post('/submit', authToken);
reportRouter.put('/:id/accept', authToken);
reportRouter.put('/:id/reject', authToken);
reportRouter.delete('/:id', authToken);

module.exports = reportRouter;
