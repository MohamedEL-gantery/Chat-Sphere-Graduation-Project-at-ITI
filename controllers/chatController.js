const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const appError = require('../utils/appError')

//create chat
const asyncHandler = require('express-async-handler');

const createChat = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const secondId = req.body.secondId;

    // Check if the second user exists
    const findSecondId = await User.findById(secondId);
    if (!findSecondId) {
        const error = appError.Error('User not found', 'fail', 404);
        return next(error);
    }

    // Check if a chat already exists between these two users
    const findChat = await Chat.findOne({ members: { $all: [userId, secondId] } });
    if (findChat) {
        return res.status(200).send({ status: 'success', data: findChat });
    }

    // Create a new chat
    const chat = new Chat({ members: [{ userId, secondId }] });
    await chat.save();
    res.status(200).send({ status: 'success', data: chat });
});




const findChat = asyncHandler(async (req, res, next) => {
    const _id = req.params.id;

    const chat = await Chat.findById(_id).populate('members.secondId members.userId');
    if (!chat) {
        const error = appError.Error('Chat not found', 'fail', 404);
        return next(error);
    }

    res.status(200).send({ status: 'success', data: chat });
});

const findUserChats = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const chats = await Chat.find({
        members: {
            $elemMatch: {
                $or: [{ userId }, { secondId: userId }]
            }
        }
    }).populate('members.secondId members.userId');

    if (chats.length === 0) {
        const error = appError.Error('Chats not found', 'fail', 404);
        return next(error);
    }

    res.status(200).send({ status: 'success', data: chats });
});



const deleteChat = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const secondId = req.params.id;

    const chat = await Chat.findOneAndDelete({
        members: {
            $all: [{ userId }, { secondId }]
        }
    });

    if (!chat) {
        const error = appError.Error('Chat not found', 'fail', 404);
        return next(error);
    }

    res.status(200).send({ status: 'success', data: chat });
});




   
   
module.exports = {
    createChat,
    findChat,
    findUserChats,
    deleteChat
}