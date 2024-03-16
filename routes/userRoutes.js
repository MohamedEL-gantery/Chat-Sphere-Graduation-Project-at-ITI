const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const upload = require('../middlewares/multer');
const uploadToCloud = require('../utils/uploadImage');

const router = express.Router();

router.use(authController.protected);

router.route('/').get(userController.getAllUser);

router.route('/me').get(userController.getMe, userController.getUser);

router.route('/deleteMe').delete(userController.deleteMe);

router
  .route('/updateMe')
  .patch(upload.single('photo'), uploadToCloud, userController.updateUser);

router.route('/:id/follow').put(userController.followUser);

router.route('/:id/unFollow').put(userController.unFollowUser);

router.route('/:id').get(userController.getUser);

module.exports = router;
