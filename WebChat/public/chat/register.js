$(init);

function init() {
    $("body").on('click', '#registerBtn', doRegister);
}

function doRegister() {
    var usr = $("#usr").val();
    var pwd = $("#pwd").val();
    var _pwd= $('#pwd-repeat').val();
    if (!usr || !pwd) {
        alert('用户名和密码都不能为空!');
        return;
    }
    else if (_pwd != pwd) {
        alert('两次输入密码不一样!');
        return;
    }
    $.ajax({
        type: "POST",
        url: "/register",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'usr': usr,
            'pwd': pwd
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
