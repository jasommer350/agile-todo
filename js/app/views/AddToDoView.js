define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/ModalView',
    'app/templates/templates',
    'app/utilities/indexdb',
    'app/events/eventHandler'
], function ($, _, Backbone, ModalView, Templates, IndexDB, Vent) {
    'use strict';
    //We extend out ModalView instead of a Backbone.View.extend
    var AddToDoView = ModalView.extend({
        //html for the content we want filled out
        template: Templates['addTodoForm'],

        initialize: function (options) {
            //Since we are overriding out Parent view initialize method we need to call
            //the method first
            ModalView.prototype.initialize.apply(this, arguments);
            //Puts out html form into the body of the modal, remember we cached a jquery selector for it
            //in the modalView
            this.$bodyEl.html(this.template(this.model.toJSON()));

            Vent.ventObj.on("saved-record", function (todo) {
                //fires when we are done saving the todo
                this.model.set(todo);
                this.collection.add(this.model);
                this.$modalEl.modal('hide');
            }, this);

        },

        addToDo: function () {
            this.applyToDo();
        },

        setTodo: function () {
            var todo = {
                title: this.$('#add_title').val(),
                desc: this.$('#add_desc').val(),
                priority: this.$('#add_priority').val(),
                project: this.$('#add_project').val(),
                done: false,
                context: this.$('#add_context').val()
            };
            todo.desc = todo.desc.replace(/\r?\n/g, '<br>');
            return todo;

        },
        applyToDo: function () {
            var todo = this.setTodo();
            //Call the IndexDB to save the todo, then setup listner for when it is finished.
            //Move code below to the finish listener
            IndexDB.saveToDo("todos", todo);
        },

        events: {
            //listen for the btn-add for when user submits the location code they want
            'click #btn-add': 'addToDo'
        },
        onModalHidden: function (e) {
            //Overrides partent method for listening for modal close event and turns off listener and removes view
            //beacuse this has an event that we need to make sure is turned off
            Vent.ventObj.off("saved-record");
            this.$modalEl.off('hidden.bs.modal');
            this.remove();
        }

    });

    return AddToDoView;
});