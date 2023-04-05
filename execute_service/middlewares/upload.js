const multer = require("fastify-multer");
const path = require("path");

const { UPLOAD_MAX_SIZE, IMAGE_FORMAT } = global.config;
const { UploadFailedError } = require("../errors");

exports.upload = multer({
  storage: multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './public/upload/csv/')
      },
      filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}.${ext}`);
      }
  }),
  fileFilter: function (req, file, cb) {
    cb(null, true);
      // if (file.mimetype == "text/csv") {
      // } else {
      //     cb(null, false);
      //     return cb(new Error('Only .csv files are allowed!'));
      // }
  }
});