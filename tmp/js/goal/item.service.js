(function() {
    'use strict';

    angular
        .module('drip.goal')
        .factory('Item', Item);

    function Item($rootScope,$ionicModal) {
    	var vm = this;

        var service = {
        	showModal:showModal,
        	hideModal:hideModal,
        };

        function showModal() {
        	$ionicModal.fromTemplateUrl('templates/item_add_modal.html', {
	            scope: $rootScope.$new(),
	            animation: 'slide-in-up'
	        }).then(function(modal) {
	            vm.modal = modal;
	        });
        }

        function hideModal() {
         	vm.modal.hiden();
        }

        return service;
   	}

})();