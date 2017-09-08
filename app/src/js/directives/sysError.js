/*
 * 全局错误提示弹出层 
 */
angular.module('myappApp')
.directive('errDiv', function() {
	return {
		restrict: "EAC",
		templateUrl: 'views/public/errModal.html',
		replace: true,
		transclude: true,
		scope: {
			msg: '='
		},
		compile: function(tElement, tAttrs, transclude) {
			return function(scope, iElement, iAttrs) {
				scope.$watch('msg', function(newVal, oldVal){
					if(newVal != oldVal && newVal != ""){
						iElement.modal('show');
					}
				});
				tElement.on('hidden.bs.modal', function () {
			    	 scope.msg = "";
			    	 scope.$apply();
			    })
			}
		}
	};
});