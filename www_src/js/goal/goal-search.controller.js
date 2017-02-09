/**
 * Created by Jason.z on 2016/10/28.
 */
(function() {

    'use strict';

    angular
        .module('kd.goal')
        .controller('GoalSearchController', GoalSearchController);

    function GoalSearchController(Goal) {
        var vm = this;
        vm.search = {
            text:''
        };
        vm.goals = [];

        getGoals();

        function getGoals(text) {
            Goal.getAllGoals(text).then(function(goals){
                vm.goals = goals;
            },function(error){

            });
        }

        vm.doSearch = function(){
            getGoals(vm.search.text);
        };

        vm.clearSearch = function(){
            getGoals();
            vm.search.text = '';
        };
    }

})();