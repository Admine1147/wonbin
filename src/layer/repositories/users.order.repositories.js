const fs = require('fs');
const path = require('path');
const { Op } = require("sequelize");

class UserOrderRepository {
    constructor (ordersModel) {
        this.ordersModel = ordersModel;
    }

    getUserRecord = async (user_id) => {
        try {
            const userInfo = await this.ordersModel.findOne({where : {user_id}});
            return userInfo;
        } catch (err) {
            console.log(err);
            return err
        }
    }

    minusPoint = async (user_id) => {
        try {
            await this.ordersModel.increment({point: -10000}, {where: {user_id}});
        } catch (err) {
            console.log(err);
            return err
        }
    }

    createOrder = async (orderData) => {
        const createOrderData = await this.ordersModel.create(orderData);

        return createOrderData;
    }

    getOrderDetail = async (order_id) => {
        try {
            const orderDetail = await this.ordersModel.findOne({where: {order_id}});
            return orderDetail;
        } catch (err) {
            return {success: false, errorMessage: `${err}`};
        }
    }

    getOrder_for_user_order = async (user_id, order_id) => {
        try {
            const order = await this.ordersModel.findAll({where: { [Op.and]: [{ user_id }, { order_id }] } });

            return order
        } catch (err) {
            console.log(err);
            return err
        }
    }

    getOrderImages = async (order_id) => {
        try {
            const orderDetailImagesNameArray = await this.ordersModel.findAll({where: {order_id}});
            return orderDetailImagesNameArray;
        } catch (err) {
            return {success: false, errorMessage: `${err}`};
        }
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

    getUserOrderListAll = async (user_id, pageCount) => {
        const userOrderListAll = await this.ordersModel.findAll({
            where: {user_id}, order: [['order_id', 'DESC']],
            offset: pageCount,
            limit: 5
        });
        return userOrderListAll;
    }

    getUserOrderListDoing = async (user_id, pageCount) => {
        const userOrderListDoing = await this.ordersModel.findAll({
            where: { [Op.and]: [{ user_id }], [Op.not]: [{ status: 5 }] }, order: [['order_id', 'DESC']],
            offset: pageCount,
            limit: 5
        })
        return userOrderListDoing;
    }

    getUserOrderListDone = async (user_id, pageCount) => {
        const userOrderListDone = await this.ordersModel.findAll({
            where: { [Op.and]: [{ user_id }, { status: 5 }] }, order: [['order_id', 'DESC']],
            offset: pageCount,
            limit: 5
        });
        return userOrderListDone;
    }

    getuserOrderListThumImgName = async (arrayOrderId) => {
        let arrayThumName = {};

        for (let i = 0; i < arrayOrderId.length; i++) {
            const thumName = await this.ordersModel.findOne({where: { [Op.and]: [{ order_id: arrayOrderId[i] }, { is_thum: 1 }] }});
            if (thumName) {
                arrayThumName[arrayOrderId[i]] = thumName.img_name;
            }
        } 
        return arrayThumName;
    }

    deleteUserOrder = async (order_id) => {
        try {
            const resultOfDestroy = await this.ordersModel.destroy({where: {order_id}});
            return resultOfDestroy;
        } catch (err) {
            return `${err}`;
        }
    }

    returnPoint = async (user_id) => {
        await this.ordersModel.increment({point: 10000}, {where: {user_id}});
        return 1;
    }

    deleteUserOrderImgs = async (order_id, user_id) => {
        try {
            const resultOfDestroy = await this.ordersModel.destroy({where: {order_id}});

            const relativePath = `src/public/image/userRequest/user_${user_id}/order_${order_id}`;
            const dir = path.resolve(relativePath);
            if(fs.existsSync(dir)) {
                fs.rm(dir, {recursive:true}, (error) => {
                    if (error) {
                        console.log('rmdir error : ' + error);
                        throw new Error(`${error}`);
                    }
                    return true;
                })
            }
            throw new Error("DB 경로상에는 이미지가 존재하지만, 실제 이미지 파일은 존재하지 않습니다.")
        } catch (err) {
            return `${err}`;
        }
    }

    createReview = async (params) => {
        try {
            const result = await this.ordersModel.create(params);
            return result;
        } catch (err) {
            console.log(`${err}`);
            return false
        }
    }

    changeIsReview = async (order_id, review_id) => {
        try {
            await this.ordersModel.update(
                { isReview : review_id },
                { where : { order_id }}
            );

            return true;
        } catch (err) {
            console.log(`${err}`);
            return false
        }
    }

    getReview = async (user_id, order_id, review_id) => {
        try {
            const review_one = await this.ordersModel.findOne({where: { [Op.and]: [{ review_id }, { order_id }, { user_id }] } });
            return review_one;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    getMatserStore = async (master_id) => {
        try {
            const master = await this.ordersModel.findOne({where: {master_id}});
            if (!master) {
                throw new Error("해당 리뷰가 작성된 가게의 마스터를 찾지 못하였습니다.")
            }
            return master.storename;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
 
}

module.exports = UserOrderRepository;