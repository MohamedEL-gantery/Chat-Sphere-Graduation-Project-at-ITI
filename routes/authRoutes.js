const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
router.route('/api/register').post(authController.register)
router.route('/api/login').post(authController.login)
router.route('/api/refresh').post(authController.refresh)
router.route('/api/logout').post(authController.logout)
module.exports = router;
