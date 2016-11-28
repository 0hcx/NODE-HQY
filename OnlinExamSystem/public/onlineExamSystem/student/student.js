var socket = io();
//题目
var question = {
    id: 0, //选中的题目Id
    ctn: ""
};
var examTime = {
    subject: "",
    startTime: [],
    endTime: []
};
var userId = $("#userId").val();
var userStatus = $("#userStatus").val();
var userCategory = $("#userCategory").val();
var START = "START";    //开始考试状态
var END = "END";      //考试结束状态
var EXAM = "EXAM";
var SUBMIT = "SUBMIT";
var INIT = "INIT";
var LOGIN = "LOGIN";
var status = INIT;

$(init);

function init() {
    $(window).on('beforeunload',function(){
        return '您输入的内容尚未保存，确定离开此页面吗？';
    });
    getExamTime();
    timeBefore();
    socketInit();
    $("body").on('click', clickEvent);
    $("body").on('click', "[data-toggle='select']", showQuestion);
}
function getTimeDifference(timeList) {
    var tL = timeList;
    var now = new Date();
    var startTime =  new Date(parseInt(tL[0]), parseInt(tL[1]-1), parseInt(tL[2]), parseInt(tL[3]), parseInt(tL[4]));
    var timeDifference = startTime.getTime() - now.getTime();
    var second = parseInt(timeDifference / 1000);
    var time = {
        remain: second,
        second: (second < 60) ? second : second % 60,
        hour: parseInt(second / 3600),
        minute: parseInt((second - parseInt(second / 3600) * 3600) / 60)
    };
    return time;
}
//考试开始时间
function timeBefore() {
    var timer = setInterval(function() {
        var time = getTimeDifference(examTime.startTime);
        $('#time-title').text("距离考试开始");
        $('#time-ctn').text(time.hour + " : " + time.minute + " : " + time.second);
        if(time.remain <= 0) {
            status = START;
            showExamTime();
            clearInterval(timer);
        }
    }, 1000);
}
//考试结束倒计时
function showExamTime() {
    var timer = setInterval(function() {
        var time = getTimeDifference(examTime.endTime);
        $('#time-title').text("距离考试结束");
        $('#time-ctn').text(time.hour + " : " + time.minute + " : " + time.second);
        if(time.remain <= 0) {
            status = END;
            doUpdate(SUBMIT);
            clearInterval(timer);
        }
    }, 1000);
}
//点击事件
function clickEvent(e) {
    var element = $(e.target).attr("id");
    switch (element) {
        case "saveAnswerBtn":
            doSaveAnswer(question.id);
            break;
        case "submitBtn":
            doUpdate(SUBMIT);
            break;
        default:
            break;
    }
}
function socketInit() {
    var data = {
        userId: userId,
        userCategory: userCategory
    };
    socket.emit("login", data);
    status = LOGIN;
}
function showQuestion(e) {
    if(status == START && userStatus != SUBMIT) {
        if(question.id != 0) {
            doSaveAnswer();
        }
        $(".default-welcome").addClass("hide");
        $(".answer-section").removeClass("hide");
        e.preventDefault();
        var $this = $(this);
        question.id = $this.data('id');
        $("#question-head").text("第" + $(this).text() + "题");
        $("#updateQueBtn").addClass("hide");
        getQuestionCtn();
        getAnswerOne();
        //转换为答题状态
        doUpdate(EXAM);
    } else if(userStatus == SUBMIT) {
        alert("你已提交答卷，请等候老师批阅。");
    } else if(status != START) {
        alert("考试时间未到！");
    }
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
function getQuestionCtn() {
    var jsonData = JSON.stringify({
        "_id": question.id
    });
    postData(urlGetQuestionCtn, jsonData, cbShowQuestionCtn);
}
function cbShowQuestionCtn(result) {
    $("#que-score").text("分值：" + result.score);
    $("#questionContent").text(result.content);
}
//保存答题内容
function doSaveAnswer() {
    var jsonData = JSON.stringify({
        "userId": userId,
        "questionId": question.id,
        "answerCtn": $("#answer-ctn").val()
    });
    postData(urlSaveAnswer, jsonData, cbSaveAnswer);
}
function cbSaveAnswer(result) {
    if(result.code == 99) {
        alert("保存失败！");
    }
}
//获取答题保存的内容
function getAnswerOne() {
    var jsonData = JSON.stringify({
        "userId": userId,
        "questionId": question.id
    });
    postData(urlGetAnswerOne, jsonData, cbShowAnswer);
}
function cbShowAnswer(result) {
    if(result != "99") {
        $("#answer-ctn").val(result.answerCtn);
    } else {
        $("#answer-ctn").val("");
    }
    
}
//更改用户状态为已提交,强制刷新页面
function doUpdate(status) {
    var jsonData = JSON.stringify({
        "userId": userId,
        "status": status
    });
    if(status == EXAM) {
        postData(urlUpdateStatus, jsonData, null);
    } else {
        postData(urlUpdateStatus, jsonData, cbUpdateStatus);
    }
    socket.emit("update status");
}
function cbUpdateStatus(result) {
    if(result.code != 99) {
        userStatus = SUBMIT;
        $(".default-welcome").removeClass("hide");
        $(".answer-section").addClass("hide");
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
    examTime.subject = result.subject;
    examTime.startTime = result.startTime;
    examTime.endTime = result.endTime;
}
