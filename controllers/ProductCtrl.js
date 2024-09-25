const Product = require('../model/Product');
const { upload } = require('../utilis/fileUpload');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id });

    if (products.length === 0) {
      return res.status(200).json({ message: 'No products found. Add a product today!' });
    }

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
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name, description, price, category, stock } = req.body;
    const images = req.files.map(file => file.path);
    const userId = req.user.id;

    try {
      let product = new Product({
        name,
        description,
        price,
        category,
        stock,
        images,
        createdBy: userId
      });
      
      await product.save();

      // Populate createdBy with user details
      product = await product.populate('createdBy', 'fullname email');

      res.status(201).json({
        message: 'Product added successfully.',
        product
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error.' });
    }
  });
};

exports.addRating = async (req, res) => {
  const { productId } = req.params;
  const { rating, review } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const existingRating = product.ratings.find(r => r.user.toString() === userId);
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this product.' });
    }

    product.ratings.push({ user: userId, rating, review });
    
    await product.save();

    res.status(200).json({ message: 'Rating added successfully.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateProduct = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    let images;

    if (req.files) {
      images = req.files.map(file => file.path);
    }

    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: 'Product not found.' });

      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = price;
      if (category) product.category = category;
      if (stock) product.stock = stock;
      if (images) product.images = images;

      await product.save();

      const updatedProduct = await product.populate('createdBy', 'fullname email');

      res.status(200).json({
        message: 'Product updated successfully.',
        product: updatedProduct
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error.' });
    }
  });
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

