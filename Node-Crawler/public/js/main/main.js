// 基于准备好的dom，初始化echarts实例
var chart_1 = echarts.init(document.getElementById('chart_1'), 'vintage');
var chart_2 = echarts.init(document.getElementById('chart_2'), 'vintage');
var chart_3 = echarts.init(document.getElementById('chart_3'), 'vintage');
var chart_4 = echarts.init(document.getElementById('chart_4'), 'vintage');
var chart_5 = echarts.init(document.getElementById('chart_5'), 'vintage');
/* type:
    0 => 各区域租房带看次数
    1 => 各户型均价对比
    2 => 各户型所占比例
    3 => 各城区均价
    4 => 带看次数与价格之间的关系
    5 => 各城区价格走势
    6 => 杭州租房价格走势
    7 => 带看次数走势
    8 => 价格占比
*/

//获取数据
function getHouseData(type) {
    var jsonData = JSON.stringify({
        "type": type
    });
    switch (type) {
        case 0:
            postData(urlGetData, jsonData, cbShowData0);
            break;
        case 1:
            postData(urlGetData, jsonData, cbShowData1);
            break;
        case 2:
            postData(urlGetData, jsonData, cbShowData2);
            break;
        case 3:
            postData(urlGetData, jsonData, cbShowData3);
            break;
        case 4:
            postData(urlGetData, jsonData, cbShowData4);
            break;
    }

}
function cbShowData1(result) {
    var name = [], value = [];
    for(var i = 0; i < result.data.length; i++) {
        name[i] = result.data[i].name;
        value[i] = Number(result.data[i].value).toFixed(2);
    }
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: result.title
        },
        tooltip: {},
        legend: {
            data:['均价元/月']
        },
        xAxis: {
            data: name
        },
        yAxis: {},
        series: [{
            name: '均价元/月',
            type: 'bar',
            data: value
        }]
    };
    chart_1.setOption(option);
}
function cbShowData2(result) {
    var name = [];
    for(var i = 0; i < result.data.length; i++) {
        name[i] = result.data[i].name;
    }
    var option = {
        title : {
            text: result.title,
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: name
        },
        series : [
            {
                name: '房源数',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data: result.data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    chart_2.setOption(option);
}
//各城区均价
function cbShowData3(result) {
    var name = [], value = [];
    for(var i = 0; i < result.data.length; i++) {
        name[i] = result.data[i].name;
        value[i] = Number(result.data[i].value).toFixed(2);
    }
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: result.title
        },
        tooltip: {},
        legend: {
            data:['均价元/月']
        },
        xAxis: {
            data: name
        },
        yAxis: {},
        series: [{
            name: '均价元/月',
            type: 'bar',
            data: value
        }]
    };
    chart_3.setOption(option);
}
function cbShowData0(result) {
    var name = [], value = [];
    for(var i = 0; i < result.data.length; i++) {
        name[i] = result.data[i].name;
        value[i] = Number(result.data[i].value);
    }
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: result.title
        },
        tooltip: {},
        legend: {
            data:['带看次数/次']
        },
        xAxis: {
            data: name
        },
        yAxis: {},
        series: [{
            name: '带看次数/次',
            type: 'bar',
            data: value
        }]
    };
    chart_4.setOption(option);
}
function cbShowData4(result) {
    var series = [];
    for(var i = 0; i < result.areaName.length; i++) {
        var arr = {
            name: result.areaName[i],
            type:'line',
            data: result.data[i]
        };
        series.push(arr);
    }
    var option = {
        title: {
            text: result.title
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: result.areaName
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: result.duration
        },
        yAxis: {
            type: 'value'
        },
        series: series
    };
    chart_5.setOption(option);
}

getHouseData(1);
getHouseData(2);
getHouseData(3);
getHouseData(0);
getHouseData(4);