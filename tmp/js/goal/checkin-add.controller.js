(function () {

    'use strict';

    angular
        .module('drip.goal')
        .controller('CheckinAddController', CheckinAddController);

    function CheckinAddController($rootScope, $state, $scope, $ionicPopup, $stateParams, Goal, goal, Upload, ENV) {
        var vm = this;
        var goalId = $stateParams.goalId;

        vm.goal = goal;

        vm.checkin = {
            'type': false,
            'model': 'text',
            'goal_id': goalId,
            'is_public':goal.pivot.is_public,
            'attaches': [],
        };

        var options = {
            maximumImagesCount: 1,
            width: 800,
            height: 800,
            quality: 80
        };

        vm.doUpload = function () {
            Upload.imageUpload().then(function (data) {
                console.log("上传成功");
                console.log(data);
                vm.checkin.attaches = [];
                vm.checkin.attaches.push(data);
                // var image = document.getElementById('upload-image');
                // image.src = data.url;
            }, function (error) {
                console.log("上传失败");
                console.log(error);
            });
        };

        vm.removeAttach = function () {
            vm.checkin.attaches = [];
        };

        vm.day1 = moment().add(-1, 'days').format("YYYY-MM-DD");
        vm.day2 = moment().add(-2, 'days').format("YYYY-MM-DD");
        vm.day3 = moment().add(-3, 'days').format("YYYY-MM-DD");
        // vm.checkin.day = vm.day1;

        // $ionicModal.fromTemplateUrl('templates/checkin_succ_modal.html', {
        //     scope: vm,
        //     animation: 'slide-in-up'
        // }).then(function(modal) {
        //     vm.modal = modal;
        // });

        // vm.cancelShare = function() {
        //     vm.modal.hide();
        //     $state.go('goalview',{
        //         "goalId":goalId
        //     });
        // };

        vm.delItem = function(item) {
            if(vm.goal.items.length>0) {
                var index = vm.goal.items.indexOf(item);
                console.log(index);
                if(index) {
                    vm.goal.items.splice(index,1);
                }
            }
        };

        vm.doCheckin = function () {

            vm.checkin.items = vm.goal.items;
            vm.checkin.obj_id = goalId;
            vm.checkin.obj_type = 'GOAL';

            if (vm.checkin.type && !vm.checkin.day) {
                vm.checkin.day = vm.day1;
            }

            Goal.doCheckin(vm.checkin).then(function (response) {
                // $state.go('goalview', {goalId: goalId});
                var succPopup = $ionicPopup.show({
                    template: '<div class="text-center"><i class="icon ion-ios-checkmark-outline balanced" style="font-size: 100px;"></i><p>正能量 <span class="assertive">+'+response.energy+'</span></p></div>',
                    title: '打卡成功',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                        {
                            text: '返回',
                            onTap: function (e) {
                                $state.go('goalview', {goalId: goalId});
                            }
                        },
                        {
                            text: '<b>分享</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                $state.go('eventshare', {eventId: response.event_id});
                            }
                        },
                    ]
                });

                succPopup.then(function (res) {
                });

                $rootScope.$broadcast('goal.update');
            }, function (error) {

                var failPopup = $ionicPopup.show({
                    template: '<div class="text-center"><i class="icon ion-ios-close-outline assertive" style="font-size: 100px;"></i><p>' + error + '</p></div>',
                    title: '打卡失败',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                        {
                            text: '确定',
                            onTap: function (e) {
                            }
                        }
                    ]
                });

                failPopup.then(function (res) {

                });
            });
        };

        // 返回
        vm.goBack = function () {
            $state.go('goal', {
                goalId: groupId
            });
        };
    }
})(); 