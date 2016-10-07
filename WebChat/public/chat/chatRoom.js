var socket = io();
//传递给服务器用户Id
var data = {
    from: $('.chat-room').attr("data-id")
};
var msg = {
    from:   $('.chat-room').attr("data-id"),
    to: $('.username-to').attr("data-id"),
    content: ''
};

socket.emit('add user', data);

$('form').submit(function(){
    var ctn = $('#m').val();
    if(ctn != '') {
        var html = '<li class="chat-box-r"><p class="chat-p">'+ ctn +'</p><img class="chat-user-img" src="/images/mb2.jpg"></li>';
        $('#messages').append(html);
        msg.content = ctn;
        socket.emit('chat message', msg);
        doAddMsg();
    }
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msg){
    var html = '<li class="chat-box-l"><img class="chat-user-img" src="/images/mb2.jpg"><p class="chat-p">' +msg +'</p></li>';
    $('#messages').append(html);
});

function doAddMsg() {
    $.ajax({
        type: "POST",
        url: "/p/addMessage",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'from': msg.from,
            'to': msg.to,
            'content': msg.content
        }),
        success: function(result) {
            if (result.code == 99) {
                alert("发送失败");
            }
        }
    })
}