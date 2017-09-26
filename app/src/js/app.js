'use strict';

/**
 * @ngdoc overview
 * @name myappApp
 * @description
 * # myappApp
 *
 * Main module of the application.
 * version: 1.5.0
 */
angular
    .module('myappApp', [
        'ngCookies',
        'ui.router',
        'myappApp.services'
    ])
    .constant('urlPrefix', 'datasupport')
    .config(function($stateProvider, $urlRouterProvider, configModulesProvider, configHeaderProvider) {
        $urlRouterProvider
            .when("", "/login")
            .when('/', "/login")
            .when('/500', '500.html')
            .when('/400', '400.html')
            .when('/404', '404.html')
            .when('/402', 'authError.html')
            .otherwise('/login');

        /*
		$stateProvider
		.state("login", {
			url: "/login",
			templateUrl: "views/login/index.html",
			controller: "LoginCtrl"
		})
		.state("main", {
     		url: "/main",
            templateUrl: "views/index.html",
            controller: "MainCtrl"
		})
		.state("main.home", {
			url: "/home",
			templateUrl: "views/home/index.html",
			controller: "HomeCtrl"
		})
        .state("main.userMgr", {
            url: "/userMgr",
            templateUrl: "views/userMgr/index.html",
            controller: "UserCtrl"
        })

		*/

        /*
			解析provider
        */
        var states = configModulesProvider.$get();

        function _$handlerRouter(states, prefix, ortherRoutes) {
            var states_cp = [];
            angular.forEach(states, function(route, i) {
                route.state = 'main.' + route.state;
                states_cp.push(route);
            })
            if (ortherRoutes) {
                angular.forEach(ortherRoutes, function(route, i) {
                    states_cp.push(route);
                })
            }

            var _routeArr_ = [];
            angular.forEach(states_cp, function(route, i) {
                if (route.multiple) {
                    var arr = _$handlerRouter(route.children, route.folder || '');
                    for (var k = 0; k < arr.length; k++) {
                        _routeArr_.push(arr[k]);
                    }
                } else {

                    if (!route.state) throw new Error(' Missing Parameters *state*!');
                    var urls = route.state.split('.');
                    var obj = {
                        state: route.state,
                        url: '/' + urls.slice(-1)[0],
                        templateUrl: 'views/' +
                            (prefix ? prefix + '/' : '') +
                            urls.slice(-1).join('/') + '.html',
                        controller: urls.slice(-1)[0][0].toUpperCase() + urls.slice(-1)[0].slice(1) + 'Ctrl'
                    }

                    _routeArr_.push(obj);
                }

            })

            return _routeArr_;
        }

        function isArray(arr) {
            return Object.prototype.toString.call(arr) === "[object Array]";
        }

        function isBoolean(a) {
            return Object.prototype.toString.call(a) === "[object Boolean]";
        }

        function flatten(input, shallow, strict, startIndex) {
            var output = [],
                idx = 0;
            for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
                var value = input[i];
                if (isArray(value)) {
                    //flatten current level of array or arguments object
                    if (!shallow) value = flatten(value, shallow, strict);
                    var j = 0,
                        len = value.length;
                    output.length += len;
                    while (j < len) {
                        output[idx++] = value[j++];
                    }
                } else if (!strict) {
                    output[idx++] = value;
                }
            }
            return output;
        }

        function indexOf(array, item, isSorted) {
            var i = 0,
                length = array && array.length;
            if (typeof isSorted == 'number') {
                i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
            } else if (isSorted && length) {
                i = _.sortedIndex(array, item);
                return array[i] === item ? i : -1;
            }
            if (item !== item) {
                return _.findIndex(slice.call(array, i), _.isNaN);
            }
            for (; i < length; i++)
                if (array[i] === item) return i;
            return -1;
        };

        function contains(obj, target, fromIndex) {
            if (!isArray(obj)) throw new Error('paramter is not array type');
            return indexOf(obj, target, typeof fromIndex == 'number' && fromIndex) >= 0;
        }

        function uniq(array, isSorted, iteratee, context) {
            if (array == null) return [];
            if (isBoolean(isSorted)) {
                context = iteratee;
                iteratee = isSorted;
                isSorted = false;
            }
            if (iteratee != null) iteratee = cb(iteratee, context);
            var result = [];
            var seen = [];
            for (var i = 0, length = array.length; i < length; i++) {
                var value = array[i],
                    computed = iteratee ? iteratee(value, i, array) : value;
                if (isSorted) {
                    if (!i || seen !== computed) result.push(value);
                    seen = computed;
                } else if (iteratee) {
                    if (!contains(seen, computed)) {
                        seen.push(computed);
                        result.push(value);
                    }
                } else if (!contains(result, value)) {
                    result.push(value);
                }
            }
            return result;
        }

        function _$handlerHeader(states, prefix) {
            var _header_ = {};
            var _children_state_ = [];
            angular.forEach(states, function(route, i) {
                    if (route.multiple) {
                        var arr = _$handlerHeader(route.children);
                        arr['label'] = route.label;
                        arr['key'] = i;
                        arr['state'] = 'fake.' + route.folder;
                        _header_[route.folder] = arr;
                        _children_state_.push(arr.childrenState);
                        _children_state_ = flatten(_children_state_);
                    } else {
                        if (!route.state) throw new Error(' Missing Parameters *state*!');
                        var urls = route.state.split('.');
                        var obj = {
                            state: ['main', route.state].join('.'),
                            url: '/' + urls.slice(-1)[0],
                            label: route.label,
                            key: i // 对排序有特殊要求的地方
                        }
                        _header_[route.state] = obj;
                        _children_state_.push(obj.state);
                    }

                })
                //_header_.childrenState = flatten(_children_state_);
            Object.defineProperty(_header_, "childrenState", {
                value: flatten(_children_state_),
                enumerable: false
            });
            return _header_;
        }
        // 配置菜单栏
        var header = _$handlerHeader(states);
        var len = uniq(header.childrenState).length;
        if (header.childrenState.length !== len) {
            throw new Error("Duplicate state is not allowed!");
        }
        configHeaderProvider.setHeader(header);

        // 默认路由
        var default_routes = [{
                state: 'login',
            },
            {
                state: 'main',
            }
        ];

        var routeArr = _$handlerRouter(states, '', default_routes);
        (function routeGen(routes) {
            angular.forEach(routes, function(route, i) {
                $stateProvider.state(route.state, route);
            })
        }(routeArr))
    });