const MasterService = require("../services/masters.services");

class MasterController {
    masterService = new MasterService();

    getPage_master_home = async (req, res) => {
        res.render('master/masterHome');
    } 

    getPate_LaundryCare = async (req, res) => {
        res.render('master/LaundryCare');
    }

    getPage_masterReviews = async (req, res) => {
        res.render('master/masterReviews')
    }
}

module.exports = MasterController;