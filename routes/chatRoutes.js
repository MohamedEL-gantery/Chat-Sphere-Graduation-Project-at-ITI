const express = require('express');
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.use(authController.protected);

router.route('/').post(chatController.createChat);

router
  .route('/:id')
  .get(chatController.findUserChats)
  .delete(chatController.deleteChat);

router.route('/find/:senderId/:receivedId').get(chatController.findOneChat);

module.exports = router;
