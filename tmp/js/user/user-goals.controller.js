/**
 * Created by Jason.z on 2016/11/4.
 */
(function() {

    'use strict';

    angular
        .module('kd.user')
        .controller('UserGoalsController', UserGoalsController);

    function UserGoalsController($http,$stateParams,$localStorage,ENV) {

        var vm = this;

        vm.goals = [];



    }

})();