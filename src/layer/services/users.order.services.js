const UserOrderRepository = require("../repositories/users.order.repositories.js")
const { orders, order_imgs } = require("../../sequelize/models/index.js");

class UserOrderService {
    userOrderRepository = new UserOrderRepository(orders);
    userOrderImgsRepository = new UserOrderRepository(order_imgs);

    createOrder = async (orderData) => {
        const createOrderData = await this.userOrderRepository.createOrder(orderData);
        return createOrderData;
    }
    
    insertOrderImgName = async (user_id, order_id, arrayFileName) => {
        const insertOrderImgNameData = await this.userOrderImgsRepository.insertOrderImgName(user_id, order_id, arrayFileName);
        return insertOrderImgNameData;
    }   
}

module.exports = UserOrderService;