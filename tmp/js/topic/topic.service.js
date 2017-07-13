/**
 * Created by Jason.z on 2016/11/17.
 */



(function() {
    'use strict';

    angular
        .module('drip.topic')
        .factory('Topic', Topic);

    function Topic($http, $q,ENV,Loading) {

        var service = {
            getInfo: getInfo,
            getEvents:getEvents,
        };

        return service;

        function getInfo(topicName){
            var deferred = $q.defer();

            $http.get(ENV.apiUrl + 'topic/info?name='+topicName)
                .success(function(response) {
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

        // 获取动态列表
        function getEvents(topicId,offset,type){
            var deferred = $q.defer();
            var params = {};
            params.topic_id = topicId;
            params.offset = offset;

            if(type) {
                params.type = type;
            }
            Loading.showWaiting("正在加载动态列表...");
            $http.get(ENV.apiUrl + 'topic/events',{params:params})
                .success(function(response) {
                    Loading.hide();
                    if (response.status) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.message);
                    }
                }).error(function(error) {
                Loading.hide();
                deferred.reject(error);
            });
            return deferred.promise;
        }


    }

})();
