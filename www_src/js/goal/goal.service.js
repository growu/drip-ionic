(function () {
    'use strict';

    angular
        .module('drip.goal')
        .factory('Goal', Goal);

    function Goal($http, $q, $localStorage, $ionicPopup,Loading, $log, ENV) {
        var userId = $localStorage.user.user_id;
        var goals = [];
        var topGoals = [];

        var service = {
            doCheckin: doCheckin,
            createGoal: createGoal,
            editGoal: editGoal,
            getGoal: getGoal,
            getGoals: getGoals,
            reOrderGoals: reOrderGoals,
            getAllGoals: getAllGoals,
            delGoal: delGoal,
            getItems: getItems,
            insertItem: insertItem
        };

        return service;

        function doCheckin(checkin) {
            var deferred = $q.defer();
            Loading.showWaiting("正在提交打卡记录，请稍候...");
            $http.post(ENV.apiUrl + 'checkin/create', checkin)
                .success(function (response) {
                    Loading.hide();
                    if (response.status) {
                        // 修改目标打卡状态
                        if (goals.length > 0 && goals[checkin.goal_id]) {
                            goals[checkin.goal_id].pivot.is_today_checkin = true;
                        }
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.message);
                    }
                }).error(function (error) {
                $log.error(error);
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getGoals(isRefresh){
            isRefresh = (typeof(isRefresh)=='undefined')?false:isRefresh;
            var deferred = $q.defer();
            if (!isRefresh && goals.length > 0) {
                $log.debug("从队列中获取...");
                var process = [];
                var finish = [];

                for(var key in goals) {
                    if(goals[key]) {
                        if(goals[key].pivot.status==0) {
                            if(goals[key].pivot.order != 999) {
                                process.splice(goals[key].pivot.order,0,goals[key]);
                            } else {
                                process.push(goals[key]);
                            }
                        }
                        if(goals[key].pivot.status==1) {
                            finish.push(goals[key]);
                        }
                    }
                }

                var new_goals = {
                    process:process,
                    finish:finish
                };

                deferred.resolve(new_goals);
            } else {
                $log.debug("队列为空，从服务器拉取...");
                Loading.showWaiting("正在获取目标列表...");
                $http.get(ENV.apiUrl + 'user/goals')
                    .success(function (response) {
                        if (response.status) {
                            Loading.hide();
                            angular.forEach(response.data.finish,function(data,index,array){
                                goals[data.goal_id] = data;
                            });
                            angular.forEach(response.data.process,function(data,index,array){
                                goals[data.goal_id] = data;
                            });
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

        function reOrderGoals(new_goals) {
            var deferred = $q.defer();

            var order = [];
            // 修改本地的目标顺序
            angular.forEach(new_goals,function(data,index,array){
                goals[data.goal_id].pivot.order = index;
                var obj = {};
                obj.goal_id = data.goal_id;
                obj.index = index;
                order.push(obj);
            });

            // 同步到服务器
            Loading.showWaiting("正在同步排序到服务器,请稍候...");
            $http.post(ENV.apiUrl + 'goal/reorder',{order:order})
                .success(function (response) {
                    if (response.status) {
                        Loading.show("同步成功");
                        deferred.resolve(response.message);
                    } else {
                        Loading.show(response.message);
                        deferred.reject(response.message);
                    }
                }).error(function (error) {
                    deferred.reject(error);
            });

            return deferred.promise;

        }

        function getAllGoals(searchText){
            searchText = searchText || '';
            var deferred = $q.defer();
            $log.debug("检查队列...");
            if (searchText.length==0 && topGoals.length > 0) {
                $log.debug("存在于队列中");
                deferred.resolve(topGoals);
            } else {
                $log.debug("不存在队列中，从服务器拉取...");
                Loading.showWaiting("正在获取目标列表");
                $http.get(ENV.apiUrl + 'goal/all?q='+searchText)
                    .success(function (response) {
                        if (response.status) {
                            Loading.hide();
                            if(!searchText) {
                                topGoals = response.data;
                            }
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

        function createGoal(goal) {
            var deferred = $q.defer();
            Loading.showWaiting("目标创建中，请稍候...");
            $http.post(ENV.apiUrl + 'goal/create', goal)
                .success(function (response) {
                    if (response.status) {
                        Loading.show("创建成功");
                        var goal = response.data;
                        goals[goal.goal_id] = goal;
                        deferred.resolve(goal);
                        $log.error(goals);
                    } else {
                        Loading.show(response.message);
                        deferred.reject(response.message);
                    }
                }).error(function (error) {
                    deferred.reject(error);
            });
            return deferred.promise;
        }

        function editGoal(goal) {
            var deferred = $q.defer();
            Loading.showWaiting("正在保存设置...");
            $http.post(ENV.apiUrl + 'goal/setting', goal)
                .success(function (response) {
                    if (response.status) {
                        if(goals.length>0&&goals[goal.goal_id]) {
                            goals[goal.goal_id].pivot.is_public = goal.is_public;
                            goals[goal.goal_id].pivot.is_push = goal.is_push;
                            goals[goal.goal_id].pivot.remind_time = goal.remind_time;
                        }
                        Loading.show("修改成功");
                        deferred.resolve(response.data);
                    } else {
                        Loading.show(response.message);
                        deferred.reject(response.message);
                    }
                }).error(function (error) {
                    $log.error(error);
                    deferred.reject(error);
            });
            return deferred.promise;
        }

        function getGoal(goalId,isRefresh) {
            isRefresh = (typeof(isRefresh)=='undefined')?false:isRefresh;
            var deferred = $q.defer();
            if (!isRefresh && goals.length > 0 && goals[goalId]) {
                $log.debug("存在于队列中");
                deferred.resolve(goals[goalId]);
            } else {
                $log.debug("不存在队列中，从服务器拉取...");
                Loading.showWaiting("正在获取目标详情");
                $http.get(ENV.apiUrl + 'user/goal?user_id=' + userId + '&goal_id=' + goalId)
                    .success(function (response) {
                        if (response.status) {
                            Loading.hide();
                            goals[goalId] = response.data;
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

        function delGoal(goalId) {
            var deferred = $q.defer();

            var confirmPopup = $ionicPopup.confirm({
                title: '警告',
                template: '删除目标将会清空你在该目标下的所有记录，是否删除？',
                cancelText: '取消',
                okText: '删除',
                okType:'button-assertive'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    Loading.showWaiting("删除中，请稍候...");
                    $http.post(ENV.apiUrl + 'goal/delete', {goal_id: goalId})
                        .success(function (response) {
                            if (response.status) {
                                Loading.show("删除成功");
                                if (goals.length > 0 && goals[goalId]) {
                                    goals.splice(goalId, 1);
                                }
                                deferred.resolve(response.data);
                            } else {
                                Loading.show(response.message);
                                deferred.reject(response.message);
                            }
                        }).error(function (error) {
                        deferred.reject(error);
                    });
                } else {
                    deferred.reject("取消删除");
                }
            });
            return deferred.promise;
        }

        function getItems(goalId) {
            var deferred = $q.defer();
            $log.debug("获取项目信息,先从队列中检查...");
            if (goals.length > 0 && goals[goalId]) {
                $log.debug("存在于队列中");
                deferred.resolve(goals[goalId].items);
            } else {
                $log.debug("不存在队列中，从服务器拉取...");
                Loading.showWaiting("正在获取打卡项目...");
                $http.get(ENV.apiUrl + 'goal/items?goal_id=' + goalId)
                    .success(function (response) {
                        $log.debug("获取成功");
                        $log.debug(response);
                        if (response.status) {
                            Loading.hide();
                            deferred.resolve(response.data);
                        } else {
                            deferred.reject(response.message);
                        }
                    }).error(function (error) {
                    $log.error(error);
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        }

        function insertItem(item) {
            var deferred = $q.defer();

            $http.post(ENV.apiUrl + 'goal/item', item)
                .success(function (data) {
                    if (data.code === 0) {
                        deferred.resolve(data.data);
                    } else {
                        deferred.reject(data);
                    }
                }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

    }

})();
