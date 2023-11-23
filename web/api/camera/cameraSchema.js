const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    properties: {
        Type: {
            type: Number,
            required: true,
        },
        ID: {
            type: Number,
            required: true,
            unique: true,
        },
        ROAD_NAME: {
            type: String,
            required: true,
        },
        DIRECTION: {
            type: String,
            required: true,
        },
        DESCP: {
            type: String,
            required: true,
        },
    },
    geometry: {
        type: {
            type: String,
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
});


const camera = mongoose.model('cameras', cameraSchema);

module.exports =  camera;
