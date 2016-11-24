$(init);

function init() {
    $("body").on('click', '#registerBtn', doRegister);
}

function doRegister() {
    var usr = $("#usr").val();
    var pwd = $("#pwd").val();
    var _pwd= $('#pwd-repeat').val();
    var name= $('#student-name').val();
    if (!usr || !pwd || !name) {
        alert('用户名和密码都不能为空!');
        return;
    } else if (_pwd != pwd) {
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
            'pwd': pwd,
            'username': name
        }),
        success: function(result) {
            if (result.code == 99) {
                alert(result.msg);
            } else {
                alert("注册成功！");
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
function doAddStudent() {
    var jsonData = JSON.stringify({
        'usrId': usrId,
        'pwd': pwd,
        'username': username
    });
    postData(urlAddStudent, jsonData, cbAddStudent);
}
function cbAddStudent(result) {
    if (result.code == 99) {
        alert(result.msg);
    } else {
        alert("添加成功！");
        location.href = '/p/index';
    }
}