'use strict';
app.controller('AclRoleCtrl', ['$scope', '$state', '$http','global',function ($scope, $state, $http,global) {
    var sso=jm.sdk.sso;
    var acl=jm.sdk.acl;
    // $scope.search = {};
    $scope.role;

    $scope.isCollapsed = true;
    $scope.opts = {
        injectClasses: {
            "ul": "tree-font-size",
            "iExpanded": "fa fa-minus",
            "iCollapsed": "fa fa-plus",
            "iLeaf": "fa fa-file-o",
            "labelSelected": "tree-selected"
        }
    };

    $scope.style={
        visibility: 'hidden'
    };
    $scope.selectRole = function(role){
        $scope.moreloading = true;
        angular.forEach($scope.roles, function(role) {
            role.selected = false;
        });
        $scope.curRole = role;
        $scope.curRole.selected = true;
        reset();
        if( $scope.userRoles[role.code]){
            $scope.isCollapsed=true;
        }
        if(!$scope.isCollapsed){
            $scope.role = $scope.curRole;
        }
        // $scope.role = role;
        $scope.getResource(role);
        $scope.dataSource();
    };

    $scope.change = function(id){
            if(id==0){
                $scope.role ={};
                $scope.isCollapsed =false;
            }
            if(id==1){
                $scope.role = $scope.curRole;
                $scope.isCollapsed =false;
            }
            if(id==2){
                $scope.isCollapsed =true;
            }

    };

    $scope.enter = function(){
        $scope.isCollapsed = true;
        $scope.ebtnname='新增';
        $scope.role.creator=sso.user.id;
        $http.post(aclUri+'/roles', $scope.role, {
            params:{
                token: sso.getToken()
            }
        }).success(function(result) {
            if(result.err){
                return $scope.error(result.msg);
            }
            $scope.role._id = result._id;
            $scope.roles.push($scope.role);
            $scope.role = {};
            $scope.success('操作成功');
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };

    $scope.update = function(){
        $scope.isCollapsed = true;
        $scope.ubtnname='修改';
        var id = $scope.role._id;
        $http.post(aclUri+'/roles/'+id, $scope.role, {
            params:{
                token: sso.getToken()
            }
        }).success(function(result) {
            if(result.err){
                return $scope.error(result.msg);
            }
            $scope.success('操作成功');
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };

    $scope.deleteRole = function(role){
        $scope.openTips({
            title:'提示',
            content:'是否确认删除当前角色?',
            okTitle:'是',
            cancelTitle:'否',
            okCallback: function(){
                $http.delete(aclUri+'/roles/'+role._id, {
                    params:{
                        token: sso.getToken()
                    }
                }).success(function(result) {
                    if(result.err){
                        return $scope.error(result.msg);
                    }
                    $scope.roles.splice($scope.roles.indexOf(role), 1);
                    $scope.resources = [];
                    $scope.curRole=null;
                    $scope.curPermission= null;
                    $scope.addPermission={};
                    $scope.removePermission={};
                    $scope.success('操作成功');
                }).error(function(msg, code){
                    $scope.errorTips(code);
                });
            }
        });
    };
    //角色资源权限
    $scope.getResource = function(role){
        $http.get(aclUri+'/roles/'+role._id +'/resources', {
            params:{
                code:role.code,
                token: sso.getToken()
            }
        }).success(function(result){
            var obj = result;
            if(obj.err){
                $scope.error(obj.msg);
            }else{
                $scope.moreloading = false;
                $scope.curPermission= result;
            }
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };
    //设置角色权限
    $scope.addPermission={};
    $scope.removePermission={};
    $scope.setPermisssion=function ($event,code) {
        var checkbox = $event.target;
        if(checkbox.checked){
            if(!$scope.removePermission[code]||$scope.removePermission[code].indexOf(checkbox.value)==-1){
                if (!$scope.addPermission[code]) {
                    $scope.addPermission[code] = [checkbox.value];
                } else {
                    if ($scope.addPermission[code].indexOf(checkbox.value) == -1) {
                        $scope.addPermission[code].push(checkbox.value);
                    }
                }
            }else{
                $scope.removePermission[code].splice($scope.removePermission[code].indexOf(checkbox.value),1);
            }

        }else{
            if(!$scope.addPermission[code]||$scope.addPermission[code].indexOf(checkbox.value)==-1){
                    if(!$scope.removePermission[code]){
                        $scope.removePermission[code]=[checkbox.value];
                    }else{
                        if($scope.removePermission[code].indexOf(checkbox.value)==-1) {
                            $scope.removePermission[code].push(checkbox.value);
                        }
                    }
            }else{
                $scope.addPermission[code].splice($scope.addPermission[code].indexOf(checkbox.value),1);
            }
        }
    };
    //更新角色资源的权限
    $scope.changePermission=function () {
        $http.post(aclUri+'/roles/'+$scope.curRole._id+'/resource',{
            roles:$scope.curRole.code,
            addPermission:formatPermission($scope.addPermission),
            removePermission:formatPermission($scope.removePermission)
        },{
            params:{
                token: sso.getToken()
            }
        }).success(function(result){
            var obj = result;
            if(obj.err){
                $scope.error(obj.msg);
            }else{
                $scope.getResource($scope.curRole);
                $scope.addPermission={};
                $scope.removePermission={};
                $scope.success('操作成功');
            }
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };

    $scope.checkPer = function(item,per){
        item.permissions || (item.permissions=[]);
        if(item.permissions.indexOf(per)==-1) return false;
        if(!$scope.userResources[item.code]) return false;
        return $scope.userResources[item.code].indexOf(per)!=-1;
    };

    var token = sso.getToken();
    $scope.userResources = {};
    //获取用户资源及其权限
    $http.get(aclUri + '/users/'+localStorage.getItem('id')+'/resources', {
        params: {
            token: token
        }
    }).success(function (result) {
        if (result.err) {
            $scope.error(result.msg);
        } else {
            $scope.userResources = result||{};
        }
    }).error(function (msg, code) {
        $scope.errorTips(code);
    });
    //获取资源树
    $scope.dataSource = function () {
            var search = $scope.search;
            // var keyword = search.keyword;
            $http.get(aclUri + '/resources/tree', {
                params: {
                    token: token
                    // keyword: keyword
                }
            }).success(function (result) {
                if (result.err) {
                    $scope.error(result.msg);
                } else {
                    $scope.angularTreeList = result.rows || [];
                }
            }).error(function (msg, code) {
                $scope.errorTips(code);
            });
    };
    // $scope.search = function () {
    //     $scope.ketword = $scope.search.keyword||'';
    //     console.info($scope.role);
    //     // reset();
    //     $scope.getResource($scope.role);
    //     $scope.dataSource();
    // }

    //获取用户所属角色
    $http.get(aclUri+'/users/'+localStorage.getItem('id')+'/roles', {
        params: {
            token: token
        }
    }).success(function (result) {
        if(result.err){
            $scope.error(result.msg);
        }else{
            $scope.userRoles =result;
            getRoles(result);
        }
    }).error(function(msg, code){
        $scope.errorTips(code);
    });
    //获取用户创建的角色
    function getRoles(userRoles) {
        $http.get(aclUri+'/roles', {
            params: {
                token: token
            }
        }).success(function (result) {
            if(result.err){
                $scope.error(result.msg);
                $scope.errorTips(result.msg);
            }else{
                var ary=[];
                result.rows.forEach(function (item) {
                    if(!userRoles[item.code]){
                        ary.push(item);
                    }
                });
                for(var key in userRoles){
                    if(key!="root"){
                        ary.unshift(userRoles[key]);
                    }
                }
                $scope.roles =ary ;//获取用户相关角色
                $scope.role = null;
                $scope.curRole = null;
            }
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    }
    //格式化参数
    function formatPermission(ary) {
        var allow=[];
        for (var key in ary) {
            if (ary.hasOwnProperty(key)){
                var per={
                    permissions:ary[key],
                    resources:key
                };
                allow.push(per);
            }
        }
        return allow;
    }
    //重置
    function reset() {
        $scope.curPermission= null;
        $scope.addPermission={};
        $scope.removePermission={};
        var checkboxs=document.getElementsByClassName("resetValue");
        for(var key in checkboxs ){
            if(checkboxs[key].checked){
                checkboxs[key].checked=false;
            }
        }
    }
}]);

