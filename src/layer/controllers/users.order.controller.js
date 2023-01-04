const UserOrderService = require("../services/users.order.services.js");

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const rimraf = require('rimraf');
const uuid = require('uuid4');


class UserOrderController {
    userOrderService = new UserOrderService();

    getPage_userOrder = async (req, res) => {
        const user_id = 1;  // jwt 미들웨어에서 res.locals.userId 로 가져온다.

        const userInfo = await this.userOrderService.getUserInfo(user_id);
        res.render('user_order/index', {ejsName: "user_order", userInfo: userInfo});
    }

    getPage_userOrderList = async (req, res) => {
        const type = req.query["type"];
        const user_id = 1;        // jwt 미들웨어에서 user_id 를 res에 넣어줄거야.

        const result = await this.userOrderService.getUserOrdersList(type, user_id);

        //console.log(result.getUserOrderListthumImgName);

        res.render('user_order/index', {
            ejsName: "user_orders_list", 
            orderList: result.getUserOrderList, 
            orderListThum: result.getUserOrderListthumImgName, 
            type: type
        });
    }

    // 요청 사항 디테일 보여주기
    getPage_userOrderDetail = async (req, res) => {
        const order_id = Number(req.params.orderId);

        const getOrderDetail = await this.userOrderService.getOrderDetail(order_id);

        res.render('user_order/index', {
            ejsName: "user_order_detail", 
            orderDetail: getOrderDetail.order, 
            orderDetailImgs: getOrderDetail.orderImgs
        });
    }

    getPage_userWriteReview = async (req, res) => {
        res.render('user_order/index', {ejsName: "user_write_review"});
    }

    insertUserOrder = async (req, res) => {
        const orderData = JSON.parse(req.body.result);
        const user_id = 1;  // 나중에 accessToken 의 payload 에서 값을 가져올 거야.
        orderData["user_id"] = user_id;

        const createOrderData = await this.userOrderService.createOrder(orderData);
        
        if (createOrderData.success === false) {
            return res.status(400).json(createOrderData);
        }

        res.status(200).json(createOrderData);
    }

    insertUserOrderImgUpload = async (req, res) => {
        const order_id = req.body.order_id;
        const user_id = req.body.user_id;
        const imgFiles = req.files;
        let arrayFileName = [];

        for (let obj in imgFiles) {
            arrayFileName.push(imgFiles[obj][0]["filename"]);
        }

        const insertOrderImgName = await this.userOrderService.insertOrderImgName(user_id, order_id, arrayFileName);

        res.status(200).json({success: insertOrderImgName});
    }

    deleteUserOrder = async (req, res) => {
        const order_id = Number(req.params.order_id);
        const user_id = 1;  // jwt 미들웨워의 payload => res.locals 로 가져온다.
        const result = await this.userOrderService.deleteUserOrder(order_id);
        const result2 = await this.userOrderService.deleteuUserOrderImg(order_id, user_id); 

        if (result === false) {
            res.status(300).json({success: false, errorMessage: "요청글 삭제를 실패하였습니다."})
        }

        if (result === false) {
            res.status(300).json({success: false, errorMessage: "이미지 삭제를 실패하였습니다."})
        }
        
        res.status(200).json({success: true});
    }

    getUserNameAndMasterStorename = async (req, res) => {   // 해당 오더에 등록된 storename과, 유저의 닉네임
        const order_id = req.params.order_id;
        const user_id = 1;  // jwt 미들웨어에서 가져온다.

        const user = await this.userOrderService.getUserInfo(user_id);
        const order = await this.userOrderService.getOneOrder(order_id);

        const user_nicname = user.nickname;
        const orderStorename = order.storename;

        res.status(200).json({success: true, nickname: user_nicname, storename: orderStorename});
    }

    insertUserReview = async (req, res) => {
        try {
            const { reviewComment, reviewStar } = req.body;
            const order_id = Number(req.params.order_id);
            const user_id = 1;  // jwt의 res.locals 에서 가져올 예정.

            if (reviewComment === '' || Number(reviewStar) === 0) {
                throw new Error("잘못된 값을 입력 받았습니다.")
            }

            const {master_id, user_nick } = await this.userOrderService.getMasterId(user_id, order_id);

            const params = {
                order_id : order_id,
                user_id : user_id,
                master_id : master_id,
                nickname : user_nick,
                star: reviewStar,
                comment: reviewComment
            }
            const creatingReview = await this.userOrderService.insertReview(params);

            if (creatingReview === false) {
                throw new Error("리뷰 등록이 실패하였습니다.")
            }

            res.status(200).json({success: true, message: "성공적으로 리뷰를 등록하였습니다.", review_id: creatingReview.review_id})

        } catch (err) {
            console.log(`${err}`);
            res.status(400).json({success: false, errorMessage: `${err}`}); 
        }   
    }

    getOrderReview = async (req, res) => {
        const order_id = Number(req.params.order_id);
        const review_id = Number(req.params.review_id);
        const user_id = 1;  // jwt
     
        if (!order_id || !review_id) {
            return res.status(400).json({success:false, message:"잘못된 타입으로 리뷰를 찾고 있습니다."})
        }

        const result = await this.userOrderService.getUserReview(user_id, order_id, review_id);

        if (result.success === false) {
            return res.status(400).json({result})
        }

        res.status(200).json(result); 
    }
}

module.exports = UserOrderController;