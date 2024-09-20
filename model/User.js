const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profile: {
    name: String,
    address: String,
    paymentInfo: {
      cardNumber: String,
      expiryDate: String,
      cvv: String,
    },
    preferences: Object,
  },
  mfa: {
    enabled: { type: Boolean, default: false },
    secret: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
