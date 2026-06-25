const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Look for the token in the Authorization header
  const authHeader = req.headers.authorization;

  // Return a 401 Unauthorized error if the token is missing
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'Not authorized. No token provided' });
  }

  const [type, token] = authHeader.split(' ');

  // Confirm the header starts with Bearer
  if (type !== 'Bearer') {
    return res
      .status(401)
      .json({ message: 'Not authorized. Token format is invalid' });
  }

  // Verify the token using JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // If token is invalid, return error message
    if (err) {
      return res.status(401).json({
        message: 'Not authorized. Token failed',
        error: err.message,
      });
    }

    // Store the decoded user information on request object
    req.user = decoded;

    next();
  });
};

module.exports = authMiddleware;
