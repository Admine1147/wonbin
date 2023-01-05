const UserOrderRepository = require("../repositories/users.order.repositories.js")
const { users, orders, order_imgs, masters, order_reviews } = require("../../sequelize/models/index.js");

class UserOrderService {
    userOrderModel = new UserOrderRepository(orders);
    userOrderImgsModel = new UserOrderRepository(order_imgs);
    mastersModel = new UserOrderRepository(masters);
    usersModel = new UserOrderRepository(users);
    orderReviewsModel = new UserOrderRepository(order_reviews);

    getUserInfo = async (user_id) => {
        const getUser = await this.usersModel.getUserRecord(user_id);   
        
        return {
            nickname: getUser.nickname,
            phonenumber: getUser.phonenumber,
            email : getUser.email,
            address : getUser.address,
            point: getUser.point
        }

    }

    createOrder = async (orderData) => {
        if (orderData["life_laundry"] === true) {
            orderData["life_laundry"] = 1;
        } else {
            orderData["life_laundry"] = 0;
        }

        if(orderData["individual_laundry"] === true) {
            orderData["individual_laundry"] = 1;
        } else {
            orderData["individual_laundry"] = 0;
        }

        try {
            // order 를 등록하기에 앞서, 해당 유저의 포인트가 최소 포인트인 10,000 이 넘는지 확인. 넘는다면 차감, 넘지 못한다면 return.
            const userData = await this.usersModel.getUserRecord(orderData.user_id);

            if (userData.point < 10000) {
                return {success: false, message: "포인트가 부족합니다."}
            }

            await this.usersModel.minusPoint(orderData.user_id);
            const createOrderData = await this.userOrderModel.createOrder(orderData);
            return {success: true, data: createOrderData};

        } catch (err) {
            console.log(err);
            return {success: false, message: '서버 오류로 인하여 요청이 정상적으로 신청되지 않았습니다.'}
        }
        
    }

    getOrderDetail = async (order_id) => {  // order 디테일.
        const orderDetail = await this.userOrderModel.getOrderDetail(order_id); // {}
        const orderDetailImgName = await this.userOrderImgsModel.getOrderImages(order_id); // []

        const result = {
            order: orderDetail,
            orderImgs: orderDetailImgName.map((img) => {
                return img.img_name;
            })
        };

        return result;
    }

    getOneOrder = async (order_id) => {
        const order = await this.userOrderModel.getOrderDetail(order_id);
        return order;
    }
    
    insertOrderImgName = async (user_id, order_id, arrayFileName) => {
        const insertOrderImgNameData = await this.userOrderImgsModel.insertOrderImgName(user_id, order_id, arrayFileName);
        return insertOrderImgNameData;
    }   

    getUserOrdersList = async (listType, user_id, page) => {
        let getUserOrderList = [];
        let getUserOrderListthumImgName = [];
        let pageCount = 0;  // 페이지에 따라서, pageCount번째 레코드 부터 시작해서 5개를 뽑아와라.

        if (page > 1) {
            pageCount = 5 * (page - 1);
        }

        if (!listType || listType === "all") {
            getUserOrderList = await this.userOrderModel.getUserOrderListAll(user_id, pageCount);
        }
        if (listType === "doing") {
            getUserOrderList = await this.userOrderModel.getUserOrderListDoing(user_id, pageCount);
        }
        if (listType === "done") {
            getUserOrderList = await this.userOrderModel.getUserOrderListDone(user_id, pageCount);
        }

        const arrayOrderId = getUserOrderList.map((order) => {
            return order.order_id;
        })
   
        getUserOrderListthumImgName = await this.userOrderImgsModel.getuserOrderListThumImgName(arrayOrderId);
        
        const result = {
            getUserOrderList: getUserOrderList,
            getUserOrderListthumImgName: getUserOrderListthumImgName
        }

        return result;
    }

