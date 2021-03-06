'use strict';

(function(){
    var name = 'team';
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
                            controller: 'TeamCtrl',
                            template: '<div ui-view class="fade-in-down"></div>',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/index.js'])
                        })
                        .state('app.team.config', {
                            url: '/info',
                            template: '<div ui-view class="fade-in-down"></div>',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/config.js'])
                        })
                        .state('app.team.config.list', {
                            url: '/list',
                            templateUrl: path +'tpl/config_list.html',
                            controller: 'ConfiglistCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen'])
                        })
                        .state('app.team.config.edit', {
                            url: '/edit/{id}',
                            templateUrl: path +'tpl/config_edit.html',
                            controller: 'ConfigeditCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen'])
                        })
                        .state('app.team.new', {
                            url: '/new',
                            templateUrl: path +'tpl/newteam.html',
                            controller: 'NewteamCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/newteam.js'])
                        })
                        .state('app.team.manage', {
                            url: '/manage',
                            templateUrl: path +'tpl/manage.html',
                            controller: 'ManageCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/manage.js'])
                        })
                        .state('app.team.out', {
                            url: '/out',
                            templateUrl: path +'tpl/outteam.html',
                            controller: 'OutteamCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/outteam.js'])
                        })
                    ;
                }
            ]
        );
}());

