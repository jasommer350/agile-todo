define(['underscore', 'app/events/eventHandler', 'libs/toastr'], function (_, Vent, Toastr) {
    'use strict';
    var IndexDBUtil = {
        vent: Vent.ventObj,
        initialize: function (dbName, options) {
            var self = this;
            this.dbVersion = options.version;
            this.store = options.store;
            this.findDataFlag = options.findDataFlag === "no" ? false : true;
            this.dbName = dbName;
            this.openRequest = indexedDB.open(this.dbName, this.dbVersion);

            this.openRequest.onupgradeneeded = function (e) {
                Toastr.info('Running On Upgrade Needed', 'Information');

                //var thisDB = e.target.result;
                var thisDB = this.result;

                if (!thisDB.objectStoreNames.contains(self.store)) {
                    thisDB.createObjectStore(self.store, {
                        //keyPath: 'id',
                        autoIncrement: true
                    });
                }
                if (self.store === 'UserStories' && !thisDB.objectStoreNames.contains('burndown')) {
                  thisDB.createObjectStore("burndown", {
                      keyPath: 'burndown_id'
                  });
                  Toastr.success('Created Burndown Object Store', 'Success');
                }
                //var objectStore = e.currentTarget.transaction.objectStore(self.store);
                //objectStore.createIndex("project", "project", {
                //    unique: false
                //});
            };

            this.openRequest.onsuccess = function (e) {
                Toastr.success('Database Connection Successful', 'Success');
                //self.db = e.target.result;
                self.db = this.result;
                //Only load if it is todo otherwise wait for filter
                console.log(self.findDataFlag);
                if (self.findDataFlag) {
                  self.findAllToDos();
                }
            };

            this.openRequest.onerror = function (e) {
                Toastr.error('Database Connection Error', 'ERROR');
                console.log(e);
            };
        },
        saveMultipleTodos: function (dbStore, todoArray) {
            var todoObjArray = todoArray,
                saveTransaction = this.db.transaction([dbStore], "readwrite"),
                itemstore = saveTransaction.objectStore(dbStore),
                i = 0,
                addNext = function () {
                    if (i < todoObjArray.length) {
                        itemstore.add(todoObjArray[i]).onsuccess = addNext;
                        console.log("Added: " + todoObjArray[i].title);
                        ++i;
                    } else { // complete
                        Toastr.success('Added New Tasks', 'Success');
                    }
                };
            addNext();
        },
        saveToDo: function (dbStore, todo) {
            var todoObj = todo,
                saveTransaction = this.db.transaction([dbStore], "readwrite"),
                store = saveTransaction.objectStore(dbStore),
                request = store.add(todoObj),
                self = this;

            request.onerror = function (e) {
                Toastr.error('Error saving item ' + e.target.error.name, 'ERROR');
                //console.log("Error", e.target.error.name);
                //some type of error handler
            };

            request.onsuccess = function (e) {
                todoObj.id = e.target.result;
                Toastr.success('Saving item ' + e.target.result, 'SAVED');
                self.vent.trigger('saved-record', todoObj);
            };

        },
        updateToDo: function (dbStore, todo) {
            var todoPutObj = todo,
                dbPutStore = dbStore,
                putobjectStore = this.db.transaction([dbPutStore], "readwrite"),
                putStore = putobjectStore.objectStore(dbPutStore),
                requestUpdate = putStore.put(todoPutObj, todoPutObj.id);
            requestUpdate.onerror = function (event) {
                Toastr.error('Error updating item ' + e.target.error.name, 'ERROR');
                console.log("Error", e.target.error);

            };
            requestUpdate.onsuccess = function (event) {
                // Success - the data is updated!
                Toastr.success('Updated Item', 'UPDATED');
            };

        },
        checkMatchingObject: function (cursorObj, matchObj) {
            var passed = true,
                numPassed = 0;
            _.each(matchObj, function (value, key) {
                if (cursorObj[key]) {
                    var modelValue = cursorObj[key];
                    if (typeof modelValue === 'boolean' && modelValue.toString() === value.toLowerCase()) {
                        numPassed++;
                    } else if (typeof modelValue === 'string' && modelValue.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        numPassed++;
                    } else {
                        passed = false;
                    }
                }
            });
            return passed;
        },
        getQuery: function (matchObj) {
            var transaction = this.db.transaction([this.store], "readonly"),
                index = transaction.objectStore(this.store).index("project"),
                singleKeyRange = IDBKeyRange.only(matchObj.project),
                passedValues = [],
                self = this,

                handleResult = function (event) {
                    var cursor = event.target.result,
                        passed = true,
                        numPassed = 0;
                    if (cursor) {
                        if (self.checkMatchingObject(cursor.value, matchObj)) {
                            var modelObj = cursor.value;
                            modelObj.id = cursor.primaryKey;
                            passedValues.push(modelObj);
                        }
                        cursor.continue();
                    }
                };

            index.openCursor().onsuccess = handleResult;

            transaction.oncomplete = function (event) {
                //console.log(passedValues);
                self.vent.trigger('loaded-db', passedValues);
            };

        },

        findAllToDos: function () {
            var transaction = this.db.transaction([this.store], "readonly"),
                content = [],
                self = this;

            transaction.oncomplete = function (event) {
                Toastr.success('Found and Loaded Data', 'Found Data');
                self.vent.trigger('loaded-db', content);
            };

            var handleResult = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    cursor.value["id"] = cursor.key;
                    content.push(cursor.value);
                    cursor.continue();
                }
            };

            var objectStore = transaction.objectStore(this.store);

            objectStore.openCursor().onsuccess = handleResult;
        },
        removeToDo: function (dbStore, todoID) {
            var objectStore = this.db.transaction([dbStore], "readwrite").objectStore(dbStore),
                requestDelete = objectStore.delete(todoID);
            requestDelete.onerror = function (event) {
                console.log("Error", e.target.error);
                Toastr.error('Error updating item ' + e.target.error.name, 'ERROR');
                //alert(e.target.error.name);
            };
            requestDelete.onsuccess = function (event) {
                // Success - the data is removed!
                Toastr.success('Removed Item', 'REMOVED');
            };
        },
        removeAllToDos: function (dbStore) {
            var objectStore = this.db.transaction([dbStore], "readwrite").objectStore(dbStore),
                requestClear = objectStore.clear();
            requestClear.onerror = function (event) {
                console.log("Error", e.target.error);
                Toastr.error('Error updating item ' + e.target.error.name, 'ERROR');
                //alert(e.target.error.name);
            };
            requestClear.onsuccess = function (event) {
                // Success - the data is removed!
                console.log("All Todos Cleared");
            };

        },
        progressEntry: function (progressObj) {
          var burndown_id = progressObj.project + progressObj.release + progressObj.sprint,
            rsltList = [],
            transaction = this.db.transaction("burndown", "readonly"),
            objectStore = transaction.objectStore("burndown"),
            request = objectStore.openCursor(burndown_id);
          request.onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor) {
              // cursor.value contains the current record being iterated through
              // this is where you'd do something with the result
              rsltList.push(cursor.value);
              cursor.continue();
            } else {
              // no more results
              console.log("Results done");
            }
          };
          request.onerror = function (event) {
            console.log("Error", e.target.error);
            Toastr.error('Error updating item ' + e.target.error.name, 'ERROR');
          };

          transaction.oncomplete = function (event) {
              if (rsltList.length > 1) {
                //Update this with new data
                Toastr.success('Found and Loaded Data', 'Found Data');
              } else {
                //Insert with new data
                Toastr.info('Nothing Found', 'No Data Found');
              }
          };
        }
    };

    return IndexDBUtil;
});
