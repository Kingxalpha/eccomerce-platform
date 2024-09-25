const express = require('express');
const supportRouter = express.Router();
const { contactSupport, getFAQs } = require('../controllers/SupportCtrl');
const { auth } = require('../middlewares/auth');

supportRouter.post('/contact', auth, contactSupport);
supportRouter.get('/faqs', getFAQs);

module.exports = supportRouter;
