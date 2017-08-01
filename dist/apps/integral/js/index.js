'use strict';

(function(){
    var name = 'integral';
    var path = 'apps/'+ name + '/';

    /**
     * Config for the router
     */
    angular.module('app')
        .config(
            [          '$stateProvider', '$urlRouterProvider','lazyLoadProvider',
                function ($stateProvider,   $urlRouterProvider, lazyLoadProvider) {
                    $stateProvider
                        .state('app.' + name, {
                            url: '/' + name,
                            controller: 'IntegralCtrl',
                            template: '<div ui-view class="fade-in-down"></div>',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/index.js'])
                        })
                        .state('app.integral.info', {
                            url: '/info',
                            templateUrl: path +'tpl/info.html',
                            controller: 'InfoCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/info.js'])
                        })
                        .state('app.integral.detail', {
                            url: '/detail/{id}{uid}',
                            templateUrl: path +'tpl/detail.html',
                            controller: 'DetailCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/info.js'])
                        })
                        .state('app.integral.give', {
                            url: '/give',
                            templateUrl: path +'tpl/give.html',
                            controller: 'GiveCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/give.js'])
                        })
                        .state('app.integral.withdraw', {
                            url: '/withdraw',
                            templateUrl: path +'tpl/withdraw.html',
                            controller: 'WithdrawCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/withdraw.js'])
                        })
                        .state('app.integral.log', {
                            url: '/log',
                            templateUrl: path +'tpl/log.html',
                            controller: 'LogCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/log.js'])
                        })
                    ;
                }
            ]
        );
}());

