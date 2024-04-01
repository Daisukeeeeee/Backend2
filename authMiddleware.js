const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');

const generateToken = (user) => {
  const role = user.is_admin ? 'admin' : 'user';
  console.log('is_admin during token generation:', user.is_admin);
  console.log('Role:', role);

  const token = jwt.sign({ id: user.id, role }, `${process.env.TOKEN_SECRET}`, { expiresIn: '1d' });
  return token;
};
;

const checkAdminRole = (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      throw new Error('Access denied. Token missing.');
    }

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new Error('Access denied. Invalid token format.');
    }

    const bearerToken = tokenParts[1];

    const decoded = jwt.verify(bearerToken, `${process.env.TOKEN_SECRET}`);

    console.log('Decoded Token:', decoded);
    if (decoded && decoded.role === 'admin') {
      req.user = decoded;
      next();
    } else {
      throw new Error('Access denied. Only admin users can access this route.');
    }
  } catch (error) {
    res.status(403).json({
      success: false,
      error: error.message,
    });
  }
};
const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', ''); 

    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};


module.exports = {
  generateToken,
  checkAdminRole,
  protect,
};
