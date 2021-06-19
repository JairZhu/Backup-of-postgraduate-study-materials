function ListServiceProxy(uriService) {
    this.uriService = uriService;
}  
  
// TaskServiceProxy.prototype.onError = function()
ListServiceProxy.prototype.GetLists = function (callback) {
    var uri = this.uriService + "/GetLists";
    $.ajax({
        url: uri,
        dataType: "json",
        success: function (lists) {
            callback(lists);
        },
        error: function (data) {
            alert('fail');
        }
    });
}

ListServiceProxy.prototype.CreateList = function(list, callback) {
    var uri = this.uriService + "/CreateList";
    $.ajax({
        type: "POST",
        url: uri,
        dataType: "json",
        data: list,
        success: function(list) {
            callback(list);
        },
        error: function (data) {
            alert('fail');
        }
    });
}

ListServiceProxy.prototype.UpdateList = function(list, callback) {
    var uri = this.uriService + "/UpdateList";
    $.ajax({
        type: "PUT",
        url: uri,
        dataType: "json",
        data: list,
        success: function(list) {
            callback(list);
        },
        error: function (data) {
            alert('fail');
        }
    });
}

ListServiceProxy.prototype.DeleteList = function(list, callback) {
    var uri = this.uriService + "/DeleteList";
    $.ajax({
        type: "Delete",
        url: uri,
        data: list,
        dataType: "json",
        success: function(result) {
            callback(result);
        },
        error: function (data) {
            alert('fail');
        }
    });
}