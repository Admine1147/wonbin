"use strict";

const express = require('express');
const router = express.Router();

const UserController = require("../../layer/controllers/users.order.controller");
const userController = new UserController();

// 페이지 보여주기
router.get('/', userController.getPage_userOrder);
router.get('/orders', userController.getPage_userOrderList);
router.get('/order/:orderId', userController.getPage_userOrderDetail);
router.get('/order/comment', userController.getPage_userWriteReview);




module.exports = router;