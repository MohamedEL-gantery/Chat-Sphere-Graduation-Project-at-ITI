const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Chat',
    },
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
