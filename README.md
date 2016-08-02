# 学习日志【2016/8/2】

nodejs开发指南读后感
=========================

# http服务器

## 1. 创建http服务器，监听3000端口;

```js
var http = require("http");
http.createServer(function(req,res){
    res.writeHead(200, {'Content-Type': 'text/html'}); 
    res.write('<h1>Node2.js</h1>');
    res.end('<p>Hello World</p>');
}).listen(3000);
```
1.  `var http = require('http')`的含义是引出自带的http模块，这个应该不难理解。   

2.  `createServer(function)`方法创建一个http的服务器，它只有一个参数，就是`function`回调函数，回调函数有两个参数，一个是`require`，一个是`response`。  

3.  回调函数里面就是返回的主体了，页面`Header`以及`内容主体`。  

4.  `createServer`函数返回一个web服务器对象，该对象用`listen`方法监听8888端口。  

### 2  http.Server 的事件

`http.Server `是一个基于事件的 HTTP 服务器，所有的请求都被封装为独立的事件，
开发者只需要对它的事件编写响应函数即可实现 HTTP 服务器的所有功能。它继承自
`EventEmitter` ，提供了以下几个事件。

1. `request `：当客户端请求到来时，该事件被触发，提供两个参数`req `和`res `，分别是
http.ServerRequest 和  http.ServerResponse  的实例，表示请求和响应信息。

2.  `connection` ：当 TCP 连接建立时，该事件被触发，提供一个参数  `socket `，为
`net.Socket `的实例。` connection `事件的粒度要大于  `request `，因为客户端在
`Keep-Alive `模式下可能会在同一个连接内发送多次请求。

3. ` close `：当服务器关闭时，该事件被触发。注意不是在用户连接断开时。

显式的实现方法：
```js
var http = require('http');
var server = new http.Server();
server.on('request',function(req,res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>Node.js</h1>');
    res.end('<p>Hello World</p>');
});
server.listen(3004);
console.log("port is 3004");
```
### 3. http.ServerRequest
`http.ServerRequest ` 是 HTTP 请求的信息，是后端开发者最关注的内容。它一般由
http.Server 的  request 事件发送，作为第一个参数传递，通常简称  `request `或  `req `。
ServerRequest  提供一些属性。

HTTP 请求一般可以分为两部分：请求头（`Request Header`）和请求体（`Requset Body`）

* ` data` ：当请求体数据到来时，该事件被触发。该事件提供一个参数  chunk ，表示接
收到的数据。如果该事件没有被监听，那么请求体将会被抛弃。该事件可能会被调
用多次。
* `end` ：当请求体数据传输完成时，该事件被触发，此后将不会再有数据到来。
*  `close`： 用户当前请求结束时，该事件被触发。不同于  end ，如果用户强制终止了
传输，也还是调用` close `。


###  4.http.ServerResponse
http.ServerResponse  是返回给客户端的信息，决定了用户最终能看到的结果。它
也是由  http.Server 的  request  事件发送的，作为第二个参数传递，一般简称为
response 或  res 。

http.ServerResponse 有三个重要的成员函数，用于返回响应头、响应内容以及结束
请求。

* `response.writeHead(statusCode, [headers]) `：向请求的客户端发送响应头。
statusCode  是 HTTP 状态码，如 200 （请求成功）、404 （未找到）等。 headers
是一个类似关联数组的对象，表示响应头的每个属性。该函数在一个请求内最多只
能调用一次，如果不调用，则会自动生成一个响应头。
*  `response.write(data, [encoding])` ：向请求的客户端发送响应内容。 data 是
一个  Buffer 或字符串，表示要发送的内容。如果  data 是字符串，那么需要指定
encoding 来说明它的编码方式，默认是 utf-8 。在 response.end 调用之前，
response.write  可以被多次调用。
* `response.end([data], [encoding])` ：结束响应，告知客户端所有发送已经完
成。当所有要返回的内容发送完毕的时候，该函数 必须 被调用一次。它接受两个可
选参数，意义和 response.write  相同。如果不调用该函数，客户端将永远处于
等待状态

### 5.node.js中的url.parse方法使用说明

该方法的含义是:将URL字符串转换成对象并返回

基本语法:url.parse(urlStr, [parseQueryString], [slashesDenoteHost])
urlStr url字符串

`parseQueryString` 为true时将使用查询模块分析查询字符串，默认为`false`
slashesDenoteHost

1. 默认为`false`，//foo/bar 形式的字符串将被解释成` { pathname: ‘//foo/bar' }`
2. 如果设置成`true`，//foo/bar 形式的字符串将被解释成` { host: 'foo', pathname: '/bar' }`
```js
var url = require('url');
var a = url.parse('http://example.com:8080/one?a=index&t=article&m=default');
console.log(a);
```

```js
打印如下:
 {
     protocol: 'http:',
     slashes: true,
     auth: null,
     host: 'example.com:8080',
     port: '8080',
     hostname: 'example.com',
     hash: null,
     search: '?a=index&t=article&m=default',
     query: 'a=index&t=article&m=default',
     pathname: '/one',
     path: '/one?a=index&t=article&m=default',
     href: 'http://example.com:8080/one?a=index&t=article&m=default'
 }
```
1. node.js中请求如何获取get请求的内容 我们可以使用上面介绍的 url.parse方法
```js
var http = require('http');
var url = require('url');
var util = require('util');
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(util.inspect(url.parse(req.url, true)));
}).listen(3001);
```
* `url.parse(req.url)`，输入 URL 字符串，返回一个对象。
* `util.inspect(object)`，返回一个对象的字符串表现形式,。通常用于代码调试。

```
href: 所解析的完整原始 URL。协议名和主机名都已转为小写。例如: http://localhost:8888/p/a/t/h?query=string#hash
protocol: 请求协议，小写。例如: http:
host: URL主机名已全部转换成小写, 包括端口信息。例如: localhost:8888
auth:URL中身份验证信息部分。例如: user:pass，这里没有。
hostname:主机的主机名部分, 已转换成小写。例如: host.com
port: 主机的端口号部分。例如: 8888
pathname: URL的路径部分,位于主机名之后请求查询之前。例如: /p/a/t/h
search: URL 的“查询字符串”部分，包括开头的问号。例如: ?query=string
path: pathname 和 search 连在一起。 例如: /p/a/t/h?query=string
query: 查询字符串中的参数部分（问号后面部分字符串），或者使用querystring.parse()解析后返回的对象。例如: query=string or {'query':'string'}
hash: URL 的 “#” 后面部分（包括 # 符号） 例如: #hash
```
#### querystring反序列化

