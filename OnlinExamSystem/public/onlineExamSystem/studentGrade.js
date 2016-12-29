var student = {};
student.idList = new Array();
student.nameList = new Array();
student.gradeList = new Array();
$(init);

function init() {
    getGrades();
    $("body").on('click', '#countBtn', doStatistic);
    $("body").on('click', '#epGradeBtn', doExport);
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
//获取学生列表
function getGrades() {
    var jsonData = JSON.stringify({
        subject: "WEB"
    });
    postData(urlGetStudentGrades, jsonData, cbStudentGrades);
}
function cbStudentGrades(data) {
    var arr = data;
    for(var i = 0; i < arr.length; i++) {
        student.idList[i] = arr[i].userId.userId;
        student.nameList[i] = arr[i].userId.username;
        student.gradeList[i] = arr[i].score;
        var html = $.format(STUDENT_GRADE, i+1, student.idList[i], student.nameList[i], student.gradeList[i]);
        $("#student-table").append(html);
    }
}
//统计成绩
function doStatistic() {
    var jsonData = JSON.stringify({

    });
    postData(urlStatistic, jsonData, cbStatistic);
}
function cbStatistic(result) {
    if(result == 99) {
        alert("统计失败");
    } else {
        alert("统计成功");
        location.reload();
    }
}
//导出EXCEL文件
function doExport() {
    var jsonData = JSON.stringify({
        "idList": student.idList,
        "nameList": student.nameList,
        "gradeList": student.gradeList,
        "type": "GRADE"
    });
    postData(urlExportExcel, jsonData, cbExportExcel);
}
function cbExportExcel(result) {
    alert(result);
}
