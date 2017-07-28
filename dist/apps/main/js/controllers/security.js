'use strict';

app.controller('SecurityCtrl', ['$scope', '$state', '$stateParams', '$http', '$timeout',  'global', function ($scope, $state, $stateParams, $http, $timeout,  global) {
    var successUri = $stateParams.successUri;
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

    $scope.mobileObj = {};
    $scope.payObj = {};
    var bank = jm.sdk.bank;

    $scope.hasMobile = false;
    global.getLocalUser().then(function(user){
        $scope.mobile = user.mobile || '';
        $scope.pmobile = $scope.mobile.toString().replace(/(\d{3})\d{4}(\d{4})/g,"$1****$2");
        if($scope.mobile) $scope.hasMobile = true;
    });

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
                setTime();
            }
        }).error(function (msg, code) {
            $scope.errorTips(code);
        });
    };

    $scope.bindMobile = function(){
        var data = {code:$scope.mobileObj.code,mobile:$scope.mobileObj.mobile};
        $http.post(ssoUri+'/bindMobile', data, {
            params:{
                token: sso.getToken()
            }
        }).success(function(result){
            if(result.err){
                $scope.error(result.msg);
            }else{
                $scope.success('操作成功');
                $scope.mobile = $scope.mobileObj.mobile;
                $scope.hasMobile = true;
                $scope.pmobile = $scope.mobile.toString().replace(/(\d{3})\d{4}(\d{4})/g,"$1****$2");
                $scope.mobileObj = {};
                clearTime();
            }
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };

    $scope.submitPay = function(){
        bank.resetPasswd({
            token: sso.getToken(),
            key: $scope.mobile,
            code: $scope.payObj.code,
            passwd: $scope.payObj.passwd
        },function(err,result){
            if(result.err){
                $scope.error(result.msg);
            }else{
                $scope.success('操作成功');
                $scope.payObj = {};
                clearTime();
                if(successUri) $state.go(successUri);
            }
        });
    };
}]);
