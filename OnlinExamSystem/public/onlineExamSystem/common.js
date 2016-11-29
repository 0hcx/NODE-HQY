var urlGetQuestionCtn  = "/admin/getQuestionOne";
var urlUpdateQuestionCtn = "/admin/updateQuestionCtn";
var urlSaveAnswer = "/p/saveAnswer";
var urlGetAnswerOne = "/p/getAnswerOne";
var urlGetAllStudents = "/admin/getAllStudents";
var urlUpdateStatus = "/p/updateStatus";
var urlGetQuestionList = "/admin/getQuestionList";
var urlSaveScore = "/admin/saveScore";
var urlExportExcel = "/admin/exportExcel";
var urlImportExcel = "/admin/importExcel";
var urlSetExamTime = "/admin/setExamTime";
var urlGetExamTime = "/p/getExamTime";
var urlStatistic = "/admin/statistic";

var STUDENT_LIST = "<tr><td>{0}</td> <td>{1}</td> <td>{2}</td> <td><a href='/p/studentDelete/{3}' class='btn btn-block btn-primary btn-xs' data-toggle='confirm' data-message='确认要删除此学生吗'>删除</a></td></tr>";
var STUDENT_BLOCK = "<div class='{0}' data-toggle='select' data-id='{1}'><div>{2}</div><div class='info-studentId'>{3}</div></div>";
var STUDENT_BLOCK_SUBMIT = "<div class='{0}' data-toggle='select'><a href='/p/markPaper/{1}'><div>{2}</div><div class='info-studentId'>{3}</div></a></div>";
var QUESTION_LIST = "<div class='question-item' data-toggle='select' data-id='{0}'>{1}</div>";

//字符串格式化
$.format = function (source, params) {
    if (arguments.length == 1)
        return function () {
            var args = $.makeArray(arguments);
            args.unshift(source);
            return $.format.apply(this, args);
        };
    if (arguments.length > 2 && params.constructor != Array) {
        params = $.makeArray(arguments).slice(1);
    }
    if (params.constructor != Array) {
        params = [params];
    }
    $.each(params, function (i, n) {
        source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
    });
    return source;
};

//删除警告确认对话框
$('[data-toggle="confirm"]').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var msg = $this.data('message');
    if (confirm(msg)) {
        location.href = $this.attr('href');
    }
});