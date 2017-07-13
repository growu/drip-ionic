(function () {

    'use strict';

    angular
        .module('drip.goal')
        .controller('GoalViewController', GoalViewController);

    function GoalViewController($scope, $rootScope, $state, $http, $stateParams, $ionicLoading, $ionicPopover, $filter, $log, ENV, Goal,User,goal) {

        var vm = this;
        var goalId = $stateParams.goalId;

        vm.goal = goal;
        vm.users = [];
        vm.checkin = {};
        vm.resUrl = ENV.resUrl;
        vm.selectedDay = $filter('date')(new Date(), 'yyyy-MM-dd');
        vm.today = (new Date()).toDateString();
        vm.events = [];

        vm.getGoal = getGoal;
        vm.setDate = setDate;
        vm.openPopover = openPopover;
        vm.closePopover = closePopover;
        vm.goCheckin = goCheckin;
        vm.goSetting = goSetting;
        vm.goHome = goHome;

        getEvents(moment().year(), moment().month() + 1);
        getEvents(moment().year(), moment().month());

        initPopover();

        // 监听事件
        $rootScope.$on('goal.update', function (evt, data) {
            getGoal();
        });

        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            vm.popover.remove();
        });

        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
            // Execute action
        });

        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });

        function getGoal() {
            User.getGoal(goalId, false).then(function (goal) {
                vm.goal = goal;
            }, function (error) {

            });
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        }

        function getEvents(year, month) {
            $http.get(ENV.apiUrl + 'goal/checkins?goal_id=' + goalId + '&month=' + month + '&year=' + year).success(function (response) {
                $log.debug(response);
                if (response.status) {
                    if (response.data.length > 0) {
                        if (vm.events.length > 0) {
                            vm.events.concat(response.data);
                        } else {
                            vm.events = response.data;
                        }
                    }
                    $log.debug(vm.events);
                }
            }).error(function (error) {
                $log.error(error);
            });
        }

        function setDate(day) {
            vm.today = day.fullDay;
            vm.selectedDay = $filter('date')(new Date(day.fullDay), 'yyyy-MM-dd');
            if (day.event.length > 0) {
                vm.checkin = day.event[0];
            } else {
                vm.checkin = {};
            }
            // getCheckin(day);
        }


        function getCheckin($day) {
            $day = $filter('date')(new Date($day), 'yyyy-MM-dd');
            $log.debug("开始获取目标信息...");
            // This request will hit the index method in the AuthenticateController
            // on the Laravel side and will return the list of users
            $http.get(ENV.apiUrl + 'goal/checkin?&goal_id=' + goalId + '&day=' + $day).success(function (data) {
                $log.debug("获取成功");
                $log.debug(data);

                if (data.code == 0) {
                    vm.checkin = data.data;
                } else {
                    $ionicLoading.show({
                        template: data.message,
                        noBackdrop: true,
                        duration: 2000
                    });
                }

            }).error(function (error) {
                $log.debug("获取失败");
                $log.debug(error);
            });

        }

        function goCheckin() {
            if (vm.goal.pivot.status == 1) {
                $ionicLoading.show({
                    template: '目标已过期，无法进行打卡',
                    noBackdrop: true,
                    duration: 2000
                });
                return;
            }

            $state.go('checkinadd', {goalId: goalId});
        }

        function initPopover() {
            $ionicPopover.fromTemplateUrl('templates/goal_view_menu.html', {
                scope: $scope
            }).then(function (popover) {
                vm.popover = popover;
            });
        }

        function openPopover($event) {
            vm.popover.show($event);
        }



        function closePopover() {
            vm.popover.hide();
        }


        function goSetting () {
            closePopover();
            $state.go('goalsetting', {goalId: goalId});
        }

        function goHome () {
            closePopover();
            $state.go('goalhome', {goalId: goalId});
        }
    }
})();