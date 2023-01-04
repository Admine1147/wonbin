const express = require('express');
const router = express.Router();

const UserController = require("../../layer/controllers/users.order.controller");
const userController = new UserController();



router.delete('/:order_id', userController.deleteUserOrder);




module.exports = router;