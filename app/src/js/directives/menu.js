'use strict';

/**
 * @ngdoc function
 * @name myappApp.directive:menuDirective
 * @description
 * # menuDirective
 * directive of the myappApp
 * author: tangb
 */

 angular.module('myappApp')
.directive('menuDirective', function() {
	return {
		restrict: "EAC",
		template: '<ul class="nav navbar-nav navbar-left">\
                	<li ng-repeat="header in routers" ng-click="handleState(header)">\
                		<a>\
                		{{header.label}}\
                		</a>\
                	</li>\
                </ul>',
		replace: true,
		transclude: true,
		scope: {
			//hierarchy: '@', // number 0,1,2,3... 
			routers: '='
		},
		compile: function(tElement, tAttrs, transclude) {
			return function(scope, iElement, iAttrs) {
				// if('undefined' === typeof scope.hierarchy) {
				// 	throw new Error('Missing attribute hierarchy!');
				// }

			}
		}
	}
})
