'use strict';
app.controller('ConfiglistCtrl', ['$scope', '$state', '$http','global',function ($scope, $state, $http,global) {
    
    $scope.new = function () {
        $state.go("app.team.config.edit");
    }
}]);

app.controller('ConfigeditCtrl', ['$scope', '$state', '$http','global',function ($scope, $state, $http,global) {

}]);