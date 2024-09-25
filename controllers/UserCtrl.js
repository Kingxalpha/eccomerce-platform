const User = require('../model/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateProfile = async (req, res) => {
  const { username, address, paymentInfo, preferences } = req.body;
  try {
    const user = await User.findById(req.user.id);
    
    if (username) user.username = username;
    // Update profile fields
    if (username) user.profile.username = username;
    if (address) user.profile.address = address;
    if (paymentInfo) user.profile.paymentInfo = paymentInfo;
    if (preferences) user.profile.preferences = preferences;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

