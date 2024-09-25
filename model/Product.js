const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  images: { type: [String], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true },
      review: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
