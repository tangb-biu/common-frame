'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:MainCtrl
 * @description
 * # 用户登录 LoginCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
  	.controller('MainCtrl', ['configHeader', '$scope', '$rootScope', '$location','$cookieStore','$state','urlPrefix','AjaxServer',function(header, $scope, $rootScope, $location, $cookieStore,$state,urlPrefix,AjaxServer){
        // header的品配置信息可以通过header访问
        console.log(header)

  	}]);
