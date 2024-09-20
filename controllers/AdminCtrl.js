const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status.' });

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    order.orderStatus = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated.', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.handleReturns = async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    // Implement return logic, e.g., update order status, process refund, etc.
    order.orderStatus = 'Returned';
    await order.save();

    res.status(200).json({ message: 'Order returned successfully.', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
