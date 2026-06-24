const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Look for the token in the Authorization header
  const authHeader = req.header('Authorization');

  // Return a 401 Unauthorized error if the token is missing
  if (!authHeader) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  // Confirm the token starts with Bearer
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Verify the token using JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Allow the request to continue if the token is valid
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
