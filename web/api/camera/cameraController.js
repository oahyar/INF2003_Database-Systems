const mongoose = require('mongoose');
const cameraSchema = require('./cameraSchema');

async function getAllCameras(req, res, next){
    await cameraSchema.find().then(cameras => {
        res.send(cameras)
    }).catch(err => {
        throw new Error(err)
    });
}

async function createNewCamera(req, res, next){
    await cameraSchema
        .create({
            type: req.body.cameraType,
            properties: {
                ID: req.body.ID,
                ROAD_NAME: req.body.ROAD_NAME,
                DIRECTION: req.body.DIRECTION,
                DESCP: req.body.DESCP,
            },
            geometry: {
                type: 'Point',
                coordinates: req.body.coordinates,
            },
        })
        .then((camera) => {
            res.send(200);
        })
        .catch(err => {
            throw new Error(err);
        });
}



module.exports = {
    getAllCameras,
    createNewCamera,
}