define(['app/views/UserStoriesView',
        'app/collections/UserStories',
        'app/templates/templates',
        'app/utilities/indexdb'
       ], function (UserStoriesView, UserStoriesCollection, Templates, IndexDB) {
    'use strict';
    var initialize = function () {
        //Open connection to IndexedDB
        IndexDB.initialize('agile', {
            version: 8,
            store: 'UserStories'
        });

        var userStoryCollection = new UserStoriesCollection([]);
        var userStoryView = new UserStoriesView({
            collection: userStoryCollection,
            context: 'UserStories'
        });
        $('#content').append(userStoryView.render().el);
        //var router = new Router(appView);
        //Backbone.history.start();

    };
    return {

        initialize: initialize,
    };
});
