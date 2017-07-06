/**
 * Created by Jason.z on 16/9/27.
 */

(function () {
    'use strict';

    angular
        .module('kd.comm')
        .factory('Update', Update);

    function Update($http, $q, $log, Loading, $ionicPopup, $cordovaInAppBrowser, ENV) {

        var service = {
            check: check,
            update: update,
            checkAndUpdate: checkAndUpdate
        };

        /**
         * 检查更新
         */
        function check() {
            var deferred = $q.defer();

            $http.post(ENV.apiUrl + 'update/check', {platform: ionic.Platform.platform(), version: ENV.version})
                .success(function (response) {
                    $log.debug("更新结果;");
                    $log.debug(response);
                    if (response.status) {
                        deferred.resolve(response.version);
                    } else {
                        $log.error("更新失败");
                        $log.error(response.message);
                        deferred.reject(response.message);
                    }
                }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        /**
         * 执行更新
         * @param version 检查版本对象
         */
        function update(version) {

            var deferred = $q.defer();

            if (!version) {
                deferred.reject("参数非法");
            } else {
                var type = version.type;

                var confirmPopup = $ionicPopup.confirm({
                    title: '发现新版本了!!!!',
                    template: version.content,
                    cancelText: '稍候再说',
                    okText: '马上更新'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        deferred.resolve("检查更新");
                        if (type == 1) {
                            checkResUpdate();
                        } else if (type == 2) {
                            gotoStore();
                        }
                    } else {
                        deferred.reject("取消更新");
                    }
                });
            }

            return deferred.promise;

        }

        /**
         * 检查更新并执行
         */
        function checkAndUpdate() {
            var deferred = $q.defer();

            // // 检查本地配置
            // if(!$localStorage.check_update) {
            //     var now = Math.floor(Date.now() / 1000);
            //     // 3天检查一次更新
            //     if($localStorage.last_check_update_time+86400*3>now) {
            //         deferred.resolve("跳过更新");
            //         return;
            //     }
            // }

            // 服务端检查
            check().then(function (version) {
                if (version.no > ENV.version) {
                    update(version).then(function (success) {
                        // $localStorage.check_update = true;
                        deferred.resolve("开始更新");
                    }, function (error) {
                        // $localStorage.check_update = false;
                        // $localStorage.last_check_update_time = Math.floor(Date.now() / 1000);
                        deferred.reject(error);
                    });
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;

        }

        /**
         * 跳转到商店
         */
        function gotoStore() {

            var url = '';

            if (ionic.Platform.platform() == 'Android') {
                url = 'market://details?id=me.growu.drip';
            } else if (ionic.Platform.platform() == 'iOS') {
                url = 'itms://itunes.apple.com/us/app/apple-store/id1017364870?mt=8';
            }

            var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'no'
            };

            Loading.showWaiting('正在跳转到商店...');

            document.addEventListener("deviceready", function () {
                $cordovaInAppBrowser.open(url, '_blank', options)
                    .then(function (event) {
                        // success
                        Loading.hide();
                    })
                    .catch(function (event) {
                        // error
                        $log.error('跳转失败');
                        $log.error(event);
                        Loading.hide();
                    });

                // $cordovaInAppBrowser.close();

            }, false);
        }

        /**
         * 资源更新
         */
        function checkResUpdate() {
            var fs = new CordovaPromiseFS({
                Promise: $q
            });
            // Initialize a CordovaAppLoader
            var loader = new CordovaAppLoader({
                fs: fs,
                serverRoot: ENV.downUrl,
                localRoot: 'app',
                cacheBuster: true, // make sure we're not downloading cached files.
                checkTimeout: 10000 // timeout for the "check" function - when you loose internet connection
            });

            function onProgress(ev) {
                Loading.showWaiting('正在下载资源包' + parseInt(ev.percentage * 100) + '%...');
            }

            loader.check().then(function (updateAvailable) {
                if (updateAvailable) {
                    loader.download(onProgress)
                        .then(function (manifest) {
                                Loading.showWaiting('正在覆盖旧的资源...');
                                loader.update();
                                Loading.show('更新成功');
                            },
                            function (error) {
                                $log.error("下载错误:", error);
                                Loading.show('资源下载失败,请检查网络配置重新尝试');
                            }
                        );
                } else {
                    $log.error("无更新内容");
                }
            });
        }

        return service;

    }

})();


