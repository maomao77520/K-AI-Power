var css = require('../css/complete.scss');
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
//         "endChargeTime": 1527595810,
//         "beginTimeSeconds": 1527591600,
//         "refundAmount": 0,
//         slotStatus: 101,
//     }
// }
            if (res.status == 0 && res.data) {
                res.data.startTime = com.formatTime(res.data.beginTimeSeconds * 1000);
                var tpl = doT.template($('#J_template').html())(res.data);
                $('#J_complete').html(tpl);
            }
            else {
                com.showToast();
            }
        },
        error: function (error) {
            com.showToast();
        }
    });
});