const Product = require('../models/Product');
const uploadImages = require('../utils/uploadImages');

exports.getProducts = async (req, res) => {
  const { search, category, priceMin, priceMax, rating } = req.query;
  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = Number(priceMin);
    if (priceMax) filter.price.$lte = Number(priceMax);
  }
  if (rating) {
    filter.ratings = { $gte: Number(rating) };
  }

  try {
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.addProduct = async (req, res) => {
  const { name, description, price, category, stock, ratings } = req.body;
  const images = await uploadImages(req.files); // Implement this utility
  try {
    const product = new Product({ name, description, price, category, stock, ratings, images });
    await product.save();
    res.status(201).json({ message: 'Product added successfully.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stock, ratings } = req.body;
  let images;
  if (req.files) {
    images = await uploadImages(req.files);
  }
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (ratings) product.ratings = ratings;
    if (images) product.images = images;

    await product.save();
    res.status(200).json({ message: 'Product updated successfully.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
