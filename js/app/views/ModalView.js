define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'app/templates/templates',
    'app/events/eventHandler'
], function ($, _, Backbone, Bootstrap, Template, Vent) {
    'use strict';
    var ModalView = Backbone.View.extend({
        template: Template['modal'],
        id: 'modal-view',

        initialize: function (options) {
            //Some options for customizing Modal view when called
            //options include any additional data passed into view besides the special options
            var title = options.title || '';
            var appendTo = options.appendTo || 'body';
            this.addType = options.context || 'todo';
            this.flag = options.flag || "";
            //set HTML variable and pass in the custom title or a blank
            var html = Template['modal']({
                title: title
            });
            //Set the html to the views element
            this.$el.html(html);
            //Cache some jquery selectors
            this.$modalEl = this.$('.modal'); //Selects modal div that the modal lives in
            this.$bodyEl = this.$('.modal-body');
            this.$titleEl = this.$('.modal-title');
            //Append the views element to the DOM, default place is the body
            //Normally done in the Parent view but we want it to append right away and then use
            //the show method to show it when we want to.
            $(appendTo).append(this.el);
        },
        render: function () {
            //To interact with bootstrap modal you can use a jquery selector and .modal with options
            this.$modalEl.modal({
                show: false,
                keyboard: false
            });
            return this;
        },
        show: function () {
            var self = this;
            this.$modalEl.modal('show');
            //setup event listener for when it is closed or click off of
            this.$modalEl.on('hidden.bs.modal', function () {
                self.onModalHidden();
            });
        },
        onModalHidden: function (e) {
            //listens for modal close event and turns off listener and removes view
            this.$modalEl.off('hidden.bs.modal');
            this.remove();
        },
        events: {}
    });

    return ModalView;
});