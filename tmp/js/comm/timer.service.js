(function() {
    'use strict';

    angular
        .module('drip.comm')
        .factory('Timer', Timer);

        function Timer($http, $localStorage, $interval,ENV) {

	        var service = {
	            start: start,
	        };

	        function getNewMessages(){

	        	if($localStorage.user) {
	        		var user_id = $localStorage.user.user_id;
		            $http.get(ENV.apiUrl + 'user/new_messages?user_id='+user_id)
		                .success(function(response) {
		                    if (response.status) {
		                       $localStorage.new_messages = response.new_messages;
		                    } 
		                }).error(function(error) {

		                });
	        	}
	        }

	        function start() {
	        	$interval(getNewMessages(),6000);
	        }

	    	return service;

	    }

 })();