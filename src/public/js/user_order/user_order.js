$(document).ready(function () {
    const imgSel = document.querySelectorAll(".img-file");
    for (let i = 1; i <= imgSel.length; i++) {
        imgSel[i-1].addEventListener("change", function (event) {
            let files = event.target.files;

            if (files.length >= 1) {
                insertImageDate(i, files[0])
            }

            if (!files.length) {
                const imgShow = document.querySelector(`#img-${i}-show`);
                imgShow.removeAttribute('src');
            }
        })
    }

    async function insertImageDate (imgNum, file) {
        const imgShow = document.querySelector(`#img-${imgNum}-show`);

        const reader = new FileReader();

        reader.addEventListener('load', function (event) {
            imgShow.src = reader.result;
        });
        reader.readAsDataURL(file);
    }

    const submitBtn = document.querySelector("#submitRequestBtn");
    submitBtn.addEventListener("click", (event) => {
        event.preventDefault();
    })
});

const submitRequest = async () => {	
    const lifeLaundry = document.querySelector("#life-laundry").checked;
    const individualLaundry = document.querySelector("#individual-laundry").checked;
    const nickname = document.querySelector("#nickname").value;
    const phoneNumber = document.querySelector("#phone-number").value;
    const email = document.querySelector("#email").value;
    const address = document.querySelector("#address").value;
    const comment = document.querySelector("#request").value;

    if (!lifeLaundry && !individualLaundry) {
        alert("세탁물 종류를 선택해 주세요");
        return
    }
    if (!nickname) {
        alert("닉네임을 입력해 주세요");
        return
    }
    if (!phoneNumber || phoneNumber.length < 11 || phoneNumber.length > 11) {
        alert("휴대폰 번호를 정확히 입력해 주세요");
        return 
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
        alert("이메일을 정확히 입력해 주세요");
        return 
    }
    if (!address) {
        alert("주소를 정확히 입력해 주세요");
        return
    }

    const orderData = {
        life_laundry: lifeLaundry,
        individual_laundry: individualLaundry,
        nickname: nickname,
        phonenumber: phoneNumber,
        email: email,
        address: address,
        comment: comment
    };

    $.ajax({
        type: "POST",
        url: '/api/order',
        data: {result: JSON.stringify(orderData)},
        success: function (response) {
            console.log(response.success);
            if (response.success === undefined) {
                alert("로그인 해 주시길 바랍니다.")
                location.href='/main';
            }
            if (response.success === false) {
                alert(response.message);
                return;
            }
            if (response.success) {
                submitRequestimg(response.data.order_id, response.data.user_id);
            }
        }
    });
    
};

const submitRequestimg = async (orderId, userId) => {
    const imgTags = document.querySelectorAll(".img-file");
    const order_id = orderId;
    const user_id = userId;
    let formData = new FormData();
    let cnt = 0;

    formData.append("order_id", order_id);
    formData.append("user_id", user_id);

    for (let i = 1; i <= imgTags.length; i++) {
        const imgFile = imgTags[i-1].files;
        if (imgFile.length >= 1) {
            cnt += 1;
            await formData.append(`imgFile_${i}`, imgFile[0]);
        }
    }

    if (cnt === 0) {
        console.log("사진이 하나도 없엉")
        location.href="/users/orders";
        return;
    }

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: '/api/order/img',
        data: formData,
        processData: false,       // 기본 값은 true. false 면 데이터를 query string 으로 설정 하지 않아. 즉 file 을 보내려면 false 로.
        contentType: false,       // 이게 true 로 되어 있으면 데이터를 string 으로 바꾼 다고.
        cache: false,
        success: function (response) {
            console.log("무사히 응답을 받음.")
            console.log(response.success);
            location.href="/users/orders";
        }
    })
}