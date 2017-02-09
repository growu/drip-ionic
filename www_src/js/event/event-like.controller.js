(function() {

    'use strict';

    angular
        .module('kd.event')
        .controller('EventLikeController', EventLikeController);  

    function EventLikeController($ionicHistory,$stateParams,Event) {
        var vm = this;
        vm.users = [];

        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        var eventId = $stateParams.eventId;
        vm.eventId = eventId;

        Event.getLikes(eventId).then(function(data){
            vm.users = data;
        });

    
    }
    
})(); 