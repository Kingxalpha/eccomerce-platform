const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1d' });

  return token;
};

module.exports = generateToken;
