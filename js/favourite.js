var css = require('../css/index.scss');
var com = require('./common.js');

$(document).on('ready', function () {

    var lat = com.parseQuery('lat') || '';
    var lng = com.parseQuery('lng') || '';

    com.getWxConfig();
    wx.ready(function () {
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                lat = res.latitude;
                lng = res.longitude;
                console.log(lat,lng)
                getList();
            },
            fail: function (err) {
                getList();
            }
        });

        // 打开导航
        $('#J_list-wrap').on('click', '.J_Navigation', function (e) {
            var location = $(this).data('location');
            var addr = $(this).data('addr');
            var lat = $(this).data('lat');
            var lng = $(this).data('lng');
            com.translateLocation(lat, lng).done(function (res) {
                com.openMap(location, addr, res.locations[0].lat, res.locations[0].lng);
            });
            
        });
    });

    // 打开导航
    $('#J_favourite-list').on('click', '.J_Navigation', function (e) {
        var location = $(this).data('location');
        var addr = $(this).data('addr');
        var lat = $(this).data('lat');
        var lng = $(this).data('lng');

        console.log(lat,lng)
        com.translateLocation(lat, lng).done(function (res) {
            com.openMap(location, addr, res.locations[0].lat, res.locations[0].lng);
        });
        
    });

    function getList() {
        $.ajax({
            url: '/charger/getcollectioncharging',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                accesstoken: 'asdasdwedf565665',
                lat: lat,
                lng: lng
            }),
            success: function (res) {
                if (res.status == 0 && res.data && res.data.content) {
                    res.data.content.userLat = lat;
                    res.data.content.userLng = lng;
                    var tpl = doT.template($('#list-template').html())(res.data.content);
                    $('#J_favourite-list').html(tpl);
                }
                else {
                    com.showToast();
                }
            },
            fail: function () {
                com.showToast();
            }
        });
    }

});