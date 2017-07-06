/**
 * Created by Jason_z on 2016/11/16.
 */

(function() {

    'use strict';

    angular
        .module('kd.topic')
        .controller('TopicController', TopicController);

    function TopicController($scope,$stateParams,$ionicScrollDelegate,$timeout,Topic,ENV) {

        var vm = this;
        vm.topic = {
            'follow_count':0
        };
        vm.events = [];
        vm.resUrl = ENV.resUrl;
        vm.currentIndex = 'new';
        vm.position = 0;
        vm.topicName = $stateParams.topicName;

        Topic.getInfo(vm.topicName).then(function(topic){
            if(topic) {
                vm.topic = topic;
            }
        },function(error){
        });

        vm.onTabSelected = function(type) {
            vm.currentIndex = type;
            vm.events = [];
            getEvents(0);
        };

        vm.showMore =  function(eventId) {
            Event.showMore(eventId);
        };

        vm.doRefresh = function() {
            getEvents(0);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };

        vm.loadMore = function() {
            var num = 0;
            if(vm.events) {
                num = vm.events.length;
            }
            if (num > 0 && num % 20 === 0) {
                getEvents(num);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        function getEvents(offset) {

            $scope.$watch(function(){
                    return vm.topic;
                },
                function (topic) {
                   if(topic.id) {
                       Topic.getEvents(vm.topic.id,offset,vm.currentIndex).then(function(data){
                           if(offset === 0) {
                               vm.events = data;
                           } else {
                               vm.events = vm.events.concat(data);
                           }
                       },function(error){

                       });
                   }
                }
            );
        }

        vm.getScrollPosition = function() {
            $timeout(function () {
                vm.position = $ionicScrollDelegate.getScrollPosition().top;
            });
            console.log(vm.position);
        };
    }

})();
