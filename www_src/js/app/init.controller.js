(function() {

    'use strict';

    angular
        .module('drip.app')
        .controller('InitController', InitController);  

        function InitController($state,$log,$localStorage,Auth) {

         	var vm = this;


			if($localStorage.is_guide) {
				startApp();
			}

         	vm.startApp = function() {
         		if(!$localStorage.is_guide) {
					$localStorage.is_guide = true;
				}
				startApp();
			};

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