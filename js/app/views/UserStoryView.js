define([
    'jquery',
    'underscore',
    'backbone',
    'app/templates/templatesUserStories',
    'app/utilities/indexdb',
    'app/views/AddUserStoryView'
], function ($, _, Backbone, Templates, IndexDB, AddUserStoryView) {
    'use strict';
    var IngView = Backbone.View.extend({
        tagName: 'tr',
        template: Templates['todo'],
        templateEdit: Templates['todoEdit'],
        initialize: function (options) {
            this.context = options.context || 'todo';

            this.listenTo(this.model, 'change', this.render, this);
            this.listenTo(this.model, 'destroy', this.remove, this);
        },
        events: {
            'click #editTodo': 'editTodo',
            'click #destroyTodo': 'destroyTodo',
            'click #got-done-chk': 'editDoneChk',
            'click #saveTodo': 'saveTodo',
        },
        editTodo: function () {
            if (this.context === 'UserStories') {
                //this.templateEdit = Templates['addTodoForm'];
                this.renderEditableModal();
            } else {
                this.renderEditable();
            }
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
            IndexDB.removeToDo(this.context, this.model.get('id'));
            this.model.destroy();
        },
        remove: function () {
            this.$el.remove();
        },
        editDoneChk: function () {
            var toggleDone = (this.model.get('done') ? false : true);
            this.model.set('done', toggleDone);
            IndexDB.updateToDo(this.context, this.model.toJSON());
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        renderEditable: function () {
            this.$el.html(this.templateEdit(this.model.toJSON()));
            this.$el.toggleClass("editTD");
            return this;
        },
        renderEditableModal: function (e) {
                //Title and id are optional so is the appendTo if we wanted something other than body
                var modal = new AddUserStoryView({
                    title: 'Edit an Enhancement',
                    id: 'modal-add-new-todo',
                    collection: this.collection,
                    model: this.model,
                    context: this.context,
                    flag: 'edit'
                });
            modal.show();
        }
    });

    return IngView;
});