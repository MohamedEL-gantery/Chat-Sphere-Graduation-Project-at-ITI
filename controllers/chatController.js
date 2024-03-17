const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const AppError = require('../utils/appError');

const createChat = asyncHandler(async (req, res, next) => {
  if (!req.body.senderId) req.body.senderId = req.user.id;

  const { senderId, receivedId } = req.body;

  const existChat = await Chat.findOne({
    members: { $all: [senderId, receivedId] },
  });

  if (existChat) {
    return res.status(200).json({
      status: 'success',
      data: existChat,
    });
  }

  const newChat = await Chat.create({
    members: [senderId, receivedId],
  });

  res.status(201).json({
    status: 'success',
    data: newChat,
  });
});

const findUserChats = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const chats = await Chat.find({ members: { $in: [userId] } });

  if (chats.length === 0) {
    return next(new AppError('No Chat Found', 404));
  }

  res.status(200).json({
    status: 'success',
    result: chats.length,
    data: chats,
  });
});

const findOneChat = asyncHandler(async (req, res, next) => {
  const { senderId, receivedId } = req.params;

  const chat = await Chat.findOne({
    members: [senderId, receivedId],
  });

  res.status(200).json({
    status: 'success',
    data: chat,
  });
});

const deleteChat = asyncHandler(async (req, res, next) => {
  const senderId = req.user.id;

  const receivedId = req.params.id;

  const chat = await Chat.findOneAndDelete({ members: [senderId, receivedId] });

  if (!chat) {
    return next(new AppError('Chat Not Found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createChat,
  findUserChats,
  findOneChat,
  deleteChat,
};
