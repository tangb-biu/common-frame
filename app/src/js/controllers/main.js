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
      $scope.header = header;

  		function CustNavigator(header) {
  		    this._header_ = header;
  		}

  		CustNavigator.prototype._$parse = function(state) {
    			if(!this._header_) throw new Error('Required parameter missing: header');
    			var header = this._header_;
    			return parse(this._header_, state);
    			function parse(header, state) {
    				  for(var i in header) {
                  if(state === header[i].state) {
                      return header[i]
                  }
        					if(isPlainObject(header[i]) && header[i]['childrenState']) {
        						  return parse(header[i], state)
        					}
    				  }
    			}

    			function isPlainObject(obj) {
    				  return Object.prototype.toString.call(obj) === "[object Object]";
    			}

  		}

      CustNavigator.prototype.getHeader = function(state) {
          return this._header_;
      }

      CustNavigator.prototype.getChildren = function() {
          
      }

  		CustNavigator.prototype.getChild = function(state) {
  		    return this._$parse(state);
  		}

  		var nav = new CustNavigator(header);
  		//var role = nav.getChild('main.role');
  		
      $scope.nav = nav;

  	}]);
