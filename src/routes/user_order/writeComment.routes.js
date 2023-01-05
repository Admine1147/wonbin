const express = require('express');
const router = express.Router();

const UsersOrderController = require("../../layer/controllers/users.order.controller.js");
const usersOrderController = new UsersOrderController();

const userMiddleware = require("../../middleware/user_middleware.js");

router.get('/:order_id', userMiddleware, usersOrderController.getUserNameAndMasterStorename);
router.post('/:order_id', userMiddleware, usersOrderController.insertUserReview);


module.exports = router;