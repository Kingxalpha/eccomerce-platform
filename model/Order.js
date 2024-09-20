const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
  }],
  shippingDetails: {
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  paymentMethod: String,
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  totalAmount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
