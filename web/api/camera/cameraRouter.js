const express = require('express');
const { authToken } = require('../../services/authentication');
const cameraController = require('./cameraController');
const cameraRouter = express.Router();

cameraRouter.get('/', authToken, cameraController.getAllCameras);
// cameraRouter.get('/:id', authToken);
cameraRouter.post('/new-camera', authToken, cameraController.createNewCamera);

module.exports =  cameraRouter ;
