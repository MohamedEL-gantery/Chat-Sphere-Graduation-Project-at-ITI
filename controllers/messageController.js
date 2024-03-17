const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');

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
  const messages = await Message.find({ chatId: req.params.id });

  res.status(200).json({
    status: 'success',
    data: messages,
  });
});

module.exports = {
  createMessage,
  getMessages,
};
