const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    variations: Object, // e.g., size, color
  }],
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
