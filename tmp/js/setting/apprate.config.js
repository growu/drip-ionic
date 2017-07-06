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
                appName: '水滴打卡',
                iosURL: '1017364870',
                androidURL: 'market://details?id=me.growu.drip',
                windowsURL: 'ms-windows-store:Review?name=me.growu.drip'
            };
            $cordovaAppRateProvider.setPreferences(prefs);
        }, false);
    }
})();
