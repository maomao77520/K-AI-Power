var css = require('../css/card.scss');
var com = require('./common.js');

$(document).ready(function() {
    var lat = 0;
    var lng = 0;
    var cardId, balance;

    com.getWxConfig();
    getLocation();

    // 价格切换
    $('#J_price_wrap').on('click', '.price-btn', function (e) {
        $('.price-btn').removeClass('active-btn');
        $(this).addClass('active-btn');
    });

    // 卡号输入框的清空
    $('#J_clear_icon').on('touchstart', function(e) {
        e.stopPropagation();
        $('#J_card_no').val('');
        $('.card-charge-balance').hide();
        $('.card-error').text('').hide();
    });

    // 卡号输入框，校验卡号，错误提示，余额提示
    $('#J_card_no').on('input', function(e) {
        var cardId = $(this).val();
        if (cardId.length >= 10) {
            checkCardId(cardId);
        }
    }).on('blur', function(e) {
        var cardId = $(this).val();

        if (cardId == '' || $('.card-charge-balance').css('display') !== 'none') {
            return;
        }
        if (cardId.length < 10) {
            $('.card-error').text('卡号格式不正确').show();
            return;
        }
        checkCardId(cardId);
    }).on('input', function(e) {
        $('.card-charge-balance').hide();
        $('.card-error').text('').hide();
    });

    $('#J_question_icon').on('click', function(e) {
        $('#J_question_dialog').fadeIn(200);
    });
    $('#J_close_dialog').on('click', function (e) {
        $('#J_question_dialog').fadeOut(200);
    });


    // 充值按钮
    var lock = false;
    $('#J_charge_btn').on('click', function(e) {
        cardId = $('#J_card_no').val();
        var payment = $('.active-btn').data('price') * 100;
        if (!cardId) {
            $('.card-error').text('请输入电卡卡号');
            return;
        }

        lock = true;
        $.ajax({
            url: '/card/createCardOrder',
            type: 'post',
            data: JSON.stringify({
                accesstoken: 'asdasdwedf565665',
                cardId: cardId,
                payment: payment,
                lat: lat,
                lng: lng
            }),
            contentType: 'application/json',
            success: function (res) {
                lock = false;
                if (res.status == 0 && res.data) {
                    var d = res.data;
                    onBridgeReady(d.appid, d.timeStamp, d.nonce_str, d.prepay_id, d.sign, d.out_trade_no);
                }
            },
            error: function (err) {
                lock = false;
                $('.toast-text').text('请求失败！' + err.msg);
                com.showToast();
            }
        });
    });

    function checkCardId(cardId) {
        return $.ajax({
            url: '/card/queryCard',
            type: 'post',
            data: JSON.stringify({
                accesstoken: 'asdasdwedf565665',
                cardId: cardId
            }),
            contentType: 'application/json',
            success: function(res) {
                if (res.status == 0) {
                    $('#J_balance').text((res.data.currentAmount / 100).toFixed(2));
                    $('.card-charge-balance').show();
                }
                else if (res.status == -1) { // 卡号格式不正确
                    $('.card-error').text('卡号格式不正确').show();
                }
                else if (res.status == -2) { // 卡号不存在
                    $('.card-error').text('卡号不存在').show();
                }
                else if (res.status == -3) { // 卡未激活
                    $('.card-error').text('卡未激活').show();
                }
                else if (res.status == -4) { // 卡已注销
                    $('.card-error').text('卡已注销').show();
                }
            }
        });
    }

    function onBridgeReady(appId, timeStamp, nonceStr, prepay_id, paySign, out_trade_no){
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
               document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
               document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
               document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            WeixinJSBridge.invoke(
               'getBrandWCPayRequest', {
                   "appId": appId,     //公众号名称，由商户传入     
                   "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数     
                   "nonceStr": nonceStr, //随机串     
                   "package": "prepay_id=" + prepay_id,     
                   "signType": "MD5",         //微信签名方式：     
                   "paySign": paySign //微信签名 
                }, function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        window.location.href = com.host + "dist/page/chargeCardSucc.html?outTradeNo=" + out_trade_no + "&cardId=" + cardId;
                    }
                    else if (res.err_msg == "get_brand_wcpay_request:cancel") {  
                        // alert("取消支付!");
                    }
                    else {  
                        // alert("支付失败!");
                    }  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                }
            ); 
        }
    }


    // 获取当前位置坐标
    function getLocation() {
        wx.ready(function () {
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    lat = res.latitude;
                    lng = res.longitude;
                },
                fail: function (err) {}
            });
        });
    }
});
