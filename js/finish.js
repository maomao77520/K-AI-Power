var css = require('../css/finish.scss');
var com = require('./common.js');

$(document).ready(function () {

    var deviceId = com.parseQuery('deviceId');
    var slotIndex = com.parseQuery('slotIndex');
    var outTradeNo = com.parseQuery('outTradeNo');

    var url = '/charger/getChargingProgress';
    var params = {
        accesstoken: 'asdasdwedf565665',
        deviceId: deviceId,
        slotIndex: slotIndex,
        outTradeNo: outTradeNo
    };

    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(params),
        contentType: 'application/json',
        success: function (res) {
// res = {
//     status: 0,
//     data: {
//         totalTime: 4,
//         startTime: '2018.05.29 11:00:00',
//         payment: 1,
//         electricityMa: 4545,
//         "location":"仙葫管委会",
//         "locationDetail":"仙葫荣沫大道",
//         "chargerIndex":1,
//         "deviceId": "2112018020700123",
//         "slotSN": "211201802070012301",
//         "slotIndex":1,
//         "endChargeTime": 1527595801,
//         "beginTimeSeconds": 1527595809,
//         "refundAmount": 0,
//         "slotStatus": 103,
//     }
// }
            if (res.status == 0 && res.data) {
                if (res.data.slotStatus == 97) {
                    window.location.href = './progress.html?deviceId='
                    + deviceId + '&slotIndex=' + slotIndex + '&outTradeNo=' + outTradeNo;
                    return;
                }

                var $body = $('body');
                document.title = '充电结束';
                 
                var $iframe = $('<iframe src="/favicon.ico" style="width:1px;height:1px; position: absolute; top: -100px;"></iframe>');
                $iframe.on('load',function() {
                  setTimeout(function() {
                      $iframe.off('load').remove();
                  }, 0);
                }).appendTo($body);

                res.data.reason = com.errorMap[res.data.slotStatus] || '系统故障';
                res.data.endTime = res.data.beginTimeSeconds == 0 ? '-' : com.formatTime(res.data.endChargeTime * 1000);
                res.data.startTime = res.data.beginTimeSeconds == 0 ? '-' : com.formatTime(res.data.beginTimeSeconds * 1000);
                res.data.outTradeNo = outTradeNo;
                var chargedTime = res.data.endChargeTime - res.data.beginTimeSeconds;

                if (res.data.slotStatus == 101) {
                    if (chargedTime <= 70) {
                        res.data.reason = '功率过低'
                    }
                    else {
                        res.data.reason = '电池已充满';
                    }
                }
                

                var h = Math.floor(chargedTime / 60 / 60 % 24);
                var m = Math.floor(chargedTime / 60 % 60);
                var s = Math.floor(chargedTime % 60);
                h = h >= 10 ? h : '0' + h;
                m = m >= 10 ? m : '0' + m;
                s = s >= 10 ? s : '0' + s;
                res.data.chargedTime = h + ':' + m + ':' + s;

                var tpl = doT.template($('#J_template').html())(res.data);
                $('#J_finish').html(tpl);
            }
            else {
                var $body = $('body');
                document.title = '充电结束';
                 
                var $iframe = $('<iframe src="/favicon.ico" style="width:1px;height:1px; position: absolute; top: -100px;"></iframe>');
                $iframe.on('load',function() {
                  setTimeout(function() {
                      $iframe.off('load').remove();
                  }, 0);
                }).appendTo($body);
                com.showToast();
            }
        },
        error: function (error) {

            com.showToast();
        }
    });
});