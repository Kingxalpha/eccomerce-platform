const express = require('express');
const { searchProduct } = require('../controllers/SearchCtrl');
const searchRouter = express.Router();

searchRouter.get('/', searchProduct)

module.exports = searchRouter