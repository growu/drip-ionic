(function() {

    'use strict';

    angular
        .module('drip.explore')
        .controller('ExploreController', ExploreController);  

    function ExploreController($scope,Event,ENV) {

        var vm = this; 
        vm.events = [];
        vm.resUrl = ENV.resUrl;
        vm.currentIndex = 'hot';

        vm.onTabSelected = function(type) {
            vm.events = [];
            vm.currentIndex = type;
            getEvents(0);
        };

        vm.showMore =  function(eventId) {
            Event.showMore(eventId);
        };

        vm.doRefresh = function() {
            getEvents(0,false);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };

        vm.loadMore = function() {
            var num = vm.events.length;
            if (num > 0 && num % 20 === 0) {
                getEvents(num,false);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        function getEvents(offset,cache) {
            Event.getList(offset,vm.currentIndex,null,cache).then(function(events){
                if(offset === 0) {
                    vm.events = events;
                } else {
                    vm.events = vm.events.concat(events);
                }
            },function(error){

            });
        }
    }
    
})();