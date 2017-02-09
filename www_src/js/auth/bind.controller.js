/**
 * Created by Jason.z on 16/9/21.
 */
(function () {

    'use strict';

    angular
        .module('kd.auth')
        .controller('BindController', BindController);

    function BindController($state, Loading, Auth) {

        var vm = this;

        vm.user = {
            'is_register': false
        };

        vm.doBind = doBind;

        function doBind() {
            Auth.bind(vm.user.email, vm.user.password, vm.user.is_register).then(function (data) {
                Loading.show("绑定成功");
                $state.go('app.home');
            }, function (error) {
                Loading.show("绑定失败:" + error);
            });
        }


    }

})();
