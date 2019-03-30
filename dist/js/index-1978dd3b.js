/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var Common = {
    host: (function() {
        return 'http://' + window.location.hostname + '/';
    })(),
    getWxConfig: function (cb) {
        $.ajax({
            url: '/charger/config',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({url: window.location.href}),
            success: function (res) {
                console.log('***&&&&')
                // if (res.status == 0) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.appId, // 必填，公众号的唯一标识
                        timestamp: res.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.nonceStr, // 必填，生成签名的随机串
                        signature: res.signature,// 必填，签名
                        jsApiList: [
                            'checkJsApi',
                            'openLocation',
                            'getLocation',
                            'scanQRCode',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage'
                        ] // 必填，需要使用的JS接口列表
                    });

                // }
            },
            error: function (err) {}
        });
    },


    openMap: function(name, addr, latitude, longitude) {
        wx.openLocation({
            latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
            longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
            name: name, // 位置名
            address: addr, // 地址详情说明
            scale: 10, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    },

    convert: function (lat, lng) {
        var url = '/ws/geocoder/v1/?location='
        return $.ajax({
            url: url + lat + ',' + lng
            + '&key=C5YBZ-MJ4C6-HXBSF-MJ6LD-OYABF-N6FNI',
            success: function (res) {
                return res;
            }
        });
    },

    translateLocation: function (lat, lng) {
        var url = '/ws/coord/v1/translate?type=1&locations='
        return $.ajax({
            url: url + lat + ',' + lng
            + '&key=C5YBZ-MJ4C6-HXBSF-MJ6LD-OYABF-N6FNI',
            success: function (res) {
                return res;
            }
        });
    },

    parseQuery: function (name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
        
        var r = decodeURIComponent(window.location.search).substr(1).match(reg);  
        if (r != null) {
            return unescape(r[2]);
        } 
        return null; 
    },

    timer: function (fun, timeout, debounce, context) {
        var running;
        return function() {
            var args = arguments;
            context = context || this;
            if (debounce && running) {
                running = clearTimeout(running);
            }
            running = running || setTimeout(function() {
                running = null;
                fun.apply(context, args);
            }, timeout);
        };
    },
    debounce: function(fun, timeout, context) {
        console.log('debounce')
        return this.timer(fun, timeout, true, context);
    },

    sendMsg: function () {
        $.ajax({
            url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN',
            type: 'post',
            data: {
                "touser": "OPENID", // 发送对象openId
                "template_id": "ngqIpbwh8bUfcSsECmogfXcV14J0tQlEpBO27izEYtY",
                "url": "",   // 跳转url          
                "data":{
                    "first": {
                        "value":"恭喜你购买成功！",
                        "color":"#173177"
                    },
                    "keyword1":{
                        "value":"巧克力",
                        "color":"#173177"
                    },
                    "keyword2": {
                        "value":"39.8元",
                        "color":"#173177"
                    },
                    "keyword3": {
                        "value":"2014年9月22日",
                        "color":"#173177"
                    },
                    "remark":{
                        "value":"欢迎再次购买！",
                        "color":"#173177"
                    }
                }
            },
            success: function (res) {},
            error: function (err) {}
        }); 
    },
    showToast: function () {
        var $toast = $('#toast');
        if ($toast.css('display') != 'none') {
            return;
        }
        $toast.fadeIn(100);
        setTimeout(function () {
            $toast.fadeOut(100);
        }, 2000);
    },

    formatTime: function (timestamp) {
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var d = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var second = date.getSeconds();
        month = month >= 10 ? month : '0' + month;
        d = d >= 10 ? d : '0' + d;
        hour = hour >= 10 ? hour : '0' + hour;
        min = min >= 10 ? min : '0' + min;
        second = second >= 10 ? second : '0' + second;
        return year + '-' + month + '-' + d + ' ' + hour + ':' + min + ':' + second;
    },
    errorMap: {
        101: '电流过小',
        102: '电流过大',
        103: '未检测到充电器',
        '-1': '设备故障'
    },
};

module.exports = Common;

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var css = __webpack_require__(2);
var com = __webpack_require__(0);
var scroll = __webpack_require__(5);

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










/***/ }),
/* 5 */
/***/ (function(module, exports) {

var Scroll = {
    init: function (pullUpAction, pullDownAction) {
        var pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, myScroll;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        pullDownEl = document.getElementById('pullDown');
        pullDownOffset = pullDownEl.offsetHeight;
        pullUpEl = document.getElementById('pullUp');   
        pullUpOffset = pullUpEl.offsetHeight;
        
        /**
         * 初始化iScroll控件
         */
        myScroll = new iScroll('wrapper', {
            vScrollbar : false,
            topOffset : pullDownOffset,
            onRefresh : function () {
                if (pullDownEl.className.match('loading')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                } else if (pullUpEl.className.match('loading')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                }
            },
            onScrollMove: function () {
                if (this.y > 5 && !pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'flip';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                    this.minScrollY = 0;
                } else if (this.y < 0 && this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'flip';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '数据加载中...';
                }
            },
            onScrollEnd: function () {
                if (pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'loading';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';             
                    pullDownAction();
                } else if (pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'loading';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';                
                    pullUpAction();
                }
            }
        });
    }
};

module.exports = Scroll;


/***/ })
/******/ ]);