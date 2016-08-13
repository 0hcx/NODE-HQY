var express = require('express');
var fs = require('fs');
var NodePDF = require('nodepdf');

var router = express.Router();
var dbHelper = require('../db/dbHelper');
var config = require('../config');


router.get('/blogs', function(req, res, next) {
	var nameKey = "最新文章";
	dbHelper.findNews(req, function (success, data) {
		res.render('blogs', {
			title: nameKey,
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			user: req.session.user
		});
	})
});

router.get('/learningLogs', function(req, res, next) {
	var nameKey = "学习日志";
	dbHelper.findVariousNews(req, nameKey, function (success, data) {
		res.render('blogs', {
			title: nameKey,
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			user: req.session.user
		});
	})
});

router.get('/word', function(req, res, next) {
	var nameKey = "不知所言";
	dbHelper.findVariousNews(req, nameKey, function (success, data) {
		res.render('blogs', {
			title: nameKey,
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			user: req.session.user
		});
	})
});

router.get('/studyAndThink', function(req, res, next) {
	var nameKey = "学有所思系列";
	dbHelper.findVariousNews(req, nameKey, function (success, data) {
		res.render('blogs', {
			title: nameKey,
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			user: req.session.user
		});
	})
});

//search
router.get('/search', function (req, res, next) {
	dbHelper.search(req, req.query.keyword, function (success, data) {
		res.render('searchResults', {
			title: req.query.keyword,
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			user: req.session.user
		});
	})
});

//moocs
router.get('/moocs', function(req, res, next) {
	dbHelper.findMooc(req, function (success, data) {

		res.render('./moocs', {
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			user: req.session.user
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
				user: req.session.user
			});
		});
	});
});

router.get('/mooc/:id', function(req, res, next) {
	var id = req.params.id;
	dbHelper.findMoocOne(  id,  function (success, doc) {
		res.render('mooc',{
			entries: doc,
			user: req.session.user
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
