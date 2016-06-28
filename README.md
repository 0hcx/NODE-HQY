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

