(function () {

    'use strict';

    angular
        .module('kd.event')
        .controller('EventInfoController', EventInfoController);

    function EventInfoController($stateParams,$timeout, User, ENV, Event,Comment,$ionicActionSheet) {
        var vm = this;
        vm.event = {};
        vm.comment = {
            content:'',
            parent:null
        };
        vm.resUrl = ENV.resUrl;

        vm.reply = {
            user_id:'',
            nickname:''
        };

        var eventId = $stateParams.eventId;

        Event.getInfo(eventId).then(function (data) {
            vm.event = data;
        });

        vm.doComment = function () {
            Event.doComment(eventId, vm.comment).then(function (data) {
                console.log("comment success");
                vm.event.comments.splice(0, 0, data);
                vm.event.comment_count += 1;
            });
        };

        function reply(comment) {
            vm.comment.parent = comment;
            var input =  angular.element("#reply-input");
            var nickname = comment.user.nickname.length>0?comment.user.nickname:'keeper'+comment.user_id;
            input.attr('placeholder','回复'+nickname);
            if(window.cordova&&window.cordova.plugins.Keyboard) {
                $timeout(function(){
                    cordova.plugins.Keyboard.disableScroll(true);
                    cordova.plugins.Keyboard.show();
                },1000);

            } else {
                input.focus();
            }
        }

        vm.doReply = function (comment,$event) {
            $event.stopPropagation();
            $event.preventDefault();
            reply(comment);
        };

        vm.clearReplay = function() {
            vm.reply = {
                user_id:'',
                nickname:''
            };
        };

        vm.showCommentMenu = function (comment,$event) {
            $ionicActionSheet.show({
                buttons: [
                    {text: '回复'},
                    {text: '举报'},
                ],
                destructiveText: '',
                titleText: '更多操作',
                cancelText: '取消',
                cancel: function () {
                    return true;
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        reply(comment);
                    }
                    if (index == 1) {
                        User.doReport('comment', comment.comment_id).then(function (response) {
                        }, function (error) {

                        });
                    }
                    return true;
                }
            });

            window.addEventListener('native.keyboardhide', function (e){
               if(vm.comment.content.length == 0) {
                   vm.comment.parent = null;
               }
            });

            vm.doLike = function(comment,$event) {
                $event.stopPropagation();
                $event.preventDefault();

                Comment.doLike(comment).then(function(response){
                    comment.is_like = response.is_like;
                    if(response.is_like) {
                        comment.like_count ++;
                    } else {
                        comment.like_count --;
                    }
                },function(error){

                });
            };

        };

    }

})(); 