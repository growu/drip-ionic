/**
 * Created by Jason.z on 2016/11/14.
 */

(function() {

    'use strict';

    angular
        .module('kd.user')
        .controller('UserFansController', UserFansController);

    function UserFansController($scope,$stateParams,User) {
        var vm = this;
        vm.users = [];

        // $ionicHistory.nextViewOptions({
        //     disableBack: true
        // });

        vm.userId = $stateParams.userId;

        User.getInfo(vm.userId).then(function(user){
            vm.user = user;
        },function(error){
        });

        getFans(0);

        vm.doRefresh = function () {
            getFans(0);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };

        vm.loadMore = function () {
            var num = vm.users.length;
            if (num > 0 && num % 10 === 0) {
                getFans(num);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

        };

        vm.showMore = function(eventId) {
            User.showMore(eventId);
        };

        function getFans(offset) {
            User.getFans(vm.userId,offset).then(function(users){
                if(offset === 0) {
                    vm.users = users;
                } else {
                    vm.users = vm.users.concat(users);
                }
            },function(error){

            });
        }

        // User.getFans(vm.userId).then(function(data){
        //     vm.users = data;
        // });


    }

})();
