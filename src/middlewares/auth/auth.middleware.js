const jwt = require('jsonwebtoken');
const { verifyToken } = require('../../utils/generateToken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and formatted correctly
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Attach user data to request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authenticate;
