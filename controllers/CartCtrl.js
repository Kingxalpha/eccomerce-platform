const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity, variations } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock.' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].variations = variations;
    } else {
      cart.items.push({ product: productId, quantity, variations });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateCart = async (req, res) => {
  const { productId, quantity, variations } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].variations = variations;
      }
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Product not in cart.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.saveForLater = async (req, res) => {
  // Implement based on your cart schema. You might add a separate field for saved items.
};
