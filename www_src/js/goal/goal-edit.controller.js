(function() {

    'use strict';

    angular
        .module('drip.goal')
        .controller('GoalEditController', GoalEditController);  

    function GoalEditController($scope,$http,$state,$stateParams,$localStorage,$log, $ionicLoading,$ionicModal,ENV,OAuth,Goal,Item,Modal) {
        var vm = this;
        vm.goal = {};
        vm.items = [];

        vm.goalId = $stateParams.goalId;
        var userId = $localStorage.user.user_id;

        getGoal();

        function getGoal() {
            $log.debug("开始获取目标信息...");
            $http.get(ENV.apiUrl+'user/goal?user_id='+userId+'&goal_id='+vm.goalId).success(function(data) {
                $log.debug("获取成功");
                $log.debug(data);

                if(data.code == 0) {
                    vm.goal = data.data;
                } else {
                    $ionicLoading.show({
                        template: data.message,
                        noBackdrop: true,
                        duration: 2000
                    });
                    $state.go('app.home');
                }
               
            }).error(function(error) {
                $log.error(error);
            });
        }

        vm.doSaveGoal = doSaveGoal;

        function doSaveGoal() {
            Goal.editGoal(vm.goal).then(function(data) {
                $ionicLoading.show({
                    template: '更新成功',
                    noBackdrop: true,
                    duration: 2000
                });
                $state.go('goalview', {
                    goalId: data.goal_id
                });
            }, function(error) {
                $ionicLoading.show({
                    template: error,
                    noBackdrop: true,
                    duration: 2000
                });
            });
        }

        vm.itemAdd = itemAdd;

        $ionicModal.fromTemplateUrl('templates/item_add_modal.html', {
             scope: $scope,
             animation: 'slide-in-up'
         }).then(function(modal) {
             vm.modal = modal;
         });

        function itemAdd(item) {
            Modal.show('templates/item_add_modal.html','ItemAddController as itemadd',item)
                .then(function(result) {
                    console.log(result);
                    if(result&&result.item_name) {
                        if(item){
                            var index = vm.goal.items.indexOf(item);
                            vm.goal.items[index] = result;
                        } else {
                            vm.goal.items.push(result);
                        }
                        console.log(vm.goal);
                    }
                }, function(err) {
                    console.log(err);
                });
        }

        vm.doDelItem = doDelItem;

        function doDelItem(item) {
            var index = vm.goal.items.indexOf(item);
            if(index >= 0) {
                vm.goal.items.splice(index, 1);
            }
        }

        vm.doEditItem = doEditItem;

        function doEditItem(item) {
            itemAdd(item);
        }

    }
    
})(); 