const express = require('express');
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.use(authController.protected);

router
  .route('/')
  .post(chatController.createChat)
  .get(chatController.findUserChats);

router.route('/:id').delete(chatController.deleteChat);

router.route('/find/:senderId/:receivedId').get(chatController.findOneChat);

// router.route('/createGroup').post(chatController.createGroupChat);

module.exports = router;
