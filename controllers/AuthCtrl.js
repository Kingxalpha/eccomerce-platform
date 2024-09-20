const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists.' });

    user = new User({ username, email, password });
    await user.save();

    // Generate email verification token
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.EMAIL_SECRET,
      { expiresIn: '1d' }
    );

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(user.email, 'Verify Your Email', `Click here to verify: ${verificationLink}`);

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token.' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified.' });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });
    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Implement MFA methods as needed
exports.enableMFA = async (req, res) => { /* ... */ };
exports.verifyMFA = async (req, res) => { /* ... */ };
