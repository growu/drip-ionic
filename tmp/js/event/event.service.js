(function () {
    'use strict';

    angular
        .module('drip.event')
        .factory('Event', Event);

    function Event($http, $q, $localStorage, $ionicLoading, $ionicActionSheet, $ionicHistory,$log, CacheFactory,$state, ENV, Auth, User, Loading) {

        var service = {
            getInfo: getInfo,
            getList: getList,
            getLikes: getLikes,
            doComment: doComment,
            doLike: doLike,
            showMore: showMore
        };

        return service;

        function getInfo(eventId) {
            var deferred = $q.defer();
            Loading.showWaiting("正在获取动态详情...");
            $http.get(ENV.apiUrl + 'event/info?event_id=' + eventId)
                .success(function (response) {
                    Loading.hide();
                    if (response.status) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.message);
                        Loading.show(response.message);
                        $ionicHistory.goBack();
                    }
                }).error(function (error) {
                Loading.hide();
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // 获取动态列表
        function getList(offset, type, userId, cache) {
            var deferred = $q.defer();
            var params = {};
            params.offset = offset;
            if (type) {
                params.type = type;
            }
            if (userId) {
                params.user_id = userId;
            }

            cache = (typeof(cache) == 'undefined') ? true : cache;

            var name =  userId?'userEventsCache-'+userId:type+'EventsCache';

            var eventsCache = CacheFactory.get(name);

            if(!eventsCache) {
                eventsCache = CacheFactory.createCache(name, {
                    maxAge: 24 * 60 * 60 * 1000,
                    deleteOnExpire: 'aggressive'
                });
            }

            if (cache&&eventsCache.get(offset)) {
                $log.debug("从缓存 "+name+" 中读取");
                deferred.resolve(eventsCache.get(offset));
            } else {
                Loading.showWaiting("正在加载动态...");
                $http.get(ENV.apiUrl + 'event/all', {params: params})
                    .success(function (response) {
                        Loading.hide();
                        if (response.status) {
                            eventsCache.put(offset,response.data);
                            deferred.resolve(response.data);
                        } else {
                            deferred.reject(response.message);
                        }
                    }).error(function (error) {
                    deferred.reject(error);
                });
            }



            return deferred.promise;
        }

        function getLikes(eventId) {
            var deferred = $q.defer();

            $http.get(ENV.apiUrl + 'event/likes?event_id=' + eventId)
                .success(function (response) {
                    if (response.status) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.message);
                    }
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function doComment(eventId, comment) {
            var deferred = $q.defer();

            $http.post(ENV.apiUrl + 'event/comment', {
                event_id: eventId,
                content: comment.content,
                parent_id: comment.parent == null ? 0 : comment.parent.comment_id
            })
                .success(function (response) {
                    if (response.status) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.message);
                    }
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function doLike(eventId) {
            var deferred = $q.defer();

            $http.post(ENV.apiUrl + 'event/like', {
                event_id: eventId,
            }).success(function (response) {
                if (response.status) {
                    deferred.resolve(response.data);
                } else {
                    deferred.reject(response.message);
                }
            }).error(function (error) {
                // $ionicLoading.show({
                //     template: error,
                //     noBackdrop: true,
                //     duration: 2000
                // });
                deferred.reject(error);
            });
            return deferred.promise;
        }


        function showMore(eventId) {
            $ionicActionSheet.show({
                buttons: [
                    {text: '分享'},
                    {text: '举报'}
                ],
                destructiveText: '',
                titleText: '更多设置',
                cancelText: '取消',
                cancel: function () {
                    return true;
                },
                buttonClicked: function (index) {
                    if (index === 0) {
                        $state.go('eventshare', {eventId: eventId});
                    }
                    if (index === 1) {
                        console.log(eventId);
                        User.doReport('event', eventId).then(function (response) {
                        }, function (error) {

                        });
                    }
                    return true;
                }
            });
        }

    }

})();
