/**
 * Created by Jason.z on 2016/10/28.
 */

(function() {

    'use strict';

    angular
        .module('drip.goal')
        .controller('GoalHomeController', GoalHomeController);

    function GoalHomeController($http,$scope,$stateParams,$ionicPopup,Loading,$state,$log,ENV) {
        var vm = this;
        vm.goal = {};
        vm.data = {};
        vm.index = 0;

        var goalId = $stateParams.goalId;

        $http.get(ENV.apiUrl+'goal/info?goal_id='+goalId).success(function(response) {
            if(response.status) {
                vm.goal = response.data;
            }
        }).error(function(error) {
        });

        $http.get(ENV.apiUrl+'goal/events?goal_id='+goalId).success(function(response) {
            if(response.status) {
                vm.events = response.data;
            }
        }).error(function(error) {
        });

        $http.get(ENV.apiUrl+'goal/top?goal_id='+goalId).success(function(response) {
            if(response.status) {
                vm.users = response.data;
            }
        }).error(function(error) {
        });

        vm.changeIndex = function($index) {
            console.log($index);
            vm.index = $index;
            $scope.$apply();
        };

        vm.followGoal = function() {

            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="goalhome.data.days" value="0">',
                title: '目标天数',
                subTitle: '从你制定目标的当天开始算起,0代表每天',
                scope: $scope,
                buttons: [
                    { text: '取消' },
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!vm.data.days) {
                                //不允许用户关闭，除非他键入wifi密码
                                e.preventDefault();
                                $ionicLoading.show({
                                    template: '请输入天数',
                                    noBackdrop: true,
                                    duration: 2000
                                });
                            } else {
                                return vm.data.days;
                            }
                        }
                    },
                ]
            });

            myPopup.then(function(res) {
               if(res){
                   $http.post(ENV.apiUrl+'goal/follow',{goal_id:goalId,days:res}).success(function(response) {
                       if(response.status) {
                           vm.goal.is_follow = true;
                           $ionicLoading.show({
                               template: '恭喜你,制定成功,<br>开启你的打卡旅程吧...',
                               noBackdrop: true,
                               duration: 2000
                           });
                           $state.go('goalview',{goalId:goalId});
                       }
                   }).error(function(error) {
                       $log.error(error);
                       $ionicLoading.show({
                           template: '请求接口错误,请检查网络或重试',
                           noBackdrop: true,
                           duration: 2000
                       });
                   });
               }
            });


        };
    }

})();
