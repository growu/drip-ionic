/**
 * Created by Jason.z on 16/7/29.
 */

(function () {
    'use strict';

    angular
        .module('kd.user')
        .factory('User', User);

    function User($q, $http, $localStorage,$log, ENV, Loading, $ionicActionSheet,Auth,CacheFactory) {

        var service = {
            getInfo: getInfo,
            saveProfile: saveProfile,
            doReport: doReport,
            doFollow: doFollow,
            unFollow: unFollow,
            getFans: getFans,
            getFollow: getFollow,
            getGoals: getGoals,
            getGoal:getGoal
        };

        return service;

        function getInfo(userId) {
            var deferred = $q.defer();

            $http.get(ENV.apiUrl + 'user/info?user_id=' + userId)
                .success(function (response) {
                    if (response.status) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.message);
                    }
                }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function saveProfile(profile) {
            var deferred = $q.defer();

            $http.post(ENV.apiUrl + 'user/profile', profile
            ).success(function (response) {
                if (response.status) {
                    //
                    $localStorage.user.nickname = profile.nickname;
                    $localStorage.user.signature = profile.signature;
                    $localStorage.user.user_avatar = profile.user_avatar;

                    deferred.resolve(response.data);
                } else {
                    deferred.reject(data);
                }
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // 举报
        function doReport(obj_type, obj_id) {
            var deferred = $q.defer();
            console.log(obj_id);
            $ionicActionSheet.show({
                buttons: [
                    {text: '含有赌博,色情等违法内容'},
                    {text: '垃圾广告,传销'},
                    {text: '其他'}
                ],
                destructiveText: '',
                titleText: '请选择举报类型',
                cancelText: '取消',
                cancel: function () {
                    deferred.resolve("取消举报");
                    return true;
                },
                buttonClicked: function (index) {
                    $http.post(ENV.apiUrl + 'user/report', {obj_id: obj_id, obj_type: obj_type, reason: index}
                    ).success(function (response) {
                        if (response.status) {
                            Loading.show("举报成功");
                            deferred.resolve("举报成功");
                        } else {
                            Loading.show("举报失败");
                            deferred.reject(response.message);
                        }
                    }).error(function (error) {
                        deferred.reject(error);
                    });
                    return true;
                }
            });

            return deferred.promise;
        }

        // 关注
        function doFollow(userId) {
            var deferred = $q.defer();

            // TODO 判断参数是否合法,是否未用户自己

            if (typeof userId == undefined) {
                deferred.reject("缺少userId参数");
            }

            $http.post(ENV.apiUrl + 'user/follow', {follow_user_id: userId}
            ).success(function (response) {
                if (response.status) {
                    Loading.show("关注成功");
                    deferred.resolve("关注成功");
                } else {
                    deferred.reject(response.message);
                }
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // 取消关注
        function unFollow(userId) {
            var deferred = $q.defer();

            // TODO 判断参数是否合法,是否未用户自己

            if (typeof userId == undefined) {
                deferred.reject("缺少userId参数");
            }

            $http.post(ENV.apiUrl + 'user/unfollow', {follow_user_id: userId}
            ).success(function (response) {
                if (response.status) {
                    Loading.show("取消关注成功");
                    deferred.resolve("关注成功");
                } else {
                    deferred.reject(response.message);
                }
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // 获取用户粉丝
        function getFans(userId, offset) {
            var deferred = $q.defer();
            var params = {};
            params.user_id = userId;
            params.offset = offset;

            $http.get(ENV.apiUrl + 'user/fans', {params: params})
                .success(function (response) {
                    if (response.status) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.message);
                    }
                }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        // 获取用户关注
        function getFollow(userId, offset) {
            var deferred = $q.defer();

            var params = {};
            params.user_id = userId;
            params.offset = offset;

            $http.get(ENV.apiUrl + 'user/follow', {params: params})
                .success(function (response) {
                    if (response.status) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.message);
                    }
                }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getGoal(goalId,cache) {
            var deferred = $q.defer();

            var params = {};

            params.user_id = Auth.getUserId();
            params.goal_id = goalId;

            cache = (typeof(cache)=='undefined')?true:cache;

            var userGoalCache = CacheFactory.get('userGoalCache');

            if(!userGoalCache) {
                userGoalCache = CacheFactory.createCache('userGoalCache', {
                    maxAge: 24 * 60 * 60 * 1000,
                    deleteOnExpire: 'aggressive'
                });
            }

            if(cache&&userGoalCache.get(goalId)) {
                $log.debug("从缓存中读取...");
                deferred.resolve(userGoalCache.get(goalId));
            } else {
                $log.debug("从服务器拉取...");
                Loading.showWaiting("正在获取目标详情");
                $http.get(ENV.apiUrl + 'user/goal',{params:params})
                    .success(function (response) {
                        if (response.status) {
                            Loading.hide();
                            userGoalCache.put(goalId,response.data);
                            deferred.resolve(response.data);
                        } else {
                            Loading.show(response.message);
                            deferred.reject(response.message);
                        }
                    }).error(function (error) {
                    deferred.reject(error);
                });
            }
            return deferred.promise;
        }

        function getGoals(cache) {
            var deferred = $q.defer();
            // 是否通过缓存访问 默认true
            cache = (typeof(cache) == 'undefined') ? true : cache;

            var userGoalsCache = CacheFactory.get('userGoalsCache');

            if(!userGoalsCache) {
                userGoalsCache = CacheFactory.createCache('userGoalsCache', {
                    maxAge: 24 * 60 * 60 * 1000,
                    deleteOnExpire: 'aggressive'
                });
            }

            if(cache&&userGoalsCache.get('goals')) {
                deferred.resolve(userGoalsCache.get('goals'));
            } else {
                Loading.showWaiting("正在获取目标列表...");
                $http.get(ENV.apiUrl + 'user/goals')
                    .success(function (response) {
                        if (response.status) {
                            Loading.hide();
                            // 写入缓存
                            userGoalsCache.put("goals",response.data);
                            deferred.resolve(response.data);
                        } else {
                            Loading.show(response.message);
                            deferred.reject(response.message);
                        }
                    }).error(function (error) {
                    deferred.reject(error);
                });

            }
            return deferred.promise;
        }

    }

})();