好了，通过上面，咱们就找到了我们想要获取的信息，那就是`query`对象，它的内容是`hello=Node&hello2=Node2`，那么如何再把这个字符串解析成对象进行访问呢？这里就要用到querystring模块了。

```js
var querystring = require('querystring');
var hello = querystring.parse('hello=Node&hello2=Node2').hello;
var hello2 = querystring.parse('hello=Node&hello2=Node2').hello2;
console.log("hello值为：" + hello + "; hello2值为：" + hello2);
```

很简单的一段代码，querystring的parse方法将一个 query string 反序列化为一个对象。然后直接通过key-value对应取值就OK了。

在浏览器运行 http://127.0.0.1:3001/one?a=index&t=article&m=default 这个
```js
{
 protocol: null,
 slashes: null,
 auth: null,
 host: null,
 port: null,
 hostname: null,
 hash: null,
 search: '?a=index&t=article&m=default',
 query: { a: 'index', t: 'article', m: 'default' },
 pathname: '/one',
 path: '/one?a=index&t=article&m=default',
 href: '/one?a=index&t=article&m=default'
}
```
通过 `url.parse`,原始的` path` 被解析为一个对象,其中 `query `就是我们所谓的 GET 请求的内容,而路径则是 `pathname`。

2. 如何获取post请求的内容
```js
var http = require('http');
var querystring = require('querystring');
var util = require('util');

http.createServer(function(req, res) {
    var post = '';
    req.on('data', function(chunk) {
        post += chunk;
    });
    req.on('end', function() {
        post = querystring.parse(post);
        res.end(util.inspect(post));
    });
}).listen(3002);
```
定义了一个 `post `变量,用 于在闭包中暂存请求体的信息。通过` req `的 `data 事件监听`函数,每当接受到请求体的数据, 就累加到`post` 变量中。
在`end `事件触发后,通过` querystring.parse` 将 `post `解析为 真正的` POST `请求格式,然后向客户端返回。

## HTTP 客户端

在Node中通过HTTP模块也可以实现客户端的功能，主要通过两个函数`http.request`和`http.get`作为客户端向HTTP服务器发送请求。

1.`http.request(options, callback)` 发送请求
请求参数：options，包括host、post、method、path、headers

* host ：请求网站的域名或 IP 地址。
* port ：请求网站的端口，默认 80。
* method ：请求方法，默认是 GET。
* path ：请求的相对于根的路径，默认是“ / ”。 QueryString  应该包含在其中。
例如  /search?query=byvoid 。
* headers ：一个关联数组对象，为请求头的内容。

`callback ` 传递一个参数，为` http.ClientResponse `的实例。  
`http.request ` 返回一个 ` http.ClientRequest `的实例。
```js
var http = require('http');
var querystring = require('querystring');
var contents = querystring.stringify({
name: 'byvoid',
email: 'byvoid@byvoid.com',
address: 'Zijing 2#, Tsinghua University',
});
var options = {
host: 'www.byvoid.com',
path: '/application/node/post.php',
method: 'POST',
headers: {
'Content-Type': 'application/x-www-form-urlencoded',
'Content-Length' : contents.length
}
};
var req = http.request(options, function(res) {
res.setEncoding('utf8');
res.on('data', function (data) {
console.log(data);
});
});
req.write(contents);
req.end();
```
```js
运行后结果如下:
array(3) {
["name"]=>
string(6) "byvoid"
["email"]=>
string(17) "byvoid@byvoid.com"
["address"]=>
string(30) "Zijing 2#, Tsinghua University"
}
```


2.`http.get(options, callback) `发送Get请求，该方法是上面的简化版

唯一的区别在于 http.get
自动将请求方法设为了 GET 请求，同时不需要手动调用 req.end() 。
```js
var http = require('http');
http.get({host: 'www.byvoid.com'}, function(res) {
res.setEncoding('utf8');
res.on('data', function (data) {
console.log(data);
});
});
```
3.http.ClientRequest

http.ClientRequest  是由  http.request 或  http.get 返回产生的对象，表示一
个已经产生而且正在进行中的 HTTP 请求。它提供一个  response  事件，即  http.request
或  http.get  第二个参数指定的回调函数的绑定对象。我们也可以显式地绑定这个事件的
监听函数：

```js
var http = require('http');
var req = http.get({host: 'www.byvoid.com'});
req.on('response', function(res) {
res.setEncoding('utf8');
res.on('data', function (data) {
console.log(data);
});
});
```
`http.ClientRequest  `像  `http.ServerResponse` 一样也提供了  `write`  和 `end ` 函
数，用于向服务器发送请求体，通常用于 POST、PUT 等操作。所有写结束以后必须调用  `end`
函数以通知服务器，否则请求无效。 http.ClientRequest  还提供了以下函数。

* `request.abort()` ：终止正在发送的请求。
* `request.setTimeout(timeout, [callback]) `：设置请求超时时间， timeout 为
毫秒数。当请求超时以后， callback 将会被调用

4.http.ClientResponse

`http.ClientResponse` 与  `http.ServerRequest `相似，提供了三个事件  `data `、` end`
和  `close` ，分别在数据到达、传输结束和连接结束时触发，其中 ` data `事件传递一个参数
`chunk `，表示接收到的数据。

* `response.setEncoding([encoding])` ：设置默认的编码，当  data 事件被触发
时，数据将会以  encoding 编码。默认值是  `null` ，即不编码，以  Buffer 的形式存
储。常用编码为 utf8。
* `response.pause() `：暂停接收数据和发送事件，方便实现下载功能。
* `response.resume() `：从暂停的状态中恢复


# supervisor的使用及nodejs常见的调式代码命令

### 1. supervisor的使用
nodejs会在第一次引用到某部分时才会去解析脚本文件，之后直接从缓存里面去取，因此对于调式不方面，可以使用安装supervisor

supervisor 可以帮助你实现这个功能,它会监视你对代码的改动,并自动重启 Node.js
```js
安装
$ npm install -g supervisor

启动
$ supervisor app.js
```
如果你使用的是 Linux 或 Mac，直接键入上面的命令很可能会有权限错误。原因是 npm
需要把 supervisor 安装到系统目录，需要管理员授权，可以使用  `sudo npm install -g
supervisor` 命令来安装

