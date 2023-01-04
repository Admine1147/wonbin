const UserOrderService = require("../services/users.order.services.js");

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const rimraf = require('rimraf');
const uuid = require('uuid4');


class UserOrderController {
    userOrderService = new UserOrderService();

    getPage_userOrder = async (req, res) => {
        res.render('user_order/index', {ejsName: "user_order"});
    }

    getPage_userOrderList = async (req, res) => {
        res.render('user_order/index', {ejsName: "user_orders_list"});
    }

    getPage_userOrderDetail = async (req, res) => {
        const orderId = Number(req.params.orderId);
        res.render('user_order/index', {ejsName: "user_order_detail", orderId});
    }

    getPage_userWriteReview = async (req, res) => {
        res.render('user_order/index', {ejsName: "user_write_review"});
    }

    insertUserOrder = async (req, res) => {
        const orderData = JSON.parse(req.body.result);
        /*
        {
            life_laundry: true,
            individual_laundry: true,
            nickname: 'lololo',
            phonenumber: '01012345678',
            email: 'msdou@gmail.com',
            address: '서울시 어딘가 어딘가 ',
            comment: '가나다라마바사!'
        }
        */
        const user_id = 1;  // 나중에 accessToken 의 payload 에서 값을 가져올 거야.
        orderData["user_id"] = user_id;

        const createOrderData = await this.userOrderService.createOrder(orderData);
        
        res.status(200).json({success: true, data: createOrderData});
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
}

module.exports = UserOrderController;