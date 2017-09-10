'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
  	.controller('HeaderCtrl', ['configHeader', '$scope', '$rootScope', '$window', '$location', '$timeout', '$cookieStore','$state','urlPrefix','AjaxServer','Validate', function (header, $scope, $rootScope, $window, $location, $timeout, $cookieStore,$state,urlPrefix,AjaxServer,Validate) {
        //console.log(header);
        $scope.cache = {
            firstHeaderHrefs: []
        }
        $scope.userList = {
            init:{
                defaultUser: {
                    userId: 0,
                    username: '',
                    oldPassWord:'',
                    passWord:'',
                    confirmPassWord:''
                },
                pwdModalForm:{
                    oldPassWord: '',
                    passWord:'',
                    repeatPassWord:''
                }
            },
            apis:{
                logout:{
                    url: urlPrefix + '/logout',
                    method: 'post',
                    data:{}
                },
                changePwd:{
                    url: urlPrefix + '/user/#?changePass',
                    method: 'post',
                    data:{
                        oldPassWord:'',
                        passWord:''
                    }
                }
            }
        };

        $scope.addFirstHref = function(header) {
            var _hrefs_ = [];
            angular.forEach(header, function(item, index, objs) {
                if(item.state) {
                    _hrefs_.push(item);
                }else{
                    var newHref = {};
                    newHref['label'] = item.label;
                    newHref['key'] = item.key;
                    angular.forEach(item, function(secondItem, index, objs) {
                        if(secondItem.key == 0) {
                            newHref['state'] = secondItem.state;
                            _hrefs_.push(newHref);
                        }
                    })
                }
            });
            $scope.cache.firstHeaderHrefs = _hrefs_;
        }

        
        
	   	$scope.initHeader = function () {
	    	$scope.errorMsg = '';
            $scope.selfValid();
            $scope.bindEvent();

            $scope.addFirstHref(header);
            if($rootScope.userLogStatus && !$rootScope.skip){
                $rootScope.skip = true;
                $state.go("main.home");
            }

	        // 清除登出效果
            if($rootScope.userLogStatus === 'logout'){
                $scope.clearLoginInfo();
            }
	        // 读取本地登入信息
            $scope.getLocalLoginInfo();
	        // 记录登入信息
			if($rootScope.userLogStatus === 'login'){
				$scope.saveLoginInfo();
			}

	        // 判断是否已经登录
	        if( !$cookieStore || !$cookieStore.get('dsUser') ){
                $state.go("login");
	        }

	    };

        $scope.bindEvent = function () {
            $('body').off('click','.nav li');
            $('body').on('click','.nav li', function(){
                $scope.getLocalLoginInfo();
            });
        };

        /**
         * 点击修改密码
         */
        $scope.clickChangePwd = function(){
            $scope.getLocalLoginInfo();
            $scope.theUser = $.extend({},$scope.userList.init.defaultUser);
            $scope.errorMsg = '';
            $scope.selfValid();
            $scope.modalTitle = '修改密码';
            $scope.isEditPwd = true;
            $scope.userList.init.pwdModalForm.oldPassWord = '';
            $scope.userList.init.pwdModalForm.passWord = '';
            $scope.userList.init.pwdModalForm.repeatPassWord = '';
            $scope.userList.init.pwdModalForm.account = $scope.theUser.username;
            $scope.apply();
            angular.element('#J_editPwd').modal();
        };

        /**
         * 发送请求修改密码
         */
	    $scope.clickOk = function(ev){
	    	var it = $(ev.target);
	    	if(it.hasClass('disabled')){
	    		return false;
	    	}
	    	if( $scope.validateForm('all','pwd') ){
	    		it.addClass('disabled');
                var ajaxConfig = $.extend(true,{},$scope.userList.apis.changePwd);
                ajaxConfig.url = ajaxConfig.url.replace('#',$scope.theUser.userId);
                ajaxConfig.data = {
                    oldPassWord: hex_md5($scope.userList.init.pwdModalForm.oldPassWord),
                    passWord: hex_md5($scope.userList.init.pwdModalForm.passWord)
                };
                AjaxServer.ajaxInfo( ajaxConfig, function(data){
                    it.removeClass('disabled');
                    if(data) angular.element('#J_editPwd').modal('hide');
                }, function( error ) {
                    it.removeClass('disabled');
                    var err = typeof error === 'string' ? JSON.parse(error) : error;
					$scope.sysError = err.errMsg || '系统未知错误，请联系开发人员';
					console.log($scope.sysError);
                    // 暂时处理
                    if(err.errMsg === '原密码错误'){
                        $scope.validate.pwd.oldPassWord = {
                            dirty:true,
                            valid:false,
                            invalid:true,
                            error:{
                                required:false,
                                format:false,
                                same:true
                            }
                        };
                    }
					$scope.apply();
                });
            }
	    };

	     /**
         * 表单验证
         * @param type: 字段是哪个
         * @param whichForm: 用户添加（user）or修改密码（pwd）
         * @returns {boolean}
         */
        $scope.validateForm = function ( type , whichForm ){
            var validDirtyObj = angular.extend({},validFormatObj,{dirty:true}),
                validNotObj = angular.extend({},validDirtyObj,{valid:false,invalid:true});

            // 清除提示
            $scope.errorMsg = '';

            if(whichForm === 'pwd'){
                // 原密码
                if(type.indexOf('oldPassWord')>-1 || type.indexOf('all')>-1){
                    $scope.validate.pwd.oldPassWord = angular.extend({},validDirtyObj);
                    if(!$scope.userList.init.pwdModalForm.oldPassWord){
                        $scope.validate.pwd.oldPassWord = angular.extend({},validNotObj,{error:{ required:true, format:false, same:false}
                        });
                        $scope.apply();
                        return false;
                    }
                    else if(!Validate.validComplexHash($scope.userList.init.pwdModalForm.oldPassWord)){
                        $scope.validate.pwd.oldPassWord = angular.extend({},validNotObj,{error:{ required:false, format:true, same:false}});
                        $scope.apply();
                        return false;
                    }
                }
                // 新密码
                if(type.indexOf('passWord')>-1 || type.indexOf('all')>-1){
                    $scope.validate.pwd.passWord = angular.extend({},validDirtyObj);
                    if(!$scope.userList.init.pwdModalForm.passWord){
                        $scope.validate.pwd.passWord = angular.extend({},validNotObj,{ error:{ required:true, format:false, same:false } });
                        $scope.apply();
                        return false;
                    }
                    else if($scope.userList.init.pwdModalForm.passWord === $scope.userList.init.pwdModalForm.account){
                        $scope.validate.pwd.passWord = angular.extend({},validNotObj,{ error:{ required:false, format:false, same:true } });
                        $scope.apply();
                        return false;
                    }
                    else if(!Validate.validComplexHash($scope.userList.init.pwdModalForm.passWord)){
                        $scope.validate.pwd.passWord = angular.extend({},validNotObj,{ error:{ required:false, format:true, same:false } });
                        if($scope.userList.init.pwdModalForm.repeatPassWord && $scope.userList.init.pwdModalForm.repeatPassWord !== $scope.userList.init.pwdModalForm.passWord){
                            $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:false, same:true } });
                        }
                        $scope.apply();
                        return false;
                    }
                    else if($scope.userList.init.pwdModalForm.repeatPassWord && $scope.userList.init.pwdModalForm.repeatPassWord !== $scope.userList.init.pwdModalForm.passWord){
                        $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:false, same:true } });
                        $scope.apply();
                        return false;
                    }
                    else if($scope.userList.init.pwdModalForm.repeatPassWord && $scope.userList.init.pwdModalForm.repeatPassWord === $scope.userList.init.pwdModalForm.passWord){
                        $scope.validate.pwd.repeatPassWord.valid = true;
                        $scope.validate.pwd.repeatPassWord.invalid = false;
                        $scope.validate.pwd.repeatPassWord.error.same= false;
                    }
                }
                // 确认新密码
                if(type.indexOf('repeatPassWord')>-1 || type.indexOf('all')>-1){
                    $scope.validate.pwd.repeatPassWord = angular.extend({},validDirtyObj);
                    if(!$scope.userList.init.pwdModalForm.repeatPassWord){
                        $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:true, format:false, same:false } });
                        $scope.apply();
                        return false;
                    }
                    else if(!Validate.validComplexHash($scope.userList.init.pwdModalForm.repeatPassWord)){
                        $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:true, same:false } });
                        $scope.apply();
                        return false;
                    }
                    else if($scope.userList.init.pwdModalForm.passWord && $scope.userList.init.pwdModalForm.repeatPassWord !== $scope.userList.init.pwdModalForm.passWord){
                        $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:false, same:true }
                        });
                        $scope.apply();
                        return false;
                    }
                }
            }
            $scope.apply();
            return true;
	    };
        var validFormatObj = {
            dirty:false,
            valid:true,
            invalid:false,
            error:{
                required:false,
                format:false,
                same:false
            }
        };
        /**
         * 自定义验证
         */
        $scope.selfValid = function (){
            $scope.validate = {
                pwd:{
                    oldPassWord:{},
                    passWord:{},
                    repeatPassWord:{}
                }
            };
            angular.forEach($scope.validate,function(v,k){
                angular.forEach($scope.validate[k],function(n,i) {
                    $scope.validate[k][i] = angular.extend({}, validFormatObj);
                });
            });
        };
        /**
         * 用户登出
         */
	    $scope.clickLogout = function(){
	    	var ajaxConfig = {
                method: $scope.userList.apis.logout.method,
                url: $scope.userList.apis.logout.url,
                data: {}
            };
            AjaxServer.ajaxInfo( ajaxConfig, function( data ){
                if(data){
                    $state.go('login');
                    $rootScope.userLogStatus = 'logout';
                    $scope.clearLoginInfo();
                }
            }, function( error ) {
                console.log(error);
            });
	    };
        /**
         * 清除登录信息
         */
	    $scope.clearLoginInfo = function(){
	    	$rootScope.name = $scope.name = '';
	    	$rootScope.username = $scope.username = '';
	    	$rootScope.userId = $scope.userId = '';
	    	$rootScope.sessionId = $scope.sessionId = '';
	    	$rootScope.roleId = $scope.roleId = '';
            if( $cookieStore && $cookieStore.get('dsUser') ){
                 $cookieStore.remove("dsUser");
            }
	    };
        /**
         * 保存登录信息
         */
	    $scope.saveLoginInfo = function(){
	    	var user = {
	    		'username': $rootScope.username,
	    		'name': $rootScope.name,
	    		'userId': $rootScope.userId,
	    		'roleId': $rootScope.roleId
	    	};

	    	if( $cookieStore && $cookieStore.get('dsUser') ){
                 $cookieStore.remove("dsUser");
            }

	    	if($cookieStore){
				$cookieStore.put('dsUser', user);
			}

	    	$scope.username = $rootScope.username;
	    	$scope.name = $rootScope.name;
	    	$scope.userId = $rootScope.userId;
	    	$scope.roleId = $rootScope.roleId;
	    };
        /**
         * 获取本地保存的登录信息
         */
	    $scope.getLocalLoginInfo = function(){
	    	var user = null;
	    	if($cookieStore && $cookieStore.get('dsUser')){
				user = $cookieStore.get('dsUser');
				$rootScope.username = user.username;
				$rootScope.name = user.name;
				$rootScope.userId = user.userId;
				$rootScope.roleId = user.roleId;
			}
			$scope.username = $rootScope.username || '';
			$scope.name = $rootScope.name || '';
	    	$scope.userId = $rootScope.userId || '';
	    	$scope.roleId = $rootScope.roleId || '';
	    	$scope.userList.init.defaultUser.username = $scope.username;
			$scope.userList.init.defaultUser.userId = $scope.userId;
	    };

        $scope.apply = function() {
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        };
  	}]);
