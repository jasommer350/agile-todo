define([
    'backbone'
], function (Backbone) {
    'use strict';
    var ToDoModel = Backbone.Model.extend({
        defaults: {
            "title": "",
            "done": false,
            "desc": "",
            "priority": "(A)",
            "project": "+default",
            "context": "@default",
            "status": "New",
            "id": "",
            "timer":"00:00:00"
        },
        sync: function (method, model, options) {
            if (method === 'delete') {
                console.log('Deleted model ID: ' + model.get('id'));
            }
            return this;
        }
    });
    return ToDoModel;
});
