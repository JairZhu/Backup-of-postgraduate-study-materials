$(document).ready(function() {
    tasksService.GetTasks(listId, function(tasksData) {
        $("#tasks li.empty").hide()
        $.each(tasksData.Tasks, function(ix, item) { addTask(item); });
        $("#tasksWrapper").hide().slideDown();
        $("#loading").fadeOut();
        refreshStripes();
    });

    var doCreateTask = function() {
        var field = $('#newTaskField');
        if (field.val().length > 0) {
            createTask({ Subject: field.val() }, true);
            field.val("");
        }
    };

    $("#newTaskBtn").click(doCreateTask);
    $("#newTaskField").keydown(function(e) { if (e.keyCode == 13) doCreateTask(); })
                      .blur(function(e) { if ($(this).val() == "") $(this).addClass("disabled").val("New Task"); })
                      .focus(function(e) { if ($(this).val() == "New Task") $(this).removeClass("disabled").val(""); })
                      .addClass("disabled").val("New Task");
});

function createTask(task, fadeIn) {
    $("#newTask").addClass("adding");
    task.ListId = listId;
    task.StartDate = new Date();
    task.EndDate = null;
    tasksService.CreateTask(transformDatesToService(task), function(createdTask) {
        if (createdTask == null) return;
        addTask(createdTask, true);
        $("#newTask").removeClass("adding");
        refreshStripes();
    });
}

function addTask(task, fadeIn) {
    $("#tasks li.empty").slideUp();
    var t = $("<li></li>").taskItem({ task: transformDatesFromService(task), enableEdit: authenticatedUser })
                          .bind("delete", function(e) { deleteTask(e.task, e.control); })
                          .bind("update", function(e) { updateTask(e.task, e.control); });
    t.appendTo($("#tasks"));
    if (fadeIn && (!$.browser.msie || ($.browser.version > 7 || navigator.userAgent.indexOf("Trident/4.0") > -1))) t.hide().slideDown(200);
}

function deleteTask(task, taskControl) {
    taskControl.addClass("deleting");
    tasksService.DeleteTask(transformDatesToService(task), function(status) {
        taskControl.removeClass("deleting");
        if (!status) return;
        taskControl.slideUp(200, function() {
            $(this).remove();
            refreshStripes();
        });
    });
}

function updateTask(task, taskControl) {
    taskControl.addClass("saving");
    tasksService.UpdateTask(transformDatesToService(task), function(status) {
        taskControl.removeClass("saving");
    });
}

function transformDatesFromService(serviceTask) {
    var task = {};
    for (var p in serviceTask) task[p] = serviceTask[p];
    task.StartDate = parseMSJSONString(task.StartDate);
    task.DueDate = parseMSJSONString(task.DueDate);
    return task;
}

function transformDatesToService(jsonTask) {
    var task = {};
    for (var p in jsonTask) task[p] = jsonTask[p];
    if (task.StartDate) task.StartDate = task.StartDate.toMSJSON();
    if (task.DueDate) task.DueDate = task.DueDate.toMSJSON();
    return task;
}

function refreshStripes() {
    $("#tasks li").each(function(ix, el) {
        if (ix % 2 == 0) {
            $(this).removeClass("alter");
        } else {
            $(this).addClass("alter");
        }
    });

    if ($("#tasks li").length == 1) $("#tasks li.empty").slideDown();
}

function parseMSJSONString(msDate) {
    try {
        if (!msDate) return null;
        var date = new Date(parseInt(msDate.replace("/Date(", "").replace(")/", ""), 10));
        if (date.getFullYear() == 9999) date = null;
        return date;
    }
    catch (e) { return null; }
}

Date.prototype.toMSJSON = function() {
    return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate();
};