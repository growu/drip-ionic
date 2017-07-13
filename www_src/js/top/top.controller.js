(function() {

    'use strict';

    angular
        .module('drip.top')
        .controller('TopController', TopController);  

    function TopController($http,ENV) {

        var vm = this;
        
        vm.users = [];

        getTop();

        function getTop() {

            $http.get(ENV.apiUrl+'top/users').success(function(data) {
                vm.users = data.users;
                vm.rank = data.rank;
                vm.count = data.count;
                vm.month = data.month;
            }).error(function(error) {
            });
        }
    }
    
})();