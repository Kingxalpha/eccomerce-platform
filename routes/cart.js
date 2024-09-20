const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCart, removeFromCart, saveForLater } = require('../controllers/cartController');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/update', auth, updateCart);
router.delete('/remove', auth, removeFromCart);
router.post('/save-for-later', auth, saveForLater);

module.exports = router;
