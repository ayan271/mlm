'use strict';
app.controller('LogCtrl', ['$scope', '$state', '$http','global',function ($scope, $state, $http,global) {
    var sso = jm.sdk.sso;
    var history = global.agentListHistory||(global.agentListHistory={});
    $scope.pageSize = history.pageSize||$scope.defaultRows;
    $scope.search = {};
    $scope.search.date = $scope.search.date || {};
    var page = 1;
    if(com === 'mx'){
        $scope.com = true;
    }
    $scope.tablestyle = {};
    if($scope.isSmartDevice){
        $scope.tablestyle = {};
    }else{
        $scope.tablestyle = {
            height:$scope.app.navHeight-235+'px',
            border:'1px solid #cccccc'
        }
    }

    $scope.widthfields = [
        {field:'account',width:150},
        {field:'nick',width:150},
        {field:'agent',width:150},
        {field:'up',width:150},
        {field:'down',width:150},
        {field:'jbbalance',width:150},
        {field:'detail',width:200}
    ];

    $scope.dateOptions = angular.copy(global.dateRangeOptions);
    $scope.dateOptions.startDate = moment().subtract(1, 'months');
    $scope.dateOptions.endDate = moment();
    $scope.dateOptions.opens = 'left';

    $scope.left = function () {
        if($scope.page>1){
            --page;
            $scope.getdata();
        }
    }
    $scope.right = function () {
        if($scope.page<$scope.pages){
            ++page;
            $scope.getdata();
        }
    };
    $scope.getdata = function(_page) {
        if(_page) page = _page;
        $scope.nodata = false;
        $scope.moreLoading = true;
        var search = $scope.search;
        var date = search.date||{};
        var startDate = date.startDate || "";
        var endDate = date.endDate|| "";
        var agent = search.agent;
        $http.get(meixia+'/users', {
            params:{
                token: sso.getToken(),
                page:page,
                rows:$scope.pageSize||20,
                startDate:startDate.toString(),
                endDate:endDate.toString(),
                agent:agent,
                hasAccount:true,
                rtype:1,
                search: search.keyword
            }
        }).success(function(result){
            if(result.err){
                $scope.error(result.msg);
            }else{
                $scope.moreLoading = false;
                $('html,body').animate({ scrollTop: 0 }, 100);
                $('.mobilebody').animate({ scrollTop: 0 }, 0);  //后面的0是延时
                $('.mobilebox').animate({scrollLeft: 0},0);
                $scope.users  = result;
                if(result.total){
                    $scope.nodata = false;
                    $scope.page = result.page;
                    $scope.pages = result.pages;
                    $scope.total = result.total;
                    $scope.totalnumber = global.reg(result.total);
                }else{
                    $scope.nodata = true;
                    $scope.pages = 0;
                    $scope.total = 0;
                    $scope.totalnumber = 0;
                }
            }
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    }
    $scope.getdata();

    $scope.details = function (key1,key2) {
        $state.go("app.integral.detail",{id:key1,uid:key2});
    };

    $scope.$watch('search.date', function () {
        $scope.getdata(1);
    });
}]);