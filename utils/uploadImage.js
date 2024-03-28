const cloudinary = require('cloudinary').v2;
const AppError = require('../utils/appError');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloud = (req, res, next) => {
  if (!req.file) return next();

  cloudinary.uploader
    .upload_stream(
      {
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          console.log(error);
          return next(new AppError('Error uploading image to Cloudinary', 500));
        }

        req.file.cloudinaryUrl = result.secure_url;
        next();
      }
    )
    .end(req.file.buffer);
};

module.exports = uploadToCloud;
