const express = require('express');
const router = express.Router();

const UsersOrderController = require("../../layer/controllers/users.order.controller.js");
const usersOrderController = new UsersOrderController();

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid4');
const UserOrderController = require('../../layer/controllers/users.order.controller.js');

// 검증 미들웨어
const userMiddleware = require("../../middleware/user_middleware.js");

const storageImg = multer.diskStorage({
    destination: (req, file, cb) => {
        
        const order_id = req.body.order_id;
        const user_id = req.body.user_id;

        const relativePath = `src/public/image/userRequest/user_${user_id}/order_${order_id}/`;
        const dir = path.resolve(relativePath);
    
        if(!fs.existsSync(dir)) {
            fs.mkdir(dir, {recursive:true}, error => {
                if(error) {
                    console.log('mkdir error : ' + error);
                    return
                } 
                cb(null, dir)
            })
        } else {
            cb(null, dir);  // 파일이 저장될 경로가 리턴. mkdir 덕분에 실재로 파일이 생성이되고, 그곳에 이미지가 실재로 저장될거야.
        }
    },
    filename : (req, file, cb) => {
        let fileType = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        const fileNm = uuid() + fileType
        cb(null, fileNm);  // 파일의 이름들이 리턴
    }
});
const imgUpload = multer({ storage:storageImg, limits:{fileSize: 20 * 1024 * 1024} });

const fields = [
    {name: 'imgFile_1', maxCount: 10},
    {name: 'imgFile_2', maxCount: 10},
    {name: 'imgFile_3', maxCount: 10}
]


router.post('/', userMiddleware, usersOrderController.insertUserOrder)
router.post('/img', userMiddleware, imgUpload.fields(fields), usersOrderController.insertUserOrderImgUpload);
router.get('/:order_id/review/:review_id', userMiddleware, usersOrderController.getOrderReview);


module.exports = router;