'use strict';
app.controller('WithdrawCtrl', ['$scope', '$state', '$http','global','$stateParams',function ($scope, $state, $http,global,$stateParams) {
    var sso = jm.sdk.sso;
    $scope.enableTypeChoose = true;   //是否允许选择操作类型
    $scope.type = $stateParams.type || null;
    $scope.play = {};

    var player = sessionStorage.getItem('selectedUser');
    if(player) {
        player = JSON.parse(player);
        $scope.player = player;
        $scope.playerjb = global.reg(player.jb);
    }
    sessionStorage.removeItem("selectedUser");


    // var bank = jm.sdk.bank;
    // $scope.querybank = function () {
    //     bank.query({},function(err,result){
    //         result || (result||{});
    //         var holds = result.holds||{};
    //         var jbObj = holds.jb || {};
    //         $scope.balence = jbObj.amountValid||0;
    //         $scope.jb = global.reg(jbObj.amountValid||0);
    //     });
    // }
    // $scope.querybank();

    var page = 1;
    var pageSize = 10;
    var pages = 1;
    $scope.left = function (keyword) {
        if(page>1){
            --page;
            $scope.searchUser('',keyword);
        }
    }
    $scope.right = function (keyword) {
        if(page<pages){
            ++page;
            $scope.searchUser('',keyword);
        }
    };

    $scope.searchUser = function(_page,keyword){
        if(_page) page = 1;
        if($scope.play.toUserId){
            var url = statUri+'/players';
            $scope.moreLoading = true;
        }else{
            var url = "";
        }

        $http.get(url, {
            params:{
                token: sso.getToken(),
                page: page,
                rows: pageSize,
                search:keyword,
                isPlayer:true
            }
        }).success(function(result){
            $scope.moreLoading = false;
            var data = result;
            if(data.err){
                $scope.error(data.msg);
            }else{
                $scope.usersInfo = data;
                if(result.err){
                    $scope.error(result.msg);
                }else{
                    page = result.page;
                    pages = result.pages || 1;
                    $scope.page = page;
                    $scope.pages = pages;
                }
            }
        }).error(function(msg, code){
            $scope.errorTips(code);
        });
    };
    $scope.selectUser = function(row){
        $scope.play.toUserId = row.uid;
        $scope.nick = row.nick;
        var userId = row._id;
        bank.query({userId: userId},function(err, result){
            result || (result||{});
            var holds = result.holds||{};
            var jbObj = holds.jb || {};
            var jb = jbObj.amount || 0;
            $scope.player = {
                id: row._id,
                uid: row.uid,
                nick: row.nick,
                jb: jb
            }
        });
    };

    $scope.updateData = function(type, allAmount){

        if($scope.player){
            var player = $scope.player;
        }
        var ct = {'jb':global.translateByKey('common.jb')};
        var amount = $scope.play.amount;
        var memo = $scope.play.memo||"";
        var fromUserId,toUserId,info,sum;

        if(player != null){
            var account = player.nick||"";
            account += '('+ 'ID:' + (player.account||player.uid) + ')';
            if($scope.type == 'charge'){
                fromUserId = sso.user.id;
                toUserId = player.id;
                sum = player.jb + amount;
                info = global.translateByKey('search.player') + account + '<br/> '+global.translateByKey('search.balance') + global.reg(player.jb) + '<br/>'+global.translateByKey('search.charge') + amount + '<br> '+global.translateByKey('search.result')+global.reg(sum);
            }else if($scope.type == 'uncharge'){
                fromUserId = player.id;
                toUserId = sso.user.id;
                if(allAmount) amount = player.jb;
                sum = player.jb - amount;
                info = global.translateByKey('search.player')+ account + '<br/> '+global.translateByKey('search.balance') + global.reg(player.jb) + '<br/> '+global.translateByKey('search.uncharge') + amount + '<br> '+global.translateByKey('search.result')+global.reg(sum);
            }

            if(sum<0||amount>$scope.balence){
                $scope.openTips({
                    title: global.translateByKey('openTips.title'),
                    content: global.translateByKey('player.info.TipInfo.balance'),
                    cancelTitle: global.translateByKey('openTips.cancelDelContent'),
                    singleButton: true
                });
            }else{
                $scope.openTips({
                    title:global.translateByKey('player.info.TipInfo.title'),
                    content: info,
                    okTitle:global.translateByKey('player.info.TipInfo.okTitle'),
                    cancelTitle:global.translateByKey('player.info.TipInfo.cancelTitle'),
                    okCallback: function($s){

                        $http.post(agentUri+'/upcoin', {toUserId:toUserId,amount:amount,memo:memo},{
                            params: {
                                token: sso.getToken()
                            }
                        }).success(function(result){
                            if(result.err){
                                $timeout(function () {
                                    $scope.error(result.msg);
                                });
                            }else{
                                $timeout(function () {
                                    $scope.success(global.translateByKey('common.succeed'));
                                });
                                $scope.amount = "";
                                $scope.memo = "";
                                $scope.player = null;
                                $scope.play.amount = null;
                                $scope.querybank();
                                if(document.getElementById("searchinput")){
                                    document.getElementById("searchinput").value="";
                                };
                                $scope.nick = "";
                            }
                        }).error(function(msg, code){
                            $scope.errorTips(code);
                        });

                    }
                });
            }
        }else{
            $scope.openTips({
                title:global.translateByKey('openTips.title'),
                content:global.translateByKey('player.info.transferTip.tip'),
                cancelTitle:global.translateByKey('player.info.TipInfo.okTitle'),
                singleButton:true
            });
        }
    }
}]);