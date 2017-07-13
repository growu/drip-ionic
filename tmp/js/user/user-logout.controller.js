(function() {

    'use strict';

    angular
        .module('drip.user')
        .controller('UserLogoutController', UserLogoutController);  

    function UserLogoutController($http,$stateParams,$localStorage,ENV) {

        var vm = this; 
        
        vm.user = $localStorage.user;

        var userId = $stateParams.userId;

	    vm.isSelf = false;

    }
    
})();