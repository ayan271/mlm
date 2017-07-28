'use strict';
app.controller('AclResourceCtrl', ['$scope', '$state', '$http',  function ($scope, $state, $http) {
    var sso=jm.sdk.sso;
    $scope.opts = {
        injectClasses: {
            "ul": "tree-font-size",
            "iExpanded": "fa fa-minus",
            "iCollapsed": "fa fa-plus",
            "iLeaf": "fa fa-file-o",
            "labelSelected": "tree-selected"
        }
    };

    $scope.getTree = function(){
        $http.get(aclUri+'/resources/tree', {
            params:{
                token: sso.getToken()
            }
        }).success(function(result){
            if(result.err){
                    $scope.error(result.msg);
                }else{
                    $scope.resourceTreedata = [{title:'默认'}].concat(result.rows);
                    $scope.expandedResourceNodes = $scope.expandResourceNodes($scope.resourceTreedata[1]);
                }
            }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };
    $scope.getTree();
    $scope.selectedResourceNode = function(node,parent) {
        $scope.resource = node;
        $scope.parent=parent;
        if(parent){
            $scope.resource.ptitle = parent.title;
        }
    };

    $scope.onPermissionChange = function() {
        if($scope.resource.permissions.indexOf('*') > -1) {
            $scope.resource.permissions = [];
            $scope.permissions.forEach(function (item) {
                if(item.code!=='*')
                    $scope.resource.permissions.push(item.code);
            });
        }
    };

    $scope.expandResourceNodes = function(node){
        var ary = [node];
        if(node.children){
            node.children.forEach(function(child){
                ary = ary.concat($scope.expandResourceNodes(child));
            });
        }
        return ary;
    };
    $scope.addNode = function(){
        $scope.resource = $scope.resource||$scope.resourceTreedata[0];
        $scope.parent = $scope.resource;
        $scope.resource = {parent:$scope.parent._id,ptitle:$scope.parent.title,status:1,sort:0};
        $scope.selected = $scope.parent;

    };

    var formatTags = function(data){
        var ary = [];
        data = data || [];

        data.forEach(function(item){
            ary.push(item);
        });
        return ary;
    };
    $scope.createResource = function() {
        console.log($scope.resource);
        $http.post(aclUri+'/resources', $scope.resource, {
            params:{
                token: sso.getToken()
            }
        }).success(function(result) {
            if(result.err){
                return $scope.error(result.msg);
            }
            $scope.resource._id = result._id;
            if($scope.resource.parent){
                $scope.parent.children = $scope.parent.children || [];
                $scope.parent.children.push($scope.resource);

            }else{
                $scope.resourceTreedata = $scope.resourceTreedata.concat($scope.resource);
            }
            $scope.selected = $scope.resource;
            $scope.expandedNodes = $scope.expandResourceNodes($scope.resourceTreedata[0]);
            $scope.success('操作成功');
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };

    $scope.updateResource = function(){
        $scope.resource.permissions = formatTags($scope.resource.permissions);
        var id = $scope.resource._id;
        $http.post(aclUri+'/resources/'+id, $scope.resource, {
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

    $scope.deleteResource = function(resource){
        $scope.openTips({
            title:'提示',
            content:'如果当前节点存在子节点也会一并删除,是否确认删除?',
            okTitle:'是',
            cancelTitle:'否',
            okCallback: function(){
                var id = $scope.resource._id;
                $http.delete(aclUri+'/resources/'+id,{
                    params:{
                        token: sso.getToken()
                    }
                }).success(function(result){
                    console.log(result);
                    if(result.err){
                        $scope.error(result.msg);
                    }else{
                        $scope.getTree();
                        $scope.resource = null;
                        $scope.parent = null;
                        $scope.success('操作成功');
                    }
                }).error(function(msg, code){
                    $scope.errorTips(code);
                });
            }
        });
    };

    $http.get(aclUri+'/permissions', {
        params: {
            token: sso.getToken()
        }
    }).success(function (result) {
        if(result.err){
            $scope.error(result.msg);
        }else{
            $scope.permissions = [{code:'*', title:'*'}].concat(result.rows);
        }
    }).error(function(msg, code){
        $scope.errorTips(code);
    });
}]);

