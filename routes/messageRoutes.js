const express = require('express');
const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.use(authController.protected);

router.route('/').post(messageController.createMessage);

router.route('/:id').get(messageController.getMessages);

module.exports = router;
