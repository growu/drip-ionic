(function() {

    'use strict';

    angular
        .module('drip.goal')
        .controller('GoalAddController', GoalAddController);  

    function GoalAddController($rootScope,$state,Goal) {
        var vm = this;

        vm.today = moment().format("YYYY-MM-DD");

        vm.goal = {
            'start_date':moment().toDate(),
            'end_date':moment().toDate(),
            'days':0
        };

        vm.setDays = function() {

            if(vm.goal.start_date && vm.goal.end_date) {

                if(vm.goal.end_date < vm.goal.start_date) {
                    vm.goal.end_date = vm.goal.start_date;
                }

                var a = moment( vm.goal.start_date);
                var b = moment( vm.goal.end_date);
                vm.goal.days = b.diff(a, 'days') + 1;
            }
        };

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