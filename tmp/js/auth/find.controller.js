/**
 * Created by Jason.z on 16/10/9.
 */

(function() {

    'use strict';

    angular
        .module('kd.auth')
        .controller('FindController', FindController);

    function FindController($http,$ionicLoading,ENV,$interval) {

        var vm = this;

        vm.isSend = false;

        vm.find = {};


        var timer = null;

        vm.doSend = function() {

            $ionicLoading.show({
                template: '<ion-spinner icon="ios"></ion-spinner><br>验证码发送中,请稍候...',
                noBackdrop: true,
            });

            $http.post(ENV.apiUrl + 'auth/get_verify_code',{send_type:'email',send_object:vm.email,type:'find'})
                .success(function(response) {
                    if (response.status) {
                        $ionicLoading.show({
                            template: '发送成功,请到邮箱内查收',
                            noBackdrop: true,
                            duration: 2000
                        });

                        vm.isSend = true;
                        vm.time = 60;

                        timer = $interval(function(){
                            vm.time = vm.time - 1;
                            vm.codetime = vm.time+"秒后重新获取";
                            if(vm.time === 0) {
                                vm.codetime = "发送验证码";
                                $interval.cancel(timer);
                            }
                        }, 1000);
                    } else {
                        $ionicLoading.show({
                            template: '发送失败:'+response.message,
                            noBackdrop: true,
                            duration: 2000
                        });
                    }
                }).error(function(error) {
            });
        };

        vm.doFind = function() {
            vm.find.send_type = 'email';
            vm.find.send_object = vm.email;

            $http.post(ENV.apiUrl + 'auth/find',vm.find)
                .success(function(response) {
                    if (response.status) {
                        $ionicLoading.show({
                            template: '重置成功',
                            noBackdrop: true,
                            duration: 2000
                        });
                    } else {
                        $ionicLoading.show({
                            template: '重置失败:'+response.message,
                            noBackdrop: true,
                            duration: 2000
                        });
                    }
                }).error(function(error) {
                $ionicLoading.show({
                    template: '请求接口错误',
                    noBackdrop: true,
                    duration: 2000
                });
            });
        };


    }

})();