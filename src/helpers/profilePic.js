import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import config from '../db/config/config';

// cloudinary environmental variables
const { cloudinaryConfig } = config;

cloudinary.config(cloudinaryConfig);


// set the storage location of your file
const storage = cloudinaryStorage({
  cloudinary,
  filename: (req, file, cb) => {
    // set file name
    cb(undefined, file.originalname);
  },
});

// check if user uploaded a valid image

/**
 * @description This function validates uploaded image
 * @param {object} req the request body
 * @param {object} file the response body
 * @param {function} cb callback function
 * @returns {function} cb callback function
 */
const fileFilter = (req, file, cb) => {
  const error = new Error('Invalid file format [Allowed formats: .jpeg, .jpg, .png]');
  error.status = 400;
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(error, false);
  }
};

// serves as a parser to enable the application to read image uploads
const upload = multer({ storage, fileFilter });

export default upload;
