const express = require('express');
const router  = express.Router();

const fileUploader = require('../config/upload-setup/cloudinary');

router.post('/upload-file', fileUploader.single('submittedFile'), (req, res, next) => {
    if(!req.file){
        next(new Error('No file uploaded!'));
        return;
    }
    const { originalname, secure_url, format, width, height } = req.file;

    res.json({
        fileName: originalname,
        fileUrl: secure_url,
        format,
        width, 
        height
    });

} );

module.exports = router;