'use strict';
angular.module('app')
    .config(['lazyLoadProvider', function (lazyLoadProvider) {
        lazyLoadProvider.configJQ({
            'lodash': ['../libs/jquery/lodash/dist/lodash.js']
        });
        lazyLoadProvider.configModule({
            'ngTagsInput': [
                '../libs/angular/ng-tags-input/ng-tags-input.js',
                '../libs/angular/ng-tags-input/ng-tags-input.css',
                '../libs/angular/ng-tags-input/ng-tags-input.bootstrap.css'
            ],
            'localytics.directives': [
                '../libs/angular/angular-chosen-localytics/dist/angular-chosen.min.js'
            ],
            'treeControl': [
                '../libs/angular/angular-tree-control/angular-tree-control.js',
                '../libs/angular/angular-tree-control/tree-control.css',
                '../libs/angular/angular-tree-control/tree-control-attribute.css'
            ],
            'ui.bootstrap.datetimepicker': [
                '../libs/angular/angular-bootstrap-datetimepicker/datetimepicker.css',
                '../libs/angular/angular-bootstrap-datetimepicker/css/datetimepicker.css',
                '../libs/angular/angular-bootstrap-datetimepicker/datetimepicker.js'
            ],
            'angular-img-cropper': [
                '../libs/angular/angular-img-cropper/dist/angular-img-cropper.min.js'
            ],
        });
    }])

    .service('global', ['$document', '$q', '$http', '$state', '$translate', '$filter', function ($document, $q, $http, $state, $translate, $filter) {
        var self = this;
        jm.enableEvent(self);
        var sso = jm.sdk.sso;
        self.ready = false;
        self.userInfo = {};
        self.roles = [];

        var d = new Date();
        self.UTC = d.getTimezoneOffset();

        self.browser = function(){
            var browser={
                versions:function(){
                    var u = navigator.userAgent, app = navigator.appVersion;
                    return {
                        trident: u.indexOf('Trident') > -1, //IE内核
                        presto: u.indexOf('Presto') > -1, //opera内核
                        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone
                        iPad: u.indexOf('iPad') > -1, //是否iPad
                        webApp: u.indexOf('Safari') == -1 //是否web应该程序
                    };
                }(),
                language:(navigator.browserLanguage || navigator.language).toLowerCase()//检测浏览器语言
            }
            if(browser.versions.android || browser.versions.mobile || browser.versions.ios){
                plat = 'Mobile';
            }else{
                plat = 'PC'
            }
            return browser;
        };

        self.dateRangeOptions = {
            "autoApply": true,
            "showDropdowns": true,
            "locale": {
                "format": "YYYY/MM/DD",
                "separator": " - ",
                "applyLabel": "应用",
                "cancelLabel": "取消",
                "fromLabel": "从",
                "toLabel": "到",
                "customRangeLabel": "Custom",
                "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                "monthNames": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
            }
        };

        if (!sso.getToken) {
            sso.getToken = function () {
                return jm.sdk.storage.getItem('token');
            }
        }
        self.getUser = function () {
            var deferred = $q.defer();
            sso.getUser({}, function (err, user) {
                if (!user) {
                    sso.authError = '账号或密码错误';
                    localStorage.setItem('isWXLogin', false);
                    deferred.reject({err: -1, msg: '用户无效'});
                } else {
                    self.userInfo = user;
                    deferred.resolve(user);
                }
            });
            return deferred.promise;
        };

        self.getLocalUser = function () {
            var deferred = $q.defer();
            if (sso.user) {
                deferred.resolve(sso.user);
            } else {
                self.on('getUser', function (user) {
                    deferred.resolve(user);
                });
            }
            return deferred.promise;
        };

        // self.getRoles = function () {
        //     var deferred = $q.defer();
        //     // var url = meixia + '/roles';
        //     $http.get(url, {
        //         params: {
        //             token: sso.getToken()
        //         }
        //     }).success(function (result) {
        //         // var obj = {roles:["superadmin"]};
        //         var obj = {}
        //         var obj = result;
        //         if (obj.err) {
        //             deferred.reject(obj);
        //         } else {
        //             var roles = obj.roles || [];
        //             self.roles = roles;
        //             if (roles.length) {
        //                 deferred.resolve(roles);
        //             } else {
        //                 var isWXLogin = localStorage.getItem('isWXLogin');
        //                 sso.authError = isWXLogin == 'true' ? '您还不是本站会员' : '您不是本站管理员';
        //                 deferred.reject({err: -1, msg: '未分配角色'});
        //             }
        //         }
        //     }).error(function (msg, code) {
        //         deferred.reject({code: code});
        //     });
        //     return deferred.promise;
        // };

        self.getUserPermission = function (resource) {
            var deferred = $q.defer();
            $http.get(aclUri + '/user/permissions', {
                params: {
                    token: sso.getToken(),
                    resource: resource
                }
            }).success(function (result) {
                if (result.err) {
                    deferred.reject(result);
                } else {
                    var obj = {};
                    for(var key in result){
                        var ary = result[key];
                        var per = {};
                        ary.forEach(function(item){
                            per[item] = 1;
                        });
                        obj[key] = per;
                    }
                    deferred.resolve(obj);
                }
            }).error(function (msg, code) {
                deferred.reject({code: code});
            });
            return deferred.promise;
        };

        self.translateByKey = function(key,expression,comparator){
            return $filter('translate').apply(this, arguments);
        };

        self.agGrid = {
            localeText:{
                // for filter panel
                page: ' ',
                more: ' ',
                to: '-',
                of: '/',
                next: '下一页',
                last: '末尾页',
                first: '首页',
                previous: '上一页',
                loadingOoo: '加载中...',
                // for set filter
                selectAll: '全选',
                searchOoo: '搜索...',
                blanks: '空白',
                // for number filter and string filter
                filterOoo: '过滤...',
                applyFilter: '应用过滤...',
                // for number filter
                equals: '等于',
                lessThan: '小于',
                greaterThan: '大于',
                // for text filter
                contains: '包含',
                startsWith: '开始',
                endsWith: '结束',
                // tool panel
                columns: '列',
                pivotedColumns: '主列',
                pivotedColumnsEmptyMessage: '请将列拖到这里',
                valueColumns: '列值',
                valueColumnsEmptyMessage: '请将列拖到这里',
                //
                noRowsToShow: '无数据'
            }
        };
        self.aggridTranslate = function(translateKeys, gridOptions) {
            $translate(translateKeys).then(function (translate) {
                self.agGridHeaderTranslates = translate;
                gridOptions.api.refreshHeader();
                gridOptions.api.refreshView();

                var btLast = document.getElementById('btLast');
                if(btLast){
                    btLast.innerHTML = self.agGrid.localeText.last;
                }
                var btNext = document.getElementById('btNext');
                if(btNext){
                    btNext.innerHTML = self.agGrid.localeText.next;
                }
                var btPrevious = document.getElementById('btPrevious');
                if(btPrevious){
                    btPrevious.innerHTML = self.agGrid.localeText.previous;
                }
                var btFirst = document.getElementById('btFirst');
                if(btFirst){
                    btFirst.innerHTML = self.agGrid.localeText.first;
                }

                self.agGridOverlay();

            }, function (error) {
                console.log(error);
            });
        };

        self.agGridOverlay = function(){
            var overlay = angular.element(document.getElementById('overlay')).find('span');
            var content = overlay.html();
            if(content == "ag-grid.loading") overlay.html(self.agGrid.localeText.loadingOoo);
            if(content == "ag-grid.noRowsToShow") overlay.html(self.agGrid.localeText.noRowsToShow);
            if(content==self.agGrid.loadingOoo) overlay.html(self.agGrid.localeText.loadingOoo);
            if(content==self.agGrid.noRowsToShow) overlay.html(self.agGrid.localeText.noRowsToShow);
        };

        self.agGridHeaderTranslates = null;
        self.agGridHeaderCellRendererFunc = function(params) {
            var eHeader = document.createElement('span');
            if(params.colDef.translateKey){
                // var headerName = translates[params.colDef.translateKey];
                var translates = self.agGridHeaderTranslates;
                if(translates){
                    var headerName = translates[params.colDef.translateKey];
                    if(headerName){
                        params.colDef.headerName = headerName;
                    }
                }
            }

            var eTitle = document.createTextNode(params.colDef.headerName + '');
            eHeader.appendChild(eTitle);

            return eHeader;
        };

        self.agGridTranslateSync = function($scope, columnDefs, headsRranslateKeys){
            $scope.$on('translateBroadcast', function () {
                self.aggridTranslate(headsRranslateKeys, $scope.gridOptions);
            });
            $translate(headsRranslateKeys).then(function (translate) {
                self.agGridHeaderTranslates = translate;
                if($scope.gridOptions.api){
                    $scope.gridOptions.api.refreshHeader();
                }
            }, function (error) {
                console.log(error);
            });
            headsRranslateKeys.forEach(function(key,index){
                columnDefs[index].translateKey = key;
            });
        };

        self.getImgUri = function(uri, bTimestamp){
            if (uri){
                if(bTimestamp){
                    uri += '?t=' + new Date();
                }
                return uri;
            }
            return '/apps/common/img/logo.jpg';
        };


        self.isIE = function () {
            return !!navigator.userAgent.match(/MSIE/i);
        };

        self.isSmartDevice = function () {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        };

        self.location2info = function (location, cb) {
            var url = 'http://api.map.baidu.com/geocoder/v2/?ak=C6MDDbngC73PDlo6ifrzISzG&callback=?&location=' + location.latitude + ',' + location.longitude + '&output=json&pois=0';
            $.getJSON(url, function (res) {
                var province = res.result.addressComponent.province.replace('省', '');
                var city = res.result.addressComponent.city.replace('市', '');
                return cb({
                    province: province,
                    city: city
                });
                //addressComponent => {city: "广州市", district: "天河区", province: "广东省", street: "广州大道", street_number: "中922号-之101-128"}
            });
        };

        self.getLocationInfo = function (cb) {
            if (self.getLocation) {
                return self.getLocation(null, function (location) {
                    self.location2info(location, cb);
                })
            }
            if (remote_ip_info && remote_ip_info.ret == '1') {
                return cb({
                    province: remote_ip_info.province,
                    city: remote_ip_info.city
                });
            }
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        return self.location2info(position.coords, cb);
                    },
                    cb
                );
                return;
            }
        };

        self.reg = function (data) {
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        };

    }])
;
