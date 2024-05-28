const jwt = require('jsonwebtoken')

function errorHandler(err, req, res, next) {
  if (err instanceof jwt.JsonWebTokenError) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ error: 'Database error', details: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err.name === 'BadRequestError') {
    return res.status(400).json({ error: 'Bad request', details: err.message });
  }

  console.error('Internal server error:', err);
  next(err);
}
  
  module.exports = errorHandler;