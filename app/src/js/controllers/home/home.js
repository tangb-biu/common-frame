'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
  	.controller('HomeCtrl', function ($scope, $rootScope, $http, $timeout, $interval, AjaxServer, urlPrefix) {
		$scope.cache = {
        
        };
  		$scope.init = function () {
            
  		}

  		$scope.apply = function() {
			if(!$scope.$$phase) {
			    $scope.$apply();
			}
		}
  	});
