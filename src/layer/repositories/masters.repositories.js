const { Op } = require('sequelize');

class MasterRepository {
  constructor(model) {
    this.model = model;
  }

  getList_orders = async () => {
    const orders_list = await this.model.findAll({ where: { status: 1 } });
    return orders_list;
  };

  getOrder_byMasterId = async master_id => {
    const order = await this.model.findOne({
      where: { [Op.and]: [{ master_id }, { status: { [Op.gt]: 1 } }, { status: { [Op.lt]: 5 } }] },
    });
    return order;
  };

  getMaster_byId = async master_id => {
    const master = await this.model.findOne({ where: { master_id } });
    return master;
  };

  getOrder_byOrderId = async order_id => {
    const order = await this.model.findOne({ where: { order_id } });
    return order;
  };

  accept_order = async (order_id, master_id, storename, order_status) => {
    console.log('repo storename : ', storename);
    const accept_order = await this.model.update(
      { master_id, storename, status: order_status },
      { where: { order_id } },
    );
    return accept_order;
  };
}

module.exports = MasterRepository;
