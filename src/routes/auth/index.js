"use strict";

const express = require('express');
const router = express.Router();

const AuthController = require("../../layer/controllers/auth.controller.js");
const authController = new AuthController();

const authMiddleware = require("../../middleware/auth_middleware.js");

// 첫 메인 페이지
router.get('/', authMiddleware, authController.getPage_startPage);

// 메인 페이지
router.get('/main', authMiddleware, authController.getPage_mainPage)

// 회원가입 페이지. 여기서 유저냐 마스터냐 선택
router.get('/register', authMiddleware, authController.getPage_Auth);
// 유저 회원가입
router.get('/register/user', authMiddleware, authController.getPage_UserAuth);
// 마스터 회원가입
router.get('/register/master', authMiddleware, authController.getPage_MasterAuth);


// 로그인 페이지. 여기서 유저냐 마스터냐 선택
router.get('/login', authMiddleware, authController.getPage_Login);
// 유저 로그인
router.get('/login/user', authMiddleware, authController.getPage_LoginUser);
// 마스터 로그인
router.get('/login/master', authMiddleware, authController.getPage_LoginMaster);

// 로그 아웃
router.get('/logout', authController.accountLogOut);


module.exports = router;