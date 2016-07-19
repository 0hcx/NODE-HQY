$(init);

function init() {
    console.log("出事了");     
    $("body").on('click', '#registerBtn', doRegister);
}

function doRegister() {
    $.ajax({
        type: "POST",
        url: "/register",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'usr': $("#usr").val(),
            'pwd': $("#pwd").val()
        }),
        success: function(result) {
            if (result.code == 99) {
                alert(result.msg);
            } else {
                alert("注册成功！");
                location.href = '/';
            }
        }
    })
}