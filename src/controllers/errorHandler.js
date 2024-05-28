const jwt = require('jsonwebtoken')

function errorHandler(err, req, res, next) {
  if (err instanceof jwt.JsonWebTokenError) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }

  next(err);
}
  
  module.exports = errorHandler;