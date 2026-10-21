const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/httpError');

function createToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

const register = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password,
  });

  res.status(201).json({
    data: {
      user: { id: user.id, name: user.name, email: user.email },
      token: createToken(user),
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.trim().toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new HttpError(401, 'Email or password is incorrect');
  }

  res.json({
    data: {
      user: { id: user.id, name: user.name, email: user.email },
      token: createToken(user),
    },
  });
});

module.exports = { register, login };
