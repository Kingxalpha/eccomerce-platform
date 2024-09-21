const express = require('express');
const router = express.Router();
const { contactSupport, getFAQs } = require('../controllers/supportController');
const { auth } = require('../middlewares/auth');

router.post('/contact', auth, contactSupport);
router.get('/faqs', getFAQs);

module.exports = supportRoute;
