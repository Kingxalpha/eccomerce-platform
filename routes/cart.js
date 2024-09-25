const express = require('express');
const cartRouter = express.Router();
const { getCart, addToCart, updateCart, removeFromCart, saveForLater } = require('../controllers/CartCtrl');
const { auth } = require('../middlewares/auth');

cartRouter.get('/', auth, getCart);
cartRouter.post('/add', auth, addToCart);
cartRouter.put('/update', auth, updateCart);
cartRouter.delete('/remove', auth, removeFromCart);
cartRouter.post('/save-for-later', auth, saveForLater);

module.exports = cartRouter;
