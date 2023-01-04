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