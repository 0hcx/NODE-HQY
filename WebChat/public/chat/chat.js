var socket = io();//传递给服务器用户Id
var chatSession = [];
var uid = $.cookie('id');
var fid;
var name;

$(init);

function init() {

    // qq表情
    $('.emotion').qqFace({
        id : 'facebox',
        assign:'msg',
        path:'/images/face/'	//表情存放的路径
    });
    //屏幕截图
    $('#msg').screenshotPaste({
        imgContainer: '#imgPreview',
        uploadBtn: '#UploadBtn-screen'
    });

    if($(window).width() <= 450) {
        $('.chat-room').css("height", $(window).height());
        $('.chat-sidebar').css("height", $(window).height());
        $('.chat-box').css("height", $(window).height());
        $('[data-toggle="sidebar-on"]').on('click', function (e) {
            e.preventDefault();
            $('.mobile-sidebar').hide();
            $('.chat-sidebar').show();
        });

        $('[data-toggle="sidebar-off"]').on('click', function (e) {
            e.preventDefault();
            $('.chat-sidebar').hide();
            $('.mobile-sidebar').show();
        });
    }


    $('body').on('click', '.history-msg' , toggleHistoryView);
    $('body').on('click', '.history-back' , toggleChatView);
    $("body").on('click', '#sendBtn', doSend);
    $("body").on('click', '#UploadBtn', doUpload);
    $("body").on('click', '#UploadBtn-screen', doUploadScreen);
    $("body").on('change', '#uploadFile', preUpload);
    
    $('[data-toggle="select"]').on('mouseover', function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.find('.users-list-r').show();
    });

    $('[data-toggle="select"]').on('mouseout', function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.find('.users-list-r').hide();
    });
    $('[data-toggle="select"]').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        var friendId = $this.data('id');
        if(friendId == $.cookie('id')) {
            alert("不能添加自己！");
        } else {
            doAddFriend(friendId);
        }
    });
    $('[data-toggle="chat"]').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        fid = $this.data('id');
        name = $this.children('.username').html();
        createChat();
        $(".chat-default").hide();
        $(".box-send").show();
    });

    socket.on('chat message', function(data){
        if(data.status == 2) {
            var unread = parseInt($("#r"+data.from).html())+1;
            $("#r"+data.from).html(unread);
            $("#r"+data.from).show();
            doAddMsg(0, data.ctn, data.from, data.to);
        } else if(data.status == 1) {
            var html = $.format(FROM_MSG, replace_em(data.msg));
            $("#m"+fid).append(html);
            doAddMsg(1, data.ctn, data.from, data.to);
        } else if(data.status == 0) {
            doAddMsg(0, data.ctn, data.from, data.to);
        }
        toBottom();
    });
    socket.on('user left', function (msg) {
        var html = '<li class="chat-box-l"><img class="chat-user-img" src="/images/mb2.jpg"><p class="chat-p">' + msg +'</p></li>';
        $("#m"+fid).append(html);
    });
}

function preUpload() {
    $("#UploadBtn").removeClass('disabled');
}

function createChat() {
    if (chatSession.indexOf(fid) === -1) {
        chatSession.push(fid);
    }
    var data = {
        from: uid,
        to: fid
    };
    socket.emit('add user', data);
    toggleChatView();
}

//切换聊天窗口
function toggleChatView() {
    if ($("#t"+fid).length == 0 && $("#c"+fid).length == 0) {
        $(".chat-area").prepend('<div class="box-hd" id="t'+fid+'"> <div class="info-friend">'+name+'</div><div class="history-msg">聊天记录</div></div><div class="box-bd" id="c'+fid+'"><ul class="messages" id="m'+fid+'"></ul></div>');
    }
    $(".box-bd").css("height", "508px");
    getUnreadMsg(fid);
    updateMsgStatus(fid);
    $(".box-hd").hide();
    $(".box-bd").hide();
    $(".box-send").show();
    $("#t"+fid).show();
    $("#c"+fid).show();
}

//切换聊天记录窗口
function toggleHistoryView() {
    $("#mh"+fid).html('');
    if ($("#th"+fid).length == 0 && $("#ch"+fid).length == 0) {
        $(".chat-area").prepend('<div class="box-hd" id="th'+fid+'"> <div class="info-friend">与'+name+'的聊天记录</div><div class="history-back">返回</div> </div><div class="box-bd" id="ch'+fid+'"><ul class="messages" id="mh'+fid+'"></ul></div>');
    }
    getHistoryMsg();
    $(".box-hd").hide();
    $(".box-bd").hide();
    $(".box-send").hide();
    $(".box-bd").css("height", "709px");
    $("#th"+fid).show();
    $("#ch"+fid).show();
}
//发送消息
function doSend() {
    var ctn = $('#msg').val();
    if(ctn != '') {
        var html = $.format(TO_MSG, replace_em(ctn));
        $("#m"+fid).append(html);
        var msg = {
            from: uid,
            to: fid,
            content: ctn
        };
        socket.emit('chat message', msg);
        toBottom();
    }
    $('#msg').val('');
}

