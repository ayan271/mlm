'use strict';
angular.module('app')
    .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

                // lazy controller, directive and service
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;
            }
        ])
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider
            .useLoader('$translatePartialLoader', {
                urlTemplate: 'apps/{part}/l10n/{lang}.json'
            })
            .preferredLanguage('zh_CN')
            .fallbackLanguage('zh_CN')
            .useLocalStorage()
        ;
    }])
;

var app = angular.module('app');

