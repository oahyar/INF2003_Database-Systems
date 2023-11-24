const express = require('express');
const userController = require('./userController');
const { authToken } = require('../../services/authentication');

const userRouter = express.Router();

userRouter.get('/', userController.getUser);
userRouter.post('/login', userController.login);
userRouter.post('/register', userController.createUser);
userRouter.put('/update', userController.updateUser)
userRouter.delete('/delete', userController.deleteUser);

module.exports = userRouter;
