const MasterRepository = require('../repositories/masters.repositories');
const { orders, masters, order_reviews } = require('../../sequelize/models/index.js');

class MasterService {
  ordersRepository = new MasterRepository(orders);
  masterRepository = new MasterRepository(masters);
  reviewRepository = new MasterRepository(order_reviews);

  getList_orders = async () => {
    const result = await this.ordersRepository.getList_orders();
    return result;
  };

  getOrder_byMasterId = async master_id => {
    const result = await this.ordersRepository.getOrder_byMasterId(master_id);
    return result;
  };

  getMaster_byId = async master_id => {
    const master = await this.masterRepository.getMaster_byId(master_id);
    return master;
  };

  accept_order = async (order_id, master_id, storename) => {
    const find_order = await this.ordersRepository.getOrder_byOrderId(order_id);
    if (!find_order || !find_order.status == 1) {
      throw new Error('주문이 없거나, 이미 수락된 주문 입니다.');
    }
    const order_status = 2;
    const accept_order = await this.ordersRepository.accept_order(order_id, master_id, storename, order_status);

    // console.log('ser accept_order', accept_order);
    return accept_order;
  };

  getOrder_manageNextStep = async order_id => {
    const find_order = await this.ordersRepository.getOrder_byOrderId(order_id);
    const order_status = find_order.status + 1;
    const order_nextStep = await this.ordersRepository.order_nextStep(order_id, order_status);

    return order_nextStep;
  };

  getReview_byMasterId = async master_id => {
    console.log('ser getReview_byMasterId : ', master_id);
    const find_review = await this.reviewRepository.getReview_byMasterId(master_id);
    return find_review;
  };
}

module.exports = MasterService;
