var css = require('../css/card.scss');
var com = require('./common.js');

$('#loadingToast').fadeIn(100);

$(document).ready(function() {
    var cardId = com.parseQuery('cardId');
    var outTradeNo = com.parseQuery('outTradeNo');

    var flag = 0;

    getData();

    var interval = setInterval(function() {
        checkOrderStatus(outTradeNo, function(res) {
            if (res.status == 0) {
                getData();
                clearInterval(interval);
            }
            else if (flag == 10) {
                flag ++;
                $('.charge-card-result').text('支付失败，请重新充值');
                clearInterval(interval);
            }
        });
    }, 500);



    function getData() {
        $.ajax({
            url: '/card/queryCard',
            type: 'post',
            data: JSON.stringify({
                accesstoken: 'asdasdwedf565665',
                cardId: cardId
            }),
            contentType: 'application/json',
            success: function(res) {
                $('#loadingToast').fadeOut(100);
                $('.charge-card-result').show();
                $('#J_card_id').text('卡号：' + cardId);
                $('#J_card_balance').text('可用余额：' + (res.data.currentAmount / 100).toFixed(2) + '元');
            },
            fail: function(err) {
                $('#loadingToast').fadeOut(100);
                $('#toast').fadeIn(100);
            }
        });
    }

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