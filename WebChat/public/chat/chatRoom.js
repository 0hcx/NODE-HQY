// $(init);
//
// function init() {
//     $('#m').val('');
// }
var socket = io();
//传递给服务器用户Id

var data = {
    from: $('.chat-room').attr("data-id"),
    to: $('.username-to').attr("data-id")
};
var msg = {
    from:   $('.chat-room').attr("data-id"),
    to: $('.username-to').attr("data-id"),
    content: ''
};
socket.emit('add user', data);

updateMsgStatus();//消息标记为已读

$('form').submit(function(){
    var ctn = $('#m').val();
    if(ctn != '') {
        var html = '<li class="chat-box-r"><p class="chat-p">'+ ctn +'</p><img class="chat-user-img" src="/images/mb2.jpg"></li>';
        $('#messages').append(html);
        msg.content = ctn;
        socket.emit('chat message', msg);
        // doAddMsg();
    }
    $('#m').val('');
    return false;
});
socket.on('chat busy', function (data) {
    var html = '<li class="chat-box-l"><img class="chat-user-img" src="/images/mb2.jpg"><p class="chat-p">' + data._msg +'</p></li>';
    $('#messages').append(html);
    doAddMsg(0, data.ctn, msg.from, msg.to);
});
socket.on('chat message', function(data){
    var html = '<li class="chat-box-l"><img class="chat-user-img" src="/images/mb2.jpg"><p class="chat-p">' + data.msg +'</p></li>';
    $('#messages').append(html);
    // doAddMsg(data.status, data.ctn);
    if(data.status == 1) {
        doAddMsg(1, data.ctn, msg.to, msg.from);
    } else if(data.status == 0) {
        doAddMsg(0, data.ctn, msg.from, msg.to);
    }
});
socket.on('user left', function (msg) {
    var html = '<li class="chat-box-l"><img class="chat-user-img" src="/images/mb2.jpg"><p class="chat-p">' + msg +'</p></li>';
    $('#messages').append(html);
});

function doAddMsg(status, ctn, from, to) {
    $.ajax({
        type: "POST",
        url: "/p/addMessage",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'from': from,
            'to': to,
            'content': ctn,
            'status': status
        }),
        success: function(result) {
            if (result.code == 99) {
                alert("发送失败");
            }
        }
    })
}
function updateMsgStatus() {
    $.ajax({
        type: "POST",
        url: "/p/updateMsgStatus",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'from': msg.to,
            'to': msg.from
        }),
        success: function(result) {
            if (result.code == 99) {
                alert(result.msg);
            } else {
                console.log("消息已全部阅读！");
            }
        }
    })
}