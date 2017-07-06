(function() {

    'use strict';

    angular
        .module('kd.goal')
        .controller('GoalAddController', GoalAddController);  

    function GoalAddController($rootScope,$state,Goal) {
        var vm = this;

        vm.goal = {};

        vm.doSaveGoal =  function() {

            vm.goal.days = vm.goal.days || 0;

            Goal.createGoal(vm.goal).then(function(goal){
                $state.go('goalview', {
                    goalId: goal.goal_id
                });
                $rootScope.$broadcast('goal.add');
            },function(error){

            });
        };

        vm.getRange = function(){
            var today = moment().format("YYYY-MM-DD");
            var end_day = moment().add(vm.goal.days-1, 'days').format("YYYY-MM-DD");
            return '从 '+today+' 到 '+end_day;
        };

    }
    
})(); 