/**
 * Created by Jason.z on 2016/11/29.
 */

(function() {

    'use strict';

    angular
        .module('kd.mall')
            .controller('MallController', MallController);

    function MallController($http,ENV) {

        var vm = this;
        vm.goods = [];

        $http.get(ENV.apiUrl + 'good/hot').success(function(response) {
            if (response.status) {
                vm.goods = response.data;
            } else {
            }
        }).error(function(error) {
        });
    }

})();