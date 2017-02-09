/**
 * Created by Jason.z on 2016/12/8.
 */

(function() {
    'use strict';

    angular
        .module('kd.event')
        .factory('Comment', Comment);

    function Comment($http, $q, $localStorage,$ionicLoading,$ionicActionSheet,$ionicHistory, $state,ENV,Auth,User,Loading) {

        var service = {
            doLike: doLike,
        };

        function doLike(comment) {
            var deferred = $q.defer();

            $http.post(ENV.apiUrl + 'comment/like', {
                comment_id:comment.comment_id
            }).success(function(response) {
                    if (response.status) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.message);
                    }
                }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        return service;
    }

})();
