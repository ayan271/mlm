'use strict';

app.controller('ResetPasswdCtrl', ['$scope', '$state', '$stateParams', '$http', '$timeout','global', function ($scope, $state, $stateParams, $http, $timeout,  global) {
    var sso=jm.sdk.sso;
    $scope.sum = 60;
    $scope.countdown = $scope.sum;
    $scope.codeName = '免费获取验证码';
    var t;
    function setTime() {
        if ($scope.countdown == 0) {
            $scope.codeName = "免费获取验证码";
            $scope.countdown = $scope.sum;
            return;
        } else {
            $scope.codeName = "重新发送(" + $scope.countdown + "s)";
            $scope.countdown--;
        }
        t = $timeout(function () {
            setTime();
        }, 1000);
    }
    function clearTime() {
        $scope.codeName = "免费获取验证码";
        $scope.countdown = $scope.sum;
        $timeout.cancel(t);
    }

    $scope.obj = {};

    $scope.getCode = function(mobile){
        if($scope.countdown != $scope.sum) return;
        if(!mobile){
            return $scope.error('请输入手机号');
        }
        if(!(/^(\+?0?86\-?)?((13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/.test(mobile))){
            return $scope.error('请输入正确手机号');
        }
        $http.get(ssoUri + '/verifyCode', {
            params: {
                mobile: mobile
            }
        }).success(function (result) {
            if (result.err) {
                $scope.error(result.msg);
            } else {
                console.log(result);
                $scope.success('已发送验证码');
                setTime();
            }
        }).error(function (msg, code) {
            $scope.errorTips(code);
        });
    };

    $scope.resetPasswd = function(){
        var data = {key:$scope.mobile,code:$scope.obj.code,passwd:$scope.obj.passwd};
        $http.post(ssoUri+'/resetPasswd', data, {
            params:{
                token: sso.getToken()
            }
        }).success(function(result){
            if(result.err){
                $scope.error(result.msg);
            }else{
                $scope.success('重置成功,请登录');
                $state.go('access.signin');
                clearTime();
            }
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };

}]);
