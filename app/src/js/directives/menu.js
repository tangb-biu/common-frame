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
                	<li ng-repeat="header in cacheData" ng-click="handleState(header)">\
                		<a>\
                		{{header.label}}\
                		</a>\
                	</li>\
                </ul>',
		replace: true,
		transclude: true,
		scope: {
			//hierarchy: '@', // number 0,1,2,3... 
			nextData: '='
		},
		compile: function(tElement, tAttrs, transclude) {
			return function(scope, iElement, iAttrs) {
				// if('undefined' === typeof scope.hierarchy) {
				// 	throw new Error('Missing attribute hierarchy!');
				// }

				scope.cacheData = '';

				var deepCopy= function(source) { 
					var result={};
					if(source['childrenState']) {
						result['childrenState'] = source['childrenState'];
					}
					for (var key in source) {
					    result[key] = typeof source[key]==='object'? deepCopy(source[key]): source[key];
					}
					return result; 
				}
				//scope.cacheData = deepCopy(scope.nextData);

				scope.handleState = function(header) {
					scope.nextData = header;
				}

				scope.nextData && (scope.cacheData = deepCopy(scope.nextData));
				scope.$watch('nextData', function(newVal, oldVal, scope){
					if(!scope.cacheData && newVal) {
						scope.cacheData = deepCopy(newVal);
						for(var i in newVal) {
							if(newVal[i]['key'] == 0) {
								//scope.nextData = newVal[i];
								for(var i in newVal) {
									if(newVal[i]['key'] == 0) {
										scope.nextData = newVal[i];
										console.log(scope.nextData)
									}
								}
							}
						}
					}
					if(scope.cacheData && scope.cacheData['childrenState'] && newVal && newVal['childrenState']) {
						if(scope.cacheData['childrenState'].toString().indexOf(newVal['childrenState'].toString())>-1) {

						} else {
							scope.cacheData = deepCopy(scope.nextData);
						}
					}

					// for(var i in newVal) {
					// 			if(newVal[i]['key'] == 0) {
					// 				scope.nextData = newVal[i];
					// 				console.log(scope.nextData)
					// 			}
					// 		}
				}, true)

			}
		}
	}
})
