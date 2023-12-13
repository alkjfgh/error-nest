const express = require('express');
const uploadController = require('../../controller/document/uploadController');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
const fs = require('fs');

// aws.config.update({ // 루트 계정 가능
//     // accessKeyId: "AKIASEAOF6IRVY6RKNG2",
//     accessKeyId: "AKIASEAOF6IR7QRK7J65",
//     // secretAccessKey: "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",
//     secretAccessKey: "zWOfzJUPLAwHPzXi/te8DANpdfX2UGB6T+HTAjIR",
//     region: 'ap-northeast-2',
// });
// const s3 = new aws.S3();
//
// // Multer를 위한 필터. 이미지 파일만 Multer를 통해 업로드하고 아닌 경우 에러 발생.
// const multerfilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')){
//         cb(null, true);
//     } else {
//         cb(console.log('Not image file upload tried'), false);
//     }
// }
//
// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'error-nest',
//         acl: 'public-read',
//         contentType: multerS3.AUTO_CONTENT_TYPE, // content type 들어오는대로 설정
//         key: function (req, file, cb) {
//             console.log("><><><><!>@#!@#")
//             cb(null, Date.now() + '.' + file.originalname.split('.').pop());
//         },
//     }),
//     fileFilter: multerfilter,
// });


// 이미지를 저장할 경로와 파일명을 설정합니다.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const category = req.query.category ? req.query.category + '/' : '';
        const destinationPath = path.join(__dirname, `../../uploads/${category}`);
        // 폴더가 없으면 생성
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }
        cb(null, destinationPath); // 파일이 저장될 경로
    },
    filename: function (req, file, cb) {
        console.log(file.originalname)
        cb(null, file.originalname) // 파일명
    }
})

const upload = multer({storage: storage })


router.post('/', upload.single('file'), uploadController.fileUpload);

module.exports = router;



