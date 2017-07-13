/**
 * Created by Jason.z on 2016/11/29.
 */

(function() {

    'use strict';

    angular
        .module('drip.mall')
        .controller('GoodViewController', GoodViewController);

    function GoodViewController($http,$sce,$stateParams,ENV) {

        var vm = this;
        vm.good = {};
        var goodId = $stateParams.goodId;

        $http.get(ENV.apiUrl + 'good/info?good_id='+goodId).success(function(response) {
            if (response.status) {
                vm.good = response.data;
                vm.good.content = $sce.trustAsHtml(response.data.content);
            } else {
            }
        }).error(function(error) {
        });
    }

})();