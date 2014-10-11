define([
    'backbone'
], function (Backbone) {
    'use strict';
    var UserStoryModel = Backbone.Model.extend({
        defaults: {
            "title": "",
            "done": false,
            "desc": "",
            "businessvalue": "",
            "acceptancecriteria": "",
            "release": "",
            "sprint": "",
            "effort": 0,
            "remaining": 0,
            "remaining_prior": 0,
            "actual": 0,
            "progress_date": new Date(),
            "priority": "(A)",
            "project": "+default",
            "context": "@default",
            "status": "New",
            "id": ""
        },
        sync: function (method, model, options) {
            if (method === 'delete') {
                console.log('Deleted model ID: ' + model.get('id'));
            }
            return this;
        }
    });
    return UserStoryModel;
});
