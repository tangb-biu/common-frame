'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
	.controller('SideBarCtrl', ['configHeader', '$scope', '$rootScope', '$location','$cookieStore','$state','urlPrefix','AjaxServer', function(header, $scope, $rootScope, $location, $cookieStore,$state,urlPrefix,AjaxServer) {

		$scope.cache = {
			secondHeaderHrefs: [],
		}
		$scope.init = function() {
			$scope.setSecondHref(header);
			
		}

		//监听路由变化；
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			$scope.setSecondHref(header);
		})
		$scope.setSecondHref = function(header) {
            var _hrefs_ = [];
            var current_state = $location.path().split('/').slice(-1)[0];
            angular.forEach(header[current_state], function(item, index, objs) {
            	if(item.state) {
            		_hrefs_.push(item);
            	}
            });
            $scope.cache.secondHeaderHrefs = _hrefs_;
        }
	}])
