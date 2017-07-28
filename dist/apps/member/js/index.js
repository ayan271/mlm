'use strict';

(function(){
    var name = 'member';
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
                            controller: 'MemberCtrl',
                            template: '<div ui-view class="fade-in-down"></div>',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/index.js'])
                        })
                        .state('app.member.info', {
                            url: '/info',
                            template: '<div ui-view class="fade-in-down"></div>',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/info.js'])
                        })
                        .state('app.member.info.list', {
                            url: '/list',
                            templateUrl: path +'tpl/info_list.html',
                            controller: 'InfolistCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen'])
                        })
                        .state('app.member.info.edit', {
                            url: '/edit/{id}',
                            templateUrl: path +'tpl/info_edit.html',
                            controller: 'InfoeditCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen'])
                        })
                        .state('app.member.member', {
                            url: '/member',
                            templateUrl: path +'tpl/member.html',
                            controller: 'MemberCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/member.js'])
                        })
                        .state('app.member.vip', {
                            url: '/vip',
                            templateUrl: path +'tpl/vip.html',
                            controller: 'VipCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/vip.js'])
                        })
                        .state('app.member.supervip', {
                            url: '/supervip',
                            templateUrl: path +'tpl/supervip.html',
                            controller: 'SupervipCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/supervip.js'])
                        })
                        .state('app.member.config', {
                            url: '/config',
                            templateUrl: path +'tpl/config.html',
                            controller: 'ConfigCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/config.js'])
                        })
                        .state('app.member.newmember', {
                            url: '/newmember',
                            templateUrl: path +'tpl/newmember.html',
                            controller: 'NewmemberCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen',path + 'js/controllers/newmember.js'])
                        })
                    ;
                }
            ]
        );
}());

