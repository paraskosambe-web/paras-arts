const multer = require("multer");

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (!/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) {
    return cb(new Error("Only image files are allowed"));
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

module.exports = upload;