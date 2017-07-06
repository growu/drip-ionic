(function () {

  /*** directive function ***/
  var directive = function ($ionicGesture, $ionicSlideBoxDelegate) {
    return {
    	restrict: 'AE',
    	scope: {
            headerSize : '@',
    		bgColor : '='
    	},
    	replace: false,
    	template:   function(e) {
					return '<ion-nav-bar class="bar" style="z-index: 1001;">'+
			        '<ion-nav-buttons side="left">'+
			          '<a class="button button-icon ion-arrow-left-c"></a>'+
			        '</ion-nav-buttons>'+
			        '<ion-nav-buttons side="right">'+
			          '<a class="button button-icon ion-android-more-vertical"></a>'+
			        '</ion-nav-buttons>'+
			      	'</ion-nav-bar>'+
			      	'<div style="position: absolute; top:0; width: 100%; z-index: 1000; overflow: hidden; height: {{headerSize}}px">'+e.html()+'</div>'
			      },
    	link: function($scope, $elem, $attrs) {
    		var vm = $scope;
            var header = $elem.find('ion-header-bar');
    		var minH = (header[0].offsetHeight) ? header[0].offsetHeight : 44;
            
    		var nav = $elem.find('ion-nav-bar');
    		var buttons = $elem.find('a');
            var bar = angular.element(document.querySelector("cover-header-parallax > .bar"));
            var cover = angular.element(document.querySelector("cover-header-parallax > div"));
            // var content = angular.element(document.querySelector("cover-header-parallax + ion-content"));
            var content = angular.element(document.querySelector("ion-view"));
            var rgb = (vm.bgColor) ? vm.bgColor : [0, 121, 107];
            var img = angular.element(document.querySelector("img"));
            var contentHeight = (content[0].offsetHeight);
            vm.headerSize = ($attrs.headerSize) ? $attrs.headerSize : 200;

            //Modify CSS Style for Header
            header.css('height', vm.headerSize + 'px');
            header.css('background-color', 'rgba('+rgb[0]+', '+rgb[1]+', '+rgb[2]+', 0)');
            header.css('border-bottom', '0px');
            header.css('background-size', '100% 0px');
            
            nav.css('background-color', 'rgba('+rgb[0]+', '+rgb[1]+', '+rgb[2]+', 0)');
            nav.css('border-bottom', '0px');
            nav.css('background-size', '100% 0px');

            //Animation on resize cover
            cover.css('-webkit-transition', 'opacity 1s ease-in-out');
            cover.css('-moz-transition', 'opacity 1s ease-in-out');
            cover.css('-o-transition', 'opacity 1s ease-in-out');
            cover.css('-ms-transition', 'opacity 1s ease-in-out');
            cover.css('transition', 'opacity 1s ease-in-out');

            header.css('transition', 'opacity 3s ease-in-out');

            buttons.css('color', '#fff');
            buttons[buttons.length-1].style = "color: #fff; margin: 2px 15px;";

            content.css('height', (contentHeight+parseInt(vm.headerSize))+'px');
            // content.css('top', vm.headerSize + 'px');
            content.css('top', '0px');
            //on gesture for slide-box
            $ionicGesture.on('swiperight', function(e){
                $ionicSlideBoxDelegate.previous();
            }, $elem);

            $ionicGesture.on('swipeleft', function(e){
                $ionicSlideBoxDelegate.next();
            }, $elem);

            //on scroll change
            content.bind('scroll', function (e) {
                var raw = content[0];
                var newHeight = vm.headerSize;
                var scrollTop = 0;
                var opacity = 0;

                if(e.detail){
                  scrollTop = e.detail.scrollTop;
                }else if(e.target){
                  scrollTop = e.target.scrollTop;
                }
                
                newHeight -= scrollTop;

                newHeight = (newHeight > minH) ? newHeight : minH;
                
                content.css('z-index', '1010');
                content.css('background', '#fff');
                
                content.css('transform', 'translateY('+(newHeight-vm.headerSize)+'px)');

                header.css('height', (newHeight) + 'px');

                //calculate new opacity
                if(scrollTop > 20)
                    opacity = (minH/newHeight);
                else
                    opacity = 0;

                //set new background opacity on Header
                header.css('background-color', 'rgba('+rgb[0]+', '+rgb[1]+', '+rgb[2]+', '+opacity+')');
            });
    	}
    };
  };

  /*** Inject Dependencies ***/
  directive.$inject = ['$ionicGesture', '$ionicSlideBoxDelegate'];

  angular.module('rpCoverHeader', [])
    .directive('coverHeaderParallax', directive);


}());