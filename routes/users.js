const express = require('express');
const userRouter = express.Router();
const { getProfile, updateProfile } = require('../controllers/UserCtrl');
const { auth } = require('../middlewares/protectedRoute');

userRouter.get('/profile', auth, getProfile);
userRouter.put('/profile', auth, updateProfile);

module.exports = userRouter;
