/**
 * Created by Jason.z on 2016/10/31.
 */

(function() {

    'use strict';

    angular
        .module('drip.event')
        .directive('eventList', eventList);

    function eventList () {
        return {
            restrict: 'E',
            scope: {
                events:'=',
                onRefresh:'&',
                onInfinite:'&'
            },
            controller:EventListController,
            controllerAs: 'eventlist',
            bindToController: true,
            templateUrl: 'templates/event_list.html',
        };

    }

    angular
        .module('drip.event')
        .controller('EventListController', EventListController);
    function EventListController(Event,ENV) {
        var vm = this;

        vm.resUrl = ENV.resUrl;

        vm.showMore = function(eventId){
            Event.showMore(eventId);
        };

        vm.doLike = function(event) {

            var index = vm.events.indexOf(event);

            Event.doLike(event.event_id).then(function(response) {
                if (response == 'post') {
                    // $ionicLoading.show({template: "点赞成功",noBackdrop: true, duration: 2000});
                    vm.events[index].is_like = true;
                    vm.events[index].like_count++;
                } else if (response == 'cancle') {
                    // $ionicLoading.show({template: "取消点赞",noBackdrop: true, duration: 2000});
                    vm.events[index].is_like = false;
                    vm.events[index].like_count --;
                }
            }, function(error) {
                // $ionicLoading.show({
                //     template: "操作失败："+data.msg,
                //     noBackdrop: true,
                //     duration: 2000
                // });
            });
        };


    }


})();