(function() {

    'use strict';

    angular
        .module('drip.app')
        .controller('AppController', AppController);  

    function AppController($http,$localStorage,ENV,$interval) {
        var vm = this;

        function getNewMessages(){
            if($localStorage.user) {
                var user_id = $localStorage.user.user_id;
                $http.get(ENV.apiUrl + 'user/new_messages?user_id='+user_id)
                    .success(function(response) {
                        if (response.status) {
                            vm.count = response.count;
                            $localStorage.new_messages_count = response.count;
                        } 
                    }).error(function(error) {
                    });
            }
        }

        // 每分钟获取
        var timer =  $interval(getNewMessages,60000);

        timer.then(success, error, notify);
        function success(){
            // console.log("done");
        }
        function error(){
            // console.log("error");
        }
        function notify(){
            // console.log("每次都更新");
        }

    }
    
})(); 