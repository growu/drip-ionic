/**
 * Created by Jason.z on 16/9/20.
 */

(function () {

    'use strict';

    angular
        .module('drip.setting')
        .controller('SettingController', SettingController);

    function SettingController($cordovaAppRate,Update,ENV) {

        var vm = this;

        vm.latestVersion = {};
        vm.localVersionNo = ENV.version;

        vm.isNeedUpdate = false;
        vm.isOpenCheck = false;

        // 检查更新
        Update.check(true).then(function(version){
            vm.latestVersion = version;
            if(version) {
                // 本地版本号小于服务器版本号
                if(version.no>vm.localVersionNo) {
                    vm.isNeedUpdate = true;
                }
                // 本地版本号大于服务器版本号
                if(version.no>=vm.localVersionNo) {
                    vm.isOpenCheck = true;
                }
            }
        },function(error){

        });


        vm.doRate = function () {
            document.addEventListener("deviceready", function () {
                $cordovaAppRate.navigateToAppStore().then(function (result) {
                    // success
                });
            }, false);
        };


        vm.doUpdate = function () {
            Update.update(vm.latestVersion).then(function(success){
            },function(error){
            });
        };
    }

})();
