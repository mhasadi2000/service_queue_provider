const multer = require('fastify-multer');
const path = require('path');

const { UPLOAD_MAX_SIZE, IMAGE_FORMAT } = global.config;
const { UploadFailedError } = require('../errors');

const storage = (resource) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${global.publicPath}${path.sep}${resource}`);
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split('/')[1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}.${ext}`);
    },
  });

const fileFilter = (req, file, cb) => {
  // const regex = new RegExp(IMAGE_FORMAT)
  // if (!file.originalname.match(regex))
  //   cb(new UploadFailedError('unacceptable file format'), false);
  cb(null, true);
};

exports.upload = (resource) => {
  return multer({
    storage: storage(resource),
    fileFilter,
    limits: { fileSize: UPLOAD_MAX_SIZE },
  });
};
