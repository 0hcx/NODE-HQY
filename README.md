# 学习日志【2016/7/14】

### 1.moment.js（js date）日期格式化中文api
  moment.js（js date）日期格式化处理插件强大，moment.js中文api，当前日期格式化、当前日期向前或者向后推的日期格式化、指定日期格式化调用演示  
```
当前日期格式化
moment().format('MMMM Do YYYY, h:mm:ss a'); -> 四月 6日 2015, 3:55:57 下午
moment().format('dddd'); -> 星期一
moment().format("MMM Do YY"); -> 4月 6日 15
moment().format('YYYY [escaped] YYYY'); -> 2015 escaped 2015
moment().format(); -> 2015-04-06T15:55:57+08:00
---------------------------------------------------
moment().format('YYYY-MM-DD'); -> 2015-04-06
moment().format('YYYY-MM-DD h:mm:ss a'); -> 2015-04-06 03:55:57 下午

指定日期格式化
moment("20111031", "YYYYMMDD").fromNow(); -> 3年前
moment("20120620", "YYYYMMDD").fromNow(); -> 3年前
moment().startOf('day').fromNow(); -> 16小时前
moment().endOf('day').fromNow(); -> 8小时内
moment().startOf('hour').fromNow(); -> 1小时前

当前日期向前或者向后推的日期格式化
moment().subtract(10, 'days').calendar(); -> 2015年3月27日
moment().subtract(6, 'days').calendar(); -> 上周二下午3点55
moment().subtract(3, 'days').calendar(); -> 上周五下午3点55
moment().subtract(1, 'days').calendar(); -> 昨天下午3点55
moment().calendar(); -> 今天下午3点55
moment().add(1, 'days').calendar(); -> 明天下午3点55
moment().add(3, 'days').calendar(); -> 本周四下午3点55
moment().add(10, 'days').calendar(); -> 2015年4月16日

也可以使用下面方式日期格式化
moment().format('L'); -> 2015-04-06
moment().format('l'); -> 2015-04-06
moment().format('LL'); -> 2015年4月6日
moment().format('ll'); -> 2015年4月6日
moment().format('LLL'); -> 2015年4月6日下午3点55
moment().format('lll'); -> 2015年4月6日下午3点55
moment().format('LLLL'); -> 2015年4月6日星期一下午3点55
moment().format('llll'); -> 2015年4月6日星期一下午3点55
```
### 2.上传图片
  前端js代码  
```
$(init);

function init() {
    var socket = io();

    socket.on('uploadProgress' , function(percent){
        console.log(percent);
        $(".pg-bar").progressbar( "option", "value", parseInt(percent));
        $(".pg-info").text( percent + '%');
    });
    // $("#defaultForm").validate({
    //  wrapper:"span",
    //  onfocusout:false,
    //  submitHandler:function(form) {
    //      doAddNews();  //验证成功则调用添加新闻函数
    //  }
    // })

    // $(".pg-bar").progressbar({value: 0});
    //
    // $(".pg-bar").progressbar( "option", "max", 100 );
    $("body").on('click', '#addNewsBtn', doAddNews);
    $("body").on('click', '#UploadBtn', doUpload);
    $("body").on('change', '#uploadFile', preUpload);
}

function preUpload() {
    $("#UploadBtn").removeClass('disabled');
}

function doUpload() {
    
    $(".pg-wrapper").show();
    
    var file = $("#uploadFile")[0].files[0];
    var form = new FormData();
    form.append("file", file);
    
    $.ajax({
        url: "/admin/uploadImg",
        type: "POST",
        data: form,
        async: true,
        processData: false,
        contentType: false,
        success: function(result) {
            startReq = false;
            if (result.code == 0) {
                
                var picUrl = $.format("![Alt text]({0})",result.data)
                $("#newsContent").insertAtCaret(picUrl);
                $(".pg-wrapper").hide();
                // console.log(result.data);
            }
        }
    });
}
```
  后端Nodejs代码  
```
var formidable = require('formidable');

//上传图片
router.post('/uploadImg', function(req, res, next) {
console.log("开始上传");
    var io = global.io;

    var form = new formidable.IncomingForm();
    var path = "";
    var fields = [];

    form.encoding = 'utf-8';                    //上传文件编码格式
    form.uploadDir = "public/uploadFile";     //上传文件保存路径（必须在public下新建）
    form.keepExtensions = true;                 //保持上传文件后缀
    form.maxFieldsSize = 30000 * 1024 * 1024;   //上传文件格式最大值


    var uploadprogress = 0;
    console.log("start:upload----"+uploadprogress);

    form.parse(req);

    form.on('field', function(field, value) {
        console.log(field + ":" + value);       //上传的参数数据
    })
        .on('file', function(field, file) {
            path = '\\' + file.path;            //上传的文件数据
        })
        .on('progress', function(bytesReceived, bytesExpected) {

            uploadprogress = (bytesReceived / bytesExpected * 100).toFixed(0);  //计算进度
            console.log("upload----"+ uploadprogress);
            io.sockets.in('sessionId').emit('uploadProgress', uploadprogress);
        })
        .on('end', function() {
            //上传完发送成功的json数据
            console.log('-> upload done\n');
            entries.code = 0;
            entries.data = path;
            res.writeHead(200, {
                'content-type': 'text/json'
            });
            res.end(JSON.stringify(entries));
        })
        .on("err",function(err){
            var callback="<script>alert('"+err+"');</script>";
            res.end(callback);//这段文本发回前端就会被同名的函数执行
        }).on("abort",function(){
        var callback="<script>alert('"+ttt+"');</script>";
        res.end(callback);
    });

});

module.exports = router;
```
### 3.HTML< input > 标签的 type 属性
`file   定义输入字段和 "浏览"按钮，供文件上传。`
### 4.Node.js的Formidable模块的使用

