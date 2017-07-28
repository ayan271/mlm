'use strict';
app.controller('MemberCtrl',['$scope','$translatePartialLoader',function ($scope,$translatePartialLoader) {
    $translatePartialLoader.addPart('member');
}]);