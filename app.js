"use strict";

const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 라우팅
const rootRouting = require("./src/routes");
app.use("/", rootRouting);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, " 포트로 서버가 열렸어요!");
});
