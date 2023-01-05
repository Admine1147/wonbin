const { Op } = require("sequelize");

class AuthRepository {
    constructor (authModels) {
        this.authModels = authModels;
    }

    getAccount_byEmail = async (email) => {
        try {
            const checkEmail = await this.authModels.findAll({where: {email}});
            return checkEmail;
        } catch(err) {
            console.log(err);
            return err;
        }
    }

    getAccount_byPhone = async (phonenumber) => {
        try {
            const checkPhoen = await this.authModels.findAll({where: {phonenumber}});
            return checkPhoen;
        } catch(err) {
            console.log(err);
            return err;
        }
    }

    getAccount_byAddress = async (address) => {
        try {
            const checkAddress = await this.authModels.findAll({where: {address}});
            return checkAddress;
        } catch(err) {
            console.log(err);
            return err;
        }
    }

    inserAccount = async (params) => {
        try {
            const createdMaster = await this.authModels.create(params);
            return createdMaster;

        } catch (err) {
            console.log(err);
            return err;
        }
    }

}

module.exports = AuthRepository;