define([
    'jquery',
    'underscore',
    'backbone',
    'app/templates/templates',
    'app/utilities/indexdb'
], function ($, _, Backbone, Templates, IndexDB) {
    'use strict';
    var IngView = Backbone.View.extend({
        tagName: 'tr',
        template: Templates['todo'],
        templateEdit: Templates['todoEdit'],
        initialize: function (options) {
            this.listenTo(this.model, 'change', this.render, this);
            this.listenTo(this.model, 'destroy', this.remove, this);

        },
        events: {
            'click #editTodo': 'editTodo',
            'click #destroyTodo': 'destroyTodo',
            'click #got-done-chk': 'editDoneChk',
            'click #saveTodo': 'saveTodo',
            'click #startTodo': 'startTodo',
            'click #stopTodo': 'stopTodo',
            'click #resetTodo': 'resetTodo',
        },
        startTodo: function () {
          var self = this;
          this.t = setInterval(timerUp, 1000, self);
        },
        stopTodo: function () {
          if (this.t) {
            clearInterval(this.t);
            this.model.set('timer', this.$timer.text());
          } else {
            this.model.set('timer', "00:00:00");
          }
        },
        resetTodo: function () {
          if (this.t) {
            clearInterval(this.t);
          }
          this.model.set('timer', "00:00:00");
        },
        editTodo: function () {
            this.renderEditable();
        },
        saveTodo: function () {
            var todo = this.setTodo();
            this.model.set(todo);
            IndexDB.updateToDo('todos', this.model.toJSON());
            this.$el.toggleClass("editTD");
        },
        setTodo: function () {
            var todo = {
                title: this.$('[data-input="title"]').val(),
                desc: this.$('[data-input="desc"]').val(),
                priority: this.$('[data-input="priority"]').val(),
                project: this.$('[data-input="project"]').val(),
                context: this.$('[data-input="context"]').val()
            };
            todo.desc = todo.desc.replace(/\r?\n/g, '<br>');
            //Makes sure that the change event is triggered to auto re-render
            if (this.model.get('status') === 'New') {
                todo['status'] = 1;
            } else {
                var incUpdateCount = this.model.get('status') + 1;
                todo['status'] = incUpdateCount;
            }
            return todo;
        },
        destroyTodo: function () {
            IndexDB.removeToDo("todos", this.model.get('id'));
            this.model.destroy();
        },
        remove: function () {
            this.$el.remove();
        },
        editDoneChk: function () {
            var toggleDone = (this.model.get('done') ? false : true);
            this.model.set('done', toggleDone);
            IndexDB.updateToDo('todos', this.model.toJSON());
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$timer = this.$('#timer');
            return this;
        },
        renderEditable: function () {
            this.$el.html(this.templateEdit(this.model.toJSON()));
            this.$el.toggleClass("editTD");
            return this;
        }
    });
    function timerUp(self) {
      var timeString = self.$timer.text(),
       timeArray = timeString.split(":"),
       seconds,
       minutes,
       hours;
      if (timeArray.length === 3) {
        seconds = parseInt(timeArray[2]);
        minutes = parseInt(timeArray[1]);
        hours = parseInt(timeArray[0]);
        seconds += 1;
        if (seconds > 59) {
          seconds = 0;
          minutes = parseInt(timeArray[1]) + 1;
          if (minutes > 59) {
            minutes = 0;
            hours = parseInt(timeArray[0]) + 1;
          }
        }
        if (hours < 9) {
          hours = "0" + hours;
        }
        if (minutes < 9) {
          minutes = "0" + minutes;
        }
        if (seconds < 9) {
          seconds = "0" + seconds;
        }
        self.$timer.html(hours + ":" + minutes + ":" + seconds);
      }
    }
    return IngView;
});
