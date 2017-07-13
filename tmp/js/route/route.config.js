/**
 * Created by Jason.z on 2016/12/18.
 */

(function() {
    'use strict';

    angular
        .module('drip.route')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider.state('init', {
            url: '/',
            templateUrl: 'templates/init.html',
            controller: 'InitController as init'
        }).state('bind', {
            url: '/bind',
            templateUrl: 'templates/bind.html',
            controller: 'BindController as bind'
        }).state('find', {
            url: '/find',
            templateUrl: 'templates/find.html',
            controller: 'FindController as find'
        }).state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController as login',
            resolve:{
                isQQInstalled:function(OAuth){
                    return OAuth.isQQInstalled();
                },
                isWeiboInstalled:function(OAuth){
                    return OAuth.isWeiboInstalled();
                }
                // isXiaomiChannel:function(Comm){
                //     return Comm.isXiaoMiChannel();
                // }
            }
        }).state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'RegisterController as register',
            resolve:{
                isQQInstalled:function(OAuth){
                    return OAuth.isQQInstalled();
                },
                isWeiboInstalled:function(OAuth){
                    return OAuth.isWeiboInstalled();
                }
                // isXiaomiChannel:function(Comm){
                //     return Comm.isXiaoMiChannel();
                // }
            }
        }).state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/app.html",
            controller: 'AppController as app'
        }).state('app.home', {
            url: "/home",
            views: {
                'home-tab': {
                    templateUrl: "templates/home.html",
                    controller: 'HomeController as home',
                    resolve:{
                        goals:function(User){
                            return User.getGoals().then(function(goals){
                                return goals;
                            },function(error){
                                return [];
                            });
                        }
                    }
                }
            }
        }).state('app.explore', {
            url: "/explore",
            views: {
                'explore-tab': {
                    templateUrl: "templates/explore.html",
                    controller: 'ExploreController as explore'
                }
            }
        }).state('app.top', {
            url: "/top",
            views: {
                'top-tab': {
                    templateUrl: "templates/top.html",
                    controller: 'TopController as top',
                }
            }
        }).state('app.my', {
            url: "/my",
            views: {
                'my-tab': {
                    templateUrl: "templates/my.html",
                    controller: 'MyController as my'
                }
            }
        }).state('goalevent', {
            url: "/goal/event/:goalId",
            templateUrl: 'templates/goal_event.html',
            controller: 'GoalEventCtrl'
        }).state('goallog', {
            url: "/goal/log/:goalId",
            templateUrl: 'templates/goal_log.html',
            controller: 'GoalLogCtrl'
        }).state('goalsearch', {
            url: '/goal/search',
            templateUrl: 'templates/goal_search.html',
            controller: 'GoalSearchController as goalsearch',
        }).state('goalhome', {
            url: '/goal/:goalId/home',
            templateUrl: 'templates/goal_home.html',
            controller: 'GoalHomeController as goalhome',
        }).state('goaladd', {
            url: '/goal/add',
            templateUrl: 'templates/goal_add.html',
            controller: 'GoalAddController as goaladd',
            cache:false
        }).state('goaledit', {
            url: '/goal/:goalId/edit',
            templateUrl: 'templates/goal_edit.html',
            controller: 'GoalEditController as goaledit'
        }).state('goalview', {
            url: '/goal/:goalId',
            templateUrl: 'templates/goal_view.html',
            controller: 'GoalViewController as goalview',
            resolve:{
                goal:function($stateParams,User){
                    var goalId = $stateParams.goalId;
                    console.log(goalId);
                    return User.getGoal(goalId).then(function(goal){
                        return goal;
                    },function(error){
                        return {};
                    });
                }
            }
        }).state('goalsetting', {
            url: "/goal/:goalId/setting",
            templateUrl: "templates/goal_setting.html",
            controller: 'GoalSettingController as goalsetting',
            resolve:{
                goal:function($stateParams,User){
                    var goalId = $stateParams.goalId;
                    console.log(goalId);
                    return User.getGoal(goalId).then(function(goal){
                        return goal;
                    },function(error){
                        return {};
                    });
                }
            }
        }).state('goalcalendar', {
            url: "/goal/:goalId/calendar",
            templateUrl: "templates/goal_calendar.html",
            controller: 'GoalCalendarController as goalcalendar'
        }).state('goaldata', {
            url: "/goal/:goalId/data",
            templateUrl: "templates/goal_data.html",
            controller: 'GoalDataController as goaldata'
        }).state('goaltop', {
            url: "/goal/top/:goalId",
            templateUrl: "templates/goal_top.html",
            controller: 'GoalTopCtrl'
        }).state('checkinadd', {
            url: '/checkin/add/:goalId',
            templateUrl: 'templates/checkin_add.html',
            controller: 'CheckinAddController as checkinadd',
            resolve:{
                goal:function($stateParams,User){
                    var goalId = $stateParams.goalId;
                    console.log(goalId);
                    return User.getGoal(goalId).then(function(goal){
                        return goal;
                    },function(error){
                        return {};
                    });
                }
            }
        }).state('eventinfo', {
            url: "/event/:eventId",
            templateUrl: "templates/event_info.html",
            controller: 'EventInfoController as eventinfo'
        }).state('eventlike', {
            url: "/event/:eventId/like",
            templateUrl: "templates/event_like.html",
            controller: 'EventLikeController as eventlike'
        }).state('eventshare', {
            url: "/event/:eventId/share",
            templateUrl: "templates/event_share.html",
            controller: 'EventShareController as eventshare',
            cache:false
        }).state('userhome', {
            url: "/user/:userId",
            templateUrl: 'templates/user_home.html',
            controller: 'UserHomeController as userhome'
        }).state('userlevel', {
            url: "/user/:userId/level",
            templateUrl: 'templates/user_level.html',
            controller: 'UserLevelController as userlevel'
        }).state('userfans', {
            url: "/user/:userId/fans",
            templateUrl: 'templates/user_fans.html',
            controller: 'UserFansController as userfans'
        }).state('userfollow', {
            url: "/user/:userId/follow",
            templateUrl: 'templates/user_follow.html',
            controller: 'UserFollowController as userfollow'
        }).state('usergoals', {
            url: "/user/:userId/goals",
            templateUrl: 'templates/user_goals.html',
            controller: 'UserGoalsController as usergoals'
        }).state('userenergy', {
            url: "/user/:userId/energy",
            templateUrl: 'templates/user_energy.html',
            controller: 'UserEnergyController as userenergy'
        }).state('setting', {
            url: "/setting",
            templateUrl: "templates/setting.html",
            controller: 'SettingController as setting'
        }).state('profile', {
            url: "/profile",
            templateUrl: "templates/profile.html",
            controller: 'ProfileController as profile'
        }).state('feedback', {
            url: "/feedback",
            templateUrl: "templates/feedback.html",
            controller: 'FeedbackController as feedback'
        }).state('about', {
            url: "/about",
            templateUrl: "templates/about.html",
            controller: 'SettingController as setting'
        }).state('version', {
            url: "/version",
            templateUrl: "templates/version.html",
            controller: 'VersionCtrl'
        }).state('message', {
            url: "/message",
            templateUrl: "templates/message.html",
            controller: 'MessageController as message'
        }).state('messagelike', {
            url: "/message/like",
            templateUrl: "templates/message_like.html",
            controller: 'MessageLikeController as messagelike'
        }).state('messagenotice', {
            url: "/message/notice",
            templateUrl: "templates/message_notice.html",
            controller: 'MessageNoticeController as messagenotice'
        }).state('messagecomment', {
            url: "/message/comment",
            templateUrl: "templates/message_comment.html",
            controller: 'MessageCommentController as messagecomment'
        }).state('messagefan', {
            url: "/message/fan",
            templateUrl: "templates/message_fan.html",
            controller: 'MessageFanController as messagefan'
        }).state('topic', {
            url: "/topic/:topicName",
            templateUrl: "templates/topic.html",
            controller: 'TopicController as topic'
        }).state('mall', {
            url: "/mall",
            templateUrl: "templates/mall.html",
            controller: 'MallController as mall'
        }).state('goodview', {
            url: "/good/:goodId",
            templateUrl: "templates/good_view.html",
            controller: 'GoodViewController as goodview'
        }).state('donate', {
            url: "/donate",
            templateUrl: "templates/donate.html",
        });

        $urlRouterProvider.otherwise('/');

    }


})();

