define(['app/views/ToDosView',
        'app/collections/ToDos',
        'app/templates/templates',
        'app/utilities/indexdb'
       ], function (ToDosView, ToDoCollection, Templates, IndexDB) {
    'use strict';
    var initialize = function () {
        //Open connection to IndexedDB
        IndexDB.initialize('test1', {
            version: 7,
            store: 'todos'
        });

        var todoCollection = new ToDoCollection([]);
        var todoView = new ToDosView({
            collection: todoCollection,
            context: 'todo'
        });
        $('#content').append(todoView.render().el);
        //var router = new Router(appView);        
        //Backbone.history.start();

    };
    return {

        initialize: initialize,
    };
});