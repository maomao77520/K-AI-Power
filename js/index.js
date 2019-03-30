var css = require('../css/index.scss');
var com = require('./common.js');
var scroll = require('./myScroll.js');

$(document).on('ready', function () {
    var cityList = [];
    var currentLat;
    var currentLng;
    var currentPage = 1;
    var currentCity = '南宁';

    $('#loadingToast').fadeIn(100);
    com.getWxConfig();
    wx.ready(function () {
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                currentLat = res.latitude;
                currentLng = res.longitude;
                console.log(res)
                com.convert(currentLat, currentLng).done(function (res) {
                    if (res.status == 0) {
                        currentCity = res.result.address_component.city;
                        currentCity = currentCity.substring(0, currentCity.length - 1);
                        $.when(p1).done(function () {
                            if (checkValidCity(currentCity, cityList)) {
                                $('#J_city_name').text(currentCity);
                                getList(currentPage, currentLat, currentLng, initScroll);
                            }
                            else {
                                $('#loadingToast').fadeOut(100);
                                $('#J_city_name').text(currentCity)
                                $('#J_list-wrap').html('<div class="list-empty">该地区暂不支持~</div>');
                            }
                        });
                    }
                });

                $('#J_favourite').attr('href', './favourite.html?lat=' + currentLat + '&lng=' + currentLng);
                
            },
            fail: function (err) {
                currentLat = '';
                currentLng = '';
                getList(currentPage, currentLat, currentLng, initScroll);
                $('#J_favourite').attr('href', './favourite.html?lat=' + currentLat + '&lng=' + currentLng);
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

    wx.error(function (err) {
        console.log('wx.error: ', err);
    });

    var p1 = $.ajax({
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
                            var preVal = $this.find('span').text();
                            if (result[0].label == preVal) {
                                return;
                            }
                            currentCity = result[0].label;
                            $this.find('span').text(currentCity);
                            $this.css({
                                width:  (result[0].label.length + 2) + 'em'
                            });
                            searchList();
                        }
                    });
                });
            }
        },
        fail: function (err) {

        },
    });

    initSearch();

    function checkValidCity(city, cityList) {
        for (var i = 0; i < cityList.length; i++) {
            if (city.indexOf(cityList[i].label) > -1) {
                return true;
            }
        }
        return false;
    }
    

    function initScroll() {
        scroll.init(function () {
            currentPage++;
            getList(currentPage, currentLat, currentLng);
        }, function () {
            currentPage = 1;
            getList(currentPage, currentLat, currentLng);
        });
    }


    function getList(pageIndex, lat, lng, cb) {
        $.ajax({
            url: '/charger/getnearcharging',
            type: 'post',
            async: false,
            data: JSON.stringify({
                lat: lat,
                lng: lng,
                accesstoken: 'asdasdwedf565665',
                pagesize: 50,
                pageindex: pageIndex
            }),
            contentType: 'application/json',
            success: function (res) {
                $('#loadingToast').fadeOut(100);   
                if (res.status == 0 && res.data.content) {
                    if (res.data.content.length <= 0) {
                        $('#J_list-wrap').html('<div class="list-empty">附近找不到充电站~</div>');
                        return;
                    }
                    res.data.content.userLat = lat;
                    res.data.content.userLng = lng;
                    var tpl = doT.template($('#list-template').html())(res.data.content);
                    if (pageIndex == 1) {
                        $('#J_list-wrap').html(tpl);
                    }
                    else {
                        $('#J_list-wrap').append(tpl);
                    }
                    // cb && cb();
                }
                else {
                    com.showToast();
                }
            },
            error: function (err) {
                $('#loadingToast').fadeOut(100);
                com.showToast();
            }
        });
    }

    function searchList() {
        var word = $('#searchInput').val();
        $.ajax({
            url: '/charger/getsearchWordcharging',
            type: 'post',
            data: JSON.stringify({
                accesstoken: 'asdasdwedf565665',
                searchWord: encodeURIComponent(word),
                city: encodeURIComponent(currentCity),
                lat: currentLat,
                lng: currentLng
            }),
            contentType: 'application/json',
            success: function (res) {
                if (res.status == 0) {
                    if (res.data.content.length == 0) {
                        $('#J_list-wrap').html('<div class="list-empty">该区域暂不支持~</div>');
                        return;
                    }
                    res.data.content.userLat = currentLat;
                    res.data.content.userLng = currentLng;
                    var tpl = doT.template($('#list-template').html())(res.data.content);
                    $('#J_list-wrap').html(tpl);
                }
                else {

                }
            },
            error: function (err) {}

        });
    }


    var deboun = com.debounce(function () {
        searchList();
    }, 500, this);

    function initSearch() {
        var $searchBar = $('#searchBar'),
            $searchResult = $('#searchResult'),
            $searchText = $('#searchText'),
            $searchInput = $('#searchInput'),
            $searchClear = $('#searchClear'),
            $searchCancel = $('#searchCancel');

        function hideSearchResult(){
            $searchResult.hide();
            $searchInput.val('');
        }
        function cancelSearch(){
            hideSearchResult();
            $searchBar.removeClass('weui-search-bar_focusing');
            $searchText.show();
        }

        $searchText.on('click', function(){
            $searchBar.addClass('weui-search-bar_focusing');
            $searchInput.focus();
        });
        $searchInput
            .on('blur', function () {
                if(!this.value.length) cancelSearch();
            })
            .on('input', function(){
                deboun();
            });
        ;
        $searchClear.on('click', function(){
            hideSearchResult();
            $searchInput.focus();
        });
        $searchCancel.on('click', function(){
            cancelSearch();
            $searchInput.blur();
        });

        $('#J_search_form').on('submit', function (e) {
            e.preventDefault();
            searchList();
        })
    }

});








