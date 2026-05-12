const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Create uploads folder automatically
const uploadPath = 'uploads';

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}


const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    }
});


const fileFilter = (req, file, cb) => {

    const allowedTypes =
        /jpeg|jpg|png|webp/;

    const extname =
        allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

    const mimetype =
        allowedTypes.test(file.mimetype);

    if (extname && mimetype) {

        return cb(null, true);

    } else {

        cb(new Error('Only image files are allowed'));
    }
};


const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;