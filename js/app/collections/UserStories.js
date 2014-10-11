define([
    'underscore',
    'backbone',
    'app/models/UserStory'
], function (_, Backbone, UserStory) {
    'use strict';
    var UserStoryCollection = Backbone.Collection.extend({
        model: UserStory,
        url: '/userstory',
        //vent: Vent.ventObj,
        //Method gets a response from the server and returns the parsed version of the information we want
        parse: function (response) {
            return response.list;
        },
        comparator: function (todoModel) {
            return todoModel.get("priority");
        },
        strategies: {
            title_a: function (todoModel, todoModel2) {
                return todoModel.get("title") > todoModel2.get("title") ? 1 : -1;
            },
            title_d: function (todoModel, todoModel2) {
                return todoModel.get("title") > todoModel2.get("title") ? -1 : 1;
            },
            priority_a: function (todoModel, todoModel2) {
                return todoModel.get("priority") > todoModel2.get("priority") ? 1 : -1;
            },
            priority_d: function (todoModel, todoModel2) {
                return todoModel.get("priority") > todoModel2.get("priority") ? -1 : 1;
            },
            project_a: function (todoModel, todoModel2) {
                return todoModel.get("project") > todoModel2.get("project") ? 1 : -1;
            },
            project_d: function (todoModel, todoModel2) {
                return todoModel.get("project") > todoModel2.get("project") ? -1 : 1;
            },
            context_a: function (todoModel, todoModel2) {
                return todoModel.get("context") > todoModel2.get("context") ? 1 : -1;
            },
            context_d: function (todoModel, todoModel2) {
                return todoModel.get("context") > todoModel2.get("context") ? -1 : 1;
            },
            release_a: function (todoModel, todoModel2) {
                return todoModel.get("release") > todoModel2.get("release") ? 1 : -1;
            },
            release_d: function (todoModel, todoModel2) {
                return todoModel.get("release") > todoModel2.get("release") ? -1 : 1;
            },
            sprint_a: function (todoModel, todoModel2) {
                return todoModel.get("sprint") > todoModel2.get("sprint") ? 1 : -1;
            },
            sprint_d: function (todoModel, todoModel2) {
                return todoModel.get("sprint") > todoModel2.get("sprint") ? -1 : 1;
            },
            effort_a: function (todoModel, todoModel2) {
                return todoModel.get("effort") > todoModel2.get("effort") ? 1 : -1;
            },
            effort_d: function (todoModel, todoModel2) {
                return todoModel.get("effort") > todoModel2.get("effort") ? -1 : 1;
            },
            remaining_a: function (todoModel, todoModel2) {
                return todoModel.get("remaining") > todoModel2.get("remaining") ? 1 : -1;
            },
            remaining_d: function (todoModel, todoModel2) {
                return todoModel.get("remaining") > todoModel2.get("remaining") ? -1 : 1;
            },
        },
        changeSort: function (sortProperty) {
            this.comparator = this.strategies[sortProperty];
        },
        sync: function (method, collection, options) {}
    });
    return UserStoryCollection;
});