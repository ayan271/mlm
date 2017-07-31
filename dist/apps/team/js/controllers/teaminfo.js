'use strict';
app.controller('TeaminfoListCtrl', ['$scope', '$state', '$http','global',function ($scope, $state, $http,global) {
    var sso = jm.sdk.sso;
    var history = global.agentListHistory||(global.agentListHistory={});
    $scope.pageSize = history.pageSize||$scope.defaultRows;
    $scope.search = {};
    $scope.search.date = $scope.search.date || {};
    var page = 1;

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
        {field:'detail',width:150}
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
        $http.get(meixia+'/mlm/teams', {
            params:{
                token: sso.getToken(),
                page:page,
                rows:$scope.pageSize||20,
                startDate:startDate.toString(),
                endDate:endDate.toString(),
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
                $scope.teams  = result;
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

    $scope.details = function (key) {
        $state.go("app.team.manage.edit",{ id:key});
    }

    $scope.$watch('search.date', function () {
        $scope.getdata(1);
    });
}]);

app.controller('TeaminfoEditCtrl', ['$scope', '$state', '$http','global','$stateParams',function ($scope, $state, $http,global,$stateParams) {
    var sso = jm.sdk.sso;
    var id = $stateParams.id;
    console.info(id);
    var getdata = function(_page) {
        $http.get(meixia+'/mlm/teams/'+id, {
        }).success(function(result){
            console.info(result);
            if(result.err){
                $scope.error(result.msg);
            }else{
                // $scope.teams  = result;
                $scope.teams1 = [];
                result.users[0]?($scope.teams1 = result.users[0].user.nick):null;
                console.info($scope.teams1);
                $scope.teams2 = [];
                result.users[1]?$scope.teams2.push(result.users[1].user.nick):null;
                result.users[2]?$scope.teams2.push(result.users[2].user.nick):null;
                console.info($scope.teams2);
                $scope.teams3 = [];
                result.users[3]?$scope.teams3.push(result.users[3].user.nick):null;
                result.users[4]?$scope.teams3.push(result.users[4].user.nick):null;
                result.users[5]?$scope.teams3.push(result.users[5].user.nick):null;
                result.users[6]?$scope.teams3.push(result.users[6].user.nick):null;
                console.info($scope.teams3);
                $scope.teams4 = [];
                result.users[7]?$scope.teams4.push(result.users[7].user.nick):null;
                result.users[8]?$scope.teams3.push(result.users[8].user.nick):null;
                result.users[9]?$scope.teams3.push(result.users[9].user.nick):null;
                result.users[10]?$scope.teams3.push(result.users[10].user.nick):null;
                result.users[11]?$scope.teams3.push(result.users[11].user.nick):null;
                result.users[12]?$scope.teams3.push(result.users[12].user.nick):null;
                result.users[13]?$scope.teams3.push(result.users[13].user.nick):null;
                result.users[14]?$scope.teams3.push(result.users[14].user.nick):null;
                console.info($scope.teams4);
            }
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    }
    getdata();

}]);