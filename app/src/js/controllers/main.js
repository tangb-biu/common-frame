'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:MainCtrl
 * @description
 * # 用户登录 LoginCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('MainCtrl', ['configHeader', '$scope', '$rootScope', '$location', '$cookieStore', '$state', 'urlPrefix', 'AjaxServer', function(header, $scope, $rootScope, $location, $cookieStore, $state, urlPrefix, AjaxServer) {
        // header的品配置信息可以通过header访问
        $scope.header = header;

        function CustNavigator(header) {
            this._header_ = header;
        }

        CustNavigator.prototype._$parse = function(state, reverse) {
            if (!this._header_) throw new Error('Required parameter missing: header');
            var header = this._header_;
            return parse(this._header_, state, reverse);

            function parse(header, state, reverse) {
                for (var i in header) {
                    if (state === header[i].state || state === header[i].url) {
                        if (reverse) {
                            return header;
                        }
                        return header[i];
                    }
                    if (isPlainObject(header[i]) && header[i]['childrenState']) {
                        return parse(header[i], state, reverse);
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

        CustNavigator.prototype.getChildren = function(state) {
            if (!state) {
                return this._header_;
            }
            var state = this._$parse(state);
            var copyState = {};
            var toString = Object.prototype.toString;
            for (var i in state) {
                toString.call(state[i]) == "[object Object]" && (copyState[i] = state[i]);
            }
            return copyState;
        }

        CustNavigator.prototype.getParent = function(state) {
            var state = this._$parse(state, true);
            if (state == this.getChildren()) {
                return;
            }
            var copyState = {};
            var toString = Object.prototype.toString;
            for (var i in state) {
                toString.call(state[i]) == "[object Object]" && (copyState[i] = state[i]);
            }
            return copyState;
        }

        $scope.getChildren = function(state, conf, level) {
            var index = state.indexOf('fake');
            if (index > -1) {
                $scope.headerHrefs = nav.getChildren(state);
            } else {
                if (level == 1) {
                    $scope.headerHrefs = {};
                }
                if (conf) {
                    $state.go(state, conf);
                } else {
                    $state.go(state);
                }
            }
        }

        $scope.getParent = function(state) {
            $scope.headerHrefs = nav.getParent(state);
        }


        var nav = new CustNavigator(header);
        $scope.nav = nav;
        $scope.headerHrefs = {};
        $scope.getParent($state.current['state']);
        $scope.$on('$locationChangeSuccess', function() {
            $scope.getParent($location.path().split('/main')[1]);
            //console.log($location);
        });

    }]);