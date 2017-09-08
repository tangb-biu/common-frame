/*	
	// state 是页面状态变化的触发器, 自定义有意义的标识,
	// 我们希望状态控制而不是手动触发路由
	state: [ // 可选项
		login: '登录状态', // 默认项
		main: '控制页面出登录页以外的骨架', // 默认项
		home : '首页面',
		[main.user, main.role] : '用户管理首页面, 角色管理首页面'
	],
	url: 用户页面渲染的根据，自定义(目前假定非必须),

	templateUrl: '页面Url', // 规范定义
	
	controller: '页面控制器'

*/

/*
[
	{
		state: 'login', // 页面状态控制
		url: '/home', // 可以访问的url
		templateUrl: 'views/index.html', // templateUrl
		controller: 'loginCtrl' // 页面控制器
	},
	{
		state: 'main',
		url: '/main',
		templateUrl: 'views/main.html',
		controller: 'mainCtrl'
	},
	{
		state: 'home',
		url: '/home',
		templateUrl: 'views/home.html',
		controller: 'homeCtrl'
	},
	{
		multiple: true,
		label: '用户管理',
		folder: 'user',
		children: [
			{
				state: 'user',
				url: '/user',
				lebel: '用户管理',
				templateUrl: 'views/user/user.html'
			},
			{
				state: 'user_role',
				url: '/role',
				lebel: '角色管理',
				templateUrl: 'views/user/role.html'
			}

		]
	}
];

*/

angular
  	.module('myappApp.services', [])
  	.provider('configHeader', {
		setHeader: function(header) {
  			this.header = header;
  		},
  		$get: function() {
  			return this.header;
  		}
	})
  	.provider('configModules', {
		$get: function() {
			return [
				{
					state: 'home',
					label: '首页'
				},
				{
					multiple: true,
					label: '用户管理',
					folder: 'user',
					children: [
						{
							state: 'user',
							label: '用户管理'
						},
						{
							state: 'role',
							label: '角色管理'
						}

					]
				}
			];
		}
	})
