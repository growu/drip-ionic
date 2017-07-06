/**
 * Created by Jason.z on 2016/10/26.
 */
(function() {

    'use strict';

    angular
        .module('kd.event')
        .directive('eventContent', eventContent);

    function eventContent () {
        return {
            restrict: 'E',
            scope: {
                content:'@',
            },
            controller:EventContentController,
            controllerAs: 'eventcontent',
            bindToController: true,
        };

    }

    angular
        .module('kd.event')
        .controller('EventContentController', EventContentController);
    function EventContentController($scope,$compile,$element) {
        var vm = this;
        var content = vm.content;
        var isShow = false;

        // 网页链接替换
        // var linkPattern = /(https?:\/\/[^\s]+)/g;
            var linkPattern = /\b((http:\/\/|https:\/\/|ftp:\/\/|mailto:|news:)|www\.|ftp\.|[^ \,\;\:\!\)\(\""\'<>\f\n\r\t\v]+@)([^ \,\;\:\!\)\(\""\'<>\f\n\r\t\v]+)\b/gim;
            content = content.replace(linkPattern, function ($0, $1) {
                var match = $0;
                return "<a href='" + match + "' target='_blank' class='positive'><i class='ion-link'></i>网页链接</a>";
            });

            var topicPattern = /\#([^\#|.]+)\#/g;

            content = content.replace(topicPattern, function ($0, $1) {
                var match = $0;
                var protocol = $1;
                return "<a href='#/topic/" + protocol + "' class='positive'>"+match+"</a>";
            });

            var atPattern = /\@([^\@|.|<|,|:|：|^ ]+)/g;
            // var atPattern = /\@([^<,，：:\s@]+)/g;

            content = content.replace(atPattern, function ($0, $1) {
                var match = $0;
                var protocol = $1;
                return "<a href='#/user/nickname/" + protocol + "' class='positive'>"+match+"</a>";
            });



        if(content.length > 100) {
            isShow = true;
            vm.content1 =  content.substr(0, 100)+'...<a style=\"color:#0c9\" ng-click="eventcontent.hideMore($event)"> 显示全文</a>';
        } else {
            vm.content1 = content;
        }


        vm.showMore = function ($event){
            $event.preventDefault();
            $event.stopPropagation();
            if(isShow) {
                vm.content1 =  content.substr(0, 100)+'...<a href="#" style="color:#0c9" ng-click="eventcontent.hideMore($event)">全文</a>';
            }
        };

        vm.hideMore = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            if(isShow) {
                vm.content1 =  content+'<a href="#" style="color:#0c9" ng-click="eventcontent.showMore($event)"> 收起全部</a>';
            }
        };

        $scope.$watch(function(){
                return vm.content1;
            },
            function (value) {
                var ele = $compile('<p>'+value+'</p>')($scope);
                $element.html(ele);
            }
        );
    }


})();