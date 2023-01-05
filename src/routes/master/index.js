'use strict';

const express = require('express');
const router = express.Router();

const MasterController = require('../../layer/controllers/masters.controller.js');
const masterController = new MasterController();

const masterMiddleware = require("../../middleware/master_middleware");

// 사장님 페이지 & home  master.home.ejs
router.get('/', masterMiddleware, masterController.getPage_master_home);

// 사장님의 현재 진행중인 세탁물 관리 페이지.   LaundryCare
router.get('/laundryCare', masterMiddleware, masterController.getPate_LaundryCare);

// 사장님이 자신의 세탁소에 달린 리뷰들을 보는 페이지.
router.get('/reviews', masterMiddleware,  masterController.getPage_masterReviews);

module.exports = router;

