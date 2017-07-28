/**
 * Created by sahara on 2017/1/18.
 */
'use strict';

(function(){
    var name = 'acl';
    var path = 'apps/'+ name + '/';

    /**
     * acl for the router
     */
    angular.module('app')
        .config(
            [ '$stateProvider', '$urlRouterProvider', 'lazyLoadProvider',
                function ($stateProvider, $urlRouterProvider, lazyLoadProvider) {
                    $stateProvider
                        .state('app.acl', {
                            url: '/acl',
                            controller: 'AclCtrl',
                            template: '<div ui-view class="fade-in-down"></div>',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/index.js'])
                        })
                        .state('app.acl.user', {
                            url: '/user',
                            template: '<div ui-view class="fade-in-down"></div>',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/users.js'])
                        })
                        .state('app.acl.user.list', {
                            url: '/list',
                            templateUrl: path +'tpl/users_list.html',
                            controller: 'AclUsersListCtrl'
                        })
                        .state('app.acl.user.edit', {
                            url: '/edit/{id}',
                            templateUrl: path +'tpl/users_edit.html',
                            controller: 'AclUsersCtrl',
                            resolve: lazyLoadProvider.load(['ngTagsInput','localytics.directives','chosen'])
                        })
                        .state('app.acl.role', {
                            url: '/role',
                            templateUrl: path +'tpl/role.html',
                            controller: 'AclRoleCtrl',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/role.js','ngTagsInput','localytics.directives','chosen','ueditor'])
                        })
                        .state('app.acl.resource', {
                            url: '/resource',
                            templateUrl: path +'tpl/resource.html',
                            controller: 'AclResourceCtrl',
                            resolve:lazyLoadProvider.load([path + 'js/controllers/resource.js','treeControl','ngTagsInput','localytics.directives','chosen','ueditor'])
                        });
                }
            ]
        );
}());