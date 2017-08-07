(function() {

    'use strict';

    angular
        .module('drip.app')
        .controller('InitController', InitController);  

        function InitController($state,$log,$localStorage,$timeout,Auth) {

         	var vm = this;

			$timeout(function(){
				startApp();
			},3000);

			vm.currentDate = moment().format('LL');
			vm.currentWeek = moment().format('dddd');

			vm.diffDays = 1;

			if($localStorage.user) {
				console.log($localStorage.user.reg_time);
				console.log(moment().unix());
				vm.diffDays = Math.ceil((moment().unix() - $localStorage.user.reg_time)/(60*60*24))+1;
			}

			// if($localStorage.is_guide) {
			// 	startApp();
			// }

         	// vm.startApp = function() {
         	// 	if(!$localStorage.is_guide) {
			// 		$localStorage.is_guide = true;
			// 	}
			// 	startApp();
			// };

		    function startApp() {
                $log.debug("开始检查是否登录...");
		        if(Auth.isLogin()){
                    $log.debug("已登录，跳转至首页");
		            $state.go('app.home');
		        } else {
					$state.go('login');
				}
		    }

    	}
})(); 