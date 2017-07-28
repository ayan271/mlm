'use strict';
app.controller('DashboardCtrl',['$scope','$translatePartialLoader',function ($scope,$translatePartialLoader) {
    $translatePartialLoader.addPart('dashboard');
}]);