### 2. 使用npm安装包有二种模式：本地模式和全局模式

本地模式如下：npm install 包名   
全局模式安装如下：npm install -g 包名 

`本地模式`：该模式是把包安装在当前目录的node_module子目录下，
Node.js 的require在加载模块时会尝试搜寻 node_modules子目录,因此使用npm本地模式安装 的包可以直接被引用。

`全局模式`：为了减少多重副本而使用全局模式,而是因为本地模式不会注册 PATH 环境变量。举例说明,我们安装 supervisor 是为了在命令行中运行它,
譬如直接运行 supervisor script.js,这时就需要在 PATH 环境变量中注册 supervisor。npm 本地模式仅仅是把包安装到 node_modules 子目录下,
其中 的 bin 目录没有包含在 PATH 环境变量中,不能直接在命令行中调用。而当我们使用全局模 式安装时,npm 会将包安装到系统目录,
譬如 /usr/local/lib/node_modules/,同时 package.json 文 件中 bin 字段包含的文件会被链接到 /usr/local/bin/。/usr/local/bin/ 
是在PATH 环境变量中默认 定义的，因此就可以直接在命令行中运行 supervisor script.js命令了。
注意：使用全局模式安装的包并不能直接在 JavaScript 文件中用 require 获 得,因为 require 不会搜索 /usr/local/lib/node_modules/。

### 3. nodejs调式代码命令：

* `run`  执行脚本，在第一行暂停
* `restart`  重新执行脚本
* `cont, c`  继续执行，直到遇到下一个断点
* `next, n ` 单步执行
* `step, s`  单步执行并进入函数
* `out, o ` 从函数中步出
* `setBreakpoint(), sb()`  在当前行设置断点
* `setBreakpoint(‘f()’), sb(...) ` 在函数f的第一行设置断点
* `setBreakpoint(‘script.js’, 20), sb(...)  `在 script.js 的第20行设置断点
* `clearBreakpoint, cb(...)`  清除所有断点
* `backtrace, b`  显示当前的调用栈
* `list(5) ` 显示当前执行到的前后5行代码
* ` watch(expr)`  把表达式 expr 加入监视列表
* ` unwatch(expr)  `把表达式 expr 从监视列表移除
* `watchers ` 显示监视列表中所有的表达式和值
* `repl  `在当前上下文打开即时求值环境
* `kill ` 终止当前执行的脚本
* `scripts ` 显示当前已加载的所有脚本
* `version`  显示 V8 的版本

下面是个简单的例子
```js
$ node debug debug.js
< debugger listening on port 5858
connecting... ok
break in /home/byvoid/debug.js:1
1 var a = 1;
2 var b = 'world';
3 var c = function (x) {
debug> n
break in /home/byvoid/debug.js:2
1 var a = 1;
2 var b = 'world';
3 var c = function (x) {
4 console.log('hello ' + x + a);
debug> sb('debug.js', 4)
1 var a = 1;
2 var b = 'world';
3 var c = function (x) {
* 4 console.log('hello ' + x + a);
5 };
6 c(b);
7 });
debug> c
break in /home/byvoid/debug.js:4
2 var b = 'world';
3 var c = function (x) {
* 4 console.log('hello ' + x + a);
5 };
6 c(b);
debug> repl
Press Ctrl + C to leave debug repl
> x
'world'
> a + 1
2
debug> c
< hello world1
program terminated
```

### 4.使用 node-inspector 调试 Node.js

1. 使用 ` npm install -g node-inspector ` 命令安装 node-inspector，然后在终
端中通过` node --debug-brk=5858 debug.js ` 命令连接你要除错的脚本的调试服务器，

2. 启动 node-inspector：`$ node-inspector`

3. 在浏览器中打开` http://127.0.0.1:8080/debug?port=5858` ， 即可显示出优雅的 Web 调试工
具

# 模块和包

 `var http = require('http')`， 其中 http
是 Node.js 的一个核心模块，其内部是用 C++ 实现的，外部用 JavaScript 封装。

## 1.创建及加载模块

#### 1. 创建模块  

Node.js 提供了 `exports `和  `require`  两个对
象，其中  `exports `是模块公开的接口， `require `用于从外部获取一个模块的接口，即所获
取模块的 ` exports 对象`。

```js
//module.js
var name;
exports.setName = function(thyName) {
name = thyName;
};
exports.sayHello = function() {
console.log('Hello ' + name);
};
```
在同一目录下创建 getmodule.js，内容是：
```js
//getmodule.js
var myModule = require('./module');

myModule.setName('BYVoid');
myModule.sayHello();
```
运行node getmodule.js，结果是：
```js
Hello BYVoid
```

在以上示例中，`module.js `通过 ` exports `对象把` setName`  和  `sayHello `作为模块的`访问接口`，在 `getmodule.js` 中通过  `require('./module') `加载这个模块，然后就可以直接访
问 module.js 中  `exports` 对象的成员函数了。

#### 2. 单次加载

`require `不会重复加载模块，也就是说无论调用多少次  require， 获得的模块都是`同一个`。

```js
//loadmodule.js

var hello1 = require('./module');
hello1.setName('BYVoid');

var hello2 = require('./module');
hello2.setName('BYVoid 2');

hello1.sayHello();
```
运行后发现输出结果是
```js
Hello BYVoid 2 
```
这是因为变量  hello1 和  hello2 指向的是
同一个实例，因此  hello1.setName  的结果被 hello2.setName 覆盖，最终输出结果是
由后者决定的。

#### 3. 覆盖  exports 
有时候我们只是想把一个对象封装到模块中，例如
```js
//singleobject.js

function Hello() {
    var name;
    this.setName = function (thyName) {
    name = thyName;
    };

    this.sayHello = function () {
        console.log('Hello ' + name);
    };
};
exports.Hello = Hello;
```
此时我们在其他文件中需要通过` require('./singleobject').Hello ` 来获取
Hello  对象

简化后：
```js
//hello.js

function Hello( {
    var name;

    this.setName = function (thyName) {
        name = thyName;
    };
    
    this.sayHello = function() {
        console.log('Hello' + name);
    };
})

module.exports = Hello;
```
这样就可以直接获得这个对象了：
```js
//gethello.js

var Hello = require('./hello');

hello = new Hello();
hello.setName ('BYVoid');
hello.sayHello();
```
在外部引用该模块时，其接口对象就是要输出的 ` Hello 对象本身`，而不是原先的
exports 。

