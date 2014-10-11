require.config({
    paths: {
        'jquery': 'libs/jquery-1.11.1.min',
        'underscore': 'libs/underscore',
        'backbone': 'libs/backbone-min',
        'bootstrap': 'libs/bootstrap'
    },
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': {
            //Only needs deps because it expends jquery
            deps: [
                'jquery'
            ]
        }
    }
});

require(['backbone', 'bootstrap', 'app/app'], function (Backbone, Bootstrap, App) {
    'use strict';
    App.initialize();
});