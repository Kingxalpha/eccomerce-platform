const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus, handleReturns } = require('../controllers/adminController');
const { adminAuth } = require('../middlewares/auth');

router.get('/orders', adminAuth, getAllOrders);
router.put('/orders/:orderId/status', adminAuth, updateOrderStatus);
router.post('/orders/:orderId/return', adminAuth, handleReturns);

module.exports = router;
