const express = require('express');
const router = express.Router();

const AuthController = require("../../layer/controllers/auth.controller");
const authController = new AuthController;

const authMiddleware = require("../../middleware/auth_middleware.js");

router.post("/user", authMiddleware, authController.userSignUp);      // 유저 회원가입 post
router.post("/master", authMiddleware, authController.masterSignUp);   // 사장님 회원가입 post




module.exports = router;