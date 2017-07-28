'use strict';

app.controller('ProfileCtrl', ['$scope', '$state', '$http',  'global', function ($scope, $state, $http,  global) {
    var uri = ssoUri+'/users';
    var sso = jm.sdk.sso;
    $scope.user = {avatarUri:'apps/common/img/avatar.jpg'};
    global.getUser().then(function(user){
        $scope.user = user;
        $scope.user.avatarUri = sdkHost+$scope.user.headimgurl;
    });

    var cropper = {
        cropWidth: 200,
        cropHeight: 200,
        imageSize:160,
        cropType:"square",
        sourceImage: null,
        croppedImage: null
    };

    var bounds = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };

    $scope.cropper = cropper;
    $scope.bounds = bounds;

    $scope.ok = function () {
        $scope.user.avatarUri = cropper.croppedImage;
        $http.post(uri + '/'+$scope.user.id, {avatar:cropper.croppedImage}, {
            params:{
                token: sso.getToken()
            }
        }).success(function(result){
            var obj = result;
            if(obj.err){
                $scope.error(obj.msg);
            }else{
                $scope.success('操作成功');
                $state.go('^');
            }
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };

    $scope.cancel = function () {
        $state.go('^');
    };
}]);