//接收新消息时，聊天框自动滚到最下方
function toBottom(){
    $("#c"+fid).scrollTop($("#c"+fid)[0].scrollHeight);
}

function doAddFriend(friendId) {
    $.ajax({
        type: "POST",
        url: "/p/addFriend",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'user': $.cookie('id'),
            'friend': friendId
        }),
        success: function(result) {
            if (result.code == 99) {
                alert("添加出错");
            } else if(result.code == 98) {
                alert("该好友已添加！");
            } else{
                alert("添加成功！");
                location.href = '/p/index';
            }
        }
    })
}

function postData(url, data, cb) {
    var promise = $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        contentType: "application/json",
        data:data
    });
    promise.done(cb);
}

function doAddMsg(status, ctn, from, to) {
    var jsonData = JSON.stringify({
        'from': from,
        'to': to,
        'content': ctn,
        'status': status
    });
    postData(urlAddMsg, jsonData, cbAddMsg);
}

function getUnreadMsg(fid) {
    var jsonData = JSON.stringify({
        'from': fid,
        'to': uid
    });
    postData(urlGetUnreadMsg, jsonData, cbShowMsg);
}

function updateMsgStatus(fid) {
    var jsonData = JSON.stringify({
        'from': fid,
        'to': uid
    });
    postData(urlUpdateMsgStatus, jsonData, cbSetOffMsgCount);
}

function getHistoryMsg() {
    var jsonData = JSON.stringify({
        'from': fid,
        'to': uid
    });
    postData(urlGetHistoryMsg, jsonData, cbShowHistoryMsg);
}

function cbShowMsg(result) {
    if(result.length != 0) {
        for(var i =0; i < result.length; i++) {
            var html = '<li class="chat-box-l"><img class="chat-user-img" src="/images/mb2.jpg"><p class="chat-p">' + replace_em(result[i].content) +'</p></li>';
            $("#m"+fid).append(html);
        }
    }
}
function cbSetOffMsgCount(result) {
    var id = result.id;
    $("#r"+id).html('0');
    $("#r"+id).hide();
}
function cbAddMsg(result) {
    var msg = result.code;
    if(msg == 99) {
        alert("消息保存失败!");
    }
}
function cbShowHistoryMsg(result) {
    if(result.length != 0) {
        for(var i =0; i < result.length; i++) {
            if(result[i].from == uid) {
                var html = $.format(TO_MSG, replace_em(result[i].content));
            } else {
                var html = $.format(FROM_MSG, replace_em(result[i].content));
            }
            $("#mh"+fid).append(html);
        }
    }
}
// qq表情及图片判断
function replace_em(str){
    str = str.replace(/\</g,'&lt;');
    str = str.replace(/\>/g,'&gt;');
    str = str.replace(/\n/g,'<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g,'<img src="/images/face/$1.gif" border="0" />');
    str = str.replace(/[\\]public[\\]uploadFile[\\]upload_[\w]+[\.]jpg/g,"<img class='img-msg' src=" + str + " />");
    return str;
}
//发送图片
function doUpload() {

    var file = $("#uploadFile")[0].files[0];
    var form = new FormData();
    form.append("file", file);

    $.ajax({
        url: "/p/uploadImg",
        type: "POST",
        data: form,
        async: true,
        processData: false,
        contentType: false,
        success: function(result) {
            startReq = false;
            if (result.code == 0) {
                var html = $.format(TO_MSG_IMG, result.data);
                $("#m"+fid).append(html);
                var msg = {
                    from: uid,
                    to: fid,
                    content: result.data
                };
                socket.emit('chat message', msg);
                toBottom();
            }
        }
    });
}

// randomWord 产生任意长度随机字母数字组合
// randomFlag 是否任意长度
// min 任意长度最小位[固定位数]
// max 任意长度最大位
function randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}
//发送截图
function doUploadScreen() {
    var imgData = $('#imgPreview').screenshotPaste('getImgData');
    var fileName = randomWord(false, 32);   //随机字符串组成的图片名

    $.ajax({
        type: "POST",
        url: "/p/upload",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'img': imgData,
            'fileName': fileName
        }),
        success: function(result) {
            $('#imgPreview').hide();
            $('#UploadBtn-screen').addClass('disabled');
            if (result.code == 0) {
                var html = $.format(TO_MSG_IMG, result.data);
                $("#m"+fid).append(html);
                var msg = {
                    from: uid,
                    to: fid,
                    content: result.data
                };
                socket.emit('chat message', msg);
                toBottom();
            }
        }
    })
}