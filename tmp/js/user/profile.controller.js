/**
 * Created by Jason.z on 16/7/29.
 */

(function() {

    'use strict';

    angular
        .module('drip.user')
        .controller('ProfileController', ProfileController);

    function ProfileController($state, Loading,$localStorage,User,Upload) {

        var vm = this;

        vm.profile = {};

        var user = $localStorage.user;

        if(user) {
            vm.profile.nickname = user.nickname;
            vm.profile.signature = user.signature;
            vm.profile.user_avatar = user.user_avatar;
        }

        // User.getInfo(userId).then(function(data){
        //     $scope.user = data;
        //     $scope.profile.nickname = data.nickname;
        //     $scope.profile.signature = data.signature;
        //     $scope.profile.user_avatar = data.user_avatar;
        // });

        vm.saveProfile = function() {
            User.saveProfile(vm.profile).then(function(data){
                Loading.show("更新成功");
                $state.go('app.my');
            });
        };

        vm.avatarPick = function() {
            Upload.imageUpload().then(function(data){
                var image = document.getElementById('avatar');
                image.src = data.url;
                vm.profile.user_avatar = data.url;
            },function(error){

            });
        };
    }

})();
