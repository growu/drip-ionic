/**
 * Created by Jason.z on 2016/12/18.
 */

(function() {
    'use strict';

    angular
        .module('drip')
        .run(appRun);

    function appRun($ionicPlatform,$localStorage,amMoment){
        window.BOOTSTRAP_OK = true;

        $ionicPlatform.ready(function() {
            // 隐藏启动页
            if (navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            if(window.cordova&&window.plugins) {
                // 初始化jpush
                if (window.plugins.jPushPlugin) {

                    var getRegistrationID = function() {
                        window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
                    };
                    var onGetRegistrationID = function(data) {
                        try {
                            console.log("JPushPlugin:registrationID is " + data);
                            if (data.length == 0) {
                                var t1 = window.setTimeout(getRegistrationID, 1000);
                            } else {
                                $localStorage.push_id =  data;
                            }
                        } catch (exception) {
                            console.log(exception);
                        }
                    };


                    window.plugins.jPushPlugin.init();

                    getRegistrationID();
                    if (device.platform != "Android") {
                        window.plugins.jPushPlugin.setDebugModeFromIos();
                        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                    } else {
                        window.plugins.jPushPlugin.setDebugMode(true);
                        window.plugins.jPushPlugin.setStatisticsOpen(true);
                    }

                    window.plugins.jPushPlugin.setDebugMode(false);

                }

                if(window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }

                if(window.weibo) {
                    window.weibo.init(3987556016, "http://drip.growu.me", function(){

                    }, function(err){
                        console.log("微博SDK初始化失败");
                        console.log(err);
                    });
                }

                // 友盟初始化
                if(device.platform != "Android") {
                    Umeng.Analytics.config({
                        appkey: '595cb3c77f2c740fbf0009fa',
                        channel: 'AppStore'
                    }, function () {
                        console.log("友盟API初始化成功");
                    }, function (reason) {
                        console.log("友盟API初始化失败");
                    });
                } else {
                    Umeng.Analytics.config({
                        appkey: '595cb342c62dca66bf001828',
                        channel: 'Android'
                    }, function () {
                        console.log("友盟API初始化成功");
                    }, function (reason) {
                        console.log("友盟API初始化失败");
                    });
                }

            }
        });

        amMoment.changeLocale('zh-cn');

    }

})();
