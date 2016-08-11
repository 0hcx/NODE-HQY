$(init);

function init() {
    var socket = io();

    socket.on('uploadProgress' , function(percent){
        console.log(percent);
        $(".pg-bar").progressbar( "option", "value", parseInt(percent));
        $(".pg-info").text( percent + '%');
    });
    $("#defaultForm").validate({
        wrapper:"span",
        onfocusout:false,
        submitHandler:function(form) {
            updateUser();  //验证成功则调用更新用户信息函数
        }
    })

    $(".pg-bar").progressbar({value: 0});
    $(".pg-bar").progressbar( "option", "max", 100 );
    // $("body").on('click', '#addNewsBtn', doAddNews);
    $("body").on('click', '#UploadBtn', doUpload);
    $("body").on('change', '#uploadFile', preUpload);
}

function preUpload() {
    $("#UploadBtn").removeClass('disabled');
}

function doUpload() {

    $(".pg-wrapper").show();

    var file = $("#uploadFile")[0].files[0];
    var form = new FormData();
    form.append("file", file);

    $.ajax({
        url: "/admin/uploadImg",
        type: "POST",
        data: form,
        async: true,
        processData: false,
        contentType: false,
        success: function(result) {
            startReq = false;
            if (result.code == 0) {
                $("#newUserImg").attr("src",result.data);
                $(".pg-wrapper").hide();
            }
        }
    });
}

function updateUser() {

    $.ajax({
        type: "POST",
        url: "/admin/userEdit",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'userId': $("#userId").val(),
            'newEmail': $("#newEmail").val(),
            'newAddress': $("#newAddress").val(),
            'newUserImg': $("#newUserImg").attr("src")
        }),
        success: function(result) {
            if (result.code == 99) {
                alert(result.msg);
            } else {
                alert("更新成功！");
                location.href = '/p/blogs';
            }
        }
    })
}

