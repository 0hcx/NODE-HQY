$(init);

function init() {
    getExamTime();
    $("body").on('click', '#setTimeBtn', doSetExamTime);
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
//设置时间
function doSetExamTime() {
    var startTime = [], endTime = [];
    $("input[name='startTime']").each(function () {
        startTime.push($(this).val());
    });
    $("input[name='endTime']").each(function () {
        endTime.push($(this).val());
    });
    var jsonData = JSON.stringify({
        'subject': "WEB",
        'startTime': startTime,
        'endTime': endTime
    });
    postData(urlSetExamTime, jsonData, cbSetExamTime);
}
function cbSetExamTime(result) {
    if (result.code == 99) {
        alert("设置失败！");
    } else {
        alert("设置成功！");
        location.href = '/p/index';
    }
}
//获得考试科目和时间
function getExamTime() {
    var jsonData = JSON.stringify({
        "subject": "WEB"
    });
    postData(urlGetExamTime, jsonData, cbGetExamTime);
}
function cbGetExamTime(result) {
    var i = 0, j = 0;
    $("#subjectName").text("考试科目：" + result.subject);
    $("input[name='startTime']").each(function () {
        $(this).val(result.startTime[i]);
        i++;
    });
    $("input[name='endTime']").each(function () {
        $(this).val(result.endTime[j]);
        j++;
    });
}

