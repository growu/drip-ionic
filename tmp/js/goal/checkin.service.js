
(function() {
    'use strict';

    angular
        .module('kd.goal')
        .factory('Checkin', Checkin);

       	function Checkin($http, $q,$ionicLoading,$log, $state,ENV,Loading) {
	    return {
	        doCheckin: function(checkin) {
	            var deferred = $q.defer();
	            $http.post(ENV.apiUrl + 'checkin/create', checkin)
	                .success(function(response) {
	                	console.log(response);
	                    if (data.status) {
	                        deferred.resolve(response.data);
	                    } else {
							Loading.show(response.message);
	                        deferred.reject(response.message);
	                    }
	                }).error(function(error) {
	                    deferred.reject(error);
	                });
	            return deferred.promise;
	        },
	        getInfo:function(checkinId) {
	            var deferred = $q.defer();

	            $http.get(ENV.apiUrl + 'checkin/info?checkin_id='+checkinId)
	                .success(function(data) {
	                    if (data.code ===  0) {
	                        deferred.resolve(data.data);
	                    } else {
	                        deferred.reject(data);
	                    }
	                }).error(function(data) {
	                    deferred.reject(data);
	                });
	            return deferred.promise;
	        },
	        getComments:function(checkinId) {
	            var deferred = $q.defer();

	            $http.get(ENV.apiUrl + 'checkin/comments?checkin_id='+checkinId)
	                .success(function(data) {
	                    if (data.code ===  0) {
	                        deferred.resolve(data.data);
	                    } else {
	                        deferred.reject(data);
	                    }
	                }).error(function(data) {
	                    deferred.reject(data);
	                });
	            return deferred.promise;
	        },
	        doComment: function(checkinId, content) {
	            var deferred = $q.defer();

	            $http.post(ENV.apiUrl + 'checkin/comment', {
	                    checkin_id: checkinId,
	                    content: content
	                })
	                .success(function(data) {
	                    if (data.code ===  0) {
	                        deferred.resolve(data.data);
	                    } else {
	                        deferred.reject(data);
	                    }
	                }).error(function(error) {
	                    deferred.reject(error);
	                });
	            return deferred.promise;
	        },
	        doLike: function(checkinId) {
	            var deferred = $q.defer();

	            $http.post(ENV.apiUrl + 'checkin/like', {
	                    checkin_id: checkinId,
	                })
	                .success(function(data) {
	                    if (data.code ===  0) {
	                        deferred.resolve(data.data);
	                    } else {
	                        deferred.reject(data);
	                    }
	                }).error(function(data) {
	                    $ionicLoading.show({
	                        template: data.msg,
	                        noBackdrop: true,
	                        duration: 2000
	                    });
	                    deferred.reject(data);
	                });
	            return deferred.promise;
	        },
	        showMore:function(checkinId){
	        	$ionicActionSheet.show({
		            buttons: [
		                { text: '分享' }
		            ],
		            destructiveText: '',
		            titleText: '更多设置',
		            cancelText: '取消',
		            cancel: function() {
		                return true;
		            },
		            buttonClicked: function(index) {
		                if(index === 0) {
		                	$state.go('checkinshare',{checkinId:checkinId});
		                }
		                return true;
		            }
        		});
	        }
	    };

        }

})();
