var socket = io();
var userId = $("#userId").val();
var userCategory = $("#userCategory").val();
$(init);

function init() {
    socketInit();
    getStudentStatus();
    // $("body").on('click', clickEvent);
}
function socketInit() {
    // 学生更新操作，考试客户端就重新加载
    var data = {
        userId: userId,
        userCategory: userCategory
    };
    socket.emit("login", data);
    socket.on("reload", function () {
        getStudentStatus();
    });
}
function clickEvent(e) {
    var element = $(e.target).attr("id");
    switch (element) {
        case "addQueBtn":
            doRegister();
            break;
        case "updateQueBtn":
            updateQuestionCtn();
            break;
        default:
            break;
    }
}
function inputEvent(e) {
    var element = $(e.target).attr("id");
}
function postData(url, data, cb) {
    var promise = $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        contentType: "application/json",
        data: data
    });
    promise.done(cb);
}
//获取学生状态列表
function getStudentStatus() {
    var jsonData = JSON.stringify({});
    postData(urlGetAllStudents, jsonData, cbShowStatus);
}
function cbShowStatus(data) {
    var studentList = data.results;
    var html;
    var init = "student-block status-gray";
    var login = "student-block status-red";
    var exam = "student-block status-blue";
    var submit = "student-block status-green";
    $("#studentList").html("");

    for(var i = 0; i < studentList.length; i++) {
        switch (studentList[i].status) {
            case "INIT":
                html = $.format(STUDENT_BLOCK, init, studentList[i]._id, studentList[i].username, studentList[i].userId);
                break;
            case "LOGIN":
                html = $.format(STUDENT_BLOCK, login, studentList[i]._id, studentList[i].username, studentList[i].userId);
                break;
            case "EXAM":
                html = $.format(STUDENT_BLOCK, exam, studentList[i]._id, studentList[i].username, studentList[i].userId);
                break;
            case "SUBMIT":
                html = $.format(STUDENT_BLOCK_SUBMIT, submit, studentList[i]._id, studentList[i].username, studentList[i].userId);
                break;
            default:
                break;
        }
        $("#studentList").append(html);
    }
}
