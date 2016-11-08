var socket = io();  //传递给服务器用户Id
var to; //对方id
var wrapper = ".wrapper";
var htmlLogin = "<div class='login'><button type='button' id='login'>登录</button> </div>";
var htmlWait = "<div class='waiting'> <h3>请等待另一位玩家加入。。。</h3> </div>";
var htmlPoker = "<div class='wrap'> <div class='box-upper'></div> <div class='box-center'> <div class='preview-above' id='preview-above'></div> <div class='preview-below' id='preview-below'></div> </div> <div class='button-turn hide-block'> <button class='discard' id='discard'>出牌</button> <button class='abandon' id='abandon'>放弃</button> </div> <div class='box-below' id='box-below'></div></div>";
var before = false;

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
            before = true;
            $(".button-turn").removeClass("hide-block");
            $("#abandon").attr('disabled',"true");
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
        before = true;
        $("#abandon").attr('disabled',"true");
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
                var list = new Array();         //list中保存选中牌的整个div代码
                var aboveList =  new Array();   //aboveList 对方的牌
                var belowList = new Array();    //belowList 我选中的牌
                var i = 0;
                var j = 0;
                var k = 0;
                // $("#preview-above").html("");
                // $("#preview-below").html("");
                $("#preview-above").find(".poker").each(function () {
                    var pokerId = $(this).attr("id");
                    pokerId = pokerId.replace(/[p]([0-9]+)/g, "$1"); //获取选中的牌的id(删掉首字母p)
                    aboveList[j] = getPokerFace(pokerId);
                    j++;
                });
                $("#box-below").find(".click-up").each(function () {
                    var pokerId = $(this).attr("id");
                    pokerId = pokerId.replace(/[p]([0-9]+)/g, "$1"); //获取选中的牌的id(删掉首字母p)
                    belowList[k] = getPokerFace(pokerId);
                    k++;
                });
                //先对选中的牌进行比较
                if(compare(aboveList, belowList) || (before && checkPokerType(belowList) != 0)) {
                    $("#preview-above").html("");
                    $("#preview-below").html("");
                    $(".click-up").each(function () {
                        list[i] = $(this).prop("outerHTML");    //获取选中的牌的整个div代码
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
                    before = false;
                    $("#abandon").removeAttr("disabled");
                    socket.emit("discard", data);
                    $(".button-turn").addClass("hide-block");
                } else {
                    alert("出牌不符合规则！");
                }
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

//检查和确定出牌的类型
function checkPokerType(pokerList) {
    var length = (pokerList.length > 4) ? 5 : pokerList.length; //长度大于4则为顺子
    var type = 0;

    switch (length) {
        //一张单
        case 1:
            type = 1;
            break;
        //对
        case 2:
            if(pokerList[0] == pokerList[1]) {
                type = 2;
            } else if(pokerList[0] == 54 && pokerList[1] == 53) {   //大小王天王炸无敌
                type = 999;
            } else {
                type = 0;
            }
            break;
        //三张
        case 3:
            if(pokerList[0] == pokerList[1] && pokerList[1] == pokerList[2]) {
                type = 3;
            } else {
                type = 0;
            }
            break;
        //四张炸弹或者2张姐妹对连接2次
        case 4:
            if(pokerList[0] == pokerList[1] && pokerList[1] == pokerList[2] && pokerList[2] == pokerList[3]) {
                type = 4;
            } else if((pokerList[0] == pokerList[1]) && (pokerList[0] == pokerList[2] + 1) && pokerList[2] == pokerList[3]) {
                type = 44;
            } else {
                type = 0;
            }
            break;
        //五张及以上表示顺子或连对(2或3)
        case 5:
            if(pokerList.length % 2 == 0) {     //数组长度大于4且为偶数，表示连续的2张或3张
                var twoSeries = true;
                var threeSeries = true;
                //连续两张的情况
                for(var j = 0; j < pokerList.length; j+=2) {
                    //连续2张必须是a[i]==a[i+1]
                    if(pokerList[j] != pokerList[j+1]) {
                        twoSeries = false;
                        break;
                    }
                    //连续2张必须是a[i]==a[i+2]+1
                    if((j < pokerList.length - 2) && (pokerList[j] != pokerList[j+2] + 1)) {
                        twoSeries = false;
                        break;
                    }
                }
                //连续三张的情况
                if(!twoSeries) {
                    for(var k = 0; k < pokerList.length; k+=3) {
                        //连续3张必须是a[i]==a[i+1]==a[i+2]
                        if(pokerList[k] != pokerList[k+1] || pokerList[k+1] != pokerList[k+2]) {
                            threeSeries = false;
                            break;
                        }
                        //连续3张必须是a[i]==a[i+3]+1
                        if((k < pokerList.length - 3) && (pokerList[k] != pokerList[k+3] + 1)) {
                            threeSeries = false;
                            break;
                        }
                    }
                }
                if(twoSeries) {
                    type = 99;
                } else if(threeSeries) {
                    type = 999;
                } else {
                    type = 0;
                }

            } else {    //数组长度不是偶数则表示牌列顺子
                var series = true;
                for(var i = 1; i < pokerList.length; i++) {
                    if(pokerList[i] != pokerList[i - 1] - 1) {
                        series = false;
                        break;
                    }
                }
                if(series) {
                    type = pokerList.length;
                } else {
                    type = 0;
                }
            }
            break;

        default:
            type = 0;
            break;
    }
    //返回牌的类型
    return type;
}

//将选择出的牌和对方出的牌进行比较
function compare(list1, list2) {
    var check = false;
    var type1 = checkPokerType(list1); //对方的牌类型
    var type2 = checkPokerType(list2);  //我的牌类型

    //1.类型相同的情况下再比较数组第一个元素大小;
    //2.4表示炸，对方不是炸，我出炸则check为true
    //3.天王炸
    if((type1 == type2 && list2[0] > list1[0]) || (type1 != 4 && type2 == 4) || (type2 == 999)) {
        check = true;
    }

    //check为true可出牌，否则不能出牌
    return check;
}
//返回每张牌的面值
function getPokerFace(n) {
    var temp = n % 13;
    var result;
    if(n == 53) {
        result = 17;
    } else if(n == 54) {
        result = 16;
    }
    if(temp >= 3 && temp <= 12) {
        result = temp;
    } else if(temp == 0) {
        result = 13;
    } else if(temp == 1) {
        result = 14;
    } else if(temp == 2) {
        result = 15;
    }
    return result;
}