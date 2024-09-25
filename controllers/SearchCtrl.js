const Product = require('../model/Product');

exports.searchProduct = async (req, res) => {
    const { name, category, priceMin, priceMax, rating } = req.query;
    const filter = {};
  
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
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
      filter.averageRating = { $gte: Number(rating) };
    }
  
    try {
      const products = await Product.find(filter);
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: 'Server error.' });
    }
  };
  