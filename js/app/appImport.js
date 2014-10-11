define(['jquery',
        'underscore',
        'app/utilities/indexdb',
        'libs/toastr'
       ], function ($, _, IndexDB, Toastr) {
    'use strict';
    var ImportTasks = {
        initialize: function () {
            var self = this;
            this.$addtasks = $("[data-action=import]");
            this.$connecttodb = $("[data-action=dbconnect]");
            this.$taskdetails = $("#taskdetails");
            this.dbNames = {
              "todos": {"dbValue": "test1", "store": "todos"},
              "agile": {"dbValue": "agile", "store": "UserStories"}
            };
            //Adding event for processing the text import
            this.$addtasks.on("click", function (e) {
                if (self.db) {
                    IndexDB.saveMultipleTodos(self.store, self.processText());
                } else {
                  Toastr.error("Database Name is Not a Correct Choice", "ERROR - DBNAME");
                }
            });

            this.$connecttodb.on("click", function (e) {
                //self.db = $("#dbname").val();
                var okayConnect = true,
                dbname = $("#dbname option:selected").text();
                if (self.dbNames[dbname]) {
                  self.db = self.dbNames[dbname]["dbValue"];
                  self.store = self.dbNames[dbname]["store"];
                } else {
                  okayConnect = false;
                }
                //disable connect button
                if (okayConnect) {
                    $("#store").val(self.store);
                    self.dbConnect();
                } else {
                  Toastr.error("Database Name is Not a Correct Choice", "ERROR - DBNAME");
                }
            });
        },
        dbConnect: function () {
            //Open connection to IndexedDB
            // *** Get version number???
            IndexDB.initialize(this.db, {
                version: 7,
                store: this.store,
                findDataFlag: "no"
            });
        },
        processText: function () {
            var importArray = this.$taskdetails.val().split('\n'),
                tasksListtoSave = [],
                objectHeaderArray = [];
            _.each(importArray, function (value, key) {
                var splitLine = value.split('|');
                if (key === 0) {
                    //First line is header
                    objectHeaderArray = splitLine;
                } else {
                    var savedTaskObj = {};
                    _.each(splitLine, function (value, key) {
                        savedTaskObj[objectHeaderArray[key]] = value;
                    });
                    tasksListtoSave.push(savedTaskObj);
                }
            });
            return tasksListtoSave;
        }
    };
    return ImportTasks;
});
