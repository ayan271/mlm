'use strict';

(function () {
    var name = 'main';
    var path = 'apps/' + name + '/';

    angular.module('app')
        .config(
            ['$stateProvider', '$urlRouterProvider','lazyLoadProvider',
                function ($stateProvider, $urlRouterProvider, lazyLoadProvider) {
                    var layout = "tpl/app.html";
                    $urlRouterProvider
                        .otherwise('/app/dashboard');

                    $stateProvider
                        .state('app', {
                            abstract: true,
                            url: '/app',
                            templateUrl: path + layout,
                            controller: 'MainCtrl',
                            resolve: lazyLoadProvider.load(['lodash', path + 'js/controllers/index.js'])
                        })
                        .state('app.profile', {
                            url: '/profile',
                            templateUrl: path + 'tpl/profile.html',
                            controller: 'ProfileCtrl',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/profile.js'])
                        })
                        .state('app.profile.avatar', {
                            url: '/avatar',
                            templateUrl: path +'tpl/imgcrop.html',
                            resolve:lazyLoadProvider.load([ 'ngImgCrop'])
                        })
                        .state('app.updatepasswd', {
                            url: '/updatepasswd',
                            templateUrl: path + 'tpl/updatepasswd.html',
                            controller: 'UpdatePasswdCtrl',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/updatepasswd.js'])
                        })
                        .state('app.security', {
                            url: '/security/{successUri}',
                            templateUrl: path + 'tpl/security.html',
                            controller: 'SecurityCtrl',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/security.js'])
                        })
                        .state('lockme', {
                            url: '/lockme',
                            templateUrl: path + 'tpl/page_lockme.html',
                            controller: 'SigninCtrl',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/signin.js'])
                        })
                        .state('access', {
                            url: '/access',
                            template: '<div ui-view class="fade-in-right-big smooth"></div>'
                        })
                        .state('access.signin', {
                            url: '/signin',
                            templateUrl: path + 'tpl/page_signin.html',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/signin.js'])
                        })
                        .state('access.signup', {
                            url: '/signup',
                            templateUrl: path + 'tpl/page_signup.html',
                            resolve: lazyLoadProvider.load([path + 'js/controllers/signup.js'])
                        })
                        .state('access.forgotpwd', {
                            url: '/forgotpwd',
                            templateUrl: path + 'tpl/page_forgotpwd.html',
                            controller: 'ResetPasswdCtrl',
                            resolve: lazyLoadProvider.load([path +'js/controllers/resetpasswd.js'])
                        })
                        .state('access.404', {
                            url: '/404',
                            templateUrl: path + 'tpl/page_404.html'
                        })
                    ;
                }
            ]
        )
    ;
}());