1. `exports  `本身仅仅是一个普通的`空对象`，即 `{} `，它专门用来声明接口，本
质上是通过它为模块闭包的内部建立了一个有限的访问接口。可以用其他东西来代替，譬如我们上面例子中的 Hello  对象

2. 不可以通过对  `exports `直接赋值代替对 `module.exports` 赋值。
`exports` 实际上只是一个和  module.exports 指向同一个对象的变量，
它本身会在模块执行结束后释放，但 `module ` 不会，因此只能通过指定
module.exports  来改变访问接口。

## 2.模块的路径解析

1.核心模块定义在node源代码的lib/目录下，`require()`总是会优先加载核心模块。例如，`require('http')`总是返回编译好的HTTP模块，而不管是否有这个名字的文件模块；

2.如果按文件名没有查找到，那么node会添加`.js`和` .json`后缀名，再尝试加载，如果还是没有找到，最后会加上`.node`的后缀名再次尝试加载；我上面就是直接写的文件名，而没有加后缀；

3.`.js` 会被解析为Javascript纯文本文件，`.json`会被解析为JSON格式的纯文本文件，` .node`则会被解析为编译后的插件模块，由dlopen进行加载；

4.当没有以`/`或`./`来指向一个文件时，这个模块要么是”核心模块”，要么就是从node_modules文件夹加载的；

5.如果指定的路径不存在，require()会抛出一个code属性为`MODULE_NOT_FOUND`的错误。

6.使用安装的模块（node_modules）的调用机制如下面的例子所示。如果位于`/home/ry/projects/foo.js`的文件调用了`require('bar.js')`，那么node查找的位置依次为：

* /home/ry/projects/node_modules/bar.js
* /home/ry/node_modules/bar.js
* /home/node_modules/bar.js
* /node_modules/bar.js

# 了解Node核心模块

### 1.常用工具 util

`util` 是一个 Node.js 核心模块,提供常用函数的集合  
`var util = require('util')`  

 1.`util.inherits(constructor, superConstructor)`是一个实现对象间的原型继承的函数.

```js
function Base(){
    this.name = 'base';
    this.base = 1991;
    this.sayHello = function(){
        console.log('hello'+this.name);
    };
}
Base.prototype.showName = function(){
    console.log(this.name);
}
function Sub(){
    this.name = 'Sub';
}
util.inherits(Sub, Base);

var objBase = new Base();

objBase.showName(); // base
objBase.sayHello(); // hellobase
console.log(objBase); // Base { name: 'base', base: 1991, sayHello: [Function] }

var objSub = new Sub();
objSub.showName();  // Sub
//objSub.sayHello(); // 报错,不能继承该方法
console.log(objSub);  // Sub { name: 'Sub' }
```

运行结果
```js
base
Hello base
{ name: 'base', base: 1991, sayHello: [Function] }
sub
{ name: 'sub' }
```
注意， Sub  仅仅继承了 Base  在原型中定义的函数，而构造函数内部创造的  base  属
性和  sayHello  函数都没有被  Sub  继承。同时，在原型中定义的属性不会被 console.log 作
为对象的属性输出。如果我们去掉  objSub.sayHello(); 这行的注释，将会看到：
```js
node.js:201
throw e; // process.nextTick error, or 'error' event on first tick
^
TypeError: Object #<Sub> has no method 'sayHello'
at Object.<anonymous> (/home/byvoid/utilinherits.js:29:8)
at Module._compile (module.js:441:26)
at Object..js (module.js:459:10)
at Module.load (module.js:348:31)
at Function._load (module.js:308:12)
at Array.0 (module.js:479:10)
at EventEmitter._tickCallback (node.js:192:40)
```

2.`util.inspect(object,[showHidden],[depth],[colors])`是一个将任意对象转换 为字符串的方法,通常用于调试和错误输出。   

它至少接受一个参数 object,即要转换的对象。

* `showHidden`:是一个可选参数,如果值为true,将会输出更多隐藏信息。
* `depth`: 表示最大递归的层数,如果对象很复杂,你可以指定层数以控制输出信息的多少。如果不指定depth,默认会递归2层,
指定为 null 表示将不限递归层数完整遍历对象。
* `colors`: 如果color 值为 true,输出格式将会以 ANSI 颜色编码,通常用于在终端显示更漂亮 的效果。
```js
var Person = function(){
    this.person = "kongzhi";
    this.toString = function(){
        return this.name;
    }
};
var obj = new Person();

console.log(util.inspect(obj)); //{ person: 'kongzhi', toString: [Function] }
console.log(util.inspect(obj,true));
```
运行结果是：
```js
{ name: 'byvoid', toString: [Function] }
{ toString:
{ [Function]
[prototype]: { [constructor]: [Circular] },
[caller]: null,
[length]: 0,
[name]: '',
[arguments]: null },
name: 'byvoid' }
```

### 3.事件发射器 events

1.`events `模块只提供了一个对象: `events.EventEmitter`。  
EventEmitter 的核心就 是事件发射与事件监听器功能的封装。

```js
var events = require('events');
var emitter = new events.EventEmitter();
// 注册自定义事件
emitter.on('someEvent',function(arg1,arg2){
    console.log("listen1",arg1,arg2); // listen1 kong zhi
});
emitter.on('someEvent',function(arg1,arg2){
   console.log('listen2',arg1,arg2); // listen2 kong zhi
});

// 触发事件
emitter.emit('someEvent','kong','zhi');
```

2.EventEmitter常用的API：

* `EventEmitter.on(event, listener) `为指定事件注册一个监听器,接受一个字符串event 和一个回调函数listener。
* `EventEmitter.emit(event, [arg1], [arg2], [...]) `发射 event 事件,传递若干可选参数到事件监听器的参数表。
* `EventEmitter.once(event, listener) `为指定事件注册一个单次监听器,即监听器最多只会触发一次,触发后立刻解除该监听器。
* `EventEmitter.removeListener(event, listener)` 移除指定事件的某个监听器,listener 必须是该事件已经注册过的监听器。
* `EventEmitter.removeAllListeners([event])` 移除所有事件的所有监听器, 如果指定 event,则移除指定事件的所有监听器。

