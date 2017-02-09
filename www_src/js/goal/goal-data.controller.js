/**
 * Created by Jason.z on 16/10/17.
 */

(function() {

    'use strict';

    angular
        .module('kd.goal')
        .controller('GoalDataController', GoalDataController);

    function GoalDataController($http,$scope,$stateParams,ENV) {
        var vm = this;

        var goalId = $stateParams.goalId;

        $scope.goalId = goalId;
        vm.resUrl = ENV.resUrl;
        $scope.chart = null;

        vm.summary = {
            'count':0,
            'items':[]
        };

        function initChart(index) {
            var typeArr = ['week', 'month', 'year'];

            $http.get(ENV.apiUrl + 'goal/' + typeArr[index] + '?goal_id=' + goalId).success(function(response) {
                var y = response.data.y;
                y.splice(0, 0, "data1");
                var x = response.data.x;
                // y.splice(0, 0, "x");
                // console.log(x);
                console.log(y);

                var summary = response.data.summary;

                if(summary.length>0){
                    vm.summary = summary[5];
                }

                $scope.chart = c3.generate({
                    bindto: '#c3chart',
                    data: {
                        columns: [
                            y
                        ],
                        type: 'bar',
                        colors: {
                            'data1': '#0c9'
                        },
                        names: {
                            'data1': '打卡天数'
                        },
                        onclick: function (d, element) {
                            if(summary.length>0) {
                                vm.summary = summary[d.index];
                                $scope.$apply();
                            }
                        }
                    },
                    axis: {
                        x: {
                            type: 'category',
                            categories: x
                        }
                    }
                });
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }


        vm.showChart = function(index) {
            vm.summary = {
                'count':0,
                'items':[]
            };
            initChart(index);
        };

    }

})();