var mysql = require('mysql2');
var async = require('async');
var moment = require('moment');

exports.DBQuery = function (data, cb) {
    //连接数据库
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'house'
    });
    var date = new Date(new Date() - 1000 * 60 * 60 * 24).toLocaleDateString();
    date = moment(date).format('YYYY/MM/DD');
    var type = data.type;
    var sql = new Array(5);
    var title = ['各区域租房带看次数', '各户型均价对比', '各户型所占比例', '各城区当日均价','各城区租金走势'];
    sql[0] = 'select area as name, sum(look) as value from rent where date ="' + date + '" group by area';  //各城区带看次数
    sql[1] = 'select left(zone, 2) as name, avg(price) as value from rent where date ="' + date + '" group by name order by value desc'; //各户型均价对比
    sql[2] = 'select left(zone, 2) as name, count(id) as value from rent where date ="' + date + '" group by name'; //各户型比重对比
    sql[3] = 'select area as name, avg(price) as value from rent where date ="' + date + '" group by area;'; // 各城区当日均价
    sql[4] = 'select area, avg(price) as value, date_format(date, "%Y-%m-%d") as duration from rent group by area, duration;';    // 各城区租金走势

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
                entries = {
                    title: title[type],
                    data: result
                };
                break;
            case 4:
                var duration = [], priceData = [];
                var num = result.length / 8;    //天数
                var areaName = new Array(8);    //区域名称
                for(var i = 0, j = 0; i < areaName.length; i++, j+=num) {
                    areaName[i] = result[j].area;
                }
                for(var m = 0; m < result.length; m++) {
                    duration[m] = result[m].duration;
                    priceData[m] = Number(result[m].value).toFixed(2);
                }
                entries = {
                    title: title[type],
                    areaName: areaName,
                    duration: duration.slice(0, num)
                };
                entries.data = [];
                for(var k = 0; k < areaName.length; k++) {
                    entries.data[k] = priceData.slice(num * k, num * (k+1));
                }
                break;
        }
        connection.end();
        cb(true, entries);
    })
};
    