3.EventEmitter `定义了一个特殊的事件 error`,它包含了“错误”的语义,我们在遇到 异常的时候通常会发射 error 事件。
当 error 被发射时,EventEmitter 规定如果没有响 应的监听器,Node.js 会把它当作异常,退出程序并打印调用栈。
我们一般要为会发射 error 事件的对象设置监听器,避免遇到错误后整个程序崩溃。

```js
var events = require('events');
var emitter = new events.EventEmitter();
emitter.emit('error');
```
运行时会显示以下错误：
```js
node.js:201
throw e; // process.nextTick error, or 'error' event on first tick
^
Error: Uncaught, unspecified 'error' event.
at EventEmitter.emit (events.js:50:15)
at Object.<anonymous> (/home/byvoid/error.js:5:9)
at Module._compile (module.js:441:26)
at Object..js (module.js:459:10)
at Module.load (module.js:348:31)
at Function._load (module.js:308:12)
at Array.0 (module.js:479:10)
at EventEmitter._tickCallback (node.js:192:40)
```

### 4.文件系统 fs

#### 1. fs.readFile

`fs.readFile(filename,[encoding],[callback(err,data)])`是最简单的读取 文件的函数。  
* `filename`必选参数,表示文件的字符编码
* 'encoding' 是回调函数，表示文件的字符编码
* `callback` 是回调函数,用于接收文件的内容。

如果不指定encoding,则callback就是第二个参数。回调函数提供两个参数`err`和`data`,`err`表 示有没有错误发生,`data `是文件内容。如果指定了 encoding,
`data` 是一个解析后的字符 串,否则` data` 将会是以 `Buffe`r 形式表示的二进制数据。

```js
var fs = require('fs');

// 没有指定encoding , data将会是buffer形式表示的二进制数据
fs.readFile('text.txt',function(err,data){
   if(err) {
       console.log(err);
   }else {
       console.log(data);
       // <Buffer 61 61 61 64 73 66 64 66 e9 a2 9d e9 a2 9d e8 80 8c e7 aa 81 e7 84 b6 61 61 61 64 73 66
       // 64 66 e9 a2 9d e9 a2 9d e8 80 8c e7 aa 81 e7 84 b6 61 61 61 64 ... >
   }
});
```
```js
fs.readFile('text.txt','utf-8',function(err,data){
    if(err) {
        console.log(err);
    }else {
        console.log(data);
        //aaadsfdf额额而突然aaadsfdf额额而突然aaadsfdf额额而突然aaadsfdf额额而突然aaadsfdf额额而突然aaadsfdf额额而突然
    }
});
```

#### 2.fs.readFileSync

`fs.readFileSync(filename, [encoding])`是 `fs.readFile 同步`的版本。它接受的参数和 fs.readFile 相同,而读取到的文件内容会以函数返回值的形式返回。如果有错误发生,fs 将会`抛出异常`,你需要使用` try` 和 `catch `捕捉并处理异常.

#### 3. fs.open

基本语法: `fs.open(path, flags, [mode], [callback(err, fd)])`是 POSIX open 函数的 封装,
它接受两个必选参数,path 为文件的路径, flags 可以是以下值。

* `r` :以读取模式打开文件。
* `r+` :以读写模式打开文件。
* `w` :以写入模式打开文件,如果文件不存在则创建。
* `w+` :以读写模式打开文件,如果文件不存在则创建。
* `a` :以追加模式打开文件,如果文件不存在则创建。
* `a+` :以读取追加模式打开文件,如果文件不存在则创建。

`mode`参数用于创建文件时给文件指定权限，默认是`0666`。回调函数将会传递一个文件描述符  fd。
```
文件权限指的是 POSIX 操作系统中对文件读取和访问权限的规范，通常用一个八进制数来表示。例如 0754 表
示文件所有者的权限是 7 （读、写、执行），同组的用户权限是 5 （读、执行），其他用户的权限是 4 （读），
写成字符表示就是 -rwxr-xr--。
```

# ejs模板引擎

`app.set `是 Express 的参数设置工具,接受一个键(key)和一个值(value),可用的参数如下所示
```
1. basepath:基础地址,通常用于 res.redirect() 跳转。
2. views:视图文件的目录,存放模板文件。
3. view engine:视图模板引擎。
4. view options:全局视图参数对象。
5. view cache:启用视图缓存。
6. case sensitive routes:路径区分大小写。
7. strict routing:严格路径,启用后不会忽略路径末尾的“ / ”。
8. jsonp callback:开启透明的 JSONP 支持。
```
来看看app.js 中通过以下两个语句设置了模板引擎和页面模板的位置.
```js
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

为设置存放模板文件的路径 ,其中__dirname为全局变量,存放当前脚本所在目录
表明要使用的模板引擎是 ejs,页面模板在 views 子目录下
```
在routes/index.js的函数下通过如下语句渲染模板引擎,代码如下:
```js
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});
```
* `router.get("/")`的含义是: 截取Get请求方式的url中含有/的请求.
* `res.render `的功能是调用模板引擎,并将其产生的页面直接返回给客户端。它接受 两个参数,第一个是模板的名称,
即 views 目录下的模板文件名,不包含文件的扩展名;第二个参数是传递给模板的数据,用于模板翻译.

index.ejs 内容如下:

```html
<!DOCTYPE html>
 <html>
 <head>
 <title><%= title %></title>
 <link rel='stylesheet' href='/stylesheets/style.css' />
 </head>
 <body>
 <h1><%= title %></h1>
 <p>Welcome to <%= title %></p>
 </body>
 </html>
```

上面代码其中有两处 <%= title %>,用于模板变量显示,它们在模板翻译时会被替换 成 Express,因为 res.render 传递了 { title: 'Express' }。

ejs 有以下3种标签:

* `<% code %>`:JavaScript 代码。
* `<%= code %>`:显示替换过 HTML 特殊字符的内容。
* `<%- code %>`:显示原始 HTML 内容。

对于HTML 页面的<head>部分以及页眉页脚中的大量内容是重复的内容,我们可以这样前面加<%-include header%>,后面加<%-include footer%>.

## 学会使用片段视图(partials)

Express 的视图系统还支持片段视图(partials),它就是一个页面的片段,通常是重复的 内容,用于迭代显示。
通过它你可以将相对独立的页面块分割出去,而且可以避免显式地使 用 for 循环。

1. 安装express-partials。进入项目的根目录运行如下命令:
  `sudo npm install express-partials`
2. 下载成功后.在app.js 中引用此插件  ` var partials = require(‘express-partials’)`;
3. 然后再开启此插件, 在app.js 中 app.set(‘view engine’, ‘ejs’); 代码后添加如下代码:
`app.use(partials());`

