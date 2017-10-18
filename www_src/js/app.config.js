/**
 * Created by Jason.z on 2016/12/19.
 */

(function () {
    'use strict';

    angular
        .module('drip')
        .config(appConfig);

    function appConfig($ionicConfigProvider, $compileProvider, $httpProvider) {

        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.tabs.position('bottom');

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|wxLocalResource|blob|cdvfile):|data:image\//);

        $httpProvider.interceptors.push(['$q', '$location', '$rootScope', '$localStorage', '$injector', '$log', function ($q, $location, $rootScope, $localStorage, $injector, $log) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    // $log.debug("开始请求");
                    return config;
                },
                // optional method
                'requestError': function (rejection) {
                    $log.error("请求错误");
                    return $q.reject(rejection);
                },
                response: function (response) {
                    // $log.debug("获取返回结果成功");
                    // $log.debug(response);
                    return response;
                },
                // optional method
                'responseError': function (rejection) {
                    $log.error("获取返回结果失败");
                    $log.error(rejection);
                    if (rejection.status === 400 || rejection.status === 401 || rejection.status === 403) {
                        $injector.get('Loading').show('token已过期,请重新登录');
                        delete $localStorage.token;
                        $location.path('/login');
                    } else {
                        $injector.get('Loading').show('接口请求错误，请检查网络或重试');
                    }
                    return $q.reject(rejection);
                }
            };
        }]);
    }
})();


