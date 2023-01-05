if (!type) {
    type = "all";
}
const activeBtn = document.getElementsByName(type);
activeBtn[0].classList.remove("btn-outline-secondary");
activeBtn[0].classList.add("btn-primary");

const openReview = (order_id) => {
    
    $.ajax({
        type: "GET",
        url: `/api/comment/${order_id}`,
        data: {},
        success: function (response) {
            if (response.success === false) {
                alert("정상적으로 데이터를 가져오지 못했습니다.");
                return
            }

            $('#openPopup').show();
            $('body').append('<div id="backon"></div>');
            const review_storename = document.querySelector(".review-storename");
            const comment_writter = document.querySelector(".comment-writter");
            const order_id_div = document.querySelector("#order-id-div");
            review_storename.innerHTML = response.storename
            comment_writter.innerHTML = response.nickname;
            order_id_div.innerText = order_id;
        }   
    });

}

const cancelReviewWindow = () => {
    const check = confirm("정말 리뷰 작성을 취소하시겠습니까?")

    if (check === false ) {
        return
    }
    const review_storename = document.querySelector(".review-storename");
    const comment_writter = document.querySelector(".comment-writter");
    const order_id_div = document.querySelector("#order-id-div");
    const text = document.querySelector("#commentArea");

    review_storename.innerHTML = '';
    comment_writter.innerHTML = '';
    order_id_div.innerHTML = '';
    text.value = '';
    
    $('#openPopup').hide();
    $('#backon').remove();
    
} 

const cancelOrder = (event) => {
    const check = confirm("정말로 요청을 취소하시겠습니까?");

    if (check === false) {
        return;
    }

    const order_id = Number(event.parentNode.parentNode.parentNode.id);
    
    $.ajax({
        type: "DELETE",
        url: `/api/myorders/${order_id}`,
        data: {order_id},
        success: function (response) {
            console.log(response.success);
            if (response.success === false) {
                alert("해당 게시글이 존재하지 않거나, 혹은 이미 요청이 수락되어 요청 취소가 불가능한 상태입니다.")
                return
            }

            const targetCard = document.getElementById(`${order_id}`);
            targetCard.remove();
        }   
    });
};

const checkStar = (self) => {
    const saveStarValueDiv = document.querySelector("#saveStarValue");
    saveStarValueDiv.innerText = self.value;
}

const postReview = () => {
    const reviewComment = document.querySelector("#commentArea").value;
    const reviewStar = document.querySelector("#saveStarValue").innerHTML;
    const order_id = document.querySelector("#order-id-div").innerHTML;

    if (reviewStar === 0) {
        alert("별점을 정해주세요");
        return;
    }

    if (reviewComment === '') {
        alert("내용을 입력해 주세요");
        return;
    }

    $.ajax({
        type: "POST",
        url: `/api/comment/${order_id}`,
        data: {reviewComment: reviewComment, reviewStar: reviewStar},
        success: function (response) {
           if (response.success) {
                const review_id = response.review_id;
                const openReviewClick = JSON.stringify({order_id, review_id});
                const target = document.getElementById(`${order_id}`)
                const targetBtn = target.querySelector(`.review-active`);

                targetBtn.removeAttribute('onclick');
                targetBtn.classList.remove("right-side-btn-div-active");
                targetBtn.classList.add("right-side-btn-div-reviewed");
                targetBtn.innerHTML = "리뷰 남김";
                targetBtn.setAttribute("onclick", `openMyReview(${openReviewClick})`);

                alert(response.message);
            
                const review_storename = document.querySelector(".review-storename");
                const comment_writter = document.querySelector(".comment-writter");
                const order_id_div = document.querySelector("#order-id-div");
                const text = document.querySelector("#commentArea");

                review_storename.innerHTML = '';
                comment_writter.innerHTML = '';
                order_id_div.innerHTML = '';
                text.value = '';
                
                $('#openPopup').hide();
                $('#backon').remove();
           }
        }   
    });

}



