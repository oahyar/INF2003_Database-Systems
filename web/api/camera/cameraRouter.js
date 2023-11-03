const express = require('express');
const { authToken } = require('../../services/authentication');
const cameraRouter = express.Router();

cameraRouter.get('/', authToken);
cameraRouter.get('/:id', authToken);
cameraRouter.post('/new-camera', authToken);


module.exports = cameraRouter;
