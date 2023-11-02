const express = require('express');
const userController = require('./userController');
const { authToken } = require('../../services/authentication');

const userRouter = express.Router();

userRouter.get('/', authToken,userController.getUser)
userRouter.post('/login', userController.login)
userRouter.post('/register', userController.createUser)
// userRouter.put('/updateUser', userController.editUser)
// userRouter.delete('/deleteUser', userController.deleteUser)

module.exports = userRouter;