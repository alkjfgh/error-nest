const express = require('express');
const uploadController = require('../../controller/document/uploadController');
const router = express.Router();
const multer = require('multer');
const AWS = require("aws-sdk");
const multerS3 = require('multer-s3');
const path = require('path');
const fs = require('fs');

const s3 = new AWS.S3({ accessKeyId:"epcnd333@naver.com", secretAccessKey:"skssks33??!!" });
//* aws region 및 자격증명 설정
// AWS.config.update({
//     accessKeyId: "epcnd333@naver.com",
//     secretAccessKey: "skssks33??!!",
//     region: 'ap-northeast-2',
// });

// Multer를 위한 필터. 이미지 파일만 Multer를 통해 업로드하고 아닌 경우 에러 발생.
const multerfilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')){
        cb(null, true);
    } else {
        cb(console.log('Not image file upload tried'), false);
    }
}

// 이미지를 저장할 경로와 파일명을 설정합니다.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('multer.diskStorage')
        const category = req.query.category ? req.query.category + '/' : '';
        console.log(category)
        const destinationPath = path.join(__dirname, `../../uploads/${category}`);
        console.log(destinationPath)
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

// multer 저장소 및 필터 설정
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'error-nest',
        contentType: multerS3.AUTO_CONTENT_TYPE, // content type 들어오는대로 설정
        key: function(req, file, cb){
            if(file.originalname === undefined || file.originalname === null){ }
            else {
                cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 파일 이름 설정을 위한 callback function
            }
        }
    }),
    fileFilter: multerfilter,
},'NONE');

// const upload = multer({storage: storage })

router.post('/', upload.single('file'), uploadController.fileUpload);

module.exports = router;