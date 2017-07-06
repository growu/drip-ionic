(function() {

    'use strict';

    angular
        .module('kd.user')
        .controller('UserHomeController', UserHomeController);  

    function UserHomeController($scope,$ionicPopover,$ionicHistory,$stateParams,$timeout,$ionicScrollDelegate,$localStorage,User,ENV,Event) {

        var vm = this; 

        var userId = $stateParams.userId;
		vm.resUrl = ENV.resUrl;
		vm.position = 0;

	    vm.isSelf = false;
		vm.isFollow = false;

		vm.level = '';

		var names = ['无','卡渣','卡弱','卡民','卡霸','卡尊','卡圣','卡神','卡帝'];

		if (userId ==  $localStorage.user.user_id) {
	        vm.isSelf = true;
		}

		User.getInfo(userId).then(function(data){
			vm.user = data;
			vm.isFollow = vm.user.is_follow;
			vm.level = names[data.level];
		});

		vm.goBack = goBack;

		function goBack(){
			$ionicHistory.goBack();
		}

		vm.getScrollPosition = function() {
			$timeout(function () {
				vm.position = $ionicScrollDelegate.getScrollPosition().top;
			});
		};

	    vm.events = [];

	    vm.getEvents = getEvents;

	    function getEvents(offset,cache) {
			Event.getList(offset,'new',userId,cache).then(function(data){
	            if (offset === 0) {
	                vm.events = data;
	            } else {
	                vm.events = vm.events.concat(data);
	            }
	        });
	    }

	    getEvents(0,true);

	    vm.doRefresh = function() {
	        getEvents(0,true);
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


		if(!vm.isSelf) {
			initPopover();
		}

		function initPopover() {
			$ionicPopover.fromTemplateUrl('templates/user_home_menu.html', {
				scope: $scope
			}).then(function(popover) {
				vm.popover = popover;
			});
		}

		vm.showMenu = function ($event) {
			vm.popover.show($event);
		};

		vm.hideMenu = function(){
			vm.popover.hide();
		};

		//Cleanup the popover when we're done with it!
		$scope.$on('$destroy', function() {
			vm.popover.remove();
		});

		// Execute action on hide popover
		$scope.$on('popover.hidden', function() {
			// Execute action
		});

		// Execute action on remove popover
		$scope.$on('popover.removed', function() {
			// Execute action
		});

		vm.report = function(){
			vm.hideMenu();
			User.doReport("user",userId).then(function(response){
			},function(error){

			});
		};

		vm.blacklist = function(){
			vm.hideMenu();
			User.blacklist(userId).then(function(response){
			},function(error){

			});
		};


		vm.doFollow = function(userId){
			User.doFollow(userId).then(function(){
				vm.isFollow = true;
				vm.user.fans_count ++;
			},function(error){

			});
		};

		vm.unFollow = function(userId){
			User.unFollow(userId).then(function(){
				vm.isFollow = false;
				vm.user.fans_count --;
			},function(error){

			});
		};

    }
    
})();