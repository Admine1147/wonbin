const express = require('express');
const router = express.Router();

// 각 페이지로
const homeRouter = require("./auth");
const masterRouter = require("./master");
const userRouter = require("./user_order");

// 로그인 및 회원가입 api
const registerRouter = require("./auth/register.routes");
const authRouter = require("./auth/auth.routes");

// 사장님 세탁 주문 조회, 주문 상황, 가게 리뷰 조회 api
const ordersRouter = require("./master/orders.routes");
const reviewsRouter = require("./master/reviews.routes");

// 손님 세탁 요청, 요청 목록 조회, 리뷰 작성 api
const userOrderRouter = require("./user_order/order.routes");
const myordersListRouter = require("./user_order/myordersList.routes");
const writeCommentRouter = require("./user_order/writeComment.routes");


// ejs 랜더링 라우트
router.use("/", homeRouter);
router.use('/masters', masterRouter);
router.use("/users", userRouter);

// api 라우트
router.use("/api/signup", registerRouter);
router.use("/api/auth", authRouter);
router.use("/api/orders", ordersRouter);    //  get 포함
router.use("/api/reviews", reviewsRouter);  // get
router.use("/api/order", userOrderRouter);
router.use("/api/myorders", myordersListRouter);    // get
router.use("/api/comment", writeCommentRouter);





module.exports = router;