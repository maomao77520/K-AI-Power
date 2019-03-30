var css = require('../css/card.scss');
var com = require('./common.js');

$(document).ready(function() {
    // 初始化所在地区下拉内容
    var cityList = [];
    $.ajax({
        url: '/charger/getCity',
        type: 'post',
        data: JSON.stringify({
            accesstoken: 'asdasdwedf565665'
        }),
        contentType: 'application/json',
        success: function (res) {
            if (res.status == 0) {
                for (var i = 0; i < res.data.length; i++) {
                    cityList.push({
                        label: res.data[i].city,
                        value: res.data[i].city,
                        province: res.data[i].province,
                    });
                }
                // 地点下拉框
                $('#J_city_picker').on('click', function () {
                    $this = $(this);
                    weui.picker(cityList, {
                        onChange: function (result) {
                        },
                        onConfirm: function (result) {
                            $('#J_city_input').val(result[0].label);
                        }
                    });
                });
            }
        },
        fail: function (err) {

        },
    });


    $('input, textarea').on('input', function(e) {
        $('.error-tips').text('');
    });

    // 提交按钮
    $('.apply-btn').on('click', function(e) {
        var consignee = $('input[name="consignee"]').val();
        var phone = $('input[name="phone"]').val();
        var location = $('input[name="location"]').val();
        var locationDetail = $('textarea[name="locationDetail"]').val();

        if (!consignee || consignee.trim() == '') {
            $('.error-tips').text('请输入收货人');
            return;
        }
        if (!phone || !phone.match(/^1[0-9]{10}$/g)) {
            $('.error-tips').text('请输入正确的手机号码');
            return;
        }
        if (!location) {
            $('.error-tips').text('请选择所在地区');
            return;
        }
        if (!locationDetail || locationDetail.trim() == '') {
            $('.error-tips').text('请输入详细地址');
            return;
        }

        $.ajax({
            url: '/card/cardApply',
            type: 'post',
            data: JSON.stringify({
                accesstoken: 'asdasdwedf565665',
                consignee: encodeURIComponent(consignee),
                phone: phone,
                location: encodeURIComponent(location),
                locationDetail: encodeURIComponent(locationDetail)
            }),
            contentType: 'application/json',
            success: function (res) {
                if (res.status == 0) {
                    $('#iosDialog2').fadeIn(200);
                }
                else {
                    $('#toast p').text('提交失败！' + res.msg);
                    com.showToast();
                }
            },
            error: function(err) {
                $('#toast p').text('提交失败！' + err.msg);
                com.showToast();
            }
        });
    });

    $(document).on('click', '#J_close_dialog', function(e) {
        $('#iosDialog2').fadeOut(200);
        window.location.href = './user.html';

    });
});




