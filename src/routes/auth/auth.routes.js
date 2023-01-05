const express = require('express');
const router = express.Router();

const AuthController = require("../../layer/controllers/auth.controller");
const authController = new AuthController;

const authMiddleware = require("../../middleware/auth_middleware.js");

router.post("/user", authMiddleware, authController.userLogin);      // 유저 로그인 post
router.post("/master", authMiddleware, authController.masterLogin);   // 사장님 로그인 post



module.exports = router;