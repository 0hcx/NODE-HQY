//题目
var questionId = 0;
var studentId = $("#studentId").val();

$(init);

function init() {
    getQuestionList();
    $("body").on('click', '#saveMarkBtn', saveMark);
    $("body").on("click", "[data-toggle='select']", showContent);
}
//保存分数
function saveMark() {
    var jsonData = JSON.stringify({
        "userId": studentId,
        "questionId": questionId,
        "score": $("#give-score").val()
    });
    postData(urlSaveScore, jsonData, cbSaveScore);
}
function cbSaveScore(result) {
    if(result.code == 99) {
        alert("批改失败");
    }
}
//显示题目内容和学生答题内容
function showContent(e) {
    $(".answer-wrap").removeClass("hide");
    e.preventDefault();
    var $this = $(this);
    questionId = $this.data('id');
    $("#question-head").text("第" + $(this).text() + "题");
    getQuestionCtn();
    getAnswerOne();
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
//获取题目列表
function getQuestionList() {
    var jsonData = JSON.stringify({});
    postData(urlGetQuestionList, jsonData, cbQuestionList);
}
function cbQuestionList(result) {
    var list = result.results;
    for(var i = 0; i < list.length; i++) {
        var html = $.format(QUESTION_LIST, list[i]._id, i+1);
        $(".item-number").append(html);
    }
}
//获取题目内容
function getQuestionCtn() {
    var jsonData = JSON.stringify({
        "_id": questionId
    });
    postData(urlGetQuestionCtn, jsonData, cbShowQuestionCtn);
}
function cbShowQuestionCtn(result) {
    $("#que-score").text("分值：" + result.score);
    $("#questionContent").text(result.content);
}
//获得学生答案
function getAnswerOne() {
    var jsonData = JSON.stringify({
        "userId": studentId,
        "questionId": questionId
    });
    postData(urlGetAnswerOne, jsonData, cbShowAnswer);
}
function cbShowAnswer(result) {
    if(result != "99") {
        $("#give-score").val(result.score);
        $("#answerCtn").text(result.answerCtn);
    } else {
        $("#answerCtn").text("该学生没有完成该题目");
    }
}