今天总结了下Node.js的Formidable模块的使用，下面做一些简要的说明。

1) `var form = new formidable.IncomingForm()`创建Formidable.IncomingForm对象

2)` form.encoding = 'utf-8' `设置表单域的编码

3)`form.uploadDir = "/my/dir"; `设置上传文件存放的文件夹，默认为系统的临时文件夹，可以使用fs.rename()来改变上传文件的存放位置和文件名

4)` form.keepExtensions = false; `设置该属性为true可以使得上传的文件保持原来的文件的扩展名。

5)`form.type `只读，根据请求的类型，取值'multipart' or 'urlencoded'

6)`form.maxFieldsSize = 2 * 1024 * 1024; `限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，默认为2M

7)`form.maxFields = 1000 `设置可以转换多少查询字符串，默认为1000

8)`form.hash = false; `设置上传文件的检验码，可以有两个取值'sha1' or 'md5'.

9)`form.multiples = false; `开启该功能，当调用form.parse()方法时，回调函数的files参数将会是一个file数组，数组每一个成员是一个File对象，此功能需要 html5中multiple特性支持。

10)`form.bytesReceived `返回服务器已经接收到当前表单数据多少字节

11`form.bytesExpected `返回将要接收到当前表单所有数据的大小

12)`form.parse(request, [callback])` 该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息，如：
```
　　  form.parse(req, function(err, fields, files) {
 　　　　 // ...   
　　  });
```
13)`form.onPart(part); `你可以重载处理multipart流的方法，这样做的话会禁止field和file事件的发生，你将不得不自己处理这些事情，如：
```
　　   form.onPart = function(part) {
  　　 　　part.addListener('data', function() {
    　　           // ...
  　　　　 });
　　　}
```
　　  如果你只想让formdable处理一部分事情，你可以这样做:
```
　　  form.onPart = function(part) {
  　　　　if (!part.filename) {
    　　　　   // 让formidable处理所有非文件部分
   　　    　　form.handlePart(part);
　　 　　 }
　　 }
```
14)`formidable.File`对象

　　A.     ` file.size = 0 `上传文件的大小，如果文件正在上传，表示已上传部分的大小

　　B.      `file.path = null` 上传文件的路径。如果不想让formidable产生一个临时文件夹，可以在fileBegain事件中修改路径

　　C.     ` file.name = null` 上传文件的名字

　　D.     `file.type = null `上传文件的mime类型

　　E.      `file.lastModifiedDate = null `时间对象，上传文件最近一次被修改的时间

　　F.     ` file.hash = null` 返回文件的hash值

　　G.     可以使用`JSON.stringify(file.toJSON())`来格式化输出文件的信息

15)`form.on('progress', function(bytesReceived, bytesExpected) {}); `当有数据块被处理之后会触发该事件，对于创建进度条非常有用。

16)`form.on('field', function(name, value) {});` 每当一个字段/值对已经收到时会触发该事件

17)`form.on('fileBegin', function(name, file) {}); ` 在post流中检测到任意一个新的文件便会触发该事件

18)`form.on('file', function(name, file) {}); `每当有一对字段/文件已经接收到，便会触发该事件

19)`form.on('error', function(err) {}); `当上传流中出现错误便会触发该事件，当出现错误时，若想要继续触发request的data事件，则必须手动调用`request.resume()`方法

20)`form.on('aborted', function() {}); `当用户中止请求时会触发该事件，`socket`中的`timeout`和`close`事件也会触发该事件，当该事件触发之后，error事件也会触发

21)`form.on('end', function() {}); `当所有的请求已经接收到，并且所有的文件都已上传到服务器中，该事件会触发。此时可以发送请求到客户端。

# 学习日志【2016/7/13】

### 1.导出PDF

