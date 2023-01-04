const express = require('express');
const router = express.Router();

const UsersOrderController = require("../../layer/controllers/users.order.controller.js");
const usersOrderController = new UsersOrderController();


router.get('/:order_id', usersOrderController.getUserNameAndMasterStorename);
router.post('/:order_id', usersOrderController.insertUserReview);
router.get('/')


module.exports = router;