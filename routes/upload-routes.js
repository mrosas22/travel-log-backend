const express = require('express');
const router  = express.Router();

const fileUploader = require('../config/upload-setup/cloudinary');

router.get('/test',(req,res) => res.json({message:'Router Works'}));

router.post('/file', fileUploader.single('submittedFile'), (req, res, next) => {
    if(!req.file){
        next(new Error('No file uploaded!'));
        return;
    }
    console.log('The file is: ', req.file)
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