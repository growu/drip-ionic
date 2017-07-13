/**
 * Created by Jason.z on 16/7/20.
 */


(function() {

    'use strict';

    angular
        .module('drip.goal')
        .controller('ItemAddController', ItemAddController);

    function ItemAddController($scope,parameters) {
        var vm = this;

        vm.item = parameters || {};

        vm.doSaveItem = function(){
            $scope.closeModal(vm.item);
        };

        vm.closeModal = function(){
            $scope.closeModal(null);
        };


    }

})();