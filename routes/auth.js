const express = require('express');
const authRouter = express.Router();
const { signup, verifyEmail, login, enableMFA, verifyMFA } = require('../controllers/AuthCtrl');

authRouter.post('/signup', signup);
authRouter.get('/verify-email', verifyEmail);
authRouter.post('/login', login);
authRouter.post('/enable-mfa', enableMFA);
authRouter.post('/verify-mfa', verifyMFA);

module.exports = authRouter;