const openMyReview = (params) => {
    const { order_id, review_id } = params;

    $.ajax({
        type: "GET",
        url: `/api/order/${order_id}/review/${review_id}`,
        data: {},
        success: function (response) {
            if (response.success) {
                const data = response.result;

                $('#open-myReview-popup').show();
                $('body').append('<div id="backon"></div>');

                const review_storename = document.querySelector(".my-review-storename");
                const star = document.querySelector(".star-mark")
                const text = document.querySelector("#my-review-comment-area");
                const comment_writter = document.querySelector(".writeed-by-who");
                const date = document.querySelector(".writeed-by-time");

                const createdTime = new Date(data.createdAt);
                const year = createdTime.getFullYear(); 
                const month = createdTime.getMonth() + 1;
                const day = createdTime.getDate(); 
                let hour = createdTime.getHours(); 
                let minute = createdTime.getMinutes(); 

                if (hour.toString().length === 1) {
                    hour = '0' + hour.toString() 
                } 
                if (minute.toString().length === 1) {
                    minute = '0' + minute.toString() 
                }

                review_storename.innerHTML = data.storename;
                star.innerHTML = "⭐️".repeat(data.star);
                text.value = data.comment;
                comment_writter.innerHTML = data.nickname;
                date.innerHTML = `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
                
            }
        }   
    });
}

const cancelMyReviewWindow = () => {
    const review_storename = document.querySelector(".my-review-storename");
    const comment_writter = document.querySelector(".writeed-by-who");
    const star = document.querySelector(".star-mark")
    const date = document.querySelector(".writeed-by-time");
    const text = document.querySelector("#my-review-comment-area");

    review_storename.innerText = '';
    comment_writter.innerHTML = '';
    star.innerHTML = '';
    date.innerHTML = '';
    text.value = '';
    
    $('#open-myReview-popup').hide();
    $('#backon').remove();
}



$(document).ready(function () {
    if (listLength >= 5) {
        infinite_scroll();
    }
});


// 무한 스크롤 함수
const infinite_scroll = () => {
    const listEnd = document.querySelector("#end-list");
    const option = {
        root: null,
        rootMargin: "20px 20px 20px 20px",
        thredhold: 0,
    }
    let page = 2;

    const onIntersect = (entries, observer) => { 
        // entries는 IntersectionObserverEntry 객체의 리스트로 배열 형식을 반환합니다.
        entries.forEach(entry => {
            if(entry.isIntersecting){
                $.ajax({
                    type: "GET",
                    url: `/api/myorders/${type}/page/${page}`,
                    data: {},
                    success: function (response) {
                        if (response.success === true) {
                            const listWrap = document.querySelector("#card-wrap");
                            const on_list_board = document.querySelector(".center-list");
                            const orderList = response.orderList;
                            const orderListThum = response.orderListThum;
                            let temp = ``;

                            for (let i = 0; i < orderList.length; i++) {
                                
                                const createdTime = new Date(orderList[i].createdAt)
                                const year = createdTime.getFullYear(); 
                                const month = createdTime.getMonth() + 1;
                                const day = createdTime.getDate(); 
                                let hour = createdTime.getHours(); 
                                let minute = createdTime.getMinutes(); 
                                const updatedTime = new Date(orderList[i].updatedAt)
                                const up_year = updatedTime.getFullYear(); 
                                const up_month = updatedTime.getMonth() + 1;
                                const up_day = updatedTime.getDate(); 
                                let up_hour = updatedTime.getHours(); 
                                let up_minute = updatedTime.getMinutes(); 

                                const putParams = JSON.stringify({order_id: orderList[i].order_id, review_id: orderList[i].isReview});

                                if (hour.toString().length === 1) {
                                    hour = '0' + hour.toString() 
                                } 
                                if (minute.toString().length === 1) {
                                    minute = '0' + minute.toString() 
                                } 
                                if (up_hour.toString().length === 1) {
                                    up_hour = '0' + up_hour.toString() 
                                } 
                                if (up_minute.toString().length === 1) {
                                    up_minute = '0' + up_minute.toString() 
                                } 

                                let status_html = '';
                                if (orderList[i].status === 1) {
                                    status_html = '대기 중...'
                                } 
                                if (orderList[i].status === 2) {
                                    status_html = '수거 중...'
                                } 
                                if (orderList[i].status === 3) {
                                    status_html = '수거 완료'
                                } 
                                if (orderList[i].status === 4) {
                                    status_html = '배송 중...'
                                } 
                                if (orderList[i].status === 5) {
                                    status_html = '배송 완료'
                                } 

                                let status_store_name = ``;
                                if (orderList[i].status === 1) {
                                    status_store_name = '• 수락을 대기 중...';
                                }

                                if (orderList[i].status === 2 || orderList[i].status === 3 || orderList[i].status === 4) {
                                    status_store_name = `• <spna id="store-name"><${orderList[i].storename}</spna> 에서 처리 중...`
                                }
                                
                                if (orderList[i].status === 5) {
                                    status_store_name = `• <span id="store-name">${orderList[i].storename}</span> 가 완료`
                                }
                                
                                let img_src_html = ``;
                                if (orderListThum[orderList[i].order_id]) { 
                                    img_src_html = `/image/userRequest/user_${orderList[i].user_id}/order_${orderList[i].order_id}/${orderListThum[orderList[i].order_id]}`
                                } else {
                                    img_src_html = "/image/publicImg.jpg"
                                }

                                let laundry_type_life = ``;
                                let laundry_type_individual = ``;
                                if (orderList[i].life_laundry === 1) {
                                    laundry_type_life = `<div class="type-detail">생활 빨래</div>`
                                } 
                                if (orderList[i].individual_laundry === 1) { 
                                    laundry_type_individual = `<div class="type-detail">개별 클리닝</div>`
                                }

                                let active_review_btn = ``;
                                let active_cancelOrder_btn = ``;
                                if (orderList[i].isReview > 0) { 
                                    active_review_btn = `<div class="order-ctrl-btn right-side-btn-div-reviewed" onclick="openMyReview(${putParams})">리뷰 남김</div>`
                                } 
                                if (orderList[i].status === 5 && orderList[i].isReview === 0) {
                                    active_review_btn = `<div class="order-ctrl-btn right-side-btn-div-active review-active" onclick="openReview(${orderList[i].order_id})">리뷰 작성</div>`
                                }
                                if (orderList[i].status <= 4) {
                                    active_review_btn = `<div class="order-ctrl-btn right-side-btn-div">리뷰 작성</div>`
                                }
                                if (orderList[i].status === 1) {
                                    active_cancelOrder_btn = `<div class="right-side-btn-div-active" onclick="cancelOrder(this)">요청 취소</div>`
                                } else {
                                    active_cancelOrder_btn = `<div class="right-side-btn-div">요청 취소</div>`
                                }

                                temp += `
                                <div class="card-list" id="${orderList[i].order_id}">
                                    <div class="card-top">
                                        <div class="card-top-left">${year}. ${month}. ${day}. ${hour}:${minute} 요청</div>
                                        <div class="card-top-right" onclick="location.href='/users/order/${orderList[i].order_id}'">요청 상세보기 >></div>
                                    </div>
                                    <div class="card-detail">
                                        <div class="left-side">
                                            <div class="status">
                                                <div class="status-num">
                                                    ${status_html}
                                                </div>
                                                <div class="master-store">
                                                    ${status_store_name}
                                                </div>
                                                <div class="last-update">갱신일 : <span>${up_year}. ${up_month}. ${up_day}. ${up_hour}:${up_minute}</span></div>
                                            </div>
                                            <div class="card-order-detail">
                                                <div class="order-img">
                                                    <img src="${img_src_html}">
                                                </div>
                                                <div class="order-request">
                                                    <div class="type">
                                                        ${laundry_type_life}
                                                        ${laundry_type_individual}
                                                    </div>
                                                    <div class="request-detail">
                                                        ${orderList[i].comment}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="right-side">
                                            ${active_review_btn}
                                            ${active_cancelOrder_btn}
                                        </div>
                                    </div>
                                </div>
                                `;
                            }

                            new Promise((resolve, reject) => setTimeout(function () {
                                // 받아 온 데이터들을 for 문으로 돌려서 백틱 안에 html 태그를 작성한 뒤 이어붙인다.
                                listWrap.insertAdjacentHTML("beforeend", temp);
                                page += 1;
                            }, 200));    
                        }

                        if (response.success === false) {
                            if (response.type === "none") {
                                setTimeout(function () {
                                    alert(response.message)
                                }, 200);
                            }
                        }
                    }   
                });
            }
        });
    };

    const observer = new IntersectionObserver(onIntersect, option);
    observer.observe(listEnd);
}