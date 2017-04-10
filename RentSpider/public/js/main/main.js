var date = new Date(new Date() - 1000 * 60 * 60 * 24).toLocaleDateString();
var subtext = '数据截止 ' + date + '  来源: 我爱我家';
Highcharts.setOptions({
    lang: {
        printChart:"打印图表",
        downloadJPEG: "下载JPEG 图片" ,
        downloadPDF: "下载PDF文档"  ,
        downloadPNG: "下载PNG 图片"  ,
        downloadSVG: "下载SVG 矢量图" ,
        exportButtonTitle: "导出图片"
    }
});
var communityTags = []; // 小区大全
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

init();

function init() {
    //初始化各图表
    for(let i = 0; i < 7; i++) {
        getHouseData(i);
    }
    getHouseData(8);

    //查询各小区租金走势
    $('body').on('click', '#searchBtn', getSearchResult);
}

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
        case 5:
            postData(urlGetData, jsonData, cbShowData5);
            break;
        case 6:
            postData(urlGetData, jsonData, cbShowData6);
            break;
        case 8:
            postData(urlGetData, jsonData, cbCommunityData);
    }

}
// 各区域带看次数对比
function cbShowData0(result) {
    $('#chart_0').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: result.title
        },
        subtitle: {
            text: subtext
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '带看次数 (/次)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '带看次数: <b>{point.y:.1f} 次</b>'
        },
        series: [{
            name: '带看次数',
            data: result.data,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}',
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
}
// 各户型均价对比
function cbShowData1(result) {
    $('#chart_1').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: result.title
        },
        subtitle: {
            text: subtext
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '租金 (元/月)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '平均租金: <b>{point.y:.1f} 元/月</b>'
        },
        series: [{
            name: '平均租金',
            data: result.data,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}',
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
}
// 各户型所占比例
function cbShowData2(result) {
    $('#chart_2').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: result.title
        },
        tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: result.title,
            data: result.data
        }]
    });
}
// 各城区当日均价
function cbShowData3(result) {
    $('#chart_3').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: result.title
        },
        subtitle: {
            text: subtext
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '租金 (元/月)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '平均租金: <b>{point.y:.1f} 元/月</b>'
        },
        series: [{
            name: '平均租金',
            data: result.data,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}',
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
}
function cbShowData4(result) {
    var series = [];
    for(var i = 0; i < result.areaName.length; i++) {
        var arr = {
            name: result.areaName[i],
            data: result.data[i]
        };
        series.push(arr);
    }
    $('#chart_4').highcharts({
        title: {
            text: result.title,
            x: -20
        },
        subtitle: {
            text: subtext,
            x: -20
        },
        xAxis: {
            categories: result.duration
        },
        yAxis: {
            title: {
                text: '租金 (元/月)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '元/月'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: series
    });
}

function cbShowData5(result) {
    $('#chart_5').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: result.title
        },
        subtitle: {
            text: subtext
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '租金 (元/月)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '平均租金: <b>{point.y:.1f} 元/月</b>'
        },
        series: [{
            name: '平均租金',
            data: result.data,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}',
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
}
function cbShowData6(result) {
    $('#chart_6').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: result.title
        },
        xAxis: {
            categories: result.areas
        },
        yAxis: {
            min: 0,
            title: {
                text: '地区户型总量'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    '总量: ' + this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: result.series
    });
}

// 获取全部小区名数据
function cbCommunityData(result) {
    communityTags = result.comminuty;
    $( "#keyword" ).autocomplete({
        source: communityTags
    });
    console.log(communityTags)
}

// 获取查询结果
function getSearchResult() {
    var community = $('#keyword').val();
    var type = 7;
    if(community) {
        var jsonData = JSON.stringify({
            "type": type,
            "community": community
        });
        postData(urlGetData, jsonData, cbSearchResult);
    } else {
        alert("查询参数为空!")
    }
}
function cbSearchResult(result) {
    $('#searchChart').highcharts({
        title: {
            text: result.title,
            x: -20
        },
        subtitle: {
            text: subtext,
            x: -20
        },
        xAxis: {
            categories: result.duration
        },
        yAxis: {
            title: {
                text: '租金 (元/月)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '元/月'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: result.comminuty,
            data: result.data
        }]
    });
}