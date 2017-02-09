/**
 * 通用服务
 * Created by Jason.z on 2016/12/14.
 */

(function () {
    'use strict';

    angular
        .module('kd.comm')
        .factory('Comm', Comm);

    function Comm($q,$log) {

        var service = {
            getUmengChannel: getUmengChannel,
            isXiaoMiChannel:isXiaoMiChannel
        };

        function getUmengChannel() {
            var deferred = $q.defer();

            if (ionic.Platform.isAndroid()) {
                if (cordova && cordova.plugins && cordova.plugins.AppConfig) {
                    cordova.plugins.AppConfig.fetch(['UMENG_CHANNEL'], function (result) {
                        deferred.resolve(result.UMENG_CHANNEL);
                    });
                }
            } else if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
                deferred.resolve("appstore");
            } else {
                deferred.resolve(null);
            }

            return deferred.promise;
        }

        function isXiaoMiChannel(){
            return getUmengChannel().then(function(channel){
                $log.debug(channel);
                if(channel == "xiaomi") {
                    return true;
                }
                return false;
            },function(error){
                return false;
            });
        }

        return service;


    }

})();

