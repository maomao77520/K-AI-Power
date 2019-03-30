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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
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

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

var css = __webpack_require__(11);
var com = __webpack_require__(0);

var defaultPriceData = [
    {
      "lineId": 1,
      "packageId": 1,
      "price": 1,
      "chargeDuration": 4,
      "isDefault": 1
    }, {
      "lineId": 2,
      "packageId": 1,
      "price": 2,
      "chargeDuration": 8,
      "isDefault": 0
    }, {
      "lineId": 3,
      "packageId": 1,
      "price": 3,
      "chargeDuration": 12,
      "isDefault": 0
    }];
var price = 1;
var time = 4;

$(document).ready(function () {
    var deviceId = com.parseQuery('deviceId');
    var slotIndex = com.parseQuery('slotIndex');
    var openId = com.parseQuery('openid');

    $.ajax({
        url: '/charger/getPricePackage',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            accessToken: 'asdasdwedf565665',
            deviceId: deviceId
        }),
        success: function (res) {
            if (res.status == 0) {
                var priceData = res.data;
                if (res.data.length < 3) {
                    priceData = defaultPriceData;
                }
                for (var i = 0; i < priceData.length; i++) {
                    $('#J_price_wrap a').eq(i).attr('data-price', priceData[i].price);
                    $('#J_price_wrap a').eq(i).attr('data-time', priceData[i].chargeDuration);
                    $('#J_price_wrap a').eq(i).text(priceData[i].price + '元/' + priceData[i].chargeDuration + '小时');
                    if (priceData[i].isDefault == 1) {
                        $('#J_price_wrap a').eq(i).addClass('active-btn');
                    }
                }
                price = $('.active-btn').data('price');
                time = $('.active-btn').data('time');
            }
        }
    });


    $.ajax({
        url: '/charger/getpaycharging',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            accessToken: 'asdasdwedf565665',
            deviceId: deviceId,
            slotIndex: slotIndex
        }),
        success: function (res) {
            if (res.status == 0) {
                var tpl = doT.template($('#J_top_detail_template').html())(res.data);
                $('#J_top_detail').html(tpl);
            }
            else {
                com.showToast();
            }
        },
        fail: function (err) {
            com.showToast();
        }
    })
    

    var tpl = doT.template($('#J_top_detail_template').html())({
        deviceId: deviceId,
        slotIndex: slotIndex
    });
    $('#J_top_detail').html(tpl);

    
    $('#J_price_wrap').on('click', '.price-btn', function (e) {
        $('.price-btn').removeClass('active-btn');
        $(this).addClass('active-btn');
        price = $(this).data('price');
        time = $(this).data('time');
    });


    $('#J_top_detail').on('click', '#J_open_dialog', function (e) {
        $('#iosDialog2').fadeIn(200);
    });

    $('#J_close_dialog').on('click', function (e) {
        $('#iosDialog2').fadeOut(200);
    });

    var lock = false;
    $('.charge-btn').on('click', function (e) {
        if (lock) {
            return;
        }
        lock = true;
        $.ajax({
            url: '/charger/createOrder',
            type: 'post',
            data: JSON.stringify({
                accesstoken: 'asdasdwedf565665',
                payment: price * 100,
                payHours: time,
                openId: openId,
                deviceId: deviceId,
                slotIndex: slotIndex
            }),
            contentType: 'application/json',
            success: function (res) {
                lock = false;
                if (res.status == 0 && res.data) {
                    var d = res.data;
                    onBridgeReady(d.appid, d.timeStamp, d.nonce_str, d.prepay_id, d.sign, d.out_trade_no);
                }
                else if (res.status == 1 && res.data) { // errorCode=1002, 插座被占用
                    window.location.href = './error.html?deviceId='
                    + deviceId + '&slotIndex=' + slotIndex + '&errorCode=' + res.data.errorCode;
                }
            },
            error: function (err) {
                lock = false;
            }
        });
    });

    function onBridgeReady(appId, timeStamp, nonceStr, prepay_id, paySign, out_trade_no){
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
               document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
               document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
               document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            WeixinJSBridge.invoke(
               'getBrandWCPayRequest', {
                   "appId": appId,     //公众号名称，由商户传入     
                   "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数     
                   "nonceStr": nonceStr, //随机串     
                   "package": "prepay_id=" + prepay_id,     
                   "signType": "MD5",         //微信签名方式：     
                   "paySign": paySign //微信签名 
                }, function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        window.location.href = com.host + "dist/page/progress.html?deviceId="
                        + deviceId + '&slotIndex=' + slotIndex + '&outTradeNo=' + out_trade_no;
                    }
                    else if (res.err_msg == "get_brand_wcpay_request:cancel") {  
                        // alert("取消支付!");
                    }
                    else {  
                        // alert("支付失败!");
                    }  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                }
            ); 
        }
    }

    // function checkOrderStatus(out_trade_no, cb) {
    //     $.ajax({
    //         url: '/charger/getPayStatus',
    //         type: 'post',
    //         data: JSON.stringify({
    //             out_trade_no: out_trade_no
    //         }),
    //         contentType: 'application/json',
    //         success: function (res) {
    //             if (res.status) {
    //                 cb && cb(res);
    //             }
    //         }
    //     });
    // }
    

});



/***/ }),

/***/ 11:
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: Error: ENOENT: no such file or directory, open '/Users/maomao/myCode/K-AI-Power/css/images/bottom-logo.png'\n    at runLoaders (/Users/maomao/myCode/K-AI-Power/node_modules/.npminstall/webpack/3.11.0/webpack/lib/NormalModule.js:195:19)\n    at /Users/maomao/myCode/K-AI-Power/node_modules/.npminstall/loader-runner/2.3.0/loader-runner/lib/LoaderRunner.js:364:11\n    at /Users/maomao/myCode/K-AI-Power/node_modules/.npminstall/loader-runner/2.3.0/loader-runner/lib/LoaderRunner.js:200:19\n    at /Users/maomao/myCode/K-AI-Power/node_modules/.npminstall/enhanced-resolve/3.4.1/enhanced-resolve/lib/CachedInputFileSystem.js:70:14\n    at _combinedTickCallback (internal/process/next_tick.js:131:7)\n    at process._tickCallback (internal/process/next_tick.js:180:9)");

/***/ })

/******/ });