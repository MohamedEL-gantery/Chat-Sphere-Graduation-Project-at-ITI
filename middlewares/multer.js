const multer = require('multer');
const AppError = require('../utils/appError');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public');
  },
  filename: function (req, file, cb) {
    const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    cb(null, filename);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(
      new AppError('File type not supported. Only image is allowed.', 401),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

module.exports = upload;
