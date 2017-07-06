/**
 * Created by Jason.z on 2016/10/27.
 */

(function() {
    'use strict';

    angular
        .module('kd.comm')
        .factory('Loading', Loading);

    function Loading($ionicLoading) {

        var service = {
            show:show,
            showWaiting:showWaiting,
            hide:hide,
        };

        function show(content) {
            $ionicLoading.show({
                template: content || '数据加载中...',
                animation: 'fade-in',
                noBackdrop: true,
                duration: 2000
            });
        }

        function showWaiting(content) {
            $ionicLoading.show({
                template: '<ion-spinner icon="ios"></ion-spinner><br>'+content,
                noBackdrop: false,
            });
        }

        function hide() {
            $ionicLoading.hide();
        }

        return service;
    }

})();
