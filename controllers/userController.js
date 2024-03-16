const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const updateUserValidator = require('../utils/validators/updateUserValidator');
const AppError = require('../utils/appError');

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getAllUser = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: users,
  });
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No User Found With That Id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const photoUrl = req.file ? req.file.cloudinaryUrl : undefined;
  const { error, value } = updateUserValidator.updateUser({
    name: req.body.name,
    email: req.body.email,
    photo: photoUrl,
    age: req.body.age,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender,
    birthDay: req.body.birthDay,
    location: req.body.location,
  });

  if (error) {
    return next(new AppError(error, 400));
  }

  const user = await User.findByIdAndUpdate(req.user.id, value, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

const deleteMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const followUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!user.followers.includes(req.user.id)) {
      await user.updateOne({ $push: { followers: req.user.id } });
      await currentUser.updateOne({ $push: { followings: req.params.id } });

      res.status(200).json({
        status: 'success',
        message: 'user has been followed',
      });
    } else {
      return next(new AppError('You Already Follow This User', 400));
    }
  } else {
    return next(new AppError('You Can Not Follow Yourself', 400));
  }
});

const unFollowUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (user.followers.includes(req.user.id)) {
      await user.updateOne({ $pull: { followers: req.user.id } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });

      res.status(200).json({
        status: 'success',
        message: 'user has been unFollowed',
      });
    } else {
      return next(new AppError('You Already Follow This User', 400));
    }
  } else {
    return next(new AppError('You Can Not Follow Yourself', 400));
  }
});

module.exports = {
  getMe,
  getAllUser,
  getUser,
  updateUser,
  deleteMe,
  followUser,
  unFollowUser,
};
