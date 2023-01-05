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

	// 로그 아웃
	accountLogOut = async (req, res) => {
		res.clearCookie('accessToken');
		res.redirect('/main');
	}

	// 사장님 회원가입 관련
	masterSignUp = async (req, res) => {
		const {email, password, confirm_password, storename, phonenumber, address} = req.body;

		if (!email || !email.includes("@") || !email.includes(".")) {
			return res.status(400).json({success:false, message:"이메일 형식이 올바르지 않습니다."})
		}
		if (password !== confirm_password) {
			return res.status(400).json({success:false, message:"패스워드가 일치하지 않습니다."})
		}
		if (password.length < 4 ) {
			return res.status(400).json({success:false, message:"패스워드가 짧습니다."})
		}
		if (!storename) {
			return res.status(400).json({success:false, message:"가게 이름을 알맞게 입력해 주세요"})
		}
		if (!phonenumber || phonenumber.length < 11 || phonenumber.length > 11) {
			return res.status(400).json({success:false, message:"전화번호 형식이 올바르지 않습니다."})
		}
		if (!address) {
			return res.status(400).json({success:false, message:"주소지를 입력해 주세요"});
		}

		// 먼저 중복된 이메일, 전화번호, 주소가 있는지 확인.
		const checkDuplication = await this.authService.checkingMaster(email, phonenumber, address);

		if (checkDuplication.success === false) {
			if (checkDuplication.type === "duplication") {
				return res.status(200).json(checkDuplication);
			}
			if (checkDuplication.type === "err") {
				return res.status(500).json(checkDuplication);
			}
		}

		// 중복을 통과했다면, 회원가입 insert
		const params = {
			email, 
			password, 
			storename, 
			phonenumber, 
			address
		}

		const insertMater = await this.authService.joinMaster(params);

		if (insertMater.success === false) {
			return res.status(200).json(insertMater);
		}


		// 마스터가 회원가입을 했다? 바로 토큰 만들어주고 로그인 시켜서 master home 으로 보낸다.
		const makeTokenAfterRegister = await this.authService.makingTokenAfterRegisterMaster(insertMater.master.master_id);

		if (makeTokenAfterRegister.success === false) {
			return res.status(500).json(makeTokenAfterRegister)
		}

		res.cookie('accessToken', makeTokenAfterRegister.token); 
		return res.status(200).json(insertMater);
	}

	// 손님 회원가입 관련
	userSignUp = async (req, res) => {
		const {email, password, confirm_password, nickname, phonenumber, address} = req.body;

		if (!email || !email.includes("@") || !email.includes(".")) {
			return res.status(400).json({success:false, message:"이메일 형식이 올바르지 않습니다."})
		}
		if (password !== confirm_password) {
			return res.status(400).json({success:false, message:"패스워드가 일치하지 않습니다."})
		}
		if (password.length < 4 ) {
			return res.status(400).json({success:false, message:"패스워드가 짧습니다."})
		}
		if (!nickname) {
			return res.status(400).json({success:false, message:"가게 이름을 알맞게 입력해 주세요"})
		}
		if (!phonenumber || phonenumber.length < 11 || phonenumber.length > 11) {
			return res.status(400).json({success:false, message:"전화번호 형식이 올바르지 않습니다."})
		}
		if (!address) {
			return res.status(400).json({success:false, message:"주소지를 입력해 주세요"});
		}

		// 먼저 중복된 이메일, 전화번호, 주소가 있는지 확인.
		const checkDuplication = await this.authService.checkingUser(email, phonenumber, address);

		if (checkDuplication.success === false) {
			if (checkDuplication.type === "duplication") {
				console.log("중복관련 에러")
				return res.status(200).json(checkDuplication);
			}
			if (checkDuplication.type === "err") {
				console.log("시스템 에러")
				return res.status(500).json(checkDuplication);
			}
		}

		// 중복을 통과했다면, 회원가입 insert
		const params = {
			email, 
			password, 
			nickname, 
			phonenumber, 
			address
		}

		const insertUser = await this.authService.joinUser(params);

		if (insertUser.success === false) {
			return res.status(200).json(insertUser);
		}

		// 손님이 회원가입을 했다? 바로 토큰 만들어주고 로그인 시켜서 user home 으로 보낸다.
		const makeTokenAfterRegister = await this.authService.makingTokenAfterRegisterUser(insertUser.user.user_id);

		if (makeTokenAfterRegister.success === false) {
			return res.status(500).json(makeTokenAfterRegister)
		}

		res.cookie('accessToken', makeTokenAfterRegister.token); 
		return res.status(200).json(insertUser);
	}


	// 사장님 로그인
	masterLogin = async (req, res) => {
		const { email, password } = req.body;

		// 먼저 email 로 해당 사장님이 존재하는지 체크.
		const checkEmail = await this.authService.getMaster_byEmail(email);

		if (checkEmail.success === false) {
			if (checkEmail.type === "none") {
				return res.status(200).json(checkEmail);	
			}
			return res.status(400).json(checkEmail);
		}

		// 해당 이메일로 딱 한 명 존재한다. 이번에는 비밀번호를 검증한다. salt 도 필요해.
		const salt = checkEmail.master.salt;
		const db_password = checkEmail.master.password;
		const checkPassword = await this.authService.check_password(password, db_password, salt);

		if (checkPassword.success === false) {
			if (checkPassword.type === "none") {
				return res.status(200).json(checkPassword);
			}
			return res.status(400).json(checkPassword);
		}

		// 비밀번호 검증까지 통과했다면, 토큰을 발행해준다.
		const makeToken = await this.authService.makingTokenAfterRegisterMaster(checkEmail.master.master_id);
		
		if (makeToken.success === false) {
			return res.status(200).json(makeToken)
		}

		res.cookie('accessToken', makeToken.token); 
		return res.status(200).json({success: true});
	}

	// 손님 로그인
	userLogin = async (req, res) => {
		const { email, password } = req.body;

		// 먼저 email 로 해당 손님이 존재하는지 체크.
		const checkEmail = await this.authService.getUser_byEmail(email);
		if (checkEmail.success === false) {
			if (checkEmail.type === "none") {
				return res.status(200).json(checkEmail);	
			}
			return res.status(400).json(checkEmail);
		}

		// 해당 이메일로 딱 한 명 존재한다. 이번에는 비밀번호를 검증한다. salt 도 필요해.
		const salt = checkEmail.user.salt;
		const db_password = checkEmail.user.password;
		const checkPassword = await this.authService.check_password(password, db_password, salt);

		if (checkPassword.success === false) {
			if (checkPassword.type === "none") {
				return res.status(200).json(checkPassword);
			}
			return res.status(400).json(checkPassword);
		}

		// 비밀번호 검증까지 통과했다면, 토큰을 발행해준다.
		const makeToken = await this.authService.makingTokenAfterRegisterUser(checkEmail.user.user_id);
		
		if (makeToken.success === false) {
			return res.status(200).json(makeToken)
		}

		res.cookie('accessToken', makeToken.token); 
		return res.status(200).json({success: true});
	}
}

module.exports = AuthController;
