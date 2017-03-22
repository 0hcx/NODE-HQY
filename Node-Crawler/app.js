var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 爬虫-我爱我家租房信息
var mysql = require('mysql2');
var cheerio = require('cheerio');
var fs = require('fs');
var request = require('superagent');
var async = require('async');
var schedule = require('node-schedule');

//连接数据库
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'house'
});
var pages = 167;
var data = [];

//async按顺序执行
function saveToDB() {
  async.waterfall([
    getLinkArr,
    start
  ], function (err, result) {
    if(err) {
      console.log('error: ' + err);
    } else {
      connection.end();
      console.log('任务完成！！！');
      console.log('总共插入' + data.length + '条记录...');
    }
  });
}
//生成爬取页面的链接
function getLinkArr(cb) {
  var links = [];
  for(var i = 0; i < pages; i++) {
    var url = 'http://hz.5i5j.com/rent/n' + (i + 1);  //杭州房源网页地址
    links.push(url);
  }
  cb(null, links);
}
//开始处理请求得到的html
function start(links, cb) {
  async.eachLimit(links, 5, function(item, callback) {  // 限制允许并发执行的任务数为5，防止访问过快
    setTimeout(function () {                            // 设置每批任务之间休息1s，防止访问过快
      request.get(item).end(function (err, res) {       // get请求页面
        try{
          if(res.ok) {
            console.log(item + ' is processing...');
            getRoom(res.text);
            callback();
          } else {
            console.log(item + ' failed...');
            callback();
          }
        } catch (e) {
          console.log(e.stack);
          callback();
        }
      })
    }, 1000)
  }, function(err) {
    if(err) {
      console.log('A file failed to process');
    } else {
      console.log('All files have been processed successfully');
      cb(null, data);
    }
  });
}
//写入数据
function writeFile(data, cb) {
  console.log('最终爬取到：' + data.length + ' 条数据');
  console.log("开始写入数据...");
  fs.writeFile(path, JSON.stringify(data), function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("数据写入成功！");
  });
  cb(null, 'Job Is Done !');
}
//获取房屋基本信息
function getRoom(html) {
  var $ = cheerio.load(html);
  var room = $('.list-info').toArray();
  var len = room.length;
  console.log('room is：' + len);
  for(var i = 0; i < len; i++) {
    var arr = {};
    var date = new Date();
    var info = $(room[i]).find('.list-info-l li.font-balck').text().split(' ');

    arr.title = $(room[i]).find('h2').text().replace(/\s+/g, '');  // 租房标题
    arr.community = $(room[i]).find('.rent-font').text().replace(/\s+/g, ''); // 小区
    arr.area = $(room[i]).find('.list-info-l li').eq(0).find('a').eq(1).text().replace(/\s+/g, ''); // 城区
    arr.bizcircle = $(room[i]).find('.list-info-l li').eq(0).find('a').eq(2).text().replace(/\s+/g, '').replace(/租房/g, ''); // 商圈
    arr.zone = info[0];  // 户型
    arr.metres = info[1].replace(/[^0-9]/ig, ''); // 建筑面积/平
    arr.orientation = info[2]; // 朝向
    arr.floor = info[3]; // 楼层
    arr.price = $(room[i]).find('.list-info-r h3').text().replace(/[^0-9]/ig, ''); // 租金/月
    arr.look = $(room[i]).find('.list-info-l li').eq(2).text().replace(/[^0-9]/ig, ''); // 带看次数/次
    arr.date = date.toLocaleDateString(); // 日期

    var item = '{"title":"' + arr.title + '","community":"' + arr.community + '","area":"' + arr.area + '","bizcircle":"' + arr.bizcircle + '","zone":"' + arr.zone + '","metres":"' + arr.metres + '","orientation":"' + arr.orientation + '","floor":"' + arr.floor + '","price":"' + arr.price + '","look":"' + arr.look + '","date":"' + arr.date + '"}';  // 将数据组装成json格式的字符串
    var str = JSON.stringify(data);
    var sql = 'insert into rent values (null,' + '"' + arr.title + '",' + '"' + arr.community + '",' + '"' + arr.area + '",' + '"' + arr.bizcircle + '",' + '"' + arr.zone + '",' + arr.metres + ',"' + arr.orientation + '",' + '"' + arr.floor + '",' + arr.price + ',' + arr.look + ',"' + arr.date + '")';
    if(str.indexOf(item) == -1) {     //查重
      console.log(sql);
      try {
        data.push(JSON.parse(item));  // 将json格式的字符串push进data数组
        // 插入数据库
        connection.query(sql, function (err, results, fields) {
            if(err){
              console.log("error!");
            }
        });
      } catch(e) {
        console.log(e.stack);
      }
    }
  }
}

function DBQuery() {
  var date = (new Date()).toLocaleDateString();
  var sqlLook = 'select area,sum(look) from rent where date ="' + date + '" group by area';
  var sqlZone = 'select zone,count(id) as total from rent where date ="' + date + '" group by zone order by total desc;'
  connection.query(sqlLook, function(err, result) {
    if(err) {
      console.log(err);
    }
    console.log(result)
  })
}

//每天的10:00爬取内容
function scheduleControl() {
  schedule.scheduleJob('0 44 22 * * *', function() {
    console.log('时间：' + new Date() + ' 开始爬虫...');
    saveToDB();
  });
}

scheduleControl();


module.exports = app;