
class UserOrderRepository {
    constructor (ordersModel) {
        this.ordersModel = ordersModel;
    }

    createOrder = async (orderData) => {
        orderData["life_laundry"] = 1;
        orderData["individual_laundry"] = 1;
        const createOrderData = await this.ordersModel.create(orderData);

        return createOrderData;
    }

    insertOrderImgName = async (user_id, order_id, arrayFileName) => {

        for (let i = 0; i < arrayFileName.length; i++) {
            if (i === 0) {
                await this.ordersModel.create({order_id, user_id, img_name: arrayFileName[i], is_thum: 1});
                continue;
            }
            await this.ordersModel.create({order_id, user_id, img_name: arrayFileName[i], is_thum: 0});
        }
        return true;   
    }
}

module.exports = UserOrderRepository;