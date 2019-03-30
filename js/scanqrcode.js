var css = require('../css/scanqrcode.scss');
var com = require('./common.js');

$(document).ready(function () {

    var locationId = com.parseQuery('locationId');
    var lat = com.parseQuery('lat');
    var lng = com.parseQuery('lng');
    var id = com.parseQuery('id');

    $('#loadingToast').fadeIn(100);

    getList();
    function getList() {
        $.ajax({
            url: '/charger/getcharging',
            type: 'post',
            data: JSON.stringify({
                accesstoken: 'asdasdwedf565665',
                locationId: locationId,
                lat: lat,
                lng: lng
            }),
            contentType: 'application/json',
            success: function (res) {
                $('#loadingToast').fadeOut(100);
                if (res.status == 0) {
                    res.data.userLat = lat;
                    res.data.userLng = lng;
                    var tpl = doT.template($('#second-list-template').html())(res.data);
                    $('#J_second-list').html(tpl);
                }
                else {
                    com.showToast();
                }

                initEvent();
            },
            error: function (err) {
                $('#loadingToast').fadeOut(100);
                com.showToast();
            }
        });
    }  

    function initEvent() {
        com.getWxConfig();
        wx.ready(function () {

            // 打开导航
            $('#J_second-list').on('click', '.J_Navigation', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var location = $(this).data('location');
                var addr = $(this).data('addr');
                var lat = $(this).data('lat');
                var lng = $(this).data('lng');
                com.translateLocation(lat, lng).done(function (res) {
                    com.openMap(location, addr, res.locations[0].lat, res.locations[0].lng);
                });
                
            });
        });
    }
});

