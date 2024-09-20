const express = require('express');
const router = express.Router();
const { placeOrder, getOrderHistory, trackOrder } = require('../controllers/orderController');
const { auth } = require('../middlewares/auth');

router.post('/checkout', auth, placeOrder);
router.get('/history', auth, getOrderHistory);
router.get('/track/:orderId', auth, trackOrder);

module.exports = router;
