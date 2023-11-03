const express = require('express');
const userRouter = require('./user/userRouter');
const reportRouter = require('./reports/reportRouter');
const cameraRouter = require('./camera/cameraRouter');
const router = express.Router();

router.use('/user', userRouter);
router.use('/report', reportRouter);
router.use('/camera', cameraRouter);



module.exports = router;