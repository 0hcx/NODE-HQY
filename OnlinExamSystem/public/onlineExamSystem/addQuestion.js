//题目
var question = {
    id: 0, //选中的题目Id
    ctn: ""
};

$(init);

function init() {
    $("body").on('click', clickEvent);
    $("body").on("input", inputEvent);

    $('[data-toggle="select"]').on('click', function (e) {
        $(".item-ctn").removeClass("hide");
        e.preventDefault();
        var $this = $(this);
        question.id = $this.data('id');
        $("#question-head").text("第" + $(this).text() + "题");
        $("#updateQueBtn").addClass("hide");
        getQuestionCtn(question.id);
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
    if(element == "que-score" || element =="questionContent") {
        $("#updateQueBtn").removeClass("hide");
    }
}
//添加学生
function doRegister() {
    var ctn = $("#que-ctn").val();
    var score = $("#que-score").val();
    if (!ctn || !score) {
        alert('问题内容或分数不能为空!');
        return;
    }
    $.ajax({
        type: "POST",
        url: "/admin/addQuestion",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'content': ctn,
            'score': score
        }),
        success: function(result) {
            if (result.code == 99) {
                alert(result.msg);
            } else {
                alert("添加成功！");
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
//获取题目列表
function getQuestionCtn(id) {
    var jsonData = JSON.stringify({
        "_id": id
    });
    postData(urlGetQuestionCtn, jsonData, cbShowQuestionCtn);
}
function cbShowQuestionCtn(result) {
    $("#que-score").val(result.score);
    $("#questionContent").val(result.content);
}
//修改题目内容
function updateQuestionCtn() {
    var jsonData = JSON.stringify({
        "_id": question.id,
        "content": $("#questionContent").val(),
        "score": $("#que-score").val()
    });
    postData(urlUpdateQuestionCtn, jsonData, cbUpdateQuestionCtn);
}
function cbUpdateQuestionCtn(result) {
    if(result.code != 99) {
        alert("更新成功！");
    } else {
        alert("更新失败！");
    }
}
