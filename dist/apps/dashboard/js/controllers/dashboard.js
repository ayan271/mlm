'use strict';

app.controller('DashboardCtrl', ['$scope', '$translate', '$translatePartialLoader',  '$state', '$http', '$interval', 'global', function ( $scope, $translate, $translatePartialLoader,$state, $http, $interval,  global ) {
    $translatePartialLoader.addPart('dashboard');

    var d = new Date();
    var UTC = d.getTimezoneOffset();

    var sso=jm.sdk.sso;
    var bank = jm.sdk.bank;
    var reg = function (data) {
        return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    };
    if(omsPlatform === pfm_oms){
        $scope.switchs = true;
    }else{
        $scope.switchs = false;
    }

    // bank.query({},function(err,result){
    //     result || (result||{});
    //     var holds = result.holds||{};
    //     var tbObj = holds.tb || {};
    //     var jbObj = holds.jb || {};
    //     var dbjObj = holds.dbj || {};
    //     $scope.tb = reg(tbObj.amountValid||0);
    //     $scope.jb = reg(jbObj.amountValid||0);
    //     $scope.dbj = reg(dbjObj.amountValid||0);
    // });

    $scope.search = {};
    $scope.search.date || ($scope.search.date = {});

    $scope.search.date = {
        startDate: moment().subtract(7, 'days'),
        endDate: moment()
    };
    $scope.agent = {};
    $scope.stat = {};

    $scope.dateOptions = angular.copy(global.dateRangeOptions);
    $scope.dateOptions.opens = 'left';

    // $scope.url = 'http://'+$scope.host+'/index.html';
    // $scope.promote = uploadUri+'/qrcode?info='+$scope.url;
    //
    // $http.get(packUri + "/client", {
    //     params: {
    //         token: sso.getToken()
    //     }
    // }).success(function (result) {
    //     if (result.err) {
    //         $scope.error(result.msg);
    //     } else {
    //         result = result || {};
    //         $scope.android_Path = staticHost + result.androidPath
    //     }
    // }).error(function (msg, code) {
    //     $scope.errorTips(code);
    // });

    // $scope.agent = {ratio:0, settled:0};
    // $http.get(agentUri + '/info', {
    //     params: {
    //         token: sso.getToken()
    //     }
    // }).success(function (result) {
    //     // console.log(result);
    //     if(result._id){
    //         $scope.agent = result || {};
    //         $scope.agent.ratio||($scope.agent.ratio=0);
    //         $scope.agent.settled||($scope.agent.settled=0);
            // if($scope.agent.agent){
            //     $scope.agent.agent.ratio||($scope.agent.agent.ratio=0);
            // }else{
            //     $scope.agent.agent={};
            //     $scope.agent.agent.ratio||($scope.agent.agent.ratio=1);
            // }
    //     }
    // }).error(function (msg, code) {
    //     $scope.errorTips(code);
    // });

    $scope.download = function(){
        if($scope.android_Path) window.location.href = $scope.android_Path;
    };

    // global.getLocalUser().then(function(user){
    //     $http.get(agentUri + '/agents/'+user.id, {
    //         params: {
    //             token: sso.getToken()
    //         }
    //     }).success(function (result) {
    //         if (result.err) {
    //             $scope.error(result.msg);
    //         } else {
    //             result = result || {};
    //             var code = result.code;
    //             var level = result.level;
    //             $scope.level = level;
    //             $scope.code = code;
    //             if(code&&level==2){
    //                 $scope.url = 'http://'+$scope.host+'/agent.html?agent='+code;
    //                 $scope.promote = uploadUri+'/qrcode?info='+$scope.url;
    //             }
    //         }
    //     }).error(function (msg, code) {
    //         $scope.errorTips(code);
    //     });
    // });
    //
    // $scope.divided = {};
    // var reqStat = function(){
    //     if(omsPlatform === pfm_oms){
    //         $http.get(statUri+'/multiple', {
    //             params:{
    //                 token: sso.getToken(),
    //                 UTC: UTC,
    //                 fields:{user_total:1,user_yesterday:1,user_today:1,user_guest:1,user_mobile:1,user_wechat:1,user_qq:1,
    //                     recharge_total:1,recharge_yesterday:1,recharge_today:1,recharge_order_total:1,recharge_order_valid:1,recharge_order_invalid:1}
    //             }
    //         }).success(function(result){
    //             console.log(result);
    //             var obj = result;
    //             if(obj.err){
    //                 $scope.error(obj.msg);
    //             }else{
    //                 $scope.stat = obj||{};
    //                 $scope.stat.recharge_total = reg($scope.stat.recharge_total*0.01||0);
    //                 $scope.stat.recharge_yesterday = reg($scope.stat.recharge_yesterday*0.01||0);
    //                 $scope.stat.recharge_today = reg($scope.stat.recharge_today*0.01||0);
    //                 $scope.stat.recharge_order_total = reg($scope.stat.recharge_order_total||0);
    //                 $scope.stat.recharge_order_valid = reg($scope.stat.recharge_order_valid||0);
    //                 $scope.stat.recharge_order_invalid = reg($scope.stat.recharge_order_invalid||0);
    //             }
    //         }).error(function(msg, code){
    //             $scope.errorTips(code);
    //         });
    //     }else if(omsPlatform === pfm_cy){
    //         $http.get(statUri+'/multiple', {
    //             params:{
    //                 token: sso.getToken(),
    //                 UTC: UTC,
    //                 fields:{user_yesterday:1,user_today:1,login_today:1,login_yesterday:1,gain_total:1,user_total:1}
    //             }
    //         }).success(function(result){
    //             var obj = result;
    //             if(obj.err){
    //                 $scope.error(obj.msg);
    //             }else{
    //                 $scope.stat = obj||{};
    //                 var gain_jb = $scope.stat.gain_total.gain_jb;
    //                 $scope.divided.gain_jb = reg(gain_jb || 0);
    //                 $scope.divided.notDivided = reg(Math.floor((gain_jb-$scope.agent.settled)||0));
    //                 $scope.divided.amount = reg(Math.floor(((gain_jb-$scope.agent.settled) *$scope.agent.ratio)||0));
    //                 $scope.divided.settled = reg($scope.agent.settled);
    //             }
    //         }).error(function(msg, code){
    //             $scope.errorTips(code);
    //         });
    //     }
    // };

    // reqStat();
    // var t = $interval(function(){
    //     reqStat();
    // }, 5000);
    // $scope.$on("$destroy", function(){
    //     $interval.cancel(t);
    // });
    //
    // $scope.$on('translateBroadcast', function () {
    //     $scope.getData();
    // });

    //平台数据
    var orders = [
        {key:'register',name:'注册人数'},
        {key:'login',name:'登录人数'},
        {key:'arpu',name:'ARPU'},
        {key:'recharge_p',name:'充值人数'},
        {key:'recharge',name:'充值数'},
        {key:'arppu',name:'ARPPU'}
    ];
    $scope.lineOptions = [];

    // $scope.getData = function(){
    //     var search = $scope.search;
    //     var date = search.date;
    //     var startDate = date.startDate || "";
    //     var endDate = date.endDate || "";
    //
    //     $http.get(statUri+'/report/account', {
    //         params:{
    //             token: sso.getToken(),
    //             rows: 7,
    //             startDate: startDate.toString(),
    //             endDate: endDate.toString()
    //         }
    //     }).success(function(result){
    //         if(result.err){
    //             $scope.error(result.msg);
    //         }else{
    //             $scope.stats = result.rows||[];
    //             var statMap = {
    //                 register:{x:[],y:[],max:0},
    //                 login:{x:[],y:[],max:0},
    //                 recharge_p:{x:[],y:[],max:0},
    //                 recharge:{x:[],y:[],max:0},
    //                 arpu:{x:[],y:[],max:0},
    //                 arppu:{x:[],y:[],max:0}
    //             };
    //             $scope.lineOptions = [];
    //             _.forEachRight($scope.stats, function(item) {
    //                 var date = moment(item.date).format('MM-DD');
    //                 statMap.register.x.push(date);
    //                 statMap.login.x.push(date);
    //                 statMap.recharge_p.x.push(date);
    //                 statMap.recharge.x.push(date);
    //                 statMap.arpu.x.push(date);
    //                 statMap.arppu.x.push(date);
    //
    //                 var arpu = item.login?Math.round(item.recharge/item.login):0;
    //                 var arppu = item.recharge_p?Math.round(item.recharge/item.recharge_p):0;
    //                 statMap.register.y.push(item.register);
    //                 statMap.login.y.push(item.login);
    //                 statMap.recharge_p.y.push(item.recharge_p);
    //                 statMap.recharge.y.push(item.recharge);
    //                 statMap.arpu.y.push(arpu);
    //                 statMap.arppu.y.push(arppu);
    //
    //                 statMap.register.max<item.register && (statMap.register.max=item.register);
    //                 statMap.login.max<item.login && (statMap.login.max=item.login);
    //                 statMap.recharge_p.max<item.recharge_p && (statMap.recharge_p.max=item.recharge_p);
    //                 statMap.recharge.max<item.recharge && (statMap.recharge.max=item.recharge);
    //                 statMap.arpu.max<arpu && (statMap.arpu.max=arpu);
    //                 statMap.arppu.max<arppu && (statMap.arppu.max=arppu);
    //             });
    //             orders.forEach(function(item){
    //                 var o = statMap[item.key];
    //                 var name = global.translateByKey('dashboard.platformData.'+item.key);
    //                 var opts = {
    //                     name: name,
    //                     x: o.x,
    //                     y: o.y,
    //                     max: o.max
    //                 };
    //                 $scope.lineOptions.push(getLineOption(opts));
    //             });
    //         }
    //     }).error(function(msg, code){
    //         $scope.errorTips(code);
    //     });
    // };

    // function onClick(params){
    //     console.log(params);
    // };

    $scope.lineConfig = {
        theme:'default',
        // event: [{click:onClick}],
        dataLoaded:true
    };

    var colors = ['#5793f3', '#d14a61', '#675bba'];

    // var getLineOption = function(opts){
    //     opts || (opts={});
    //     opts.max || (opts.max=100);
    //     if(opts.max<10) opts.max = 10;
    //     var max = Math.round(opts.max*1.2);
    //     var step = Math.round(max/6);
    //     return {
    //         color: colors,
    //         tooltip: {
    //             trigger: 'axis'
    //         },
    //         toolbox: {
    //             feature: {
    //                 // dataView: {show: true, readOnly: true},
    //                 magicType: {show: true, type: ['line', 'bar']},
    //                 // restore: {show: true},
    //                 saveAsImage: {show: true}
    //             }
    //         },
    //         legend: {
    //             data:[opts.name],
    //             // x:'left'
    //         },
    //         xAxis: [
    //             {
    //                 type: 'category',
    //                 data: opts.x||[]
    //             }
    //         ],
    //         yAxis: [
    //             {
    //                 type: 'value',
    //                 name: opts.name,
    //                 min: 0,
    //                 max: max,
    //                 interval: step,
    //                 axisLine: {
    //                     lineStyle: {
    //                         color: colors[0]
    //                     }
    //                 }
    //             }
    //         ],
    //         series: [
    //             {
    //                 name: opts.name,
    //                 type:'bar',
    //                 data:opts.y||[]
    //             }
    //         ]
    //     }
    // };
    // $scope.$watch('search.date', function () {
    //     $scope.getData();
    // });
}]);


