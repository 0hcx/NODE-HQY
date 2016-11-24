var urlGetQuestionCtn  = "/admin/getQuestionOne";
var urlUpdateQuestionCtn = "/admin/updateQuestionCtn";
var urlSaveAnswer = "/p/saveAnswer";
var urlGetAnswerOne = "/p/getAnswerOne";
var urlGetAllStudents = "/admin/getAllStudents";
var urlUpdateStatus = "/p/updateStatus";
var urlGetQuestionList = "/admin/getQuestionList";
var urlSaveScore = "/admin/saveScore";

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