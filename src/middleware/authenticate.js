const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/httpError');

const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.get('Authorization') || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'A bearer token is required');
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new HttpError(401, 'The bearer token is invalid or expired');
    }
    throw error;
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new HttpError(401, 'The user associated with this token no longer exists');
  }
  req.user = user;
  next();
});

module.exports = authenticate;
