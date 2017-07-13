(function() {
    'use strict';

    angular
        .module('drip.auth')
        .factory('Auth', Auth);

    function Auth($http, $q, $localStorage,ENV) {

        var service = {
            login: login,
            register:register,
            bind:bind,
            isLogin: isLogin,
            getEmail:getEmail,
            getUserId:getUserId
        };

        return service;

        function login(email,password) {
            $http.post(ENV.apiUrl + 'auth/login', {
                email:email,
                password:password
            }).success(function(){

            }).error(function(){

            });
        }

        function register(email,password) {
            $http.post(ENV.apiUrl + 'auth/register', {
                email:email,
                password:password
            }).success(function(){

            }).error(function(){

            });
        }

        function bind(email,password,is_register) {

            var deferred = $q.defer();

            if(!$localStorage.user) {
                deferred.reject("未发现绑定对象");
            }

            var user_id = $localStorage.user.user_id;

            $http.post(ENV.apiUrl + 'auth/bind', {
                email:email,
                password:password,
                user_id:user_id,
                is_register:is_register
            }).success(function(response){
                if(response.status) {
                    $localStorage.token = response.token;
                    $localStorage.user = response.user;
                    deferred.resolve(response.user);
                } else {
                    deferred.reject(response.message);
                }
            }).error(function(error){
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function isLogin() {
            if ($localStorage.user && $localStorage.token) {
                 return true;
            } 
            return false;
        }

        function getEmail() {
            if ($localStorage.user) {
                return $localStorage.user.email;
            }
            return null;
        }

        function getUserId() {
            if ($localStorage.user) {
                return $localStorage.user.user_id;
            }
            return null;
        }
    }

})();
