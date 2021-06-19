function TaskServiceProxy(uriService) {
    this.uriService = uriService;
}

TaskServiceProxy.prototype.GetTasks = function(listId, callback) {
    var uri = this.uriService + "/GetTasks/" + listId;
    $.ajax({
        url: uri,
        dataType: "json",
        success: function(pagedTaskSource) {
            callback(pagedTaskSource);
        },
        error: function (data) {
            alert('fail');
        }
    });
}

TaskServiceProxy.prototype.CreateTask = function(task, callback) {
    var uri = this.uriService + "/CreateTask";
    $.ajax({
        type: "POST",
        url: uri,
        data: task,
        dataType: "json",
        success: function(task) {
            callback(task);
        },
        error: function (data) {
            alert('fail');
        }
    });
}

TaskServiceProxy.prototype.UpdateTask = function(task, callback) {
    var uri = this.uriService + "/UpdateTask";
    $.ajax({
        type: "PUT",
        url: uri,
        data: task,
        dataType: "json",
        success: function(tasks) {
            callback(tasks);
        },
        error: function (data) {
            alert('fail');
        }
    });
}

TaskServiceProxy.prototype.DeleteTask = function(task, callback) {
    var uri = this.uriService + "/DeleteTask";
    $.ajax({
        type: "Delete",
        url: uri,
        data: task,
        dataType: "json",
        success: function(result) {
            callback(result);
        },
        error: function (data) {
            alert('fail');
        }
    });
}

