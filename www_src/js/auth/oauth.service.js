(function () {
    'use strict';

    angular
        .module('kd.auth')
        .factory('OAuth', OAuth);

    function OAuth($http, $localStorage, Loading, $log, $state, ENV) {

        var isCheckQQInstalled = 0;

        var service = {
            doWeiboLogin: doWeiboLogin,
            doQQLogin: doQQLogin,
            doXiaomiLogin: doXiaomiLogin,
            isWeiboInstalled: isWeiboInstalled,
            isQQInstalled: isQQInstalled,
        };

        return service;


        function doThirdLogin(provider, data) {
            // var loginData = {};
            data.provider = provider;
            data.device = ionic.Platform.device();
            data.push_id = $localStorage.push_id;

            Loading.showWaiting("登录中，请稍候...");

            $http.post(ENV.apiUrl + 'auth/oauth', data)
                .success(function (response, status, headers, config) {
                    if (response.status) {
                        var user = response.user;
                        $localStorage.user = user;
                        Loading.show("登录成功");
                        if (user.email) {
                            $localStorage.token = response.token;
                            $state.go('app.home');
                        } else {
                            $state.go('bind');
                        }
                    } else {
                        Loading.show("登录失败:" + response.message);
                    }
                })
                .error(function (error) {
                    Loading.show("API接口请求错误，请检查网络或重试");
                    $log.error(error);
                });
        }

        function isQQInstalled() {
            if (window.cordova && YCQQ) {
                $log.debug("QQ登录插件加载成功！");
                return YCQQ.checkClientInstalled(function () {
                    $log.debug("安装QQ客户端");
                    isCheckQQInstalled = 1;
                    return true;
                }, function () {
                    $log.debug("未安装QQ客户端");
                    return false;
                });
            } else {
                $log.debug("QQ登录插件未加载！");
                return false;
            }
        }

        function isWeiboInstalled() {
            // if(window.cordova&&YCWeibo){
            //     $log.debug("微博登录插件加载成功！");
            //     return true;
            // } else {
            //     $log.debug("微博登录插件未加载！");
            //     return false;
            // }
            if (window.cordova && window.weibo) {
                $log.debug("微博登录插件加载成功！");
                return true;
            } else {
                $log.debug("微博登录插件未加载！");
                return false;
            }
        }

        function doWeiboLogin() {
            if (isWeiboPluginLoaded) {
                // YCWeibo.ssoLogin(function (response) {
                window.weibo.login(function (response) {
                    $log.debug("微博登录成功", response);
                    // 获取用户信息
                    var url = "https://api.weibo.com/2/users/show.json?uid=" + response.uid + "&access_token=" + response.token;
                    $log.debug(url);
                    $http.get(url).success(function (data) {
                        $log.debug(data);
                        if (data.error_code) {
                            Loading.show('获取微博用户信息失败');
                        } else {
                            response.userid = response.uid;
                            response.access_token = response.token;
                            response = angular.extend(response, data);
                            doThirdLogin('weibo', response);
                        }
                    }).error(function (error) {
                        $log.error(error);
                        Loading.show("获取微博用户信息接口错误");
                    });

                }, function (reason) {
                    $log.error("微博登录失败", reason);
                });
            }
        }

        function doQQLogin() {
            YCQQ.ssoLogin(function (response) {
                $log.debug("QQ登录成功", response);
                Loading.showWaiting("正在获取用户信息...");

                // 获取用户信息
                var url = "https://graph.qq.com/user/get_user_info?access_token=" + response.access_token + "&oauth_consumer_key=1104758278&openid=" + response.userid;
                $log.debug(url);

                $http.get(url).success(function (data) {
                    $log.debug(data);
                    if (data.ret == 0) {
                        response = angular.extend(response, data);
                        doThirdLogin('qq', response);
                    } else {
                        Loading.show("获取用户信息失败" + data.msg);
                    }
                }).error(function (error) {
                    $log.error(error);
                    Loading.show("获取QQ用户接口错误");
                });

            }, function (error) {
                $log.error(error);
                if (error.user_cancelled == 'YES') {
                    Loading.show("登录取消");
                } else {
                    Loading.show("登录失败");
                }
            }, isCheckQQInstalled);
        }

        function doXiaomiLogin() {
            var data = {};

            $log.debug("小米SDK开始登录...");

            Xiaomi.getAccessToken(function (token) {
                data = token;
                $log.debug("获取token成功:");
                $log.error(token);

                Xiaomi.getOpenId(function (openID) {
                    $log.debug("获取openid成功:");
                    $log.error(openID);
                    data.openid = openID;

                    Xiaomi.getProfile(function (profile) {
                        $log.debug("获取profile成功:");
                        data = angular.extend(data, profile);

                        doThirdLogin('xiaomi', data);
                    }, function (error) {
                        $log.debug("获取profile失败:", error);
                    });
                }, function (error) {
                    $log.debug("获取openid失败:", error);
                });
            }, function (error) {
                $log.debug("获取token失败:", error);
            });
        }


    }

})();
