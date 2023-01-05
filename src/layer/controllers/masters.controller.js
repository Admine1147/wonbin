const MasterService = require('../services/masters.services');

class MasterController {
  masterService = new MasterService();

  getPage_master_home = async (req, res) => {
    const master_id = res.locals.master_id;
    const master = await this.masterService.getMaster_byId(master_id);
    res.render('master/masterHome', { master_point: master.point });
  };

  getPate_LaundryCare = async (req, res) => {
    const master_id = res.locals.master_id;
    const master = await this.masterService.getMaster_byId(master_id);
    res.render('master/LaundryCare', { master_point: master.point });
  };

  getPage_masterReviews = async (req, res) => {
    const master_id = res.locals.master_id;
    const master = await this.masterService.getMaster_byId(master_id);
    res.render('master/masterReviews', { master_point: master.point });
  };

  // 사장님 홈페이지 처음 접속 시 리스트를 가져옴.
  getList_orders = async (req, res) => {
    const page = 1; // 가장 처음에 페이지가 로드된 것이라면 초기값으로 1.

    const result = await this.masterService.getList_orders(page);
    res.status(200).json(result);
  };

  getList_orders_page = async (req, res) => {
    const page = Number(req.params.page);

    const result = await this.masterService.getList_orders(page);
    if (result.success === false) {
      return res.status(200).json(result);
    }

    res.status(200).json(result);
  };

  accept_order = async (req, res) => {
    const { order_id } = req.params;
    const master_id = res.locals.master_id;
    const exist_order = await this.masterService.getOrder_byMasterId(master_id);
    if (exist_order.success === true) {
      // true가 나왔다는 건, 이미 할 일이 등록되어 있다는 뜻.
      return res.status(200).json({ message: '이미 할 일이 있으니 할 일이나 마저 하십쇼. 인간', success: false });
    }

    const master = await this.masterService.getMaster_byId(master_id);
    const { storename } = master;

    const accept_order = await this.masterService.accept_order(order_id, master_id, storename);

    res.json({ accept_order });
  };

  // 내가 관리중인 요청 오더
  getOrder_manage = async (req, res) => {
    const master_id = res.locals.master_id;
    console.log(master_id);

    const result = await this.masterService.getOrder_byMasterId(master_id);
    if (result.success === false) {
      return res.json({ success: false, message: '현재 담당중인 요청 없음' });
    }

    res.status(200).json(result);
  };

  getOrder_manageNextStep = async (req, res) => {
    const master_id = res.locals.master_id;
    const { order_id } = req.params;
    const order = await this.masterService.getOrder_manageNextStep(order_id);

    res.json({ order: order });
  };

  getList_review = async (req, res) => {
    const master_id = res.locals.master_id;
    const review = await this.masterService.getReview_byMasterId(master_id);

    res.json({ review_list: review });
  };
}

module.exports = MasterController;
