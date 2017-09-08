'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:LoginCtrl
 * @description
 * # 用户登录 LoginCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
  	.controller('LoginCtrl', ['$scope', '$rootScope', '$location','$cookieStore','$state','urlPrefix','AjaxServer',function($scope, $rootScope, $location, $cookieStore,$state,urlPrefix,AjaxServer){
        var apiLoginUrl = urlPrefix + '/login';
  		$scope.init = function() {
            $rootScope.userLogStatus = '';
  			$scope.username = '';
  			$scope.password = '';
            $scope.errorMsg = '';
            if($rootScope.userLogStatus == 'logout'){
                $scope.clearLoginInfo();
            }
  		};

        $scope.clickSubmit = function( ev ) {
            var it = $(ev.target), ajaxConfig;
            if( it.hasClass('disabled') ){
                return false;
            }
            if( $scope.validForm() ){
                // 清空客户端缓存
                if( $cookieStore && $cookieStore.get('dsUser') ){
                    $cookieStore.remove("dsUser");
                }
                $scope.errorMsg = '';
                it.addClass('disabled');
                ajaxConfig = {
                    method: 'POST',
                    url: apiLoginUrl,
                    data: {
                        'account': $scope.username,
                        'password': hex_md5($scope.password),
                    },
                };
                //console.log(ajaxConfig);
                AjaxServer.ajaxInfo( ajaxConfig, function(data){
                    it.removeClass('disabled');
                    if(data){
                        var d = typeof(data)==="string" ? JSON.parse(data) : data;
                    	$rootScope.user = d;
                        $rootScope.username = d.account;
                        $rootScope.name = d.userName;
                        $rootScope.userId = d.id;
                        $rootScope.roleId = d.roleId;

                        $rootScope.userLogStatus = 'login';
                    	$state.go('main.home');
                    }
                }, function( error ) {
                    it.removeClass('disabled');
                    $scope.validFailFn(error.errMsg);
                })

           }else{
                $scope.validFailFn();
           }
        };

        $scope.validForm = function() {
            if( $scope.username === '' || $scope.password === ''){
                $scope.errorMsg = '请输入用户名和密码';
                return false;
            }else{
                return true;
            }

        };

        $scope.validFailFn = function( msg ){
            if( msg ) $scope.errorMsg = msg;
            $scope.apply();
        };

        $scope.clearLoginInfo = function(){
            $rootScope.name = $scope.name = '';
            $rootScope.username = $scope.username = '';
            $rootScope.userId = $scope.userId = '';
            $rootScope.sessionId = $scope.sessionId = '';
            $rootScope.roleId = $scope.roleId = '';
            if( $cookieStore && $cookieStore.get('dsUser') ) $cookieStore.remove("dsUser");
            $scope.apply();
        };

        $scope.apply = function() {
            if(!$scope.$$phase) $scope.$apply();
        };

  	}]);
