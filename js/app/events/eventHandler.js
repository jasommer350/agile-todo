define(["underscore", "backbone"], function (_, Backbone) {
    'use strict';
    var events = {
        ventObj: _.extend({}, Backbone.Events)
    };
    return events;
});