const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

checkActiveStatus = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user.active) {
    throw new AppError('User is not active', 403);
  }

  next();
});

module.exports = checkActiveStatus