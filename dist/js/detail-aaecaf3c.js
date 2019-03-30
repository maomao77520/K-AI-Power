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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
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
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

function CountDown(deadline, $ele) {
    this.count(deadline, $ele);
}

CountDown.prototype = {
    count: function (deadline, $ele) {
        var now = new Date().getTime();
        this.$ele = $ele;
        var me = this;
        if (deadline.getTime() - now <= 0) {
            clearInterval(this.interval);
            $ele.find('.hour').text('00');
            $ele.find('.minite').text('00');
            $ele.find('.second').text('00');
        }
        else {
            this.init(deadline);
            this.interval = setInterval(function () {
                me.init(deadline)
            }, 1000);
        }
    },

    init: function (deadline) {
        var now = new Date().getTime();
        if (deadline - now <= 0) {
            clearInterval(this.interval);
            this.$ele.find('.hour').text('00');
            this.$ele.find('.minite').text('00');
            this.$ele.find('.second').text('00');
        }
        else {
            this.getNum(deadline);
        }
    },

    getNum: function (deadline) {
        var now = new Date().getTime();
        var time = deadline.getTime() - now;
        var hour = this.formatNum(Math.floor(time / 1000 / 60 / 60 % 24));
        var minite = this.formatNum(Math.floor(time / 1000 / 60 % 60));
        var second = this.formatNum(Math.floor(time / 1000 % 60));
        this.$ele.find('.hour').text(hour);
        this.$ele.find('.minite').text(minite);
        this.$ele.find('.second').text(second);
    },

    formatNum: function (num) {
        return num >= 10 ? num : '0' + num;
    }
};

module.exports = CountDown;

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var css = __webpack_require__(9);
var com = __webpack_require__(0);
var countDown = __webpack_require__(3);

$(document).on('ready', function () {
    $('#loadingToast').fadeIn(100);
    
    var lat = com.parseQuery('lat');
    var lng = com.parseQuery('lng');
    var id = com.parseQuery('id');

    var targetLat, targetLng, currentLat, currentLng, location, addr;
    $.ajax({
        url: '/charger/getslotcharging',
        type: 'post',
        data: JSON.stringify({
            accesstoken: 'asdasdwedf565665',
            deviceId: id,
            lat: lat,
            lng: lng
        }),
        contentType: 'application/json',
        success: function (res) {
// res = {
//     status: 0,
//     data: {
//         content: [
//             {
//                 beginTimeSeconds:1527128746,
//                 deviceId:"2112018020700166",
//                 electricityMa:33,
//                 lastCommandType:5,
//                 lastUpdateTimeSeconds:1527084656,
//                 paymentSeconds:7200,
//                 slotIndex:2,
//                 slotStatus:0,
//                 userId:"oqUQA1SNkYjb9wJE5k-_VBIthn-k"
//             },
//             {
//                 beginTimeSeconds:1527125746,
//                 deviceId:"2112018020700166",
//                 electricityMa:33,
//                 lastCommandType:5,
//                 lastUpdateTimeSeconds:1527084656,
//                 paymentSeconds:7200,
//                 slotIndex:2,
//                 slotStatus:1,
//                 userId:"oqUQA1SNkYjb9wJE5k-_VBIthn-k"
//             },
//             {
//                 beginTimeSeconds:1527126746,
//                 deviceId:"2112018020700166",
//                 electricityMa:33,
//                 lastCommandType:5,
//                 lastUpdateTimeSeconds:1527084656,
//                 paymentSeconds:3600,
//                 slotIndex:2,
//                 slotStatus:1,
//                 userId:"oqUQA1SNkYjb9wJE5k-_VBIthn-k"
//             },
//             {
//                 beginTimeSeconds:1527085725,
//                 deviceId:"2112018020700166",
//                 electricityMa:33,
//                 lastCommandType:5,
//                 lastUpdateTimeSeconds:1527084656,
//                 paymentSeconds:10800,
//                 slotIndex:2,
//                 slotStatus:1,
//                 userId:"oqUQA1SNkYjb9wJE5k-_VBIthn-k"
//             }
//         ],
//         deviceId: '1324',
//         location: '开泰路口',
//         locationDetail: '仙葫大道265号'
//     }
// }
            $('#loadingToast').fadeOut(100);
            targetLat = res.data.lat;
            targetLng = res.data.lng;
            location = res.data.location;
            addr = res.data.locationDetail;
            if (res.status == 0) {
                var tpl1 = doT.template($('#J_detail_top_template').html())(res.data);
                $('#J_detail_info').html(tpl1);

                var tpl2 = doT.template($('#J_detail_list_template').html())(res.data);
                $('#J_detail_list').html(tpl2);
                var content = res.data.content;
                for (var i = 0; i < content.length; i++) {
                    if (content[i].slotStatus =s= 1) {
                        var endTime = new Date((content[i].beginTimeSeconds + content[i].paymentSeconds) * 1000)
                        var count = new countDown(endTime, $('.left-time-' + i));
                    }
                }
                

                initEvent();
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

            // 打开导航
            $('#J_detail_info').on('click', '.J_Navigation', function (e) {
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

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);