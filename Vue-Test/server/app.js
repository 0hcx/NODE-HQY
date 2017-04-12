var express = require('express');
var app = express();
var cors = require('cors');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session     = require('express-session');
var dbHelper = require('./db/dbHelper');
// var authority = require('./db/authority');
var jwt = require('jwt-simple');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// app.set('jwtTokenSecret', 'vue-exercise');

//加入session支持
app.use(session({
  name:'blogOfHiQiyang',
  cookie: { maxAge: 60000,
      secure: false
   },
  secret: 'huqiyang-web-node-secret-key',
  resave: true,
  saveUninitialized: true
}));

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('app listening at http://%s:%s', host, port);
});

// 跨域
app.use(cors({
	origin: ['http://localhost:8090'],
	methods: ['GET', 'POST']
}))

app.use('/api', require('./routes/api'));

// login
// app.get('/isLogin', authority.isAuthenticated);

module.exports = app;