'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:UserCtrl
 * @description
 * @author [Xieq]
 * # UserCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
.controller('UserCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate',function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate) {
    $scope.tbh = ( angular.element(window).height() - 140 ) * .9 - 30;
    $scope.trh = angular.element('.table-custom tr').height() || 30;
    $scope.pslgst = 30;

    $scope.userList = {
        init:{
            thObj: {account:'账号',userName:'用户姓名',phone:'联系电话',createTime:'创建时间'},
            tdObj: [{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]},{id:1,account:'xxx',userName:'xxx',phone:'13333333555',createTime:'2017-04-10 09:24',permissions:[{id:1,name:'xxxx'}]}],
            getListError: '',
            loading: true,
            userOptions:[{id:1,account:'zhangs'},{id:2,account:'lisi'}],
            viewAuthOptions:[{id:1,name:'调度管理'},{id:2,name:'监控管理'},{id:3,name:'历史任务'},{id:4,name:'操作日志'},{id:5,name:'用户管理'},{id:6,name:'系统设置'}],
            actionType: 'add',
            actionId: 0,
            modalForm:{
                account:'',
                userName:'',
                phone:'',
                passWord:'',
                repeatPassWord:'',
                permissions:[]
            },
            pwdModalForm:{
                passWord:'',
                repeatPassWord:''
            },
            selected: []
        },
        query:{userName:'',account:''},
        apis:{
            getList: {
                url: urlPrefix + '/user',
                method: 'get',
                data: {
                    currentPage: 1,
                    pageSize: '',
                    userName:'',
                    account:''
                }
            },
            getSize: {
                url: urlPrefix + '/user?size',
                method: 'get',
                data: {
                    userName:'',
                    account:''
                }
            },
            getOne: {
                url: urlPrefix + '/user/#',
                method: 'get',
                data: {}
            },
            addOne:{
               url: urlPrefix + '/user',
               method: 'post',
               data: {
                    account:'',
                    userName:'',
                    phone:'',
                    passWord:'',
                    permissions:[]
               }
            },
            updateOne:{
               url: urlPrefix + '/user/#?update',
               method: 'post',
               data: {
                    userName:'',
                    phone:'',
                    permissions:[]
               }
            },
            deleteOne:{
               url: urlPrefix + '/user/#?delete',
               method: 'post',
               data: {}
            },
            resetPwd:{
               url: urlPrefix + '/user/#?resetPass',
               method: 'post',
               data: {
                    passWord:''
               }
            },
            changePwd:{
               url: urlPrefix + '/user/#?changePass',
               method: 'post',
               data: {
                    oldPassWord:'',
                    passWord:''
               }
            },
            getUsers: {
                url: urlPrefix + '/user',
                method: 'get',
                data: {}
            }
        }
    };
    /**
     * 初始化
     */
    $scope.init = function () {
        $rootScope.pagePath = '';
        $scope.userList.query = {};
       // $scope.bindEvent();
        $scope.getUsers();
        $scope.selfValid();
    };
    /**
     * 页面查询操作
     * @param flag: if curPage == 1
     */
    $scope.query = function ( flag ) {
        if( flag ) $scope.pager.curPage = 1;
        $scope.formatState();
        $scope.queryData();
    };
    /**
     * 查询
     */
    $scope.queryData = function(){
        $scope.getList();
        $scope.getPager();
    };
    $scope.formatState = function () {
        $scope.userList.init.getListError = '';
        $scope.userList.init.loading = true;
        $scope.userList.init.tdObj = [];
    };
    /**
     * 获取用户选项
     */
    $scope.getUsers = function(){
        var config = {
            url:  $scope.userList.apis.getUsers.url,
            method: $scope.userList.apis.getUsers.method,
            data: {}
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            if(data && data.length > 0){
                $scope.userList.init.userOptions = data;
            }
            $scope.apply();
        },
        fnFail = function(data){
            console.log(data.errMsg || '获取用户列表失败');
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 获取视图权限选项
     */
    $scope.getViewRights = function(){

    };
    /**
     * 获取列表数据
     */
    $scope.getList = function(){
        var config = {
            url:  $scope.userList.apis.getList.url,
            method: $scope.userList.apis.getList.method,
            data: {
                currentPage: $scope.pager.curPage || 1,
                pageSize: parseInt($scope.pager.pageSize) || 10,
                userName: $scope.userList.query.userName || null,
                account: $scope.userList.query.account || null
            }
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.userList.init.loading = false;
            if(data && data.length > 0) {
                $scope.userList.init.tdObj = data;
                angular.forEach(data,function(v,k){
                    $scope.userList.init.tdObj[k].createTime = $filter('date')(v.createTime,'yyyy-MM-dd HH:mm:ss');
                });
            }
            else $scope.userList.init.tdObj = [];
            $scope.apply();
        },
        fnFail = function(data){
            $scope.userList.init.getListError = data.errMsg || '网络问题，请刷新页面重试';
            $scope.userList.init.loading = false;
            $scope.userList.init.tdObj = [];
            $scope.apply();
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 获取数据条数
     */
    $scope.getPager = function(){
        var config = {
            url:  $scope.userList.apis.getSize.url,
            method: $scope.userList.apis.getSize.method,
            data: {
                userName: $scope.userList.query.userName || null,
                account: $scope.userList.query.account || null
            }
        },
        fnSuccess = function (data){
            var d = +data;
            if(d && d > 0){
                $scope.pager.total = d;
                $scope.pager.totalPage = Math.ceil( d / parseInt($scope.pager.pageSize) );
            }
            $scope.apply();
        },
        fnFail = function(data){
            $scope.userList.init.getListError = data.errMsg || '网络问题，请刷新页面重试';
            $scope.userList.init.loading = false;
            $scope.userList.init.tdObj = [];
            $scope.apply();
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 发送新增或修改请求
     * @param it: clicked object
     */
    $scope.addOrUpdate = function(it){
        $scope.userList.init.modalForm.permissions = $scope.userList.init.viewAuthOptions.filter(function(item){
            var tArr = $scope.popZero( $scope.userList.init.selected );
            if(tArr && tArr.indexOf(item.id)>-1) return true;
        });
        var flag = $scope.userList.init.actionType === 'add',
            config = {
            url:  flag ? $scope.userList.apis.addOne.url : $scope.userList.apis.updateOne.url.replace(/\#/,$scope.userList.init.actionId),
            method: flag ? $scope.userList.apis.addOne.method : $scope.userList.apis.updateOne.method,
            data: {
                account: flag ? $scope.userList.init.modalForm.account : null,
                userName: $scope.userList.init.modalForm.userName,
                phone: $scope.userList.init.modalForm.phone,
                passWord: flag ? hex_md5($scope.userList.init.modalForm.passWord) : null,
                permissions: $scope.userList.init.modalForm.permissions
            }
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data){
               $('#J_addUser').modal('hide');
               $scope.userList.init.modalForm = {account:'',userName:'',passWord:'',repeatPassWord:''};
               $scope.modalTitle = '';
               $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            console.log(data.errMsg);
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 发送请求删除
     * @param it: clicked object
     */
    $scope.deleteOneUser = function(it){
        var config = {
            url:  $scope.userList.apis.deleteOne.url.replace(/\#/,$scope.userList.init.actionId),
            method: $scope.userList.apis.deleteOne.method,
            data: {}
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data){
                angular.element('#J_userConfirm').modal('hide');
                $scope.modalTitle = '';
                $scope.modalInfo = '';
                $scope.userList.init.actionId = 0;
                $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            console.log(data.errMsg);
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 发送请求重置密码
     * @param it: clicked object
     */
    $scope.resetPwd = function(it){
        var config = {
            url:  $scope.userList.apis.resetPwd.url.replace(/\#/,$scope.userList.init.actionId),
            method: $scope.userList.apis.resetPwd.method,
            data: {
                passWord: hex_md5($scope.userList.init.pwdModalForm.passWord)
            }
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data){
                angular.element('#J_resetPwd').modal('hide');
                $scope.modalTitle = '';
                $scope.userList.init.pwdModalForm = {};
                $scope.actionId = 0;
                $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            console.log(data.errMsg);
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 选择
     * @param ev,id
     * @returns {boolean}
     */
    $scope.updateChecked = function (ev,id){
        var action = ev.target.checked?'add':'remove',
        opts = $scope.userList.init.viewAuthOptions,
        sel = $scope.userList.init.selected,
        len = opts.length,
        id = parseInt( id );
        // 勾选
        if(action === 'add' && sel.indexOf(id) === -1){
            var ids;
            // id为0表示全选
            if(id===0 && opts && len !== 0){
                for(var i = 0; i < len; i++){
                    ids = +opts[i].id;
                    if(sel.indexOf(ids)===-1) sel.push(ids);
                }
            }
            sel.push(id);
            // 判断是否已全选
            $scope.isAllSelected( opts, sel );
        }
        // 取消勾选
        if(action === 'remove' && sel.indexOf(id) !== -1){
            var idx = sel.indexOf(id);
            // id为0表示全不选
            if(id===0) sel.splice(0,sel.length);
            // 删除去除勾选项id
            if(idx > -1) sel.splice(idx,1);
            // 已不全选
            var idz = sel.indexOf(0);
            if(idz > -1) sel.splice(idz,1);
        }
        // console.log(sel,$scope.userList.init.selected);
    };
    /*
     * 去除全选标记0
     */
    $scope.popZero = function ( array ) {
        var arr = $.extend([],array), idx = arr.indexOf(0);
        if(idx > -1) arr.splice(idx,1);
        return arr;
    };

    /*
     * 判断是否全选
     * @param selection,selected
     */
    $scope.isAllSelected = function ( selection , selected ) {
        var idx = selected.indexOf(0);
        if(selection && selected){
            if( idx === -1 && selection.length === selected.length ) {
                selected.push( 0 );
            }
        }
    };
    /**
     * 点击确定
     * @param event: event object
     */
    $scope.clickOk = function (event){
        var it = $(event.target),
            type = $scope.userList.init.actionType;
        if(it.hasClass('disabled')){
            return false;
        }
        switch(type){
            case 'delete':
                it.addClass('disabled');
                $scope.deleteOneUser(it);
                break;
            case 'resetPwd':
                if($scope.validateForm('all','pwd')){
                    it.addClass('disabled');
                    $scope.resetPwd(it);
                }
                break;
            default:
                if($scope.validateForm('all','user')){
                    it.addClass('disabled');
                    $scope.addOrUpdate(it);
                }
                break;
        }
    };
    /**
     * 点击新增
     */
    $scope.clickAdd = function(){
         $scope.modalTitle = '新增用户';
         $scope.userList.init.actionType = 'add';
         $scope.userList.init.modalForm = {account:'',userName:'',passWord:'',repeatPassWord:''};
         $scope.userList.init.selected = [];
         $scope.selfValid();
         angular.element('#J_addUser').modal();
    };
    /**
     * 点击重置密码
     * @param index
     */
    $scope.clickResetPwd = function(index){
         $scope.modalTitle = '重置密码';
         $scope.isEditPwd = false;
         $scope.userList.init.actionType = 'resetPwd';
         $scope.userList.init.actionId = $scope.userList.init.tdObj[index].id;
         $scope.userList.init.pwdModalForm.passWord = '';
         $scope.userList.init.pwdModalForm.repeatPassWord = '';
         $scope.userList.init.pwdModalForm.account = $scope.userList.init.tdObj[index].account;
         $scope.selfValid();
         angular.element('#J_resetPwd').modal();
    };
    /**
     * 点击修改
     * @param index
     */
    $scope.clickEdit = function(index){
         $scope.modalTitle = '修改用户';
         $scope.userList.init.actionType = 'update';
         $scope.userList.init.actionId = $scope.userList.init.tdObj[index].id;
         $scope.userList.init.modalForm = angular.extend({},$scope.userList.init.tdObj[index]);
         $scope.userList.init.selected = [];
         var permissions = $scope.userList.init.modalForm.permissions;
         if(permissions && permissions.length > 0){
            angular.forEach(permissions,function(v,k){
                $scope.userList.init.selected.push(+v.id);
            });
            $scope.isAllSelected($scope.userList.init.viewAuthOptions,$scope.userList.init.selected);
         }
         $scope.selfValid();
         angular.element('#J_addUser').modal();
    };
    /**
     * 点击删除
     * @param index
     */
    $scope.clickDelete = function(index){
        $scope.modalTitle = '删除用户';
        $scope.modalInfo = '删除后不可恢复，确定删除这个用户么';
        $scope.userList.init.actionType = 'delete';
        $scope.userList.init.actionId = $scope.userList.init.tdObj[index].id;
        angular.element('#J_userConfirm').modal();
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
        
        // 用户表单
        if(whichForm === 'user'){
            // 添加时验证用户名和密码，修改不用修改这两个
            if($scope.userList.init.actionType === 'add'){
                 // 账号
                 if(type === 'account' || type === 'all'){
                     $scope.validate.user.account = angular.extend({},validDirtyObj);
                     if(!$scope.userList.init.modalForm.account){
                         $scope.validate.user.account = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                         $scope.apply();
                         return false;
                     }
                     else if(!Validate.validEnglish($scope.userList.init.modalForm.account) || !Validate.validLength($scope.userList.init.modalForm.account,{maxLen:10})){
                         $scope.validate.user.account = angular.extend({},validNotObj,{ error:{ required:false,format:true,same:false } });
                         $scope.apply();
                         return false;
                     }
                }
               // 密码
               if(type === 'passWord' || type === 'all'){
                   $scope.validate.user.passWord = angular.extend({},validDirtyObj);
                   if(!$scope.userList.init.modalForm.passWord){
                       $scope.validate.user.passWord = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                       $scope.apply();
                       return false;
                   }
                   else if($scope.userList.init.modalForm.passWord === $scope.userList.init.modalForm.account){
                       $scope.validate.user.passWord = angular.extend({},validNotObj,{ error:{required:false,format:false,same:true} });
                       $scope.apply();
                       return false;
                   }
                   else if(!Validate.validComplexHash($scope.userList.init.modalForm.passWord)){
                       $scope.validate.user.passWord = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false} });
                       if($scope.userList.init.modalForm.repeatPassWord && $scope.userList.init.modalForm.repeatPassWord !== $scope.userList.init.modalForm.passWord){
                           $scope.validate.user.repeatPassWord = angular.extend({},validNotObj,{ error:{required:false,format:false,same:true} });
                       }
                       $scope.apply();
                       return false;
                   }
                   else if($scope.userList.init.modalForm.repeatPassWord && $scope.userList.init.modalForm.repeatPassWord !== $scope.userList.init.modalForm.passWord){
                       $scope.validate.user.repeatPassWord = angular.extend({},validNotObj,{
                           error:{ required:false,format:false,same:true} });
                       $scope.apply();
                       return false;
                   }
                   else if($scope.userList.init.modalForm.repeatPassWord && $scope.userList.init.modalForm.repeatPassWord === $scope.userList.init.modalForm.passWord){
                       $scope.validate.user.repeatPassWord.valid = true;
                       $scope.validate.user.repeatPassWord.invalid = false;
                       $scope.validate.user.repeatPassWord.error.same= false;
                   }
               }
               // 重复密码
               if(type === 'repeatPassWord' || type === 'all'){
                   $scope.validate.user.repeatPassWord = angular.extend({},validDirtyObj);
                   if(!$scope.userList.init.modalForm.repeatPassWord){
                       $scope.validate.user.repeatPassWord = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                       $scope.apply();
                       return false;
                   }
                   else if(!Validate.validComplexHash($scope.userList.init.modalForm.repeatPassWord)){
                       $scope.validate.user.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:true, same:false } });
                       $scope.apply();
                       return false;
                   }
                   else if($scope.userList.init.modalForm.passWord && $scope.userList.init.modalForm.repeatPassWord !== $scope.userList.init.modalForm.passWord){
                       $scope.validate.user.repeatPassWord = angular.extend({},validNotObj,{ error:{required:false,format:false,same:true} });
                       $scope.apply();
                       return false;
                   }
               }
            }

            // 用户名
            if(type === 'userName' || type === 'all'){
                $scope.validate.user.userName = angular.extend({},validDirtyObj);
                if(!$scope.userList.init.modalForm.userName){
                    $scope.validate.user.userName = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                    $scope.apply();
                    return false;
                }
                else if(!Validate.validLength($scope.userList.init.modalForm.userName,{maxLen:10})){
                    $scope.validate.user.userName = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false} });
                    $scope.apply();
                    return false;
                }
           }
           // 联系电话
           if(type === 'phone' || type === 'all'){
               $scope.validate.user.phone = angular.extend({},validDirtyObj);
               if($scope.userList.init.modalForm.phone && !Validate.validTel($scope.userList.init.modalForm.phone,{maxLen:10})){
                   $scope.validate.user.phone = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false} });
                   $scope.apply();
                   return false;
               }
               if(!$scope.userList.init.modalForm.phone){
                   $scope.validate.user.phone.valid = true;
                   $scope.validate.user.phone.invalid = false;
                   $scope.validate.user.phone.error.format = false;
               }
           }
        }
        // 重置密码表单
        else if(whichForm === 'pwd'){
            // 新密码
            if(type === 'passWord' || type === 'all'){
                $scope.validate.pwd.passWord = angular.extend({},validDirtyObj);
                if(!$scope.userList.init.pwdModalForm.passWord){
                    $scope.validate.pwd.passWord = angular.extend({},validNotObj,{ error:{ required:true, format:false, same:false}});
                    $scope.apply();
                    return false;
                }
                else if($scope.userList.init.pwdModalForm.passWord === $scope.userList.init.pwdModalForm.account){
                    $scope.validate.pwd.passWord = angular.extend({},validNotObj,{error:{required:false,format:false,same:true} });
                    $scope.apply();
                    return false;
                }
                else if(!Validate.validComplexHash($scope.userList.init.pwdModalForm.passWord)){
                    $scope.validate.pwd.passWord = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false } });
                    if($scope.userList.init.pwdModalForm.repeatPassWord && $scope.userList.init.pwdModalForm.repeatPassWord !== $scope.userList.init.pwdModalForm.passWord){
                        $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{required:false,format:false,same:true } });
                    }
                    $scope.apply();
                    return false;
                }
                else if($scope.userList.init.pwdModalForm.repeatPassWord && $scope.userList.init.pwdModalForm.repeatPassWord !== $scope.userList.init.pwdModalForm.passWord){
                    $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{required:false,format:false,same:true } });
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
            if(type === 'repeatPassWord' || type === 'all'){
                $scope.validate.pwd.repeatPassWord = angular.extend({},validDirtyObj);
                if(!$scope.userList.init.pwdModalForm.repeatPassWord){
                    $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false }});
                    $scope.apply();
                    return false;
                }
                else if(!Validate.validComplexHash($scope.userList.init.pwdModalForm.repeatPassWord)){
                    $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:true, same:false } });
                    $scope.apply();
                    return false;
                }
                else if($scope.userList.init.pwdModalForm.passWord && $scope.userList.init.pwdModalForm.repeatPassWord !== $scope.userList.init.pwdModalForm.passWord){
                    $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:false, same:true } });
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
            user:{
                account:{},
                userName:{},
                phone:{},
                passWord:{},
                repeatPassWord:{}
            },
            pwd:{
                passWord:{},
                repeatPassWord:{}
            }
        };
        angular.forEach($scope.validate,function(v,k){
            angular.forEach($scope.validate[k],function(n,i) {
                $scope.validate[k][i] = angular.extend({}, validFormatObj);
            });
        });
        // console.log($scope.validate);
    };
    $scope.apply = function() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }
}]);
