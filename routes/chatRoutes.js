const express = require('express')
const router = express.Router()

const {
    createChat,
    findChat,
    findUserChats,
    deleteChat } = require('../controllers/chatController')
router.route('/chats').post( createChat).get( findUserChats)
router.route('/chat/:id').get( findChat).delete( deleteChat)
module.exports = router  