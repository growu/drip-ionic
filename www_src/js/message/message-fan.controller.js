/**
 * Created by Jason.z on 2016/11/23.
 */
(function () {

    'use strict';

    angular
        .module('kd.message')
        .controller('MessageFanController', MessageFanController);

    function MessageFanController($http, ENV) {

        var vm = this;
        vm.messages = [];

        getMessages();

        function getMessages() {

            $http.get(ENV.apiUrl + 'message/fan').success(function (response) {
                if (response.status) {
                    vm.messages = response.data;
                }
            }).error(function (error) {
            });
        }
    }

})();