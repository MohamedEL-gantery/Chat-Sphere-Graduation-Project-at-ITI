const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);

router.route('/login').post(authController.login);

router.route('/logout').get(authController.logout);

router.route('/forgetPassword').post(authController.forgetPassword);

router.route('/verifyResetCode').post(authController.verifyResetCode);

router.use(authController.protected);

router.route('/verifySignup').post(authController.verifySignup);

router.route('/resetPassword').patch(authController.resetPassword);

router.route('/updateMyPassword').patch(authController.updatePassword);

module.exports = router;
