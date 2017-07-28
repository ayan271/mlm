'use strict';

(function(){
    var name = 'dashboard';
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
                            templateUrl: path + 'tpl/index.html',
                            controller: 'DashboardCtrl',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/dashboard.js','daterangepicker', 'echarts'])
                        })
                    ;
                }
            ]
        );
}());

