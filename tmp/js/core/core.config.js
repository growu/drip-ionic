/**
 * Created by Jason_z on 2016/12/17.
 */

(function () {
    'use strict';

    angular
        .module('kd.core')
        .config(coreConfig);

    function coreConfig( $controllerProvider, $compileProvider, $filterProvider, $provide, $animateProvider, $logProvider, $localStorageProvider, $translateProvider) {

        var core = angular.module('kd.core');
        // registering components after bootstrap
        core.controller = $controllerProvider.register;
        core.directive = $compileProvider.directive;
        core.filter = $filterProvider.register;
        core.factory = $provide.factory;
        core.service = $provide.service;
        core.constant = $provide.constant;
        core.value = $provide.value;



        // Disables animation on items with class .ng-no-animation
        $animateProvider.classNameFilter(/^((?!(ng-no-animation)).)*$/);

        $logProvider.debugEnabled(true);

        // $localStorageProvider.setKeyPrefix('wdk');

        $translateProvider.translations('zh-cn', {
            JANUARY: '一月',
            FEBRUARY: '二月',
            MARCH: '三曰',
            APRIL: '四月',
            MAI: '五月',
            JUNE: '六月',
            JULY: '七月',
            AUGUST: '八月',
            SEPTEMBER: '九月',
            OCTOBER: '十月',
            NOVEMBER: '十一月',
            DECEMBER: '十二月',

            SUNDAY: '日',
            MONDAY: '一',
            TUESDAY: '二',
            WEDNESDAY: '三',
            THURSDAY: '四',
            FRIDAY: '五',
            SATURDAY: '六'
        });
        $translateProvider.preferredLanguage('zh-cn');


    }
})();
