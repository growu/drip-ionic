/**
 * Created by Jason.z on 16/9/29.
 */

(function() {

    'use strict';

    angular
        .module('kd.setting')
        .controller('FeedbackController', FeedbackController);

    function FeedbackController($http,$state,$log,Loading,ENV,Upload) {

        var vm = this;

        vm.feedback = {
            'content':'',
            'attaches':[],
            'device':ionic.Platform.device(),
            'version':ENV.version
        };

        vm.doFeedback = function(){
            $http.post(ENV.apiUrl + 'user/feedback', vm.feedback).success(function(response) {
                $log.debug(response);
                if (response.status) {
                    Loading.show('感谢反馈,我们会在第一时间处理你的意见～');
                    $state.go('setting');
                } else {
                    $ionicLoading.show({
                        template: response.message,
                        noBackdrop: true,
                        duration: 2000
                    });
                }
            }).error(function(error) {
            });
        };

        vm.doUpload = function() {
            Upload.imageUpload().then(function(data){
                vm.feedback.attaches = [];
                vm.feedback.attaches.push(data);
            },function(error){

            });
        };

        vm.removeAttach = function() {
            vm.feedback.attaches = [];
        };


    }

})();
