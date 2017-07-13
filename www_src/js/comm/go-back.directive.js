/**
 * Created by Jason.z on 2016/11/4.
 */
(function() {

    'use strict';

    angular
        .module('drip.comm')
        .directive('goBack', goBack);

    function goBack () {
        return {
            restrict: 'E',
            template:'<a class="button button-clear icon ion-ios-arrow-left" ng-click="vm.goBack()"></a>',
            controller:function($state,$element,$scope,$ionicHistory){
                var  vm = this;

                vm.goBack = function(){
                    if($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.home');
                    }
                };

            },
            controllerAs: 'vm',
            bindToController: true,
        };

    }




})();