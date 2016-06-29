var express = require('express');
var router = express.Router();
var userSchema = require('../db/schema/user');
var dbHelper = require('../db/dbHelper');


router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express', layout: 'main' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { layout: 'lg' });
});

router.post('/login', function(req, res, next) {
  dbHelper.findUsr(req.body, function (success, doc) {
    res.send(doc);
  })
});
router.get('/', function(req, res, next) {
	//res.render('index', { title: 'Express' });
	var mongoose = require('mongoose');

	mongoose.connect('mongodb://127.0.0.1:27017/test');

	var Schema = mongoose.Schema;

	var blogSchema = new Schema({
		title:  String,
		author: String,
		body:   String
	});

	var Blog = mongoose.model('Blog', blogSchema);

	var User = mongoose.model('User', userSchema);

	var user = new User({
		username: 'hqy',
		password: '123'
	})
	user.save(function (err) {
		if(err){
			console.log('保存失败');
		}
		console.log('success');
	})

// 	blog = new Blog({
// 		title: '1',
// 		author: '1',
// 		body:   '1'
// 	})
//
// 	blog.save(function(err, doc) {
// 		if (err) {
// 			console.log('error')
// 		} else {
// 			console.log(doc)
// 		}
// 	})
//
// 	//增加数据
// 	var blog1 = new Blog({
// 		title: '3',
// 		author: '3',
// 		body: '3'
// 	})
// 	blog1.save(function (err) {
// 		if(err){
// 			console.log('保存失败');
// 		}
// 		console.log('success');
// 	})

// //修改数据
// 	var conditions = {title: '2'};
// 	var update = {$set:{author: '222'}};
// 	Blog.update(conditions,update,function(err,date) {
// 		if(err){
// 			console.log(err);
// 		}
// 		console.log('date');
// 	})
//
//删除数据
// 	Blog.remove({title: '1'},function(err) {
// 		if(err){
// 			console.log(err);
// 		}
// 		console.log('删除成功');
// 	})

// //查找数据
// 	Blog.find({"title": 2},function (err,docs) {
// 		if(err){
// 			console.log(err);
// 		}
// 		console.log(docs);
// 	})
//
})

module.exports = router;
