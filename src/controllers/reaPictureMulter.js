const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "_" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find
    (acceptedFormat => acceptedFormat == file.mimetype);

    if (extensaoImg) {
        return cb(null, true);
    }
    return cb(null, false);
};

const upload = multer({ storage, fileFilter }).single('thumb');

// Middleware to handle resizing
const resizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const filePath = req.file.path;
    const outputFilePath = path.join('./uploads', 'resized_' + req.file.filename);

    try {
        const metadata = await sharp(filePath).metadata();
        if (metadata.width > 1280 || metadata.height > 720) {
            await sharp(filePath)
                .resize(1280, 720, {
                    fit: sharp.fit.inside,
                    withoutEnlargement: true
                })
                .toFile(outputFilePath);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting the original file:', err);
                }
            });

            req.file.path = outputFilePath;
            req.file.filename = 'resized_' + req.file.filename;
        }
        next();
    } catch (error) {
        console.error('Error processing the image:', error);
        return res.status(500).json({ error: 'Error processing the image' });
    }
};

module.exports = { upload, resizeImage };
