var css = require('../css/chargeBalance.scss');
var com = require('./common.js');

$(document).ready(function () {

    let deviceId = '2112018091500132';

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
                        $('#J_actual_price').html('￥' + (priceData[i].donationAmount ? priceData[i].amount - priceData[i].donationAmount : priceData[i].amount) + '元');
                    }
                }
                
            }
        }
    });

    var amount, donation;
    $('#J_price_wrap').on('click', 'a', function(e) {
        $('#J_price_wrap a').removeClass('active-btn');
        $(this).addClass('active-btn');
        amount = $(this).data('amount');
        donation = $(this).data('donation');
        $('#J_actual_price').html('￥' + (donation ? amount - donation: amount) + '元');
    });
});