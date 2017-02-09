/**
 * Created by Jason.z on 2016/12/18.
 */

(function() {
    'use strict';

    angular
        .module('kd.setting')
        .config(appRateConfig);

    function appRateConfig($cordovaAppRateProvider) {
        document.addEventListener("deviceready", function () {
            var prefs = {
                language: 'zh-Hans',
                appName: '微打卡',
                iosURL: '1017364870',
                androidURL: 'market://details?id=com.keepdays.weidaka',
                windowsURL: 'ms-windows-store:Review?name=com.keepdays.weidaka'
            };
            $cordovaAppRateProvider.setPreferences(prefs);
        }, false);
    }
})();
