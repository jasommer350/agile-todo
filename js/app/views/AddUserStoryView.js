define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/ModalView',
    'app/templates/templatesUserStories',
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

            //Set todays date as default for when they maybe enterting in
            //progress data.
            console.log(this.model.toJSON());
            var modelToJSON = this.model.toJSON();
            modelToJSON.todaysDate = this.todaysDate();

            this.$bodyEl.html(this.template(modelToJSON));
            Vent.ventObj.on("saved-record", function (todo) {
                //fires when we are done saving the todo
                this.model.set(todo);
                this.collection.add(this.model);
                this.$modalEl.modal('hide');
                console.log("Hidden Modal");
            }, this);
        },
        todaysDate: function() {
          var d = new Date(),
            yr = d.getFullYear(),
            mth = d.getMonth()+1,
            day = d.getDate(),
            dayPadded = day < 10 ? '0'+day : day,
            mthPadded = mth < 10 ? '0'+mth : mth;
          return yr + "-" + mthPadded + "-" + dayPadded;
        },
        translateInputDate: function (inputDteStr) {
          var dd = inputDteStr.split("-"),
          yr = dd[0],
          mth = dd[1],
          day = dd[2];
          return mth + "-" + day + "-" + yr;
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
        setUserStory: function () {
            var todo = {
                title: this.$('#add_title').val(),
                desc: this.$('#add_desc').val(),
                priority: this.$('#add_priority').val(),
                project: this.$('#add_project').val(),
                done: false,
                context: this.$('#add_context').val(),
                businessvalue: this.$('#add_businessvalue').val(),
                acceptancecriteria: this.$('#add_acceptancecriteria').val(),
                release: this.$('#add_release').val(),
                sprint: this.$('#add_sprint').val(),
                effort: this.$('#add_effort').val(),
                remaining: this.$('#add_remaining').val(),
                actual: this.$('#add_actual').val()
            };
            //Check if remaining prior is different from remaining, if so
            //need to kick off a transaction to input into burndown
            //chart table
            if (this.model.get('remaining_prior') !== todo.remaining) {
              var progress_date_string = this.$('#add_progressdate').val(),
                progress_date_translated = this.translateInputDate(progress_date_string);

              todo.remaining_prior = todo.remaining;
              todo.progress_date = new Date(progress_date_translated);

              //kick off indexDB update/save for burn down progress
              IndexDB.progressEntry(todo);
            }
            todo.desc = todo.desc.replace(/\r?\n/g, '<br>');
            return todo;

        },
        applyToDo: function () {
            // ***** ToDo Add a handler for setting the add based on addType ***
            var todo;
            if(this.addType === 'todo') {
                todo = this.setTodo();

            } else {
                todo = this.setUserStory();
            }

            if (this.flag === 'edit') {
                this.model.set(todo);
                IndexDB.updateToDo(this.addType, this.model.toJSON());
                this.$modalEl.modal('hide');
            } else {
                IndexDB.saveToDo(this.addType, todo);
            }

            //Call the IndexDB to save the todo, then setup listner for when it is finished.
            //Move code below to the finish listener

        },

        events: {
            //listen for the btn-add for when user submits the location code they want
            'click #btn-add': 'addToDo'
        },
        onModalHidden: function (e) {
            //Overrides partent method for listening for modal close event and turns off listener and removes view
            //beacuse this has an event that we need to make sure is turned off
            console.log("Hidding window");
            Vent.ventObj.off("saved-record");
            this.$modalEl.off('hidden.bs.modal');
            this.remove();
        }

    });

    return AddToDoView;
});
