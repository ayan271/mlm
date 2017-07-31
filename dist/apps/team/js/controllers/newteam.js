'use strict';
app.controller('NewteamCtrl', ['$scope', '$state', '$http','global','$stateParams',function ($scope, $state, $http,global,$stateParams) {

    var id = $stateParams.id;
    console.info(id);

}]);