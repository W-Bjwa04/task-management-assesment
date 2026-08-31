// Auth middleware — verifies access token from Authorization header and attaches req.user.
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const authMiddleware = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied — no token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    next(new ApiError(401, 'Invalid or expired access token'));
  }
};

module.exports = authMiddleware;
