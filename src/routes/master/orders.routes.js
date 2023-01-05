const express = require('express');
const router = express.Router();

const MasterController = require('../../layer/controllers/masters.controller.js');
const masterController = new MasterController();

const masterMiddleware = require("../../middleware/master_middleware");

router.get('/', masterMiddleware, masterController.getList_orders);
router.put('/:order_id', masterMiddleware, masterController.accept_order);

router.get('/page/:page', masterMiddleware, masterController.getList_orders_page);
router.get('/laundryCare', masterMiddleware, masterController.getOrder_manage);
router.put('/laundryCare/:order_id', masterMiddleware, masterController.getOrder_manageNextStep);

router.get('/reviews', masterMiddleware, masterController.getList_review);

module.exports = router;