下面我们可以来使用片段视图了 partials, 做一个demo如下:  
在 app.js 中新增以下内容:
```js
// 片段视图
 app.get('/list', function(req, res) {
    res.render('list', {
      title: 'List',
      items: [1991, 'byvoid', 'express', 'Node.js']
    });
 });
```
在 views 目录下新建 list.ejs,内容是:  
```html
<!DOCTYPE html>
 <html>
 <head>
 <title><%= title %></title>
 <link rel='stylesheet' href='/stylesheets/style.css' />
 </head>
 <body>
 <ul><%- partial('listitem', items) %></ul>
 </body>
 </html>
```
同时新建 listitem.ejs,内容是:  
```js
<li><%= listitem %></li>
```
重启后 ,在浏览器访问 http://127.0.0.1:3000/list 即可看到 列表页面;  
在源代码看到如下代码:  
```html
<!DOCTYPE html>
 <html>
 <head>
 <title>List</title>
 <link rel='stylesheet' href='/stylesheets/style.css' />
 </head>
 <body>
 <ul><li>1991</li><li>byvoid</li><li>express</li><li>Node.js</li></ul>
 </body>
 </html>
```
`partial` 是一个可以在视图中使用函数,它接受两个参数,第一个是片段视图的名称, 第二个可以是一个对象或一个数组,如果是一个对象,
那么片段视图中上下文变量引用的就 是这个对象;如果是一个数组,那么其中每个元素依次被迭代应用到片段视图。片段视图中
上下文变量名就是视图文件名,例如上面的'listitem'.


# Express

![](http://images2015.cnblogs.com/blog/561794/201604/561794-20160428221209189-1894732044.png)

### 1.app.js

```js
var express = require('express');  // 引入express模块
 var path = require('path');        // 引入path模块
 var favicon = require('serve-favicon');
 var logger = require('morgan');
 var cookieParser = require('cookie-parser');
 var bodyParser = require('body-parser');

// routes 是一个文件夹形式的本地模块,即./routes/index.js,它的功能 是为指定路径组织返回内容,相当于 MVC 架构中的控制器。
 var routes = require('./routes/index');
 var users = require('./routes/users');

// 函数创建了一个应用的实例,后面的所有操作都是针对于这个实例进行的
 var app = express();

// app.set 是 Express 的参数设置工具,接受一个键(key)和一个值(value),可用的参 数如下所示
// 1. basepath:基础地址,通常用于 res.redirect() 跳转。
// 2. views:视图文件的目录,存放模板文件。
// 3. view engine:视图模板引擎。
// 4. view options:全局视图参数对象。
// 5. view cache:启用视图缓存。
// 6. case sensitive routes:路径区分大小写。
// 7. strict routing:严格路径,启用后不会忽略路径末尾的“ / ”。
// 8. jsonp callback:开启透明的 JSONP 支持。

 // view engine setup
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs');

 // Express 依赖于 connect,提供了大量的中间件,可以通过 app.use 启用
 // 1. bodyParser 的功能是解析客户端请求,通常是通过 POST 发送的内容。
 // 2. router 是项目的路由支持。
 // 3. static 提供了静态文件支持。
 // 4. errorHandler 是错误控制器。
 // uncomment after placing your favicon in /public
 //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
 app.use(logger('dev'));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));

 app.use('/', routes);
 app.use('/users', users);

 // catch 404 and forward to error handler
 app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
 });

 // error handlers

 // development error handler
 // will print stacktrace
 if (app.get('env') === 'development') {
 app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
 message: err.message,
 error: err
 });
 });
 }

 // production error handler
 // no stacktraces leaked to user
 app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
 message: err.message,
 error: {}
 });
 });

 module.exports = app;
```

### 2. routes/index.js
routes/index.js 是路由文件,相当于控制器,用于组织展示的内容:

```js
var express = require('express');
 var router = express.Router();
 router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
 });

 module.exports = router;
 // 上面的代码
 router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
 });
```
其中只有一个语句 res.render('index', { title: 'Express' }),功能是 调用模板解析引擎,翻译名为 index 的模板,
并传入一个对象作为参数,这个对象只有一个 2 属性,即 title: 'Express'。

### 3. index.ejs

index.ejs 是模板文件,即 routes/index.js 中调用的模板,内容是:

```js
<!DOCTYPE html>
 <html>
 <head>
 <title><%= title %></title>
 <link rel='stylesheet' href='/stylesheets/style.css' />
 </head>
 <body>
 <h1><%= title %></h1>
 <p>Welcome to <%= title %></p>
 </body>
 </html>
```
其中包含了形如` <%= title %> `的标签,功能是显示引用的 变量,即 res.render 函数第二个参数传入的对象的属性。

### 4. 在bin目录下有一个文件www,内容如下:

```js
// Module dependencies.
var app = require('../app');
var debug = require('debug')('microblog:server');
var http = require('http');

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.
var server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

//Event listener for HTTP server "error" event.
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

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
// Event listener for HTTP server "listening" event.
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

上面的代码最主要做的工作时,创建一个http服务器,并且监听默认的端口号是3000;
```

##### express()内置方法理解如下:

1.`express()`用来创建一个Express的程序。express()方法是express模块导出的顶层方法。如下代码:
```js
var express = require('express');
var app = express();
```

2.`express.static(root, [options]):`
express.static是Express中唯一的内建中间件。它以server-static模块为基础开发，负责托管 Express 应用内的静态资源。
* 参数root为静态资源的所在的根目录。  
```js
例如，假设在 public 目录放置了图片、CSS 和 JavaScript 文件，你就可以：

app.use(express.static(path.join(__dirname, 'public')));

现在，public 目录下面的文件就可以访问了
```

# 理解路由控制

### 1. 工作原理:

访问 http://localhost:3000/,浏览器会向服务器发送请求,app 会 解析请求的路径,调用相应的逻辑。  
`app.use('/', routes);` 它的作用是routes文件夹下 规定路径为`“/” `默认为index,而index.js代码如下:  
```js
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});
```
通 过 `res.render('index', { title: 'Express' }) `调用视图模板 index,传递 title 变量。最终视图模板生成 HTML 页面,返回给浏览器.

### 2. 理解路由规则:
创建一个地址为 /hello 的页面,内容是当前的服务器时间  

1.在route下新建一个文件hello.js文件;代码如下:

```js
var express = require('express');
     var router = express.Router();
     router.get('/', function(req, res, next) {
        res.send('The time is ' + new Date().toString());
     });
     module.exports = router;
```
2. 在app.js头部引入hello模块;添加如下代码:
```js
    var hello = require('./routes/hello');
```
3. 在已有的路由规则 app.use('/users', users); 后面添加一行:
```js
    app.use('/hello', hello);
```
### 3. 理解路径匹配

展示一个用户的个人页面,路径为 /users/[username]  
在app.js加入如下代码:  
```js
// 路径匹配
 app.get('/users/:username', function(req, res) {
   res.send('user: ' + req.params.username);
 });
```







#学习日志 【2016/7/29】

Flex 布局教程：实例篇
====================

## 一、骰子的布局

骰子的一面，最多可以放置9个点。  

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071328.png)  

