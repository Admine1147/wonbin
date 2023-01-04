'use strict';

const express = require('express');
const router = express.Router();

const MasterController = require('../../layer/controllers/masters.controller.js');
const masterController = new MasterController();

// 사장님 페이지 & home  master.home.ejs
router.get('/', masterController.getPage_master_home);

// 사장님의 현재 진행중인 세탁물 관리 페이지.   LaundryCare
router.get('/laundryCare', masterController.getPate_LaundryCare);

// 사장님이 자신의 세탁소에 달린 리뷰들을 보는 페이지.
router.get('/reviews', masterController.getPage_masterReviews);

module.exports = router;
