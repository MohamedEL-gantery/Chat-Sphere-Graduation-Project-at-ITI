const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const upload = require('../middlewares/multer');
const uploadFirebase = require('../utils/firebase');

const router = express.Router();

router.use(authController.protected);

router
  .route('/')
  .patch(upload.single('photo'), uploadFirebase, userController.updateUser);

module.exports = router;
