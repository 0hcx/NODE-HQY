var student = {};
student.idList = new Array();
student.nameList = new Array();
$(init);

function init() {
    getAllStudents();
    $("body").on('click', '#exportBtn', doExport);
    $("body").on('click', '#importBtn', doImport);
    // $("body").on('click', '#countBtn', doStatistic);
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
function getAllStudents() {
    var jsonData = JSON.stringify({});
    postData(urlGetAllStudents, jsonData, cbAllStudents);
}
function cbAllStudents(data) {
    var arr = data.results;
    for(var i = 0; i < arr.length; i++) {
        student.idList[i] = arr[i].userId;
        student.nameList[i] = arr[i].username;
        var html = $.format(STUDENT_LIST, i+1, arr[i].userId, arr[i].username, arr[i]._id);
        $("#student-table").append(html);
    }
}
//导出EXCEL文件
function doExport() {
    var jsonData = JSON.stringify({
        "idList": student.idList,
        "nameList": student.nameList,
        "type": "STUDENTS"
    });
    postData(urlExportExcel, jsonData, cbExportExcel);
}
function cbExportExcel(result) {
    alert(result);
}
//导入学生数据
function doImport() {
    var jsonData = JSON.stringify({});
    postData(urlImportExcel, jsonData, cbImportExcel);
}
function cbImportExcel(result) {
    if(result.code == 99) {
        alert("批量添加失败");
    } else {
        location.reload();
    }
}
//统计成绩
// function doStatistic() {
//     var jsonData = JSON.stringify({
//        
//     });
//     postData(urlStatistic, jsonData, cbStatistic);
// }
// function cbStatistic(result) {
//     if(result == 99) {
//         alert("统计失败");
//     } else {
//         alert("统计成功");
//     }
// }