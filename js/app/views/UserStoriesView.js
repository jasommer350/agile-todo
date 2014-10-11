define([
    'jquery',
    'underscore',
    'backbone',
    'app/templates/templatesUserStories',
    'app/views/UserStoryView',
    'app/models/UserStory',
    'app/views/AddUserStoryView',
    'app/utilities/indexdb',
    'app/events/eventHandler'
], function ($, _, Backbone, Templates, UserStoryView, UserStoryModel, AddUserStoryView, IndexDB, Vent) {
    'use strict';
    var UserStoriesView = Backbone.View.extend({
        id: 'todoTable',
        className: 'table-responsive',
        template: Templates['todoListTable'],
        initialize: function (options) {
            //place options passed in to variables
            this.context = options.context || '';

            //setup caches for dom elements
            this.$el.html(this.template({
                context: this.context
            }));
            this.$tableID = this.$('#todolistTable > tbody:last');
            this._views = [];

            //UI Setup
            //this.$('#details').hide();

            //Listeners and event handler object
            this.listenTo(this.collection, 'add', this.addOne, this);
            this.listenTo(this.collection, 'reset sort', this.render, this);
            Vent.ventObj.on("loaded-db", function (content) {
                //fires when we get todos
                this.collection.reset(content);
            }, this);

        },
        render: function () {
            //Want to make sure all sub views are removed including listeners
            _.each(this._views, function (subview) {
                subview.remove();
            });
            this._views = []; //need to make sure we are starting fresh and all views are gone

            var container = document.createDocumentFragment(); //Used to avoid causing to DOM to reflow 
            this.collection.each(this.addOne, this);

            _.each(this._views, function (subview) {
                container.appendChild(subview.render().el);
            });
            
            this.$tableID.append(container);
            return this; //so we can chain our actions together in the app.js file so we can get the.el
        },
        addOne: function (todo) {
            var todoView = new UserStoryView({
                model: todo,
                context: this.context
            });
            this._views.push(todoView);
        },
        events: {
            'click #addToDo': 'addToDo',
            'click #clearAllToDos': 'clearAllToDos',
            'click #showhideDetails': 'showhideDetails',
            'click #clearList': 'clearList',
            'click [sortby]': 'sortBy',
            'click #getToDos': 'getList',
            'click #filterBy': 'filterBy',
            'click #filterByGlobal': 'filterByGlobal'
        },
        clearAllToDos: function () {
            IndexDB.removeAllToDos(this.context);
            this.collection.reset();
        },
        filterByGlobal: function () {
            var rawFilterStr = this.$('#filterByGlobalVal').val(),
                matchObj = this.filterTextParser(rawFilterStr);
            IndexDB.getQuery(matchObj);
        },
        getList: function () {
            if (this.context === 'todo') {
                IndexDB.findAllToDos();
            } else {
                var rawFilterStr = this.$('#filterByGlobalVal').val(),
                    matchObj = this.filterTextParser(rawFilterStr);
                IndexDB.getQuery(matchObj);
            }
            //When the get request is complete an event fires called load-db
        },
        showhideDetails: function () {
            //this.$('#details').toggle();
        },
        sortBy: function (ev) {
            var sortType = $(ev.target).attr("sortby"),
                sortTypeSplitArray = sortType.split("_"),
                sortTypeValue = sortTypeSplitArray[0],
                switchSortDirection = sortTypeSplitArray[1] === 'a' ? 'd' : 'a';

            $(ev.target).attr("sortby", sortTypeValue + '_' + switchSortDirection);
            this.collection.changeSort(sortType);
            this.collection.sort();
        },
        filterTextParser: function (rawFilterStr) {
            var splitFilterStr = rawFilterStr.split("|"),
                matchObj = {};
            _.each(splitFilterStr, function (str) {
                var splitFilter = str.split("=");
                if (splitFilter.length === 2) {
                    matchObj[splitFilter[0]] = splitFilter[1];
                }
            });
            return matchObj;
        },
        filterBy: function () {
            var rawFilterStr = this.$('#filterByVal').val(),
                matchObj = this.filterTextParser(rawFilterStr);
            var filtered = _.filter(this.collection.models, function (item) {
                var item = item,
                    passed = true,
                    numPassed = 0;
                _.each(matchObj, function (value, key) {
                    if (item.has(key)) {
                        var modelValue = item.get(key);
                        if (typeof modelValue === 'boolean' && modelValue.toString() === value.toLowerCase()) {
                            numPassed++;
                        } else if (typeof modelValue === 'string' && modelValue.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                            numPassed++;
                        } else {
                            passed = false;
                        }
                    }
                });
                //console.log(item.get("title") + ' - Passed: ' + numPassed);
                return passed;
            });
            this.collection.reset(filtered);
        },
        addToDo: function (e) {
            var todoModel = new UserStoryModel({}),
                //Title and id are optional so is the appendTo if we wanted something other than body
                modal = new AddUserStoryView({
                    title: 'Add a New Todo',
                    id: 'modal-add-new-todo',
                    collection: this.collection,
                    model: todoModel,
                    context: this.context
                });
            modal.show();
        }
    });

    return UserStoriesView;
});