下面，就来看看Flex如何实现，从1个点到9个点的布局。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071329.png)

如果不加说明，本节的HTML模板一律如下。

```css
<div class="box">
  <span class="item"></span>
</div>
```

上面代码中，div元素（代表骰子的一个面）是Flex容器，span元素（代表一个点）是Flex项目。如果有多个项目，就要添加多个span元素，以此类推。

### 1.1 单项目

首先，只有左上角1个点的情况。Flex布局默认就是首行左对齐，所以一行代码就够了。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071301.png)

```css
.box {
  display: flex;
}
```

设置项目的对齐方式，就能实现居中对齐和右对齐。  

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071302.png)
```css
.box {
  display: flex;
  justify-content: center;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071303.png)

```css
.box {
  display: flex;
  justify-content: flex-end;
}
```

设置交叉轴对齐方式，可以垂直移动主轴。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071304.png)

```css
.box {
  display: flex;
  align-items: center;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071305.png)  

```css
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071306.png)

```css
.box {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071307.png)

```css
.box {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
```

### 1.2 双项目

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071308.png)

```css
.box {
  display: flex;
  justify-content: space-between;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071309.png)

```css
.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071310.png)

```css
.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071311.png)

```css
.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071312.png)  

```css
.box {
  display: flex;
}

.item:nth-child(2) {
  align-self: center;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071313.png)

```css
.box {
  display: flex;
  justify-content: space-between;
}

.item:nth-child(2) {
  align-self: flex-end;
}
```

### 1.3 三项目

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071314.png)

```css
.box {
  display: flex;
}

.item:nth-child(2) {
  align-self: center;
}

.item:nth-child(3) {
  align-self: flex-end;
}
```

### 1.4 四项目 

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071315.png)

```css
.box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-content: space-between;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071316.png)

HTML代码如下。
```html
<div class="box">
  <div class="column">
    <span class="item"></span>
    <span class="item"></span>
  </div>
  <div class="column">
    <span class="item"></span>
    <span class="item"></span>
  </div>
</div>
```
CSS代码如下。
```css
.box {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}

.column {
  flex-basis: 100%;
  display: flex;
  justify-content: space-between;
}
```

### 1.5 六项目

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071317.png)
```css
.box {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071318.png)

```css
.box {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: space-between;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071319.png)

HTML代码如下。
```html
<div class="box">
  <div class="row">
    <span class="item"></span>
    <span class="item"></span>
    <span class="item"></span>
  </div>
  <div class="row">
    <span class="item"></span>
  </div>
  <div class="row">
     <span class="item"></span>
     <span class="item"></span>
  </div>
</div>
```css

CSS代码如下。
.box {
  display: flex;
  flex-wrap: wrap;
}

.row{
  flex-basis: 100%;
  display:flex;
}

.row:nth-child(2){
  justify-content: center;
}

.row:nth-child(3){
  justify-content: space-between;
}
```

### 1.6 九项目

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071320.png)

```css
.box {
  display: flex;
  flex-wrap: wrap;
}
```

## 二、网格布局

### 2.1 基本网格布局

最简单的网格布局，就是平均分布。在容器里面平均分配空间，跟上面的骰子布局很像，但是需要设置项目的自动缩放。  

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071321.png)

HTML代码如下。
```html
<div class="Grid">
  <div class="Grid-cell">...</div>
  <div class="Grid-cell">...</div>
  <div class="Grid-cell">...</div>
</div>
```

CSS代码如下。 
```css
.Grid {
  display: flex;
}

.Grid-cell {
  flex: 1;
}
```

### 2.2 百分比布局

某个网格的宽度为固定的百分比，其余网格平均分配剩余的空间。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071322.png)

HTML代码如下。

```html
<div class="Grid">
  <div class="Grid-cell u-1of4">...</div>
  <div class="Grid-cell">...</div>
  <div class="Grid-cell u-1of3">...</div>
</div>
```
CSS代码如下。 
```css
.Grid {
  display: flex;
}

.Grid-cell {
  flex: 1;
}

.Grid-cell.u-full {
  flex: 0 0 100%;
}

.Grid-cell.u-1of2 {
  flex: 0 0 50%;
}

.Grid-cell.u-1of3 {
  flex: 0 0 33.3333%;
}

.Grid-cell.u-1of4 {
  flex: 0 0 25%;
}
```

## 三、圣杯布局

圣杯布局（Holy Grail Layout）指的是一种最常见的网站布局。页面从上到下，分成三个部分：头部（header），躯干（body），尾部（footer）。其中躯干又水平分成三栏，从左到右为：导航、主栏、副栏。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071323.png)

HTML代码如下。

```html
<body class="HolyGrail">
  <header>...</header>
  <div class="HolyGrail-body">
    <main class="HolyGrail-content">...</main>
    <nav class="HolyGrail-nav">...</nav>
    <aside class="HolyGrail-ads">...</aside>
  </div>
  <footer>...</footer>
