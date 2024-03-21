const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const AppError = require('../utils/appError');

const createMessage = asyncHandler(async (req, res, next) => {
  if (!req.body.senderId) req.body.senderId = req.user.id;

  const { chatId, senderId, content } = req.body;

  const newMessage = await Message.create({ chatId, senderId, content });

  res.status(201).json({
    status: 'success',
    data: newMessage,
  });
});

const getMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ chatId: req.params.id }).populate(
    'senderId',
    'name photo'
  );

  res.status(200).json({
    status: 'success',
    data: messages,
  });
});

const updateMessages = asyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { content: req.body.content },
    { new: true, runValidators: true }
  );

  if (!message) {
    return next(new AppError('No Message Found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: message,
  });
});

const deleteMessages = asyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndDelete(req.params.id);

  if (!message) {
    return next(new AppError('No Message Found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createMessage,
  getMessages,
  updateMessages,
  deleteMessages,
};