####  1.1.安装plantomjs  
```
npm install phantomjs -g
```
####  1.2.关键代码  
```
router.get('/:id', function (req, res, next) {
    console.log('进入pdf');
    var id = req.params.id;
    //获得导出PDF的文章页面地址
    var host = req.protocol + '://' + req.get('host') + '/pdf/blogPdf/' + id;
    //设置pdf文件名及属性
    var pdffile = config.site.path + '\\news-' + Date.now() + '.pdf';
    
    NodePDF.render(host, pdffile, function(err, filePath){
        if (err) {
            console.log(err);
        }else{
            //以异步的方式读取文件内容
            fs.readFile(pdffile , function (err,data){
                console.log("开始");
                console.log(data);
                //在网页上以pdf的格式打开文件
                res.contentType("application/pdf");
                res.send(data);

            });
        }
    });
})

router.get('/blogPdf/:id', function(req, res, next) {
    
    var id = req.params.id;
    console.log("开始查找 ");
    //查找并以blogPdf渲染页面
    dbHelper.findNewsOne(req, id, function (success, data) {
        res.render('blogPdf',{
            entries: data,
        });
    })
});
```
### 2.HTML DOM protocol 属性
  protocol 属性是一个可读可写的字符串，可设置或返回当前 URL 的协议。  
  假设当前的 URL 是: `http://example.com:1234/test.htm#part2：`，则.protocol为`http`
  
### 3.node.js中的fs.readFile方法使用说明
#### 3.1 方法说明  
  以异步的方式读取文件内容。  
  不置顶内容编码的情况下，将以buffer的格式输出，如：`<Buffer 32 33 31 32 33 31 32 33 31 32 33>`
#### 3.2 语法
    fs.readFile(filename, [encoding], [callback(err,data)])
  由于该方法属于fs模块，使用前需要引入fs模块（var fs= require(“fs”) ）
#### 3.3 接受参数
  filename    文件路径  
  options      option对象，包含 encoding，编码格式，该项是可选的。  
  callback      回调，传递2个参数 异常err 和 文件内容 data  
#### 3.4 例子
```
var fs = require('fs'); 
fs.readFile('content.txt','utf-8', function(err,data){ 
 if(err){ 
  console.log(err); 
 }else{ 
  console.log(data); 
 } 
})
```
### 4. 向Web客户端发送PDF文档(MIME类型 )
  Web 浏览器使用 MIME 类型来识别非 HTML 文档，并决定如何显示该文档内的数据。将插件 (plug-in) 与 MIME 类型结合使用，则当 Web 浏览器下载 MIME 类型指示的文档时，就能够启动相应插件处理此文档。某些 MIME 类型还可以与外部程序结合使用，浏览器下载文档后会启动相应的外部程序。   

  PDF 文件的 MIME 类型是 "application/pdf"。要用servlet 来打开一个 PDF 文档，需要将 response 对象中 header 的 content 类型设置成 "application/pdf":   
```
// PDF 文件的 MIME 类型
res.setContentType( "application/pdf" ); 
//也可以通过下面的方式来设置
response.setHeader("Content-type", "application/pdf");
```

# 学习日志【2016/7/12】

### 查询结果分页操作
#### 后端
```
exports.findNews = function(req, cb) {
    // News.find({author:'577374a73e5758541ed9beaa'})
    //  .populate('author')
    //  .exec(function(err, docs) {
    //
    //      var newsList=new Array();
    //      for(var i=0;i<docs.length;i++) {
    //          newsList.push(docs[i].toObject());
    //
    //      }
    //      // console.log(newsList);
    //      cb(true,newsList);
    //  });
    var page = req.query.page || 1 ;
    this.pageQuery(page, PAGE_SIZE, News, 'author', {}, {
        created_time: 'desc'
    }, function(error, data){
        if(error){
            next(error);
        }else{
            cb(true,data);
        }
    });
};


exports.pageQuery = function (page, pageSize, Model, populate, queryParams, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var $page = {
        pageNumber: page
    };
    async.parallel({
        count: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) {   // 查询一页的记录
            Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, results) {
        
        var newsList=new Array();
        for(var i=0;i<results.records.length;i++) {
            newsList.push(results.records[i].toObject());
        }
        
        var count = results.count;
        $page.pageCount = parseInt((count - 1) / pageSize + 1);
        $page.results = newsList;
        $page.count = count;
        callback(err, $page);
    });
};
```
#### 路由
```
router.get('/blogs', function(req, res, next) {
    dbHelper.findNews(req, function (success, data) {
        res.render('blogs', {
            entries: data.results,
            pageCount: data.pageCount,
            pageNumber: data.pageNumber,
            count: data.count
        });
    })
});
```
#### 前台
```
<div class="box-footer">
    <nav>
        <ul class="pagination">
            <li>
                <a href="{{#le pageNumber 1}}?{{else}}?page={{reduce pageNumber 1}}{{/le}}"
                           aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            {{#times pageCount 1 pageCount}}
            <li {{#equals pageNumber this.step}}class="active" {{/equals}}>
                <a href="?page={{step}}{{#if recommend}}&recommend={{recommend}}{{/if}}{{#if type}}&type={{type}}{{/if}}">{{step}}</a>
            </li>
            {/times}}
            <li>
                <a href="{{#ge pageNumber pageCount}}?page={{pageCount}}{{else}}?page={{add pageNumber 1}}{{/ge}}"
                           aria-label="Previous">
                    <span aria-hidden="true">&raquo;</span>
                </a>   
            </li>
        </ul>
    </nav>
</div>
```

