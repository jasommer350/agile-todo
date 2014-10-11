var Templates = {};

var app = (function () {
    var api = {
        views: {},
        models: {},
        collections: {},
        content: null,
        router: null,
        todos: null,
        init: function () {
            this.content = $("#content");
            this.todos = new api.collections.ToDos();
            //creates and puts the menu view into the DOM
            ViewsFactory.list().render();
            return this;
        },
        changeContent: function (el) {
            this.content.empty().append(el);
            return this;
        },
        title: function (str) {
            $("h1").text(str);
            return this;
        },
    };

    var Router = Backbone.Router.extend({});
    api.router = new Router();

    var ViewsFactory = {
        //Views factory returns the view On first call it creates the view
        list: function () {
            if (!this.listView) {
                this.listView = new api.views.list({
                    collection: api.todos,
                    el: $("#content"),
                    mode: 'todo'
                });
            }
            return this.listView;
        }
    };
    return api;
})();

//***** VIEWS *****

// views/list.js
app.views.todo = Backbone.View.extend({
    tagName: 'tr',
    template: _.template(Templates['todo']),
    initialize: function (options) {},
    render: function () {
        //class="cf done-<%= done %>" data-index="<%= index %>"
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

// views/list.js
app.views.list = Backbone.View.extend({
    mode: null,
    index: null,
    events: {},
    template: _.template(Templates['list']),
    initialize: function (options) {
        this.mode = options.mode;
        this.$el.html(this.template());
        this.$tableID = this.$('#todolistTable > tbody:last'); //used for placing a new model at bottom of table
    },
    render: function () {
        this.collection.each(this.addOne, this);
        return this;
    },
    addOne: function (list) {
        var todoView = new app.views.todo({
            model: list
        });
        this.$tableID.append(todoView.render().el);
        //this.$tableID.append(listView.render().el);
    },
    priorityUp: function (e) {},
    priorityDown: function (e) {},
    archive: function (e) {},
    changeStatus: function (e) {},
    setMode: function (mode) {
        this.mode = mode;
        return this;
    }
});