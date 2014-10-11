define([
    'underscore'
], function (_) {
    var Templates = {};
    Templates['todoListTable'] = [
        '<h1>User Stories /  Enhancements</h3>',
        '<div class="container-fluid">',

        '<% if(context === "UserStories") { %>',
            '<div class="row subpage-nav">',
                '<div class="col-xs-6 col-md-6 pull-right">',
                    '<form class="form-horizontal" role="form">',
                        '<div class="input-group">',
                            '<input type = "text" class="form-control" data-input = "filter" id="filterByGlobalVal" value = "" placeholder="Enter filter globally ex: project=MyProject|relase=1"/>',
                            '<span class="input-group-btn">',
                            '<button type="button" class="btn btn-primary btn-block" id="filterByGlobal"><span class="glyphicon glyphicon-search"></span></button>',
                            '</span>',
                        '</div>',
                    '</form>',
                '</div>',
            '</div>',
        '<% } %>',
            '<div class="row subpage-nav-bottom">',
                '<div class="col-xs-8 col-md-6">',
                    '<input type = "text" class="form-control" data-input = "filter" id="filterByVal" value = "" placeholder="Enter filter ex: release=1|sprint=A"/>',
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
        '<div class="row">',
        '<table id="todolistTable" class="table">',
        '<thead><tr>',
        '<th>Done</th>',
        '<th>Title  <button type="button" class="btn btn-default btn-xs"><span sortby="title_a" class="glyphicon glyphicon-resize-vertical"></span></button></th>',
        '<th>Description</th>',
        '<th>Priority  <button type="button" class="btn btn-default btn-xs"><span sortby="priority_a" class="glyphicon glyphicon-resize-vertical"></span></button></th>',
        '<th>Release  <button type="button" class="btn btn-default btn-xs"><span sortby="release_a" class="glyphicon glyphicon-resize-vertical"></span></button></th>',
        '<th>Sprint  <button type="button" class="btn btn-default btn-xs"><span sortby="sprint_a" class="glyphicon glyphicon-resize-vertical"></span></button></th>',
        '<th>Effort  <button type="button" class="btn btn-default btn-xs"><span sortby="effort_a" class="glyphicon glyphicon-resize-vertical"></span></button></th>',
        '<th>Remaining  <button type="button" class="btn btn-default btn-xs"><span sortby="remaining_a" class="glyphicon glyphicon-resize-vertical"></span></button></th>',
        '<th>Edit</th>',
        '<th>Delete</th>',
        '</tr></thead>',
        '<tbody>',
        '</tbody></table>',
        '</div>', //Puts table in its own row
        '</div>', //closes the container
    ].join('');

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
        '<td data-type="project" data-field="editable"><%= release %></td>',
        '<td data-type="context" data-field="editable"><%= sprint %></td>',
        '<td data-type="context" data-field="editable"><%= effort %></td>',
        '<td data-type="context" data-field="editable"><%= remaining %></td>',
        '<td> <button type="button" class="btn btn-default" id="editTodo"><span class="glyphicon glyphicon-pencil"></span></button> </td>',
        '<td> <button type="button" class="btn btn-danger" id="destroyTodo"><span class="glyphicon glyphicon-trash"></span></button> </td>', '</td>'
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
         '<label for="add_desc">Business Value</label>',
         '<textarea class="form-control" id="add_businessvalue"><%= businessvalue %></textarea>',
        '</div>',
        '<div class="col-sm-6">',
         '<label for="add_desc">Acceptance Criteria</label>',
         '<textarea class="form-control" id="add_acceptancecriteria"><%= acceptancecriteria %></textarea>',
        '</div>',
             '</div>',
        '<div class="form-group">',
            '<div class="col-sm-4">',
                '<label for="add_priority">Effort</label>',
                '<input type="text" class="form-control" id="add_effort" value="<%= effort %>">',
            '</div>',
            '<div class="col-sm-4">',
                '<label for="add_project">Release</label>',
                '<input type="text" class="form-control" id="add_release" value="<%= release %>">',
            '</div>',
            '<div class="col-sm-4">',
                '<label for="add_project">Sprint</label>',
                '<input type="text" class="form-control" id="add_sprint" value="<%= sprint %>">',
            '</div>',
        '</div>',
       '<div class="form-group">',
            '<div class="col-sm-4">',
                '<label for="add_priority">Priority</label>',
                '<input type="text" class="form-control" id="add_priority" value="<%= priority %>">',
            '</div>',
            '<div class="col-sm-4">',
                '<label for="add_project">Project</label>',
                '<input type="text" class="form-control" id="add_project" value="<%= project %>">',
            '</div>',
            '<div class="col-sm-4">',
                '<label for="add_context">Context</label>',
                '<input type="text" class="form-control" id="add_context" value="<%= context %>">',
            '</div>',
        '</div>',

        '<div class="form-group">',
           '<div class="col-sm-4">',
             '<label for="add_progressdate">Enter New Progress Date</label>',
             '<input type="date" class="form-control" id="add_progressdate" value="<%= todaysDate %>">',
            '</div>',
            '<div class="col-sm-4">',
             '<label for="add_remaining">Remaining</label>',
             '<input type="text" class="form-control" id="add_remaining" value="<%= remaining %>">',
           '</div>',
           '<div class="col-sm-4">',
            '<label for="add_actual">Actual Worked</label>',
            '<input type="text" class="form-control" id="add_actual" value="<%= actual %>">',
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