</body>
```

CSS代码如下。

```css
.HolyGrail {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

header,
footer {
  flex: 1;
}

.HolyGrail-body {
  display: flex;
  flex: 1;
}

.HolyGrail-content {
  flex: 1;
}

.HolyGrail-nav, .HolyGrail-ads {
  /* 两个边栏的宽度设为12em */
  flex: 0 0 12em;
}

.HolyGrail-nav {
  /* 导航放到最左边 */
  order: -1;
}
```

如果是小屏幕，躯干的三栏自动变为垂直叠加。

```css
@media (max-width: 768px) {
  .HolyGrail-body {
    flex-direction: column;
    flex: 1;
  }
  .HolyGrail-nav,
  .HolyGrail-ads,
  .HolyGrail-content {
    flex: auto;
  }
}
```

## 四、输入框的布局

我们常常需要在输入框的前方添加提示，后方添加按钮。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071324.png)

HTML代码如下。
```html

<div class="InputAddOn">
  <span class="InputAddOn-item">...</span>
  <input class="InputAddOn-field">
  <button class="InputAddOn-item">...</button>
</div>
```

CSS代码如下。
```css
.InputAddOn {
  display: flex;
}

.InputAddOn-field {
  flex: 1;
}
```

## 五、悬挂式布局

有时，主栏的左侧或右侧，需要添加一个图片栏。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071325.png)

HTML代码如下。
```html
<div class="Media">
  <img class="Media-figure" src="" alt="">
  <p class="Media-body">...</p>
</div>
```

CSS代码如下。
```css
.Media {
  display: flex;
  align-items: flex-start;
}

.Media-figure {
  margin-right: 1em;
}

.Media-body {
  flex: 1;
}
```

## 六、固定的底栏

有时，页面内容太少，无法占满一屏的高度，底栏就会抬高到页面的中间。这时可以采用Flex布局，让底栏总是出现在页面的底部。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071326.png)

HTML代码如下。
```html
<body class="Site">
  <header>...</header>
  <main class="Site-content">...</main>
  <footer>...</footer>
</body>
```

CSS代码如下。
```css
.Site {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.Site-content {
  flex: 1;
}
```

## 七，流式布局

每行的项目数固定，会自动分行。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071330.png)

CSS的写法。
```css
.parent {
  width: 200px;
  height: 150px;
  background-color: black;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
}

.child {
  box-sizing: border-box;
  background-color: white;
  flex: 0 0 25%;
  height: 50px;
  border: 1px solid red;
}
```

#学习日志 【2016/7/28】(往后日志全部发布到个人博客)

Flex 布局教程：语法篇
=====================
  网页布局（layout）是CSS的一个重点应用。  
  ![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071001.gif)  
  布局的传统解决方案，基于盒状模型，依赖 display属性 + position属性 + float属性。它对于那些特殊布局非常不方便，比如，垂直居中就不容易实现。  
  ![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071002.png)  
####浏览器支持  
  ![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071003.jpg)  

## 一、Flex布局是什么？
  Flex是Flexible Box的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

  任何一个容器都可以指定为Flex布局。
```css
.box{
  display: flex;
}
```
行内元素也可以使用Flex布局。
```css
.box{
  display: inline-flex;
}
```
Webkit内核的浏览器，必须加上-webkit前缀。
```css
.box{
  display: -webkit-flex; /* Safari */
  display: flex;
}
```
注意，设为Flex布局以后，子元素的float、clear和vertical-align属性将失效。

## 二、基本概念
  采用Flex布局的元素，称为Flex容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为Flex项目（flex item），简称"项目"。

  ![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png)  

  容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。

项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。

## 三、容器的属性
  以下6个属性设置在容器上。

* flex-direction  
* flex-wrap
* flex-flow
* justify-content
* align-items
* align-content

### 3.1 flex-direction属性

  `flex-direction`属性决定主轴的方向（即项目的排列方向）。  
```css
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
```
![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071005.png)  

它可能有4个值。  

* row（默认值）：主轴为水平方向，起点在左端。
* row-reverse：主轴为水平方向，起点在右端。
* column：主轴为垂直方向，起点在上沿。
* column-reverse：主轴为垂直方向，起点在下沿。

### 3.2 flex-wrap属性

默认情况下，项目都排在一条线（又称"轴线"）上。flex-wrap属性定义，如果一条轴线排不下，如何换行。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071006.png)  
```css
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```
它可能取三个值。

（1）nowrap（默认）：不换行。  
![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071007.png)  

（2）wrap：换行，第一行在上方。  
![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071008.jpg)  

（3）wrap-reverse：换行，第一行在下方。  
![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071009.jpg)  

### 3.3 flex-flow

`flex-flow`属性是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`。

```css
.box {
  flex-flow: <flex-direction> || <flex-wrap>;
}
```
### 3.4 justify-content属性

justify-content属性定义了项目在主轴上的对齐方式。  
```css
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```
![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071010.png)  

它可能取5个值，具体对齐方式与轴的方向有关。下面假设主轴为从左到右。  

* flex-start（默认值）：左对齐
* flex-end：右对齐
* center： 居中
* space-between：两端对齐，项目之间的间隔都相等。
* space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

### 3.5 align-items属性

`align-items`属性定义项目在交叉轴上如何对齐。  
```css
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```
![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071011.png)  

它可能取5个值。具体的对齐方式与交叉轴的方向有关，下面假设交叉轴从上到下。  

* flex-start：交叉轴的起点对齐。
* flex-end：交叉轴的终点对齐。
* center：交叉轴的中点对齐。
* baseline: 项目的第一行文字的基线对齐。
* stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

### 3.6 align-content属性

align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。
  
```css
.box {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071012.png)  

该属性可能取6个值。  

* flex-start：与交叉轴的起点对齐。
* flex-end：与交叉轴的终点对齐。
* center：与交叉轴的中点对齐。
* space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
* space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
* stretch（默认值）：轴线占满整个交叉轴。

## 四、项目的属性

以下6个属性设置在项目上。  

* order
* flex-grow
* flex-shrink
* flex-basis
* flex
* align-self

### 4.1 order属性

`order`属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。  

```css
.item {
  order: <integer>;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071013.png)  

### 4.2 flex-grow属性

`flex-grow`属性定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大。  

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071014.png)  

如果所有项目的`flex-grow`属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的`flex-grow`属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。

### 4.3 flex-shrink属性

`flex-shrink`属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
```css
.item {
  flex-shrink: <number>; /* default 1 */
}
```
![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071015.jpg)   

如果所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小。如果一个项目的`flex-shrink`属性为0，其他项目都为1，则空间不足时，前者不缩小。
负值对该属性无效。  

### 4.4 flex-basis属性

`flex-basis1属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小。  

```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

它可以设为跟`width`或`height`属性一样的值（比如350px），则项目将占据固定空间。  

### 4.5 flex属性

`flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。

```css
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。  
建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。  

### 4.6 align-self属性

`align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071016.png)  

该属性可能取6个值，除了auto，其他都与align-items属性完全一致。

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










