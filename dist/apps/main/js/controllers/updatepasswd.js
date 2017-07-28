'use strict';

app.controller('UpdatePasswdCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    var url = ssoUri+'/user/passwd';
    var sso=jm.sdk.sso;
    $scope.data = {};
    $scope.update = function () {
        if($scope.data.newPasswd!=$scope.data.confirm_password){
            $scope.error('新输入密码验证失败');
            return;
        }
        $http.post(url, $scope.data, {
            params:{
                token: sso.getToken()
            }
        }).success(function(result){
            var obj = result;
            if(obj.err){
                $scope.error(obj.msg);
            }else{
                $scope.success('操作成功');
                $state.go('app.main');
                $scope.data={};
            }
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };
}]);
