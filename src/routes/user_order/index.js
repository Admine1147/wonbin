"use strict";

const express = require('express');
const router = express.Router();

const UserController = require("../../layer/controllers/users.order.controller");
const userController = new UserController();

const userMiddleware = require("../../middleware/user_middleware");

// 페이지 보여주기
router.get('/', userMiddleware, userController.getPage_userOrder);
router.get('/orders', userMiddleware, userController.getPage_userOrderList);
router.get('/order/:orderId', userMiddleware, userController.getPage_userOrderDetail);
router.get('/order/comment', userMiddleware, userController.getPage_userWriteReview);




module.exports = router;