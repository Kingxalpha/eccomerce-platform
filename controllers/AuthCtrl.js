const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utilis/sendEmail');
const generateToken = require('../utilis/generateToken');

exports.signup = async (req, res) => {
  try {
    const { fullname, username, email, password, phoneNumber } = req.body;

    if (!fullname || !username || !email || !password || !phoneNumber) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token valid for 1 hour
    const verificationToken = jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      verificationToken,  // Store the token
      tokenExpires: Date.now() + 3600000  // 1 hour from now
    });

    await newUser.save();

    // Send the verification email
    const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
    const emailContent = `
    <h1>Welcome to Our E-Commerce Platform, ${fullname}!</h1>
    <p>We're thrilled to have you on board!</p>
    <p>At our platform, you can explore a wide range of products tailored just for you. Whether you're looking for the latest gadgets, fashion items, or home essentials, we have something for everyone.</p>
    <p>Our mission is to provide you with a seamless shopping experience, ensuring that you can find exactly what you need at competitive prices.</p>
    <p>Don't forget to verify your email address to unlock all features and start shopping! Click the link below to verify:</p>
    <p><a href="${verificationUrl}">Verify Your Email</a></p>
    <p>If you have any questions or need assistance, feel free to reach out to our support team. Happy shopping!</p>
    <p>Best regards,<br>Your E-Commerce Team</p>
    `;

    await sendEmail(email, 'Email Verification', emailContent);

    return res.status(201).json({ msg: 'Verification email sent. Please check your inbox.', user: newUser });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const email = decoded.email;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the user's verification status
    user.isVerified = true;
    await user.save();

    // Prepare the email content
    const emailContent = `
      <h1>Congratulations, ${user.fullname}!</h1>
      <p>Your email has been successfully verified, and your registration is now complete!</p>
      <p>Welcome to our e-commerce platform! We are excited to have you as part of our community.</p>
      <p>Feel free to log in to your account and start shopping:</p>
      <p><a href="http://localhost:5000/api/auth/login">Log in to Your Account</a></p>
      <p>If you have any questions or need assistance, our support team is here to help!</p>
      <p>Thank you for joining us, and happy shopping!</p>
      <p>Best wishes,<br>Your E-Commerce Team</p>
    `;

    // Optionally, send a confirmation email
    await sendEmail(email, 'Email Verified', emailContent);

    return res.status(200).json({ msg: 'Email verified successfully!' });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check if the email is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email.' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate and return the token if login is successful
    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// Implement MFA methods as needed
exports.enableMFA = async (req, res) => { /* ... */ };
exports.verifyMFA = async (req, res) => { /* ... */ };
