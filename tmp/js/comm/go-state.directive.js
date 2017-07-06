/**
 * Created by Jason.z on 2016/11/2.
 */
(function() {

    'use strict';

    angular
        .module('kd.comm')
        .directive('goState', goState);

    function goState () {
        return {
            restrict: 'A',
            scope:{
              goState:'='
            },
            controller:function($state,$element,$scope){
                var obj;
                var vm = this;
                $scope.$watch(function(){
                    return vm.goState;
                } , function(value){
                    obj = value;
                });

                $element.bind('click', function(event) {
                    if(obj.params&&obj.state) {
                        event.stopPropagation();
                        event.preventDefault();
                        $state.go(obj.state,obj.params);
                    }
                });
            },
            controllerAs: 'vm',
            bindToController: true,
        };

    }

})();