const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'eduvoult_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    // This is the new, crucial part. It tells Cloudinary to run moderation.
    moderation: 'aws_rek', 
  },
});

const upload = multer({ storage: storage });

module.exports = upload;