var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var fs = require('fs');
var NodePDF = require('nodepdf');
var config = require('../config');

//注册
router.get('/register', function(req, res, next) {
	res.render('register',{ layout: 'lg' });
});

router.post('/register', function(req, res, next) {
	dbHelper.addUser(req.body, function (success, doc) {
		res.send(doc);
	})
});
module.exports = router;
