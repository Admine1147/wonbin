const MasterService = require('../services/masters.services');

class MasterController {
  masterService = new MasterService();

  getPage_master_home = async (req, res) => {
    res.render('master/masterHome');
  };

  getPate_LaundryCare = async (req, res) => {
    res.render('master/LaundryCare');
  };

  getPage_masterReviews = async (req, res) => {
    res.render('master/masterReviews');
  };

  getList_orders = async (req, res) => {
    const result = await this.masterService.getList_orders();
    res.json({
      order_list: result,
    });
  };

  accept_order = async (req, res) => {
    const { order_id } = req.params;
    const master_id = 1;
    const exist_order = await this.masterService.getOrder_byMasterId(master_id);
    if (exist_order) {
      return res.status(200).json({ message: '이미 할 일이 있으니 할 일이나 마저 하십쇼. 인간', success: false });
    }

    const master = await this.masterService.getMaster_byId(master_id);
    const { storename } = master;

    const accept_order = await this.masterService.accept_order(order_id, master_id, storename);

    res.json({ accept_order });
  };

  getOrder_manage = async (req, res) => {
    const master_id = 1;
    const order = await this.masterService.getOrder_byMasterId(master_id);
    if (!order) {
      return res.send('일 없음');
    }
    console.log('con manage order : ', order);
    res.json({ order: order });
  };

  getOrder_manageNextStep = async (req, res) => {
    const master_id = 1;
    const { order_id } = req.params;
    const order = await this.masterService.getOrder_manageNextStep(order_id);

    res.json({ order: order });
  };

  getList_review = async (req, res) => {
    const master_id = 1;
    const review = await this.masterService.getReview_byMasterId(master_id);

    res.json({ review_list: review });
  };
}

module.exports = MasterController;
