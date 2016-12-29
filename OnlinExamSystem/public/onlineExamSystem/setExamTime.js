$(init);

function init() {
    getExamTime();
    $("body").on('click', '#setTimeBtn', doSetExamTime);
    var start = {
        format: 'YYYY-MM-DD hh:mm',
        minDate: $.nowDate(0), //设定最小日期为当前日期
        festival: true,
        ishmsVal: false,
        maxDate: '2099-06-30 23:59:59', //最大日期
        choosefun: function(elem, datas){
            end.minDate = datas; //开始日选好后，重置结束日的最小日期
        }
    };
    var end = {
        format: 'YYYY-MM-DD hh:mm',
        minDate: start.maxDate, //设定最小日期为当前日期
        festival: true,
        ishmsVal: false,
        maxDate: '2099-06-16 23:59:59', //最大日期
        choosefun: function(elem, datas){
            start.maxDate = datas; //将结束日的初始值设定为开始日的最大日期
        }
    };
    $.jeDate('#startTime', start);
    $.jeDate('#endTime', end);
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
    var startDate = $("#startTime").val();
    var endDate = $("#endTime").val();
    var jsonData = JSON.stringify({
        'subject': "WEB",
        'startTime': startDate,
        'endTime': endDate
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
    $("#subjectName").text("考试科目：" + result.subject);
    $("#startTime").val(result.startTime);
    $("#endTime").val(result.endTime);
}

