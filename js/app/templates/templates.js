define([
    'underscore'
], function (_) {
    var Templates = {};
    Templates['todoListTable'] = [
        '<h1>My Todo List</h3>',
        '<div class="container-fluid">',
            '<div class="row">',
                '<div class="col-xs-8 col-md-6">',
                    '<input type = "text" class="form-control" data-input = "filter" id="filterByVal" value = "" placeholder="Enter filter ex: project=default|context=default"/>',
                '</div>',
                '<div class="col-xs-4 col-md-2">',
                    '<button type="button" class="btn btn-primary btn-block" id="filterBy">Filter</button>',
                '</div>',
                '<div class="col-xs-4 col-md-1">',
                    '<button type="button" class="btn btn-primary btn-block" id="addToDo"><span class="glyphicon glyphicon-plus"></span></button>',
                '</div>',
                '<div class="col-xs-4 col-md-1">',
                    '<button type="button" class="btn btn-success btn-block" id="getToDos"><span class="glyphicon glyphicon-refresh"></span></button>',
                '</div>',
                '<div class="col-xs-2 col-md-2">',
                    '<button type="button" class="btn btn-danger btn-block" id="clearAllToDos">Delete ALL</button>',
                '</div>',
            '</div>',
        '</div>',
        '<table id="todolistTable" class="table">',
        '<thead><tr>',
        '<th>Done</th>',
        '<th>Title  <button type="button" class="btn btn-default btn-xs"><span sortby="title_a" class="glyphicon glyphicon-resize-vertical"></span></button></th>',
        '<th>Description</th>',
        '<th>Priority  <button type="button" class="btn btn-default btn-xs"><span sortby="priority_a" class="glyphicon glyphicon-resize-vertical"></span></button></th>',
        '<th>Project  <button type="button" class="btn btn-default btn-xs"><span sortby="project_a" class="glyphicon glyphicon-resize-vertical"></span></button></th>',
        '<th>Context  <button type="button" class="btn btn-default btn-xs"><span sortby="context_a" class="glyphicon glyphicon-resize-vertical"></span></button></th>',
        '<th>Timer</th>',
        '<th>Edit</th>',
        '<th>!Delete!</th>',
        '<th>Save</th>',
        '</tr></thead>',
        '<tbody>',
        '</tbody></table>'
    ].join('');

//    if (dataType === 'desc') {
//                    $(this).html('<textarea data-input = "' + dataType + '">' + content + '</textarea>')
//                } else {
//                    $(this).html('<input type = "text" data-input = "' + dataType + '" value = "' + content + '"/>')
//                }

    Templates['todoEdit'] = [
         '<td data-type="done"><input type="checkbox" id="got-done-chk" data-status <%= done %> <% if(done)print(\"checked\") %> /></td>',
        '<td data-type="title" data-field="editable"><input type = "text" data-input = "title" value = "<%= title %>"/></td>',
        '<td data-type="desc" data-field="editable"><textarea data-input = "desc"><%= desc %></textarea></td>',
        '<td data-type="priority" data-field="editable"><input type = "text" data-input = "priority" value = "<%= priority %>"/></td>',
        '<td data-type="project" data-field="editable"><input type = "text" data-input = "project" value = "<%= project %>"/></td>',
        '<td data-type="context" data-field="editable"><input type = "text" data-input = "context" value = "<%= context %>"/></td>',
        '<td> <button type="button" class="btn btn-default" id="editTodo" disabled><span class="glyphicon glyphicon-pencil"></span></button> </td>',
        '<td> <button type="button" class="btn btn-danger" id="destroyTodo"><span class="glyphicon glyphicon-trash"></span></button> </td>',
        '<td> <button type="button" class="btn btn-success" id="saveTodo"><span class="glyphicon glyphicon-floppy-disk"></span></button> </td>'
    ].join('');
    Templates['todo'] = [
        '<td data-type="done"><input type="checkbox" id="got-done-chk" data-status <%= done %> <% if(done)print(\"checked\") %> /></td>',
        '<td data-type="title" data-field="editable"><%= title %></td>',
        '<td data-type="desc" data-field="editable"><%= desc %></td>',
        '<td data-type="priority" data-field="editable"><%= priority %></td>',
        '<td data-type="project" data-field="editable"><%= project %></td>',
        '<td data-type="context" data-field="editable"><%= context %></td>',
        '<td data-type="timer" id="timer"><%= timer %></td>',
        '<td> <button type="button" class="btn btn-default" id="editTodo"><span class="glyphicon glyphicon-pencil"></span></button> </td>',
        '<td> <button type="button" class="btn btn-danger" id="destroyTodo"><span class="glyphicon glyphicon-trash"></span></button> </td>',
        '<td> <button type="button" class="btn btn-success" id="saveTodo" disabled><span class="glyphicon glyphicon-floppy-disk"></span></button> </td>',

        '<td> <button type="button" class="btn btn-success" id="startTodo">Start</button> </td>',
        '<td> <button type="button" class="btn btn-danger" id="stopTodo">Stop</button> </td>',
        '<td> <button type="button" class="btn btn-default" id="resetTodo">Reset</button> </td>'

    ].join('');

    Templates['modal'] = [
        '<div class="modal fade">',
          '<div class="modal-dialog">',
            '<div class="modal-content">',
              '<div class="modal-header">',
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
                '<h4 class="modal-title"> <%= title %></h4>',
              '</div>',
              '<div class="modal-body"></div>',
            '</div>',
          '</div>',
        '</div>'
    ].join('');

    Templates['addTodoForm'] = [
      '<form class="form-horizontal" role="form">',
       '<div class="form-group">',
              '<div class="col-sm-6">',
         '<label for="add_title">Title</label>',
         '<input type="text" class="form-control" id="add_title" value="<%= title %>">',
        '</div>',
        '<div class="col-sm-6">',
         '<label for="add_desc">Description</label>',
         '<textarea class="form-control" id="add_desc"><%= desc %></textarea>',
        '</div>',
             '</div>',
       '<div class="form-group">',
              '<div class="col-sm-6">',
         '<label for="add_priority">Priority</label>',
         '<input type="text" class="form-control" id="add_priority" value="<%= priority %>">',
        '</div>',
        '<div class="col-sm-6">',
         '<label for="add_project">Project</label>',
         '<input type="text" class="form-control" id="add_project" value="<%= project %>">',
        '</div>',
             '</div>',
       '<div class="form-group">',
          '<div class="col-sm-6">',
            '<label for="add_context">Context</label>',
            '<input type="text" class="form-control" id="add_context" value="<%= context %>">',
          '</div>',
        '</div>',
       '<div id="btn-add" class="btn btn-default">Submit</div>',
      '</form>',
            '<div id="error-msg"></div>'
    ].join('');

    //Loops through each template in the Template object and complies the template for use later
    for (var tmpl in Templates) {
        if (Templates.hasOwnProperty(tmpl)) {
            Templates[tmpl] = _.template(Templates[tmpl]);
        }
    }
    return Templates;
});
