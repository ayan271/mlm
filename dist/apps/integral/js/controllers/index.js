'use strict';
app.controller('IntegralCtrl',['$scope','$translatePartialLoader',function ($scope,$translatePartialLoader) {
    $translatePartialLoader.addPart('integral');
}]);