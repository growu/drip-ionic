/**
 * Created by Jason.z on 2016/11/9.
 */

(function() {

    'use strict';

    angular
        .module('kd.message')
        .controller('MessageNoticeController', MessageNoticeController);

    function MessageNoticeController($http,ENV) {

        var vm = this;
        vm.messages = [];

        getMessages();

        function getMessages() {

            $http.get(ENV.apiUrl+'message/notice').success(function(response) {
                if(response.status) {
                    vm.messages = response.data;
                }
            }).error(function(error) {
            });
        }
    }

})();
