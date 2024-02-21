const multer = require('multer');
const path = require('path');

const storageVideo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/videos');
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});
const storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/images');
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const uploadImage = multer({ storage: storageImage });

const uploadVideo = multer({ storage: storageVideo });

module.exports = {
    uploadImage,
    uploadVideo,
};
