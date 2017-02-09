/**
 * Created by Jason.z on 2016/11/25.
 */

(function() {

    'use strict';

    angular
        .module('kd.comm')
        .directive('imageOnload', imageOnload);

    function imageOnload () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('load', function () {
                    //call the function that was passed
                    scope.$apply(attrs.imageOnload);
                });
            }
        };
    }

})();
