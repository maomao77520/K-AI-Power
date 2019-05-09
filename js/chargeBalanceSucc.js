var css = require('../css/chargeBalanceSucc.scss');
var com = require('./common.js');

$('#loadingToast').fadeIn(100);

$(document).ready(function() {
    var outTradeNo = com.parseQuery('outTradeNo');
    var amount = com.parseQuery('amount');
    

    var interval = setInterval(function() {
        checkOrderStatus(outTradeNo, function(res) {
            if (res.status == 0) {
                $('#loadingToast').fadeOut(100);
                $('.charge-balance-wrap').show();
                $('#J_charge_total').text(amount);
                clearInterval(interval);
            }
            else if (flag == 10) {
                flag ++;
                $('.charge-balance-wrap').text('支付失败，请重新充值');
                clearInterval(interval);
            }
        });
    }, 500);

    function checkOrderStatus(out_trade_no, cb) {
        $.ajax({
            url: '/charger/getPayStatus',
            type: 'post',
            data: JSON.stringify({
                out_trade_no: out_trade_no
            }),
            contentType: 'application/json',
            success: function (res) {
                cb && cb(res);
            }
        });
    }
});