const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1]; // "Bearer token"

    const { _id } = jwt.verify(token, process.env.SECRET);
    
    req.user = await User.findOne({ _id }).select('_id name email role phone');
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
}
module.exports=requireAuth;