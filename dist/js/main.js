'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$rootScope', '$scope', '$translate', '$localStorage', '$window', 'toaster', '$modal', '$location', 'global','$http',
        function ($rootScope, $scope, $translate, $localStorage, $window, toaster, $modal, $location, global,$http) {
            // add 'ie' classes to html

            var isIE = !!navigator.userAgent.match(/MSIE/i);
            if (isIE) {
                angular.element($window.document.body).addClass('ie');
            }

            if (isSmartDevice($window)) {
                angular.element($window.document.body).addClass('smart')
                $scope.isSmartDevice = true;
            };

            var host = $location.host();
            var port = $location.port();
            $scope.host = port==80 ? host : host+':'+port;
            console.log($scope.host);

            $scope.apiHost = apiHost;
            $scope.sdkHost = sdkHost;
            $scope.staticHost = staticHost;

            // config
            $scope.app = {
                name: 'MLM',
                version: '0.0.1',
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info: '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger: '#f05050',
                    light: '#e8eff0',
                    dark: '#3a3f51',
                    black: '#1c2b36'
                },
                settings: {
                    themeID: 1,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: true,
                    asideFolded: false,
                    asideDock: false,
                    container: false
                },
                navHeight: window.innerHeight - 50
            };
            //检测浏览器
            global.browser();
            // save settings to local storage
            // if (angular.isDefined($localStorage.settings)) {
            //     $scope.app.settings = $localStorage.settings;
            // } else {
            //     $localStorage.settings = $scope.app.settings;
            // }
            $scope.$watch('app.settings', function () {
                if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                    // aside dock and fixed must set the header fixed.
                    $scope.app.settings.headerFixed = true;
                }
                // for box layout, add background image
                $scope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');
                // save to local storage
                $localStorage.settings = $scope.app.settings;
            }, true);

            // angular translate
            $scope.lang = {
                isopen: false
            };
            $scope.langs = {
                zh_CN: '中文',
                en: 'English',
                vi: 'Tiếng Việt'
            };
            $scope.langKey = localStorage.getItem('langKey')||"zh_CN";
            $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || '中文';
            $scope.setLang = function (langKey, $event) {
                // set the current lang
                $scope.selectLang = $scope.langs[langKey];
                // You can change the language during runtime
                $translate.use(langKey);
                $scope.lang.isopen = !$scope.lang.isopen;
                localStorage.setItem('langKey',langKey);

                $scope.langKey = langKey;
            };

            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

            //toaster全局定义
            $scope.error = function (title, body) {
                toaster.pop('error', title, body);
            };

            $scope.info = function (title, body) {
                toaster.pop('info', title, body);
            };

            $scope.success = function (title, body) {
                toaster.pop('success', title, body);
            };

            $scope.warning = function (title, body) {
                toaster.pop('warning', title, body);
            };

            $scope.errorTips = function(code){
                if(code==401){
                    $scope.error(global.translateByKey('common.notLogged'));
                }else if(code==403){
                    $scope.error(global.translateByKey('common.noPermission'));
                }else if(code==404){
                    $scope.error(global.translateByKey('common.requestPathFailed'));
                }else{
                    $scope.error(global.translateByKey('common.networkFault'));
                }
            };

            //angular-Grid全局定义
            $scope.angGridFormatDateS = function (params) {
                var date = params.data[params.colDef.field];
                if(!date) return '';
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            };
            $scope.angGridFormatDate = function (params) {
                var date = params.data[params.colDef.field];
                if(!date) return '';
                return moment(date).format('YYYY-MM-DD');
            };

            $scope.angGridFormatStatus = function (params) {
                return params.data[params.colDef.field] ? "启用" : "禁用";
            };

            $scope.$on('translateBroadcast', function () {
                global.agGrid.loadingOoo = global.agGrid.localeText.loadingOoo;
                global.agGrid.noRowsToShow = global.agGrid.localeText.noRowsToShow;
                global.agGrid.localeText.next = global.translateByKey('ag-grid.next');
                global.agGrid.localeText.last = global.translateByKey('ag-grid.last');
                global.agGrid.localeText.first = global.translateByKey('ag-grid.first');
                global.agGrid.localeText.previous = global.translateByKey('ag-grid.previous');
                global.agGrid.localeText.loadingOoo = global.translateByKey('ag-grid.loading');
                global.agGrid.localeText.noRowsToShow = global.translateByKey('ag-grid.noRowsToShow');
            });

            $rootScope.$on('$translateLoadingError', function () {
                console.log('$translateLoadingError');
                $scope.warning('Resource is not fully loaded refresh page');
            });

            window.onresize = function () {
                $scope.app.navHeight = window.innerHeight - 50;
            };

            $scope.openTips = function (opts) {
                opts = opts || {};
                opts.title = opts.title || '提示';
                opts.content = opts.content || '';
                opts.cancelTitle = opts.cancelTitle || '取消';
                opts.cancelCallback = opts.cancelCallback || function () {
                    };
                opts.okTitle = opts.okTitle || '确定';
                opts.okCallback = opts.okCallback || function () {
                    };
                opts.singleButton = opts.singleButton || false;

                var modalInstance = $modal.open({
                    template: '<div class="modal-header">' +
                    '<h3 class="modal-title">' + opts.title + '</h3>' +
                    '</div>' +
                    '<div class="modal-body">' + opts.content + '</div>' +
                    '<div class="modal-footer">' +
                    '<button class="btn btn-default" ng-click="cancel()">' + opts.cancelTitle + '</button>' +
                    '<button class="btn btn-primary" ng-click="ok()" ng-hide="' + opts.singleButton + '">' + opts.okTitle + '</button>' +
                    '</div>',
                    controller: 'ModalInstanceCtrl',
                    size: opts.size,
                    resolve: {
                        tipsOpts: function () {
                            return opts;
                        }
                    }
                });

                modalInstance.result.then(function ($s) {
                    opts.okCallback($s);
                }, function () {
                    opts.cancelCallback();
                });
            };
            var sso = jm.sdk.sso;
            var bank = jm.sdk.bank;
            var page = 1;
            var pageSize = 10;
            var pages = 1;
            var total = 0;
            $scope.left = function (publickey) {
                if (page > 1) {
                    --page;
                    $scope.search(publickey);
                }
            }
            $scope.right = function (publickey) {
                if (page < pages) {
                    ++page;
                    $scope.search(publickey);
                }
            };
            $scope.search = function (publickey,_page) {
                if (_page) page = 1;
                if (publickey) {
                    var urll = statUri + '/players';
                    $scope.moreLoading = true;
                } else {
                    var urll = "";
                }
                $http.get(urll, {
                    params: {
                        page: page,
                        rows: pageSize,
                        token: sso.getToken(),
                        search: publickey
                    }
                }).success(function (result) {
                    $scope.moreLoading = false;
                    if (result.err) {
                        $scope.error(result.msg);
                    } else {
                        page = result.page;
                        pages = result.pages || 1;
                        total = result.total || 0;
                        $scope.page = page;
                        $scope.pages = pages;
                        $scope.total = total;
                        $scope.usersInfo = result;
                    }
                }).error(function (msg, code) {
                    $scope.errorTips(code);
                });
            };

            $scope.selectUser = function (row) {
                var userId = row._id;
                var uid = row.uid;
                var nick = row.nick;
                bank.query({userId: userId}, function (err, result) {
                    result || (result || {});
                    // console.info(result);
                    var holds = result.holds || {};
                    var jbObj = holds.jb || {};
                    var jb = jbObj.amount || 0;
                    var obj = {
                        id: userId,
                        uid: uid,
                        nick: nick,
                        jb: jb
                    };
                    sessionStorage.setItem('selectedUser', JSON.stringify(obj));//缓存到本地
                    $scope.player = row;
                    $scope.player.id = result.id;
                    $scope.player.jb = jb;
                    $('#searchUser').modal('hide');
                });
            };
        }
    ])
    .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close($scope);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);