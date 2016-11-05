var socket = io();  //传递给服务器用户Id
var to; //对方id
var wrapper = ".wrapper";
var htmlLogin = "<div class='login'><button type='button' id='login'>登录</button> </div>";
var htmlWait = "<div class='waiting'> <h3>请等待另一位玩家加入。。。</h3> </div>";
var htmlPoker = "<div class='wrap'> <div class='box-upper'></div> <div class='box-center'> <div class='preview-above' id='preview-above'></div> <div class='preview-below' id='preview-below'></div> </div> <div class='button-turn hide-block'> <button class='discard' id='discard'>出牌</button> <button class='abandon' id='abandon'>放弃</button> </div> <div class='box-below' id='box-below'></div></div>";

$(init);

function init() {

    //绑定点击事件
    $("body").on("click", function(e){
        clickEvent($(e.target).attr("id"), $(e.target));
    });
    //初始化socket
    socketInit();

}
function socketInit() {
    //监听服务器消息
    //等待状态
    socket.on("waiting", function () {
        $(wrapper).html("");
        $(wrapper).append(htmlWait);
    });
    //进入打牌界面
    socket.on("start poker", function (data) {
        to = data.to;
        $(wrapper).html("");
        $(wrapper).append(htmlPoker);
        if(data.before == true) {
            $(".button-turn").removeClass("hide-block");
        }
        poker(data.pokerList, 27);
    });
    //第三人登录显示拥挤
    socket.on("crowded", function () {
        alert("棋牌室拥挤，请稍后再试。。。");
    });
    //对方退出全部初始化
    socket.on("exit", function () {
        $(wrapper).html("");
        $(wrapper).append(htmlLogin);
    });
    //接受对方的牌
    socket.on("receive discard", function (data) {
        var num = data.num;
        var length = $(".opposite").length;
        $("#preview-above").html("");
        $("#preview-below").html("");
        for(var index in data.discard) {
            $("#preview-above").append(data.discard[index]);
        }
        $(".button-turn").removeClass("hide-block");
        // $(".opposite:eq(" + i + ")").remove();
        $(".box-upper").html("");
        oppositePoker(length - num);

    });
    //对方放弃出牌
    socket.on("receive abandon", function () {
        $("#preview-above").html("");
        $(".button-turn").removeClass("hide-block");
    });
}
//初始化扑克牌
function poker(list, n) {
    var pokerList = list.sort(sortNumber);
    for(var index in pokerList) {
        getPos(pokerList[index]);
    }
    oppositePoker(n);
}
//展示对方的牌
function oppositePoker(n) {
    for(var i = 0; i < n; i++) {
        var left = -180;
        var top = -480;
        var html = "<div class='poker opposite' style='background-position: " + left + "px " + top + "px;'></div>";
        $(".box-upper").append(html);
    }
}
//根据余数排序
function sortNumber(a, b) {
    var x = changeNum(a % 13, a);
    var y = changeNum(b % 13, b);
    return y - x;
}
//改变特殊牌的值
function changeNum(n, m) {
    var temp = n;
    switch (m) {
        case 53:
            temp = 18;
            n = -1;
            break;
        case 54:
            temp = 17;
            n = -1;
            break;
        default:
            break;
    }
    switch (n) {
        case 0:
            temp = 14;
            break;
        case 1:
            temp = 15;
            break;
        case 2:
            temp = 16;
            break;
        default:
            break;
    }
    return temp;
}
//根据序号指定精灵图的位置
function getPos(index) {
    var left = (index % 13 == 0) ? 1080 : (index % 13 * 90 - 90);
    var top = (index % 13 == 0) ? (parseInt(index / 13) * 120 - 120) : (parseInt(index / 13) * 120);
    left *= -1;
    top *= -1;
    var html = "<div class='poker p" + index +"' id='p" + index + "' style='background-position: " + left + "px " + top + "px;'></div>";
    $(".box-below").append(html);
}
//点击事件
function clickEvent(element, n) {
    var temp = element.replace(/[p]([0-9]+)/g, "p");

    switch(temp) {
        //登录
        case "login":
            //获得唯一的id
            window.id = new Date().getTime()+""+Math.floor(Math.random()*899+100);
            socket.emit("add user", id);
            break;
        //选牌
        case "p":
            var that = n;
            if(that.parent().attr("id") == "box-below") {
                if(that.hasClass("click-up")) {
                    that.removeClass("click-up");
                } else {
                    that.addClass("click-up");
                }
            }
            break;
        //出牌
        case "discard":
            if($(".box-below").find(".click-up").length == 0) {
                alert("请选择要出的牌，若没有请点击放弃");
            } else {
                var list = new Array();
                var i = 0;
                $("#preview-above").html("");
                $("#preview-below").html("");
                $(".click-up").each(function () {
                    list[i] = $(this).prop("outerHTML");
                    $(this).removeClass("click-up");
                    $("#preview-below").append(list[i]);
                    $(this).remove();
                    i++;
                });
                var data = {
                    discard: list,
                    to: to,
                    num: list.length
                };
                socket.emit("discard", data);
                $(".button-turn").addClass("hide-block");
            }
            break;
        //放弃
        case "abandon":
            $(".click-up").each(function () {
                $(this).removeClass("click-up");
            });
            socket.emit("abandon", to);
            $(".button-turn").addClass("hide-block");
            break;
        default:
            break;
    }
}