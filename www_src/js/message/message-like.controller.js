(function() {

    'use strict';

    angular
        .module('drip.message')
        .controller('MessageLikeController', MessageLikeController);  

    function MessageLikeController($http,ENV) {

        var vm = this; 
        vm.messages = [];

        getMessages();

        function getMessages() {

            $http.get(ENV.apiUrl+'message/like').success(function(response) {
                if(response.status) {
                    vm.messages = response.data;
                }
            }).error(function(error) {
            });
        }
    }
    
})(); 