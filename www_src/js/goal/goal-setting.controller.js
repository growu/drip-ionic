(function () {

    'use strict';

    angular
        .module('drip.goal')
        .controller('GoalSettingController', GoalSettingController);

    function GoalSettingController($scope, $stateParams, $rootScope, $state, Goal, goal, Modal, $log, $ionicModal) {
        var vm = this;
        vm.goalId = $stateParams.goalId;

        vm.goal = goal;

        vm.setting = {
            goal_id: vm.goalId,
            is_push: Boolean(goal.pivot.is_push),
            is_public: Boolean(goal.pivot.is_public),
            remind_time: goal.pivot.remind_time,
            items: goal.items
        };

        vm.timePickerObject = {
            inputEpochTime: 0,
            step: 1,  //Optional
            format: 24,  //Optional
            titleLabel: '提醒设置',  //Optional
            setLabel: '设置',  //Optional
            closeLabel: '取消',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {
                if (typeof (val) !== 'undefined') {
                    var selectedTime = new Date(val * 1000);
                    var time = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
                    vm.setting.remind_time = time;
                    // vm.timePickerObject.inputEpochTime = getEpochTime(time);
                }
            }
        };

        vm.doSaveSetting = doSaveSetting;
        vm.delGoal = delGoal;

        // 保存设置
       function doSaveSetting() {
            Goal.editGoal(vm.setting).then(function (response) {
                $state.go('goalview', {goalId: vm.goalId});
            }, function (error) {
            });
        }

        // 删除目标
        function delGoal () {
            Goal.delGoal(vm.goalId).then(function (response) {
                $state.go('app.home');
                $rootScope.$broadcast('goal.delete');
            }, function (error) {
            });
        }

        $ionicModal.fromTemplateUrl('templates/item_add_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modal = modal;
        });

        vm.itemAdd = function (item) {
            Modal.show('templates/item_add_modal.html', 'ItemAddController as itemadd', item)
                .then(function (result) {
                    console.log(result);
                    if (result && result.item_name) {
                        if (item) {
                            var index = vm.goal.items.indexOf(item);
                            vm.setting.items[index] = result;
                        } else {
                            vm.setting.items.push(result);
                        }
                    }
                }, function (err) {
                    $log.error(err);
                });
        };

        vm.doDelItem = function (item) {
            var index = vm.setting.items.indexOf(item);
            if (index >= 0) {
                vm.setting.items.splice(index, 1);
            }
        };

        vm.doEditItem = function (item) {
            itemAdd(item);
        };



        // function getEpochTime(time) {
        //     if (time) {
        //         var hour = time.substring(0, 2);
        //         var minute = time.substring(time.indexOf(":") + 1, time.indexOf(":") + 3);
        //         console.log((hour * 60 + minute * 1) * 60);
        //         return (hour * 60 + minute * 1) * 60;
        //     }
        //     return 0;
        // }
    }

})();