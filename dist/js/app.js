'use strict';
agGrid.initialiseAgGridWithAngular1(angular);
angular.module('app', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'ui.load',
    'ui.jq',
    'ui.tree',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'toaster',
    'agGrid',
    'ng.ueditor'
])
    .run(
        ['$rootScope', '$state', '$stateParams', '$translate',
            function ($rootScope, $state, $stateParams, $translate) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
                    $translate.refresh();
                });

                $rootScope.$on('$translateChangeSuccess', function () {
                    $rootScope.$broadcast('translateBroadcast');
                });

                $rootScope.$on('$translateChangeError', function () {
                    console.log('$translateChangeError');
                });

            }
        ]
    )
;
