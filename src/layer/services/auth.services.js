const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const util = require("util");

const AuthRepository = require("../repositories/auth.repositories.js");
const { users, orders, order_imgs, masters, order_reviews } = require("../../sequelize/models/index.js");


class AuthService {
    userOrderModel = new AuthRepository(orders);
    userOrderImgsModel = new AuthRepository(order_imgs);
    mastersModel = new AuthRepository(masters);
    usersModel = new AuthRepository(users);
    orderReviewsModel = new AuthRepository(order_reviews);

    // 사장님 회원가입 관련
    checkingMaster = async (email, phonenumber, address) => {
        try {
            const check_email = await this.mastersModel.getAccount_byEmail(email);
            if (check_email.length) {
                return {success: false, type: "duplication", message: "이미 존재하는 이메일 입니다."}
            }

            const check_phonenumber = await this.mastersModel.getAccount_byPhone(phonenumber);
            if (check_phonenumber.length) {
                return {success: false, type: "duplication", message: "이미 존재하는 전화번호 입니다."};
            }
            
            const check_address = await this.mastersModel.getAccount_byAddress(address);
            if (check_address.length) {
                return {success: false, type: "duplication", message: "이미 존재하는 주소입니다."};
            }

            return {success: true, message: "중복 검사 완료. 해당 사항 없음."};

        } catch (err) {
            console.log(err);
            return {success: false, type: "err", message: `${err}`}
        }
    }

    joinMaster = async (masterJoin) => {
        try {
            const {email, password, storename, phonenumber, address} = masterJoin;

            // 비밀번호 암호화
            const randomBytesPromise = util.promisify(crypto.randomBytes);
            const pbkdf2Promise = util.promisify(crypto.pbkdf2);
            const buf = await randomBytesPromise(64);
            const salt = buf.toString("base64");
            const hashedPassword = await pbkdf2Promise(password, salt, 100000, 64, "sha512");
            const new_password = hashedPassword.toString("base64");

            const params = {
                email,
                password: new_password,
                salt,
                storename,
                phonenumber,
                address
            }

            // 회원가입
            const createMaster = await this.mastersModel.inserAccount(params);

            return {success: true, message: "회원가입 완료", master: createMaster};

        } catch (err) {
            console.log(err);
            return {success: false, type: "err", message: `${err}`}
        }
    }

    makingTokenAfterRegisterMaster = async (master_id) => {
        try {
            const accessToken = jwt.sign({master_id: master_id, account_type: "master"}
            , process.env.JWT_SECRET_KEY, { expiresIn: '1h', algorithm : "HS256"});
        
            return {success: true, token: accessToken}

        } catch (err) {
            return {success: false, message:"토큰을 발행하는 도중 에러가 발생하였습니다. 로그인 해 주십시오."}
        }
    }

    // 손님 회원가입 관련
    checkingUser = async (email, phonenumber, address) => {
        try {
            const check_email = await this.usersModel.getAccount_byEmail(email);
            const check_phonenumber = await this.usersModel.getAccount_byPhone(phonenumber);
            const check_address = await this.usersModel.getAccount_byAddress(address);

            if (check_email.length) {
                return {success: false, type: "duplication", message: "이미 존재하는 이메일 입니다."}
            }
            if (check_phonenumber.length) {
                return {success: false, type: "duplication", message: "이미 존재하는 전화번호 입니다."};
            }
            if (check_address.length) {
                return {success: false, type: "duplication", message: "이미 존재하는 주소입니다."};
            }

            return {success: true, message: "중복 검사 완료. 해당 사항 없음."};

        } catch (err) {
            console.log(err);
            return {success: false, type: "err", message: `${err}`}
        }
    }

    joinUser = async (userJoin) => {
        try {
            const {email, password, nickname, phonenumber, address} = userJoin;

            // 비밀번호 암호화
            const randomBytesPromise = util.promisify(crypto.randomBytes);
            const pbkdf2Promise = util.promisify(crypto.pbkdf2);
            const buf = await randomBytesPromise(64);
            const salt = buf.toString("base64");
            const hashedPassword = await pbkdf2Promise(password, salt, 100000, 64, "sha512");
            const new_password = hashedPassword.toString("base64");

            const params = {
                email,
                password: new_password,
                salt,
                nickname,
                phonenumber,
                address
            }

            // 회원가입
            const createUser = await this.usersModel.inserAccount(params);

            return {success: true, message: "회원가입 완료", user: createUser};

        } catch (err) {
            console.log(err);
            return {success: false, type: "err", message: `${err}`}
        }
    }

    makingTokenAfterRegisterUser = async (user_id) => {
        try {
            const accessToken = jwt.sign({user_id: user_id, account_type: "user"}
            , process.env.JWT_SECRET_KEY, { expiresIn: '1h', algorithm : "HS256"});
        
            return {success: true, token: accessToken}

        } catch (err) {
            return {success: false, message:"토큰을 발행하는 도중 에러가 발생하였습니다. 로그인 해 주십시오."}
        }
    }

    // 사장님이 로그인 시 이메일을 검사한다.
    getMaster_byEmail = async (email) => {
        try {
            const getMaster = await this.mastersModel.getAccount_byEmail(email);

            if (!getMaster.length || getMaster.length > 1) {
                return {success: false, type:"none", message:"아이디가 존재하지 않습니다."}
            }

            return {success: true, master: getMaster[0]};

        } catch (err) {
            console.log(err);
            return {success: false, type:"err", message:err};
        }
    }

    // 유저가 로그인 시 이메일을 검사한다.
    getUser_byEmail = async (email) => {
        try {
            const getUser = await this.usersModel.getAccount_byEmail(email);

            if (!getUser.length || getUser.length > 1) {
                return {success: false, type:"none", message:"아이디가 존재하지 않습니다."}
            }
            return {success: true, user: getUser[0]};

        } catch (err) {
            console.log(err);
            return {success: false, type:"err", message:err};
        }
    }

    // 계정 로그인 시 비밀번호를 검사.
    check_password = async (password, db_password, salt) => {
        try {

            const pbkdf2Promise = util.promisify(crypto.pbkdf2);
            const hashedPassword = await pbkdf2Promise(password, salt, 100000, 64, "sha512");
            const encodedHashedPassword = hashedPassword.toString("base64")

            if (encodedHashedPassword !== db_password) {
                return {success: false, type: "none", message:"비밀번호가 일치하지 않습니다."}
            }

            return {success: true, message:"비밀번호가 일치합니다."};

        } catch (err) {
            console.log(err);
            return {success: false, type:'err', message: err}
        }
    }


}

module.exports = AuthService;