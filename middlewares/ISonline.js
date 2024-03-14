const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

checkOnlineStatus = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; 

  
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  
  req.userIsOnline = user.isOnline;

  
  next();
});
module.exports = checkOnlineStatus