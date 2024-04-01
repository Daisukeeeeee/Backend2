const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', ''); 

    if (!token) {
      throw new Error('Authentication failed!');
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = protect;
