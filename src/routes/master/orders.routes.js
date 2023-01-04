const express = require('express');
const router = express.Router();

const MasterController = require('../../layer/controllers/masters.controller.js');
const masterController = new MasterController();

router.get('/', masterController.getList_orders);
router.put('/:order_id', masterController.accept_order);

router.get('/laundryCare', masterController.getOrder_manage);
router.put('/laundryCare/:order_id', masterController.getOrder_manageNextStep);

router.get('/reviews', masterController.getList_review);

module.exports = router;