# 学习日志 【2016/7/2】
  7月2日---7月8日支教期间，看完MongoDB权威指南和Nodejs开发指南，期间暂停更新日志。

# 学习日志 【2016/7/1】

### MongoDB 分页查询的方法及性能
  [分页](http://blog.jobbole.com/80464/)  
  [控制异步回调利器 - async 串行series,并行parallel,智能控制auto简介](http://yijiebuyi.com/blog/be234394cd350de16479c583f6f6bcb6.html) 
  
### 搞定：找不到该项目，请确认该项目的位置的办法
#### 出现此问题的原因:
  1.文件或文件夹名称不符合Windows命名规范;比如名称中含有..等特殊符号;  
  2.使用下载工具创建的文件夹,在未下载完成前自行删除文件  
  3.系统备份文件GHOST创建的文件(我是系统备份的ghost产生的,装双系统时)  
  4.恶意文件生成的防删除目录  
#### 解决办法
  1.打开我的电脑,或者任意文件夹,在显示已知文件类型这里选择的勾去掉,(让系统不隐藏文件后缀,这样安全点)  
  2.新建.bar文件，内容为：
```
DEL /F /A /Q \\?\%1
RD /S /Q \\?\%1
```
  3.将.bat文件拖入删除不掉的文件夹后即可删除。  

# 学习日志 【2016/6/30】

### 个人博客完成情况

  * 实现文章发布
  * 首页显示已发布文章及数量
  * 框架结构优化

### 在Mongoose中使用嵌套的populate处理数据的方法
  假设有如下mongodb的schema定义：  
```
drawApply = new Schema({
    salesId: { type: Schema.ObjectId, ref: 'sales' },
    money: Number,
    status: { type: Number, default: 0 },
    createTime: { type: Date, default: Date.now }
});

sales = new Schema({
    name: { type: String, required: true, unique: true },
    pwd: String,
    phone: String,
    merchant: { type: Schema.ObjectId, ref: 'merchant' },
    status: { type: Number, default: 0 }
});

merchant = new Schema({
    name: String,
    sname: String,
    type: String
});
```
  表drawApply的salesId属性指定表sales的_id，表sales的属性merchant指定表merchant的_id。这是一种嵌套级联的关系。查找drawApply表的数据，并同时返回对应的sales表的数据，可以使用下面的方法：  
```
drawApply.find().populate('salesId', '_id name phone merchant').sort({createTime: -1}).exec(function(err, list) {
  // list of drawApplies with salesIds populated
});
```
  返回的结果中除了drawApply表的数据外，还会包含salesId中_id，name，phone，merchant四个属性的值。但是merchant属性的值是以ObjectId的形式显示的，如果想知道对应的merchant其它属性的值，则需要使用到嵌套的populate。代码如下：  
```
drawApply.find().populate({
    path: 'salesId',
    select: '_id name phone merchant',
    model: 'sales',
    populate: {
        path: 'merchant',
        select: '_id sname',
        model: 'merchant'
    }).sort({createTime: -1}).exec(function(err, list) {
  // list of drawApplies with salesIds populated and merchant populated
});
```
  如果drawApply表中还存在其它ObjectId类型的字段，则可以在populate方法后面继续跟其它的populate，使用方法相同，如：  
```
drawApply.find().populate({
    path: 'salesId',
    select: '_id name phone merchant',
    model: 'sales',
    populate: {
        path: 'merchant',
        select: '_id sname',
        model: 'merchant'
    })
    .populate('approver', 'name')
    .populate('operator', 'name')
    .sort({createTime: -1}).exec(function(err, list) {
  // list of drawApplies with salesIds populated and merchant populated
});
```
### JavaScript调试技巧之console.log()
  对于JavaScript程序的调试，相比于alert()，使用console.log()是一种更好的方式，原因在于：alert()函数会阻断JavaScript程序的执行，从而造成副作用；而console.log()仅在控制台中打印相关信息，因此不会造成类似的顾虑  

### Mongoose的model.find()查出来的不是文档
  切记：find查询出来的是mongoose的doc对象，支持update等操作，不是POJO，用doc.toObject()转换成POJO  
```
News.find({author:'577374a73e5758541ed9beaa'})
        .populate('author')
        .exec(function(err, docs) {

            var newsList=new Array();
            for(var i=0;i<docs.length;i++) {
                newsList.push(docs[i].toObject());
            }
            console.log(newsList);
            cb(true,newsList);
        });
```
  查询出来的newsList是个数组，若  
```
res.render('index',{
    list:data
});
```
  在index里使用{{list}}发现传递的参数接受不了，换成list.length试下，数组的话可使用  {{#each list}}  {{/each}} 在index中遍历  
  以下为.toObject()用console.log()调试结果  
```
  { _id: 577480e1abaa964c0c52ad07,
    title: 'test2',
    content: '2',
    author: 
     { _id: 577374a73e5758541ed9beaa,
       username: 'hqy',
       password: '123',
       __v: 0,
       meta: [Object] },
    __v: 0,
    meta: 
     { createAt: Thu Jun 30 2016 10:16:01 GMT+0800 (中国标准时间),
       updateAt: Thu Jun 30 2016 10:16:01 GMT+0800 (中国标准时间) } } ]
```

### Mongoose的基本用法

#### 1.将Mongoose集成到项目中
    npm install --save mongoose

#### 2 . 连接数据库
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1:27017/blog');
#### 3 . 定义一个Schema（也就是Mongodb中的Collections集合），更多字段类型，请参考SchemaTypes
```
var userSchema = {
username: {type: String, required: true, unique: true},
password: {type: String, required: true}
}
```
#### 4 . 将Schema进行“Model化”
```
var User = mongoose.model('User', userSchema );
```
#### 5 . 增加记录
```
User.create({username: '张三', password: 'md5-pass'}, function(err, user){
 if(!err){
     console.log(user.username + ' 保存成功!');
 }else{
    console.log('数据保存失败：' + err);
 }
});
```
#### 6 . 修改记录
```
User.findOneAndUpdate({_id: req.params.userId}, {
 username: newUsername
}, function (err, raw) {
 if(!err) {
     console.log( '修改成功!');
 }else{
     console.log('修改失败');
 }
});
```
#### 7 . 删除记录
```
User.deleteById(userId, function(err, doc){
 if(!err){
     console.log('删除成功');
 }
});
```
#### 8 . 查询记录
```
User.findById(userId, callback);    // one record
User.findOne({username: '张三'}, callback);  // one record
User.find();  // multi records
```
#### 9 . 查询记录集合
```
User.find({'age' : 28},function(error,data) {
 console.log(data);
})
{}  : 无查询参数时默认查出表中所有数据
```
#### 10 . entity保存方法,model调用的是create方法，entity调用的是save方法
```
    var  Entity = new TestModel({});
    Enity.save(function(error,data){})
```
#### 11 . 数据更新
```
  var mongoose = require("mongoose");
  var db =mongoose.connect("mongodb://127.0.0.1:27017/test");
  var TestSchema = new mongoose.Schema({
    name : { type:String },
    age  : { type:Number, default:0 },
    email: { type:String },
    time : { type:Date, default:Date.now }
});
var TestModel = db.model("test1", TestSchema );
var conditions = {age : 26};
var update = {$set :{name : '小小庄'}};
TestModel.update(conditions,update,function(error,data){
    if(error) {
          console.log(error);
    }else {
          console.log(data);
      }
})
返回结果 ： { ok: 1, nModified: 1, n: 1 }
```
#### 12 . 删除数据
```
var conditions = { name: 'tom' };
TestModel.remove(conditions, function(error){
     if(error) {
           console.log(error);
     } else {
           console.log('Delete success!');
   }
});
```
#### 13 . 简单查询方法 ---过滤
```
//返回一个只显示 name 和 email的属性集合
//id为默认输出,可以设置为 0 代表不输出

 TestModel.find({},{name:1, email:1, _id:0},function(err,docs){
   console.log(docs);
 });
```
#### 14 . 单条数据 findOne(Conditions,callback);
```
  查询符合条件的数据，结果只返回单条
  TestModel.findOne({},function(error,data){
          console.log(data);
  })
  TestModel.findOne({age:28},function(error,docs){
          console.log(docs);
  })
```
#### 15 . 单条数据 findById(_id, callback);
```
  根据Id取数据findById，与findOne相同，但它只接收文档的_id作为参数，返回单个文档。

  TestModel.findById('obj._id', function (err, doc){
           //doc 查询结果文档
 });
```
#### 16 . 根据某些字段进行条件筛选查询，比如说 Number类型，怎么办呢，我们就可以使用$gt(>)、$lt(<)、$lte(<=)、$gte(>=)操作符进行排除性的查询
```
  Model.find({"age":{"$gt":18}},function(error,docs){
           //查询所有nage大于18的数据
 });

  Model.find({"age":{"$lt":60}},function(error,docs){
         //查询所有nage小于60的数据
  });

  Model.find({"age":{"$gt":18,"$lt":60}},function(error,docs){
         //查询所有nage大于18小于60的数据
  });
总结

1. 查询：find查询返回符合条件一个、多个或者空数组文档结果。

2. 保存：model调用create方法，entity调用的save方法。

3. 更新：obj.update(查询条件,更新对象,callback)，根据条件更新相关数据。

4. 删除：obj.remove(查询条件,callback)，根据条件删除相关数据。
```

# 学习日志【2016/6/29】

### 博客完成进度 

  * 登录功能完成  
  * 整体界面框架搭建完成  

### mongodb 查询语句

    1.db.users.find({"age" : 27}) select * from users where age = 27
    2.db.users.find({}, {"username" : 1, "email" : 1}) select username, email from users
    3.db.users.find({}, {"username" : 1, "_id" : 0}) // no case  // 即时加上了列筛选，_id也会返回；必须显式的阻止_id返回
    4.db.users.find({"age" : {"$gte" : 18, "$lte" : 30}}) select * from users where age >=18 and age <= 30 // $lt(<) $lte(<=) $gt(>) $gte(>=)

### CSS3 如何让背景图片拉伸填充避免重复显示

    使用background-size属性方法：
    1.数值表示 100px
    2.百分比表示方式 30%
    3.等比扩展图片来填满元素，即cover值
    4.等比缩小图片来适应元素的尺寸，即contain值
    5.以图片自身大小来填充元素，即auto值

### 数据的增删改查注意点

    1. 数据的增删改查都是在model也就是当前的User下进行的，而不是在新建的变量，也就是当前的user中进行的；save操作是以实例为对象的。  

    2. 数据的增删改查产生的效果可以在console中看到，在浏览器输入localhost:8080/register，由于不能渲染网页，所以是500错误，console中会出现。  

    3. 数据的操作都是异步式的，因此显示的结果并不是按照程序写的顺序执行。

    4. mongo exployer 只能查看和修改数据  

    5. romomongo 可以查看、修改、删除数据 鼠标右键即可执行操作。  

### 新注册的用户是如何插入mongodb数据库中的

    mongoose.model('User', UserSchema);

    mongoose在内部创建collection时将我们传递的collection名小写化，同时如果小写化的名称后面没有字母——s,则会在其后面添加一s,针对我们刚建的collection,则会命名为：users。  

### 利用Mongodb Nodejs 实现登录功能

  1.新建表User并向表中新增一条记录

    var userSchema = require('../db/schema/user');
    var User = mongoose.model('User', userSchema);

  2.对login页面submit事件监听

    $(init);

    function init() {   

      $("body").on('click', '#loginBtn', doLogin);
    }   

    function doLogin() {    

      $.ajax({
        type: "POST",
        url: "/login",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          'usr': $("#usr").val(),
          'pwd': $("#pwd").val()
        }),
        success: function(result) {
          if (result.code == 99) {
            $(".login-box-msg").text(result.msg);
          } else {
            $.cookie('username', result.data.username, {expires:30});
            $.cookie('password', result.data.password, {expires:30});
            $.cookie('id', result.data._id, {expires:30});
            location.href = "/blog";
          }
        }
      })
    }

  3.mongodb findOne()

    > db.blog.findOne({"author.name" : "Jane"})

  find查询出来的是mongoose的doc对象，支持update等操作，不是POJO，用doc.toObject()转换成POJO
    
### Mongoose 模型提供了 find, findOne, 跟 findById 方法用于文档查询

#### Model.find  

    Model.find(query, fields, options, callback)// fields 和 options 都是可选参数
    例如：Model.find({'csser.com':5},function(err, docs){// docs 是查询的结果数组 });
    只查询指定键的结果

#### Model.findOne  

    与 Model.find 相同，但只返回单个文档
    Model.findOne({ age:5},function(err, doc){// doc 是单个文档});

#### Model.findById

  与 findOne 相同，但它接收文档的 _id 作为参数，返回单个文档。_id 可以是字符串或 ObjectId 对象  

    Model.findById(obj._id,function(err, doc){// doc 是单个文档});

### 关于jQuery新的事件绑定机制on()的使用技巧。

    on(events,[selector],[data],fn)  

    例子 ：$("body").on('click', '#loginBtn', doLogin);

    events:一个或多个用空格分隔的事件类型和可选的命名空间，如"click"或"keydown.myPlugin" 。  
    selector:一个选择器字符串用于过滤器的触发事件的选择器元素的后代。如果选择器为null或省略，当它到达选定的元素，事件总是触发。  
    data:当一个事件被触发时要传递event.data给事件处理函数。  
    fn:该事件被触发时执行的函数。 false 值也可以做一个函数的简写，返回false。  

### jquery.cookie用法详细解析

    语法：$.cookie(名称,值,[option])
    例如：$.cookie('username', result.data.username, {expires:30});

    (1)读取cookie值：
    $.cookie(cookieName)      cookieName:要读取的cookie名称。
    示例：$.cookie("username"); 读取保存在cookie中名为的username的值。

    (2)写入设置Cookie值：
    $.cookie(cookieName,cookieValue);    cookieName:要设置的cookie名称，cookieValue表示相对应的值。
    示例:$.cookie("username","admin"); 将值"admin"写入cookie名为username的cookie中。
    $.cookie("username",NULL);　　　销毁名称为username的cookie

    (3) [option]参数说明：
    expires:　　有限日期，可以是一个整数或一个日期(单位：天)   这个地方也要注意，如果不设置这个东西，浏览器关闭之后此cookie就失效了
    path:　　　 cookie值保存的路径，默认与创建页路径一致。
    domin: cookie域名属性，默认与创建页域名一样。　　这个地方要相当注意，跨域的概念，如果要主域名二级域名有效则要设置　　".xxx.com"
    secrue:　　 一个布尔值，表示传输cookie值时，是否需要一个安全协议。


### Node.js开发框架Express

#### 1.目录结构

    nodejs-demo/
    ├──app.js  应用核心配置文件

    ├──bin  启动项目的脚本文件

    ├──node_modules  项目依赖库

    ├──package.json  项目依赖配置及开发者信息

    ├──public  静态文件(css,js,img)

    ├──routes  路由文件(MVC中的C,controller)

    └──views  页面文件(Ejs模板)

#### 2.package.json项目配置

  package.json用于项目依赖配置及开发者信息，scripts属性是用于定义操作命令的，可以非常方便的增加启动命令，比如默认的start，用npm start代表执行node ./bin/www命令。
  查看package.json文件。

    {
      "name": "express4-demo",
      "version": "0.0.0",
      "private": true,
      "scripts": {
        "start": "node ./bin/www"
      },
      "dependencies": {
        "body-parser": "~1.10.2",
        "cookie-parser": "~1.3.3",
        "debug": "~2.1.1",
        "ejs": "~2.2.3",
        "express": "~4.11.1",
        "morgan": "~1.5.1",
        "serve-favicon": "~2.2.0"
      }
    }

#### 3.app.js核心文件

    // 加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
    var express = require('express'); 
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');    

    // 加载路由控制
    var routes = require('./routes/index');
    //var users = require('./routes/users');    

    // 创建项目实例
    var app = express();    

    // 定义EJS模板引擎和模板文件位置，也可以使用jade或其他模型引擎
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');  

    // 定义icon图标
    app.use(favicon(__dirname + '/public/favicon.ico'));
    // 定义日志和输出级别
    app.use(logger('dev'));
    // 定义数据解析器
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    // 定义cookie解析器
    app.use(cookieParser());
    // 定义静态文件目录
    app.use(express.static(path.join(__dirname, 'public')));    

    // 匹配路径和路由
    app.use('/', routes);
    //app.use('/users', users); 

    // 404错误处理
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }); 

    // 开发环境，500错误处理和错误堆栈跟踪
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }   

    // 生产环境，500错误处理
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }); 

    // 输出模型app
    module.exports = app;

#### 4.www文件

项目启动代码也被移到./bin/www的文件，www文件也是一个node的脚本，用于分离配置和启动程序。

    #!/usr/bin/env node     

    /**
     * 依赖加载
     */
    var app = require('../app');
    var debug = require('debug')('nodejs-demo:server');
    var http = require('http'); 

    /**
     * 定义启动端口
     */
    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);  

    /**
     * 创建HTTP服务器实例
     */
    var server = http.createServer(app);    

    /**
     * 启动网络服务监听端口
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);    

    /**
     * 端口标准化函数
     */
    function normalizePort(val) {
      var port = parseInt(val, 10);
      if (isNaN(port)) {
        return val;
      }
      if (port >= 0) {
        return port;
      }
      return false;
    }   

    /**
     * HTTP异常事件处理函数
     */
    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      } 

      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        :  'Port ' +  port

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }   

    /**
     * 事件绑定函数
     */
    function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }

