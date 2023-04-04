const multer = require('multer');

module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb (null, './uploads/reas')
        },
        filename: (req, file, cb) => {
            cb (null, Date.now().toString() + "_" + file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find
        (acceptedFormat => acceptedFormat == file.mimetype);

       if(extensaoImg){
        console.log("TRUE!")
        return cb(null, true);
       }
       console.log("FALSE!")
       return cb(null, false);
    }
}))