    getUserOrdersList_page = async (listType, user_id, page) => {
        try {
            let getUserOrderList = [];
            let getUserOrderListthumImgName = [];
            let pageCount = 0;  // 페이지에 따라서, pageCount번째 레코드 부터 시작해서 5개를 뽑아와라.

            if (page > 1) {
                pageCount = 5 * (page - 1);
            }

            if (!listType || listType === "all") {
                getUserOrderList = await this.userOrderModel.getUserOrderListAll(user_id, pageCount);
            }
            if (listType === "doing") {
                getUserOrderList = await this.userOrderModel.getUserOrderListDoing(user_id, pageCount);
            }
            if (listType === "done") {
                getUserOrderList = await this.userOrderModel.getUserOrderListDone(user_id, pageCount);
            }

            if (!getUserOrderList.length) {
                return {success: false, type:"none", message: "더 이상의 목록이 존재하지 않습니다."};
            }

            const arrayOrderId = getUserOrderList.map((order) => {
                return order.order_id;
            })
       
            getUserOrderListthumImgName = await this.userOrderImgsModel.getuserOrderListThumImgName(arrayOrderId);
            
            return {success: true, orderList: getUserOrderList, orderListThum: getUserOrderListthumImgName, message:"세탁 요청 목록 더 가져오기 성공"};

        } catch (err) {
            console.log(err);
            return {success: false, type:"err", message:"목록을 가져오는 도중 오류가 발생하였습니다."}
        }
        
    }

    deleteUserOrder = async (order_id) => {
        const checkOrder_id = Number.isNaN(order_id);
        try {
            if (checkOrder_id) {
                throw new Error("요청을 삭제하기 위한 order_id 의 값이 올바르지 않습니다.")
            }

            const isOrder = await this.userOrderModel.getOrderDetail(order_id);

            if (!isOrder) {
                throw new Error("삭제하고자 하는 order 가 DB에 존재하지 않습니다.")
            }

            if (isOrder.status >= 2) {
                return false;
            }

            const result = await this.userOrderModel.deleteUserOrder(order_id);
            if (result !== 1) {
                return false;
            }
            return true;
            
        } catch (err) {
            console.log(`${err}`);
            return false;
        }
    }

    deleteuUserOrderImg = async (order_id, user_id) => {
        const checkOrder_id = Number.isNaN(order_id);
        const checkUser_id = Number.isNaN(user_id);
        try {
            if (checkOrder_id || checkUser_id) {
                throw new Error("요청을 삭제하기 위한 order_id 혹은 user_id 의 값이 올바르지 않습니다.")
            }

            const isImg = await this.userOrderImgsModel.getOrderImages(order_id); // 없으면 빈 배열 []
            
            if (!isImg.length) {
                return true;
            }

            const result = await this.userOrderImgsModel.deleteUserOrderImgs(order_id, user_id);
            return true;
            
        } catch (err) {
            console.log(`${err}`)
            return false;
        }
    }

    getMasterId = async (user_id, order_id) => {
        try {

            const order = await this.userOrderModel.getOrder_for_user_order(user_id, order_id);

            if (order.length !== 1 ) {
                throw new Error("리뷰를 작성하고자 하는 주문을 특정하지 못하였습니다.")
            }

            if (order[0].status !== 5 || order[0].isReview !== 0 || order[0].master_id === 0) {
                throw new Error("리뷰를 작성할 수 있는 주문이 아닙니다.")
            }

            const result = {
                master_id : order[0].master_id,
                user_nick : order[0].nickname
            }

            return result

        } catch (err) {
            console.log(`${err}`);
            return false
        }
    }

    insertReview = async (params) => {
        try {
            const createdReview = await this.orderReviewsModel.createReview(params);
            const review_id = createdReview.review_id;
            const checkIsReview = await this.userOrderModel.changeIsReview(params.order_id, review_id);

            if (!createdReview || !checkIsReview) {
                throw new Error("리뷰 작성 도중 service에서 에러 발생.")
            }

            return createdReview
        } catch (err) {
            console.log(err);
            return false
        }
    }

    getUserReview = async (user_id, order_id, review_id) => {
        try {
            // 먼저 리뷰를 가져온다.
            const review = await this.orderReviewsModel.getReview(user_id, order_id, review_id);
            // 유저의 최신 닉네임을 가져온다.
            const user = await this.usersModel.getUserRecord(user_id);
            // 가져온 리뷰의 review.master_id 로 사장님의 최신 가게 이름을 가져온다.
            const master_storename = await this.mastersModel.getMatserStore(review.master_id);

            if (!review || !master_storename) {
                return {success: false, message:"리뷰 데이터가 존재하지 않거나, 세탁소의 이름을 찾지 못하였습니다."}
            }

            const result = {
                storename : master_storename,
                star: review.star,
                comment: review.comment,
                nickname: user.nickname,
                createdAt: review.createdAt
            }

            return {success: true, result: result};

        } catch (err) {
            console.log(err);
            return {success: false, message: err};
        }
    }
}

module.exports = UserOrderService;