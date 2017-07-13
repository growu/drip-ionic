/**
 * Created by Jason.z on 2016/11/15.
 */

(function() {

    'use strict';

    angular
        .module('drip.user')
        .controller('UserFollowController', UserFollowController);

    function UserFollowController($scope,$stateParams,User) {
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

        getFollow(0);

        vm.doRefresh = function () {
            getFollow(0);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };

        vm.loadMore = function () {
            var num = vm.users.length;
            if (num > 0 && num % 10 === 0) {
                getFollow(num);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

        };

        function getFollow(offset) {
            User.getFollow(vm.userId,offset).then(function(users){
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
