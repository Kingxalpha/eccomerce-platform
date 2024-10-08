const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('token');
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    
    req.user = decoded;
    
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  });
};

module.exports = { auth, adminAuth };
