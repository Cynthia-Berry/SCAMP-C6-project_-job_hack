const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, '../../uploads')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}__${file.originalname}` )
  }
});

module.exports = multer({storage: fileStorageEngine});
