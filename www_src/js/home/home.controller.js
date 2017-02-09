(function () {

    'use strict';

    angular
        .module('kd.home')
        .controller('HomeController', HomeController);

    function HomeController($scope, $state, $rootScope,Goal,goals,User, Update) {

        var vm = this;
        var now = Math.floor(moment().toDate().getTime() / 1000);

        vm.processed_goals = goals.processed_goals;
        vm.finished_goals = goals.finished_goals;
        vm.isReorder = false;
        vm.isFinishGroupShow = false;

        // 检查更新
        // Update.checkAndUpdate();

        vm.getGoals = getGoals;
        vm.doRefresh = doRefresh;
        vm.showReorder = showReorder;
        vm.checkinGoal = checkinGoal;
        vm.delGoal = delGoal;
        vm.reOrderGoal = reOrderGoal;
        vm.toggleGroup = toggleGroup;
        vm.checkStatus = checkStatus;

        // 监听事件
        $rootScope.$on('goal.update', function (evt, data) {
            getGoals();
        });
        // 监听事件
        $rootScope.$on('goal.add', function (evt, data) {
            getGoals();
        });

        // 监听事件
        $rootScope.$on('goal.delete', function (evt, data) {
            getGoals();
        });

        function getGoals(isRefresh) {

            User.getGoals(isRefresh).then(function (goals) {
                vm.processed_goals = goals.process;
                vm.finished_goals = goals.finish;
            }, function (error) {

            });
        }

        function doRefresh() {
            getGoals(true);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        }

        function showReorder() {
            vm.isReorder = !vm.isReorder;

            if (!vm.isReorder) {
                Goal.reOrderGoals(vm.processed_goals);
            }
        }

        function checkinGoal(goal) {
            if (goal) {
                $state.go('checkinadd', {goalId: goal.goal_id});
            }
        }

        function delGoal(goal) {
            if (goal) {
                Goal.delGoal(goal.goal_id).then(function (response) {
                    var index;
                    if (goal.pivot.status == 0) {
                        index = vm.processed_goals.indexOf(goal);
                        vm.processed_goals.splice(index, 1);
                    } else {
                        index = vm.finished_goals.indexOf(goal);
                        vm.finished_goals.splice(index, 1);
                    }
                }, function (error) {
                });
            }
        }

        function reOrderGoal(goal, fromIndex, toIndex) {
            vm.processed_goals.splice(fromIndex, 1);
            vm.processed_goals.splice(toIndex, 0, goal);
        }

        function toggleGroup(group) {
            if (group == 'finish') {
                vm.isFinishGroupShow = !vm.isFinishGroupShow;
            }
        }

        function checkStatus(time) {

            if (time == 0) {
                return 'badge-assertive';
            }

            var diff_days = Math.ceil((now - time) / 86400);
            if (diff_days >= 3 && diff_days < 7) {
                return 'badge-energized';
            }
            if (diff_days >= 7) {
                return 'badge-assertive';
            }
            return 'badge-positive';
        }

    }

})();