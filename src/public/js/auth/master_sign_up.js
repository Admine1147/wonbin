"use strict";

// ---------Responsive-navbar-active-animation-----------
function test() {
    var tabsNewAnim = $("#navbarSupportedContent");
    var selectorNewAnim = $("#navbarSupportedContent").find("li").length;
    var activeItemNewAnim = tabsNewAnim.find(".active");
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
      top: itemPosNewAnimTop.top + "px",
      left: itemPosNewAnimLeft.left + "px",
      height: activeWidthNewAnimHeight + "px",
      width: activeWidthNewAnimWidth + "px",
    });
    $("#navbarSupportedContent").on("click", "li", function (e) {
      $("#navbarSupportedContent ul li").removeClass("active");
      $(this).addClass("active");
      var activeWidthNewAnimHeight = $(this).innerHeight();
      var activeWidthNewAnimWidth = $(this).innerWidth();
      var itemPosNewAnimTop = $(this).position();
      var itemPosNewAnimLeft = $(this).position();
      $(".hori-selector").css({
        top: itemPosNewAnimTop.top + "px",
        left: itemPosNewAnimLeft.left + "px",
        height: activeWidthNewAnimHeight + "px",
        width: activeWidthNewAnimWidth + "px",
      });
    });
  }
  $(document).ready(function () {

    const targetForm = document.querySelector("#form-tag");
    targetForm.addEventListener("submit", (event) => {
        event.preventDefault();
    })

    setTimeout(function () {
      test();
    });
  });
  $(window).on("resize", function () {
    setTimeout(function () {
      test();
    }, 500);
  });
  $(".navbar-toggler").click(function () {
    $(".navbar-collapse").slideToggle(300);
    setTimeout(function () {
      test();
    });
  });
  
  // --------------add active class-on another-page move----------
  jQuery(document).ready(function ($) {
    // Get current path and find target link
    var path = window.location.pathname.split("/").pop();
  
    // Account for home page with empty path
    if (path == "") {
      path = "index.html";
    }
  
    var target = $('#navbarSupportedContent ul li a[href="' + path + '"]');
    // Add active class to target link
    target.parent().addClass("active");
  });
  
  // Add active class on another page linked
  // ==========================================
  // $(window).on('load',function () {
  //     var current = location.pathname;
  //     console.log(current);
  //     $('#navbarSupportedContent ul li a').each(function(){
  //         var $this = $(this);
  //         // if the current path is like this link, make it active
  //         if($this.attr('href').indexOf(current) !== -1){
  //             $this.parent().addClass('active');
  //             $this.parents('.menu-submenu').addClass('show-dropdown');
  //             $this.parents('.menu-submenu').parent().addClass('active');
  //         }else{
  //             $this.parent().removeClass('active');
  //         }
  //     })
  // });

const submitJoin = () => {
    const email = document.getElementsByName("email");
    const password = document.getElementsByName("password");
    const confirm_password = document.getElementsByName("confirm-password");
    const storename = document.getElementsByName("storename");
    const phonenumber = document.getElementsByName("phonenumber");
    const address = document.getElementsByName("address");

    if (!email[0].value || !email[0].value.includes("@") || !email[0].value.includes(".")) {
        alert("이메일을 정확히 입력해 주세요");
        return 
    }
    if (password[0].value !== confirm_password[0].value) {
        alert("패스워드가 일치하지 않습니다.");
        return;
    }
    if (password[0].value.length < 4 ) {
        alert("비밀번호가 너무 짧습니다.");
    }
    if (!storename[0].value) {
        alert("가게 이름을 입력해 주세요")
    }
    if (!phonenumber[0].value || phonenumber[0].value.length < 11 || phonenumber[0].value.length > 11) {
        alert("휴대폰 번호를 정확히 입력해 주세요");
        return;
    }
    if (!address[0].value) {
        alert("주소지를 입력해 주세요");
        return;
    }

    const data = {
        email: email[0].value, 
        password: password[0].value, 
        confirm_password: confirm_password[0].value, 
        storename: storename[0].value, 
        phonenumber: phonenumber[0].value, 
        address: address[0].value
    }

    $.ajax({
        type: "POST",
        url: '/api/signup/master',
        data: data,
        success: function (response) {
            console.log(response.success);
            if (response.success === true) {
                location.href="/masters";
            }
           
        }
    });
}