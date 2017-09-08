angular.module('myappApp')
  	.service('AjaxServer', function($location, $http, $cookieStore, $rootScope){
  		$rootScope.$broadcast('updateLogin');
  		this.pathStr = $location.path();
  		this.ajaxInfo = function( config , fnSuccess, fnFail ) {
            if(!config || !config.url || '' == config.url){
                console.log('ajax config error');
                return false;
            };
            return $http({
                method: config.method || 'get',
                data: config.data || '',
                params: config.method == 'get' ? config.data || '' : '',
                responseType: config.responseType || 'json',
                headers: config.headers,
                url: config.url
            }).success(function(data,header,config,status){
            	data = data || {};
            	if(data.errorCode){
            		//$rootScope.$broadcast('stopRefresh');
            		$('.modal-backdrop').remove();
            		if(data.errorCode == '401'){
            			$location.path('/login').search({'redirectUrl':this.pathStr});
            		}
            		if(data.errorCode == '402'){
            			$rootScope.$broadcast('updateLogin');
            			$location.path('/402');
            		}
            	}else{
            		if( fnSuccess ){
                        fnSuccess(data);
                    }else{
                        console.log(data);
                    }
            	}
            }).error(function(data,header,config,status){
            	data = data || {};
            	if(data.errorCode){
            		//$rootScope.$broadcast('stopRefresh');
            		$('.modal-backdrop').remove();
            		if(data.errorCode == '401'){
            			$location.path('/login').search({'redirectUrl':this.pathStr});
            		}
            		if(data.errorCode == '402'){
            			$rootScope.$broadcast('updateLogin');
            			$location.path('/402');
            			if( fnSuccess ){
                            fnSuccess(data);
                        }
            		}
            	}
            	/*else if(header){
            		if(header == 500){
            			$location.path('/500');
            		}else if(header == 400){
            			$location.path('/400');
            		}else if(header == 401){
            			$location.path('/login').search({'redirectUrl':this.pathStr});
            		}else if(header == 402){
            			$location.path('/402');
            		}else if(header == 404){
            			$location.path('/404');
            		}
            	}*/
            	else{
	                if( fnFail ){
	                    fnFail(data);
	                }else{
	                    console.log(status);
	                }
            	}
            });
  		};
  	});