#学习日志[2016/6/28]

### markdown语法

[Markdown语法说明](http://www.appinn.com/markdown/#link)  
  1.一个 Markdown段落是由一个或多个连续的文本行组成，它的前后要有一个以上的空行被视为空行  
  2.标题，类 Atx 形式则是在行首插入 1 到 6 个 # ，对应到标题 1 到 6 阶，例如：

    # 这是 H1

    ## 这是 H2

    ###### 这是 H6
  3.代码区段：tab4个空格开始  
  4.要建立一个行内式的链接，只要在方块括号后面紧接着圆括号并插入网址链接即可，如果你还想要加上链接的 title 文字，只要在网址后面，用双引号把 title 文字包起来即可，例如：

    This is [an example](http://example.com/ "Title") inline link.

    [This link](http://example.net/) has no title attribute.

### 配置mongodb

  1.从官网下载mongodb-win32-x86_64-2008plus-3.6.7.zip  
  2.创建数据库文件的存放位置，比如d:/mongodb/data/db。启动mongodb服务之前需要必须创建数据库文件的存放文件夹，否则命令不会自动创建，而且不能启动成功。  
  3.打开cmd（windows键+r输入cmd）命令行，进入D:\mongodb\bin目录（如图先输入d:进入d盘然后输入cd d:\mongodb\bin，
    输入如下的命令启动mongodb服务：
        D:/mongodb/bin>mongod --dbpath D:\mongodb\data\db  
  4.mongodb默认连接端口27017,如果出现"it looks like you are trying to acccess mongoDB over HTTP on the native driver port"说明成功  
   5.可以将MongoDB设置成Windows服务，在F:\mongodb下创建mongodb.cfg,内容为
        ##数据文件
        dbpath=F:\mongodb\data\db 
        ##日志文件
        logpath=F:\mongodb\log\mongodb.log  
   6.在F:\mongodb中创建log日志文件夹,新建mongodb.log日志文件
        用【管理员】身份打开cmd命令行，进入D:\mongodb\bin目录，输入如下的命令：
        D:\mongodb\bin>mongod --config D:\mongodb\mongo.config  
   7.最后services.msc查看mongoDB服务并启动  

### 通过CMD生成文本目录

    1.通过dir命令
    dir /o /n /B
    输出到同目录下的file.txt
    dir /o /n /B >file.txt
    2.通过tree命令
    tree /f /A
    tree /A >file.txt

### webstorm中mongoose 的使用

    1. 打开webstorm中右下角的terminal 输入$ npm install --save-mongoose
    2. run当前的项目，就会发现node_modules中就会有mongoose这个文件夹

### 如何调用数据
    
    router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express' });  //使用数据库的时候不能渲染网页   

      mongoose.connect('mongodb://127.0.0.1:27017/test');  //连接到数据库  自动会新建一个test的数据表    

      var Schema = mongoose.Schema;    //获取schema

      var blogSchema = new Schema({    //用schema创建blogSchema
        title:  String,
        author: String,
        body:   String
      });   

      var Blog = mongoose.model('Blog', blogSchema);   //用blogSchema创建Blog  注意大写和匹配 

      blog = new Blog({      //创建一个blog实例
        title: 'aaa',
        author: 'bbb',
        body:   'ccc'
      })    

      blog.save(function(err, doc) {   //保存
        if (err) {
          console.log('error')         //出现错误打印错误信息
        } else {
          console.log(doc)             //成功返回数据，可以在console中看到
        }
      })    
    

    });

### 用mongoose操作MongoDB

#### 获得mongoose模板

    var mongoose = require('mongoose');
    mongoose.connect("mongodb://127.0.0.1:27017/test");
    /*  var Schema = mongoose.Schema;  用Schema代替mongoose.Schema*

#### 存储数据

    var PersonInfo = new mongoose.Schema({
        age       : Number,
        id        : String,
        phone     : String,
        colloge   : String,
        hometown  : String
    }); 

    var Person = mongoose.model('Person',PersonInfo);   

    var person = new Person({
        age     :'20',
        id      :'3326241995123456',
        phone   :'13819630116',
        colloge :'hznu',
        hometown :'xianju'
    })  

    person.save(function (err) {
        if(err){
            console.log('保存失败');
        }
        console.log('success');
    })

#### 增加数据

    var person1 = new Person({
        age     :'15',
        id      :'3326242000123456',
        phone   :'1776542365',
        colloge :'no',
        hometown :'xianju'
    })
    person1.save(function (err) {
        if(err){
            console.log('保存失败');
        }
        console.log('success');
    })

#### 修改数据

    var conditions = {age:20};
    var update={$set:{hometown:'taizhou'}};
    //第一个参数conditions是选择条件，第二个参数update是选择后该如何更改的参数,第三个是回调函数
    Person.update(conditions,update,function (error,data) {
        if(error){
            console.log(error);
        }else{
            console.log(data);
        }
    })

#### 删除数据

    Person.remove({age:20},function (err) {
        if(err){
            console.log(err);
        }else{
            console.log('删除成功');
        }
    })

#### 查询数据

    //$lt表示小于
    Person.find({"age":{"$lt":19}},function (error,docs) {
        if(error){
            console.log(error);
        }else{
            console.log(docs);
        }
    })

#学习日志[2016/6/27]

### nodejs 文件基本结构

    /bin 
    ...www  
    /node_modules
    /public
    ... images
    ... javascripts
    ... stylesheets
    /routes
    ... index
    /views
    ... /error
    ... /layouts
    ... /partials
    app.js
    package.json

### 如何配置hbs

    var hbs = exphbs.create({
        partialsDir: 'views/partials',
        layoutsDir: "views/layouts/",
        defaultLayout: 'main',
        extname: '.hbs'
    });
    app.engine('hbs', hbs.engine);

### 如何利用hbs

    /layouts
    ... lg.hbs
    ... main.hbs
    /partials
    ... head.hbs
    ... header.hbs

    1.可以使用layout来调用模块代码进行渲染
    2.利用    {{>head}}  {{>body}}调用模块化代码

### 如何映射静态文件目录

    利用
    router.get('/blog', function(req, res, next) {
     res.render('blog', { title: 'Express', layout: 'main' });
    });
    localhost:3000/blog将跳转到blog.hbs,并利用main.hbs进行填充代码渲染

### 如何配置路由

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', routes);
    app.use('/admin', admin);

    '/'将会利用路由跳转到相关静态文件










