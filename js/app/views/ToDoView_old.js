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
        },
        editTodo: function () {
            //            this.$("td[data-field='editable']").each(function (i) {
            //                var content = $(this).text(),
            //                    dataType = $(this).attr("data-type");
            //                if (dataType === 'desc') {
            //                    $(this).html('<textarea data-input = "' + dataType + '">' + content + '</textarea>')
            //                } else {
            //                    $(this).html('<input type = "text" data-input = "' + dataType + '" value = "' + content + '"/>')
            //                }
            //            });
            //
            //            this.$("#saveTodo").prop("disabled", false);
            //            this.$("#editTodo").prop("disabled", true);
            this.renderEditable();
        },
        saveTodo: function () {
            //var setNewModelValue = {};
            //            this.$("td[data-field='editable']").each(function (i) {
            //                var inputJqueryCache;
            //                if ($(this).find('input').length === 0) {
            //                    inputJqueryCache = $(this).find('textarea');
            //                } else {
            //                    inputJqueryCache = $(this).find('input');
            //                }
            //                var inputContent = inputJqueryCache.val(),
            //                    inputType = inputJqueryCache.attr("data-input");
            //                setNewModelValue[inputType] = inputContent;
            //                //$(this).html(inputContent); //Changes row back to data and not input
            //            });
            //            if (this.model.get('status') === 'New') {
            //                setNewModelValue['status'] = 1;
            //            } else {
            //                var incUpdateCount = this.model.get('status') + 1;
            //                setNewModelValue['status'] = incUpdateCount;
            //            }
            //            this.model.set(setNewModelValue); //Re-render changes the html back
            //            this.$("#saveTodo").prop("disabled", true);
            //            this.$("#editTodo").prop("disabled", false);
            //            this.$el.toggleClass("editTD");
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
            return this;
        },
        renderEditable: function () {
            this.$el.html(this.templateEdit(this.model.toJSON()));
            this.$el.toggleClass("editTD");
            return this;
        }
    });

    return IngView;
});