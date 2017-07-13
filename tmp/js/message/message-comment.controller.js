/**
 * Created by Jason.z on 16/7/29.
 */

(function () {

    'use strict';

    angular
        .module('drip.message')
        .controller('MessageCommentController', MessageCommentController);

    function MessageCommentController($http, ENV) {

        var vm = this;
        vm.messages = [];

        getMessages();

        function getMessages() {

            $http.get(ENV.apiUrl + 'message/comment').success(function (response) {
                if (response.status) {
                    vm.messages = response.data;
                }
            }).error(function (error) {
            });
        }
    }

})();
