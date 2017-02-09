(function () {

    'use strict';

    angular
        .module('kd.auth')
        .controller('RegisterController', RegisterController);

    function RegisterController($http, $state, $localStorage, Loading, ENV, OAuth, isXiaomiChannel, isQQInstalled, isWeiboInstalled) {

        var vm = this;

        vm.isXiaomiChannel = isXiaomiChannel;
        vm.isQQInstalled = isQQInstalled;
        vm.isWeiboInstalled = isWeiboInstalled;

        vm.user = {};
        vm.user.device = ionic.Platform.device();
        vm.user.device.push_id = $localStorage.push_id;

        vm.doQQLogin = OAuth.doQQLogin;
        vm.doWeiboLogin = OAuth.doWeiboLogin;
        vm.doRegister = doRegister;

       function doRegister() {
            Loading.showWaiting('注册中,请稍候...');
            $http.post(ENV.apiUrl + 'auth/register', vm.user).success(function (response) {
                if (response.status) {
                    Loading.show('注册成功');
                    $localStorage.token = response.token;
                    $localStorage.user = response.user;
                    $state.go('app.home');
                } else {
                    Loading.show('注册失败:' + response.message);
                }
            }).error(function (error) {
            });
        }
    }

})(); 