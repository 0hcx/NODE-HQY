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


// node-mysql测试

// var mysql = require('mysql2/promise');
//
// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database:'student'
// });
//
// var sql1 = 'insert into security values ("222",222)';
//
// connection.query(sql1, function (err, results, fields) {
//   if(err){
//     console.log("error!");
//   } else {
//     console.log(results);
//   }
// });
//
// connection.end();


// Nodejs Buffer测试
// 爬取赶集网租房信息
var cheerio = require('cheerio');
var fs = require('fs');
//var mkdirp = require('mkdirp');
var request = require('superagent');
var async = require('async');

var path = './public/data/杭州全部房源.txt';
var pages = 1000;
var data = [];

//async按顺序执行
async.waterfall([
  getLinkArr,
  start,
  writeFile
], function (err, result) {
  if(err) {
    console.log('error: ' + err);
  } else {
    console.log('任务完成！！！');
  }
});
//生成爬取页面的链接
function getLinkArr(cb) {
  var links = [];
  for(var i = 0; i < pages; i++) {
    var url = 'http://hz.ganji.com/fang1/o' + (i + 1) + '/';  //杭州房源网页地址
    //var url = 'http://sh.ganji.com/fang1/o' + (i + 1) + '/';  //上海房源网页地址
    links.push(url);
  }
  readFile();
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
  var room = $('.f-list-item').toArray();
  var len = room.length;
  console.log('room is：' + len);
  for(var i = 0; i < len; i++) {
    var arr = {};
    arr.title = $(room[i]).find('.dd-item.title a').attr('title');  // 房屋标题
    arr.address = $(room[i]).find('.area').text().replace(/\s+/g, ''); // 地址
    arr.price = $(room[i]).find('.price').text(); // 价格/月
    arr.size = $(room[i]).find('.dd-item.size').text().replace(/\s+/g, ''); // 房屋大小等简介
    var item = '{"title":"' + arr.title + '","address":"' + arr.address + '","price":"' + arr.price + '","size":"' + arr.size +'"}';  // 将数据组装成json格式的字符串
    if(findItem(data, arr) == -1) {
      try {
        data.push(JSON.parse(formatString(item)));  // 将json格式的字符串push进data数组
      } catch(err) {
        console.log('JSON error!');
      }
    }
  }
}
//去重
function findItem(data, item) {
  for(var i = 0; i < data.length; i++) {
    if(item.title === data[i].title && item.address === data[i].address && item.price === data[i].price && item.size === data[i].size) {
      return i;
    }
  }
  return -1;
}
//读取保存的文本数据
function readFile() {
  var fileData = '';
  var readStream = fs.createReadStream(path);

  readStream.setEncoding('UTF8');
  readStream.on('data', function (chunk) {
    fileData += chunk;
  });
  readStream.on('end', function () {
    data = JSON.parse(formatString(fileData));
    console.log(data)
  });
  readStream.on('error', function (err) {
    console.log(err.stack);
  })
}
//解析json前去掉BOM报头（UTF-8签名）
function formatString(str) {
  if (str != null) {
    str = str.replace("\ufeff", "").replace(/\\/g, "/");
  }
  return str;
}
// function saveRoomImg(data) {
//   var $ = cheerio.load(data.toString());
//   var roomImg = $('.f-list-item img').toArray();
//   var len = roomImg.length;
//   console.log('共有图片张数：' + len);
//   for(var i = 0; i < len; i++) {
//     var imgsrc = $(roomImg[i]).data('original');
//     if(imgsrc == undefined) {
//       imgsrc = roomImg[i].attribs.src;
//     }
//     var imgName = roomImg[i].attribs.title + '.jpg';  //生成文件名
//     console.log(i);
//     downloadImg(imgsrc, imgName, function() {
//       console.log(imgName + ' done!');
//     });
//   }
// }

// function parseUrlForFileName(address) {
//   var filename = path.basename(address);
//   return filename;
// }
// 下载图片
// var downloadImg = function(uri, filename, callback){
//   request.head(uri, function(err, res, body){
//     if (err) {
//       console.log('err: '+ err);
//     }
//     console.log('下载中...');
//     request(uri).pipe(fs.createWriteStream('./public/data/img/' + filename)).on('close', callback);  //调用request的管道来下载到 images文件夹下
//   });
// };

module.exports = app;