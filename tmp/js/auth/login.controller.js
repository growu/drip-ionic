(function () {

    'use strict';

    angular
        .module('drip.auth')
        .controller('LoginController', LoginController);

    function LoginController($http, $state, $log, Loading, $localStorage, ENV, Auth, OAuth, isQQInstalled, isWeiboInstalled) {

        var vm = this;

        // vm.isXiaomiChannel = isXiaomiChannel;
        vm.isQQInstalled = isQQInstalled;
        $log.debug("是否QQ安装：");
        $log.debug(vm.isQQInstalled);

        vm.isWeiboInstalled = isWeiboInstalled;

        vm.user = {};
        vm.user.email = Auth.getEmail();
        vm.user.device = ionic.Platform.device();
        vm.user.device.push_id = $localStorage.push_id;

        vm.doQQLogin = OAuth.doQQLogin;
        vm.doWeiboLogin = OAuth.doWeiboLogin;
        // vm.doXiaomiLogin = OAuth.doXiaomiLogin;
        vm.doLogin = doLogin;

        function doLogin() {
            Loading.showWaiting("登录中,请稍候...");
            $http.post(ENV.apiUrl + 'auth/login', vm.user).success(function (response) {
                if (response.status) {
                    $localStorage.token = response.token;
                    $localStorage.user = response.user;
                    Loading.show("登录成功");
                    $state.go('app.home');
                } else {
                    Loading.show('登录失败:' + response.message);
                }
            }).error(function (error) {
                $log.error(error);
            });
        }

    }

})(); 