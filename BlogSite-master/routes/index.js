var express = require('express');
var fs = require('fs');
var NodePDF = require('nodepdf');

var router = express.Router();
var dbHelper = require('../db/dbHelper');
var config = require('../config');


router.get('/blogs', function(req, res, next) {
	dbHelper.findNews(req, function (success, data) {
		res.render('blogs', {
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			user: req.session.user.username
		});
	})
});

// router.post('/addComment', function(req, res, next) {
// 	//发表评论
// 	console.log("发表评论1");
// 	dbHelper.addComment(req.body, function (success, doc) {
// 		res.send(doc);
// 	})
// });

router.get('/moocs', function(req, res, next) {
	dbHelper.findMooc(req, function (success, data) {

		res.render('./moocs', {
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			user: req.session.user.username
		});
	});
});

router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	// console.log("userhh: ");
	// console.log(req.session.user.username);
	dbHelper.findNewsOne(req, id, function (success, data) {
		dbHelper.findComment(id, function (success, comments) {
			res.render('blog',{
				entries: data,
				comments: comments,
				user: req.session.user.username
			});
		});
	});
});

router.get('/mooc/:id', function(req, res, next) {
	var id = req.params.id;
	dbHelper.findMoocOne(  id,  function (success, doc) {
		res.render('mooc',{
			entries: doc,
			user: req.session.user.username
		});
	});
});


router.post('/moocGetChapContentOnly', function(req, res, next) {

	var moocId    = req.body.moocId;
	var chapId    = req.body.chapId;
	var preChapId = req.body.preChapId;
	var content   = req.body.content;

	dbHelper.findMoocChapContentOnly( moocId, chapId, preChapId, content, function (success, doc) {
		res.send(doc);
	});
});

module.exports = router;
