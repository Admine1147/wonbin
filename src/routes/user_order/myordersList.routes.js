const express = require('express');
const router = express.Router();

const UserController = require("../../layer/controllers/users.order.controller");
const userController = new UserController();

const userMiddleware = require("../../middleware/user_middleware.js");

router.delete('/:order_id', userMiddleware, userController.deleteUserOrder);
router.get('/:type/page/:page', userMiddleware, userController.getMorePageOrders);


module.exports = router;