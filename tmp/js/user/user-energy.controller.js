/**
 * Created by Jason.z on 2016/12/9.
 */

(function() {

    'use strict';

    angular
        .module('drip.user')
        .controller('UserEnergyController', UserEnergyController);

    function UserEnergyController($scope,$http,$stateParams,User,ENV) {
        var vm = this;
        vm.logs = [];
        vm.user = {};

        // $ionicHistory.nextViewOptions({
        //     disableBack: true
        // });
        vm.userId = $stateParams.userId;

        User.getInfo(vm.userId).then(function(data){
            vm.user = data;
        });


        getLogs(0);

        vm.doRefresh = function () {
            getLogs(0);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };

        vm.loadMore = function () {
            var num = vm.logs.length;
            if (num > 0 && num % 10 === 0) {
                getLogs(num);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

        };


        function getLogs(offset) {
            var params = {};
            params.user_id = vm.userId;
            params.offset = offset;

            $http.get(ENV.apiUrl + 'user/energy',{params:params})
                .success(function(response) {
                    if (response.status) {
                        if(offset === 0) {
                            vm.logs = response.data;
                        } else {
                            vm.logs = vm.logs.concat(response.data);
                        }
                    }
                    else {
                    }
                }).error(function(data) {

                });

        }

        // User.getFans(vm.userId).then(function(data){
        //     vm.users = data;
        // });


    }

})();
