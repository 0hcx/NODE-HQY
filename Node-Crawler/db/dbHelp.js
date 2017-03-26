var mysql = require('mysql2');
var async = require('async');
var moment = require('moment');

exports.DBQuery = function (data, cb) {
    //连接数据库
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '19960124',
        database: 'house'
    });
    var date = new Date(new Date() - 1000 * 60 * 60 * 24).toLocaleDateString();
    date = moment(date).format('YYYY/MM/DD');
    var type = data.type;
    var sql = new Array(10);
    var title = ['各区域租房带看次数', '各户型均价对比', '各户型所占比例', '各城区当日均价','各城区租金走势', '带看量前20的小区租金', '各区域户型比例'];
    var areas = ['上城', '下城', '余杭', '拱墅', '江干', '滨江', '萧山', '西湖'];
    var zones = ['1室', '2室', '3室', '4室', '5室'];

    sql[0] = 'select area as name, sum(look) as y from rent where date ="' + date + '" group by area';  //各城区带看次数
    sql[1] = 'select left(zone, 2) as name, round(avg(price), 1) as y from rent where date ="' + date + '" group by name order by y desc'; //各户型均价对比
    sql[2] = 'select left(zone, 2) as name, count(id) as y from rent where date ="' + date + '" group by name'; //各户型比重对比
    sql[3] = 'select area as name, avg(price) as y from rent where date ="' + date + '" group by area;'; // 各城区当日均价
    sql[4] = 'select area as name, round(avg(price), 1) as y, date_format(date, "%Y-%m-%d") as duration from rent group by name, duration;';    // 各城区租金走势
    sql[5] = 'select community as name, round(avg(price), 1) as y from rent where date ="' + date + '" group by community order by sum(look) desc limit 20'; // 带看量前20的小区租金
    sql[6] = 'select left(zone, 2) as name, area ,count(*) as total from rent where date="' + date + '" group by name, area';  // 各区域户型比例

    connection.query(sql[type], function(err, result) {
        var entries = [];
        if(err) {
            console.log(err);
        }
        switch (type) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 5:
                for(let item of result) {
                    item.y = Number(item.y);
                }
                entries = {
                    title: title[type],
                    data: result
                };
                break;
            case 4:
                let duration = [], priceData = [];
                let num = result.length / 8;    //天数
                let areaName = new Array(8);    //区域名称
                for(let i = 0, j = 0; i < areaName.length; i++, j+=num) {
                    areaName[i] = result[j].name;
                }
                for(let m = 0; m < result.length; m++) {
                    duration[m] = result[m].duration;
                    priceData[m] = Number(result[m].y);
                }
                entries = {
                    title: title[type],
                    areaName: areaName,
                    duration: duration.slice(0, num)
                };
                entries.data = [];
                for(let k = 0; k < areaName.length; k++) {  // 地区
                    entries.data[k] = priceData.slice(num * k, num * (k+1));
                }
                break;
            case 6:
                let series = [], index = 0, nextZone = true; // index => result数组下标, nextZone = true 表示改变了户型
                for(let i = 0; i < zones.length; i++) {
                    let arr = new Array(areas.length).fill(0);  // 初始化每个户型的值为0
                    let item = {
                        name: zones[i],
                        data: arr
                    };
                    series.push(item);
                }
                for(let i = 0; i < zones.length; i++) {
                    for(let j = index; j < result.length; j++) {
                        if(nextZone === true || (nextZone === false && result[j].name === result[j-1].name)) {
                            nextZone = false;
                            series[i].data[areas.indexOf(result[j].area)] = result[j].total;
                        } else {
                            index = j;
                            nextZone = true;
                            break;
                        }
                    }
                }
                console.log(series)
                entries = {
                    title: title[type],
                    areas: areas,
                    series: series
                };
                break;
        }
        connection.end();
        cb(true, entries);
    })
};
    
