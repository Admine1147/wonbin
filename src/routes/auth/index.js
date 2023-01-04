"use strict";

const express = require('express');
const router = express.Router();

const AuthController = require("../../layer/controllers/auth.controller.js");
const authController = new AuthController();

// 첫 메인 페이지
router.get('/', authController.getPage_startPage);

// 메인 페이지
router.get('/main', authController.getPage_mainPage)

// 회원가입 페이지. 여기서 유저냐 마스터냐 선택
router.get('/register', authController.getPage_Auth);
// 유저 회원가입
router.get('/register/user', authController.getPage_UserAuth);
// 마스터 회원가입
router.get('/register/master', authController.getPage_MasterAuth);


// 로그인 페이지. 여기서 유저냐 마스터냐 선택
router.get('/login', authController.getPage_Login);
// 유저 로그인
router.get('/login/user', authController.getPage_LoginUser);
// 마스터 로그인
router.get('/login/master', authController.getPage_LoginMaster);



module.exports = router;