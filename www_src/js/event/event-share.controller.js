/**
 * Created by Jason.z on 2016/11/24.
 */

(function () {

    'use strict';

    angular
        .module('kd.event')
        .controller('EventShareController', EventShareController);

    function EventShareController(Event, $q, Loading, $log, $ionicScrollDelegate, $cordovaSocialSharing, $timeout, $stateParams, ENV) {
        var vm = this;
        vm.image = {};
        vm.event = {};

        var shareImags = [];
        var shareTitle = "打卡动态";
        var shareMessage = "#微打卡# ";
        var shareLink = ENV.homeUrl;

        var eventId = $stateParams.eventId;
        vm.resUrl = ENV.resUrl;
        // var source = document.getElementById('content');
        var source = angular.element('#content');

        Event.getInfo(eventId).then(function (data) {
            vm.event = data;
            shareLink = shareLink + '/event/' + vm.event.event_id;
            shareMessage = "#微打卡# " + vm.event.goal.goal_name + "第" + vm.event.checkin.total_days + "天:" + delHtmlTag(vm.event.checkin.checkin_content) + ',' + shareLink;
        });

        function delHtmlTag(str) {
            var title = str.replace(/<[^>]+>/g, "");//去掉所有的html标记
            if (title.length > 500) {
                title = title.substring(0, 50);
            }
            return title;
        }

        function screen() {
            $ionicScrollDelegate.scrollTo(0, 0, false);

            var w = source.outerWidth();
            var h = source.outerHeight();

            source.css('position', "absolute");
            source.css('top', '-44px');
            source.css('left', 0);
            source.css('right', 0);

            var canvasDom = document.createElement("canvas");
            canvasDom.width = w * 2;
            canvasDom.height = h * 2;
            canvasDom.style.width = w + "px";
            canvasDom.style.height = h + "px";
            var context = canvasDom.getContext("2d");
            // 然后将画布缩放，将图像放大两倍画到画布上
            context.scale(2, 2);

            console.log(source.outerHeight());
            var deferred = $q.defer();

            if (shareImags.length == 0) {
                Loading.showWaiting("正在生成分享图片，请稍候...");
                $timeout(function () {
                    html2canvas(source, {
                        logging: true,
                        canvas: canvasDom,
                        allowTaint: false,
                        type: 'view',
                        proxy: ENV.resUrl + 'images/html2canvasproxy.php',
                        height: source.outerHeight(),
                        // width:source.outerWidth()
                    }).then(function (canvas) {
                        Loading.hide();
                        var img = new Image();
                        img.src = canvas.toDataURL("image/png");
                        vm.image = canvas.toDataURL("image/png");
                        console.log(vm.image);
                        img.onload = function () {
                            img.onload = null;
                            img.style.width = w + "px";
                            img.style.height = h + "px";
                            document.getElementById('result').appendChild(img);
                            source.hide();
                            Loading.show("生成成功，现在可以分享啦！");
                            shareImags[0] = vm.image;
                            deferred.resolve(vm.image);
                        };
                        img.onerror = function (err) {
                            img.onerror = null;
                            Loading.show("生成失败，请重新进入该页面！");
                            deferred.reject(err);
                        };

                    }, function (error) {
                        deferred.reject(error);
                    });
                }, 2000);

            } else {
                deferred.resolve(shareImags[0]);
            }

            return deferred.promise;
        }

        vm.shareToQQ = function () {

            screen().then(function (image) {
                var args = {};
                args.url = shareLink;
                args.title = shareTitle;
                args.description = shareMessage;
                args.imageUrl = shareImags;
                YCQQ.shareToQQ(function () {
                    $log.debug("QQ分享成功");
                }, function (failReason) {
                    $log.error("QQ分享失败");
                    $log.error(failReason);
                }, args);
            }, function (err) {

            });


        };

        vm.shareToQZone = function () {

            screen().then(function (image) {
                var args = {};
                args.url = shareLink;
                args.title = shareTitle;
                args.description = shareMessage;
                args.imageUrl = shareImags;
                YCQQ.shareToQZone(function () {
                    $log.debug("QQ空间分享成功");
                }, function (failReason) {
                    $log.error("QQ空间分享失败");
                    $log.error(failReason);
                }, args);
            }, function (err) {

            });


        };

        vm.shareToWeibo = function () {
            var weibo = 'com.sina.weibo';

            screen().then(function (image) {
                window.weibo.share({
                    type: 'image',
                    data: vm.image,
                    text: shareMessage
                }, function (err) {
                    $log.error(err);
                });
            }, function (err) {

            });

        };

        vm.shareToMore = function () {
            screen().then(function (image) {
                $cordovaSocialSharing
                    .share(shareMessage, shareTitle, shareImags, shareLink) // Share via native share sheet
                    .then(function (result) {
                        Loading.show("分享成功");
                        $log.debug(result);
                    }, function (err) {
                        Loading.show("分享失败，请重试");
                        $log.error(err);
                    });
            }, function (err) {

            });

        };

        vm.shareToWechat = function (type) {
            screen().then(function (image) {
                Wechat.isInstalled(function (installed) {
                    // alert("Wechat installed: " + (installed ? "Yes" : "No"));
                    var scene = Wechat.Scene.TIMELINE;
                    if (type === 0) {
                        scene = Wechat.Scene.WXSceneSession;
                    }

                    Wechat.share({
                        message: {
                            title: shareTitle,
                            description: shareMessage,
                            thumb: vm.image,
                            mediaTagName: "checkin share",
                            messageExt: "",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.IMAGE,
                                image: vm.image
                            }
                        },
                        scene: type   // share to Timeline
                    }, function (res) {
                        $ionicLoading.show({template: '分享成功', noBackdrop: true, duration: 2000});
                        $log.debug("微信分享成功");
                    }, function (reason) {
                        $log.error("微信分享失败");
                        $log.error(reason);
                    });
                }, function (reason) {
                    Loading.show("未安装微信客户端");
                });

            }, function (err) {

            });
        };
    }
})();