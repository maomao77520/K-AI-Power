var css = require('../css/chargeBalance.scss');
var com = require('./common.js');

$(document).ready(function () {

    let deviceId = com.parseQuery('deviceId');
    let amount, donation = 0;
    $.ajax({
        url: '/amount/getBalnaceInvest',
        type: 'POST',
        contentType: 'application/json',
        success: function (res) {
            if (res.status == 0) {
                $('.user-name').text(res.data.nickname);
                $('.user-icon').css({
                    'background-image': 'url(' + res.data.avatar + ')'
                });
                $('.user-balance').text('余额：' + res.data.currentAmount + '元');
            }
        }
    });

    $.ajax({
        url: '/amount/getBalancePackage',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            deviceId: deviceId
        }),
        success: function (res) {
            if (res.status == 0) {
                let priceData = res.data || [];
                let tpl = doT.template($('#J_price_template').html())(priceData);
                $('#J_price_wrap').html(tpl);
                for (let i = 0; i < priceData.length; i++) {
                    if (priceData[i].defaultPackage) {
                        amount = priceData[i].amount;
                        if (priceData[i].donationAmount > 0) {
                            donation = priceData[i].donationAmount;
                        }
                        $('#J_actual_price').html('￥' + priceData[i].amount + '元');
                    }
                }
                
            }
        }
    });


    
    $('#J_price_wrap').on('click', 'a', function(e) {
        $('#J_price_wrap a').removeClass('active-btn');
        $(this).addClass('active-btn');
        amount = $(this).data('amount');
        donation = $(this).data('donation');
        $('#J_actual_price').html('￥' + amount + '元');
    });



    var lock = false;
    $('.charge-btn').on('click', function (e) {
        console.log(amount, donation)
        if (lock) {
            return;
        }
        lock = true;
        $.ajax({
            url: '/amount/createBalanceOrder',
            type: 'post',
            data: JSON.stringify({
                accesstoken: 'asdasdwedf565665',
                payment: amount * 100,
                giveAmount: donation * 100,
                lat: 0,  // 不知道要来干啥，张鹏说没有就传0
                lng: 0
            }),
            contentType: 'application/json',
            success: function (res) {
                lock = false;
                if (res.status == 0 && res.data) {
                    var d = res.data;
                    onBridgeReady(d.appid, d.timeStamp, d.nonce_str, d.prepay_id, d.sign, d.out_trade_no);
                }
                else if (res.status == 1 && res.data) { // errorCode=1002, 插座被占用
                    window.location.href = './error.html?deviceId='
                    + deviceId + '&slotIndex=' + slotIndex + '&errorCode=' + res.data.errorCode;
                }
            },
            error: function (err) {
                lock = false;
            }
        });
    });

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
                        window.location.href = com.host + "dist/page/chargeBalanceSucc.html?outTradeNo=" + out_trade_no
                        + '&amount=' + amount;
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
});