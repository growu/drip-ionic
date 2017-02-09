/**
 * Created by tuo3 on 16/10/21.
 */
(function() {

    'use strict';

    angular
        .module('kd.user')
        .controller('UserLevelController', UserLevelController);

    function UserLevelController($http,$stateParams,ENV) {

        var vm = this;

        var userId = $stateParams.userId;

        var names = ['无','卡渣','卡弱','卡民','卡霸','卡尊','卡圣','卡神','卡帝'];

        vm.levels = [0,0,0,0,0,0,0,0,0];

        vm.level = '无';
        vm.rank = 0;
        vm.count = 0;

        $http.get(ENV.apiUrl + 'user/level?user_id='+userId)
            .success(function(response) {
                if (response.status) {
                    vm.levels = response.data.levels;
                    vm.level = names[response.data.level];
                    vm.count = response.data.count;
                    vm.rank = response.data.rank;

                }
                else {
                }
            }).error(function(data) {

        });


    }

})();