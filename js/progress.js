var css = require('../css/progress.scss');
var com = require('./common.js');
var countDown = require('./countDown.js');

$(document).ready(function () {
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    $('body').height(winHeight);
    $('body').width(winWidth);

    $('#loadingToast').fadeIn(100);

    $('.left-time-text').css({
        'padding-left': $('.top-num-wrap .hour').position().left
    });

    $('#J_question_icon').on('click', function (e) {
        $('#iosDialog2').fadeIn(200);
    });

    $('#J_close_dialog').on('click', function (e) {
        $('#iosDialog2').fadeOut(200);
    });

    var deviceId = com.parseQuery('deviceId');
    var slotIndex = com.parseQuery('slotIndex');
    var outTradeNo = com.parseQuery('outTradeNo');

    var url = '/charger/getChargingProgress';
    var params = {
        accesstoken: 'asdasdwedf565665',
        deviceId: deviceId,
        slotIndex: slotIndex,
        outTradeNo: outTradeNo
    }

    if (!deviceId || !slotIndex) {
        url = '/charger/getmycharging';
        params = {
            accesstoken: 'asdasdwedf565665'
        }
    }

    getData(url, params);
    var interval = setInterval(function () {
        getData(url, params);  
    }, 1000);

    function getData(url, params) {
        $.ajax({
            url: url,
            type: 'post',
            data: JSON.stringify(params),
            contentType: 'application/json',
            success: function (res) {
// res = {
//     status: 0,
//     "data": {
//         "deviceId": "2112018020700123",
//         "slotIndex": 3,
//         "location": "仙葫管委会",
//         "locationDetail": "仙葫荣沫大道",
//         "electricityMa": 0,
//         "paymentSeconds": 960,
//         "beginTimeSeconds": 1528089760,
//         "endChargeTime": 0,
//         "payment": 2,
//         "refundAmount": 0,
//         "slotStatus": 97,
//         "slotSN": "211201802070012303",
//         "startTime": "2018.06.04 13:22:40",
//         "time": "00:15:57",
//         "chargingTime": "00:00:03",
//         "totalTime": "8",
//         "progress": 0,
//         "chargerIndex": 1
//     }
// }

                
                if (res.status == 0 && res.data) {
                    if (res.data.slotStatus == 1) { // 打开插座成功
                        // $('#loadingToast').fadeIn(100);
                    }
                    else if (res.data.slotStatus == 97) { // 正在充电
                        $('#loadingToast').fadeOut(100);
                        clearInterval(interval);
                        $('.progress-wrap').show();
                        var endTimeStp = (res.data.beginTimeSeconds + res.data.paymentSeconds) * 1000;
                        var endTime = new Date(endTimeStp);
                        var count = new countDown(endTime, $('.top-num-wrap'));
                        var endTimeStr = com.formatTime(endTimeStp).replace(/-/g, '.');
                        var endTmp= endTimeStr.split(' ');
                        res.data.endDateStr = endTmp[0];
                        res.data.endTimeStr = endTmp[1];     

                        var startTime = com.formatTime(res.data.beginTimeSeconds * 1000).replace(/-/g, '.').split(' ');
                        res.data.startDateStr = startTime[0];
                        res.data.startTimeStr = startTime[1];

                        var progress = res.data.progress;
                        var top = winHeight - 25;
                        if (progress == 100) {
                            top = -100;
                            $('.wave').css({
                                'background-size': '50% 120%'
                            });
                        }
                        else if (progress / 100 * winHeight > 25) {
                            top = (100 - progress) / 100 * winHeight;
                        }
                        $('.wave').css({
                            'background-position': '0 ' + top + 'px'
                        });
                        var tpl = doT.template($('#J_progress_template').html())(res.data);
                        $('#J_progress_detail').html(tpl);

                    }
                    else if (res.data.slotStatus == -1 || res.data.slotStatus == 101 || res.data.slotStatus == 102) {  // 插座错误
                        $('#loadingToast').fadeOut(100);
                        clearInterval(interval);
                        window.location.href = './finish.html?deviceId=' + res.data.deviceId + '&slotIndex=' + res.data.slotIndex + '&outTradeNo=' + res.data.outTradeNo;
                    }
                    else if (res.data.slotStatus == 98 || res.data.slotStatus == 99) { // 正常结束
                        $('#loadingToast').fadeOut(100);
                        clearInterval(interval);
                        window.location.href = './finish.html?deviceId=' + res.data.deviceId + '&slotIndex=' + res.data.slotIndex + '&outTradeNo=' + res.data.outTradeNo;
                    }
                }
                else if (res.status == 1 || (res.status == 2 && !res.data)) {
                    $('#loadingToast').fadeOut(100);
                    clearInterval(interval);
                    $('body').html('<div class="list-empty">没有正在充电的订单哦~</div>'
                        + '<div class="detail-btn-wrap">'
                            + '<a href="javascript:;" class="weui-btn weui-btn_primary detail-bottom-btn">'
                                + '<i></i>'
                                + '<span>扫码充电</span>'
                            + '</a>'
                        + '</div>');
                    initEvent();
                }
                else {
                    $('#loadingToast').fadeOut(100);
                    clearInterval(interval);
                    com.showToast();
                }
            },
            error: function (error) {
                $('#loadingToast').fadeOut(100);
                clearInterval(interval);
                com.showToast();
            }
        });
    }

    function initEvent() {
        com.getWxConfig();
        wx.ready(function () {
            $('.detail-bottom-btn').on('click', function () {
                wx.scanQRCode({
                    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    }
                });
            });
        });
        wx.error(function (err) {
            console.log('wx.error: ', err);
        });
    }
    
});