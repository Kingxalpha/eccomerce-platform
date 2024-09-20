const express = require('express');
const router = express.Router();
const { signup, verifyEmail, login, enableMFA, verifyMFA } = require('../controllers/authController');

router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/enable-mfa', enableMFA);
router.post('/verify-mfa', verifyMFA);

module.exports = router;
