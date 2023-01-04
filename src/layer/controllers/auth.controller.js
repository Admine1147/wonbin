const AuthService = require("../services/auth.services.js");

class AuthController {
  authService = new AuthService();

  getPage_startPage = async (req, res) => {
    res.render("main/start");
  };

  getPage_mainPage = async (req, res) => {
    res.render("main/main");
  };

  getPage_Auth = async (req, res) => {
    res.render("signup/signUp");
  };

  getPage_UserAuth = async (req, res) => {
    res.render("signup/UserSignUp");
  };

  getPage_MasterAuth = async (req, res) => {
    res.render("signup/MasterSignUp");
  };

  getPage_Login = async (req, res) => {
    res.render("login/Login");
  };

  getPage_LoginUser = async (req, res) => {
    res.render("login/LoginUser");
  };

  getPage_LoginMaster = async (req, res) => {
    res.render("login/LoginMaster");
  };
}

module.exports = AuthController;
