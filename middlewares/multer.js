const multer = require('multer');
const AppError = require('../utils/appError');

// Set up multer storage
const storage = multer.memoryStorage();

// Define a filter function to check file types
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new AppError('File type not supported. Only images are allowed.', 401),
      false
    ); // Reject the file
  }
};

// Configure multer with storage and filter
const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

module.exports = upload;
