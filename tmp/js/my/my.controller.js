(function() {

    'use strict';

    angular
        .module('drip.my')
        .controller('MyController', MyController);  

    function MyController($state,$localStorage) {

        var vm = this; 
        vm.user = $localStorage.user;
        vm.new_messages_count = $localStorage.new_messages_count;

        vm.doLogout = doLogout;

        function doLogout() {
        	delete $localStorage.user;
        	delete $localStorage.token;
        	$state.go('login');
        }

    }
    
})();