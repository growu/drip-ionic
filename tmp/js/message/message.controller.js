(function() {

    'use strict';

    angular
        .module('drip.message')
        .controller('MessageController', MessageController);  

    function MessageController($http,ENV) {

        var vm = this; 
        vm.count = {};

        getMessages();

        function getMessages() {

            $http.get(ENV.apiUrl+'user/messages').success(function(response) {
                if(response.status) {
                    vm.count = response.data;
                    console.log(vm.count);
                }
            }).error(function(error) {
            });
        }
    }
    
})(); 