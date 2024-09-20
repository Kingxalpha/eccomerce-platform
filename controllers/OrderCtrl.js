const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.placeOrder = async (req, res) => {
  const { shippingDetails, paymentMethod, token } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty.' });

    // Calculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += item.product.price * item.quantity;
      // Optionally, check stock again
    }

    // Process payment with Stripe
    const charge = await stripe.charges.create({
      amount: totalAmount * 100, // amount in cents
      currency: 'usd',
      source: token,
      description: `Charge for ${req.user.id}`,
    });

    if (charge.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment failed.' });
    }

    // Create Order
    const order = new Order({
      user: req.user.id,
      products: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingDetails,
      paymentMethod,
      paymentStatus: 'Completed',
      orderStatus: 'Processing',
      totalAmount,
    });
    await order.save();

    // Clear Cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.trackOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.id) return res.status(404).json({ message: 'Order not found.' });

    res.status(200).json({ orderStatus: order.orderStatus });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
