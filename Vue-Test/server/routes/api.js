var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');

// register
router.post('/register', function(req, res, next) {
    dbHelper.addUser(req.body, function (success, doc) {
        res.send(doc);
    })
});

// login
router.post('/login', function(req, res, next) {
    dbHelper.findUser(req.body, function (success, doc) {
        res.send(doc);
    })
});

// isLogin
router.post('/isLogin', function(req, res, next) {
    dbHelper.authority(req, function (success, doc) {
        res.send(doc)
    })
});

// getCaptcha
router.post('/getCaptcha', function(req, res, next) {
    dbHelper.sendCaptcha(req.body, function (success, doc) {
        res.send(doc)
    })
});

// getCaptcha
router.post('/searchJobs', function(req, res, next) {
    dbHelper.findJobs(req.body, function (success, doc) {
        res.send(doc)
    })
});

// addStarJob
router.post('/addStarJob', function(req, res, next) {
    dbHelper.addStar(req.body, function (success, doc) {
        res.send(doc)
    })
});

// cancleStarJob
router.post('/cancleStar', function(req, res, next) {
    dbHelper.cancleStar(req.body, function (success, doc) {
        res.send(doc)
    })
});

// getStarJob
router.post('/getStarJob', function(req, res, next) {
    dbHelper.getStarJob(req.body, function (success, doc) {
        res.send(doc)
    })
});

// getChart
router.post('/getChartData', function(req, res, next) {
    dbHelper.getJobChart(req.body, function (success, doc) {
        res.send(doc)
    })
});

// addFollowComp
router.post('/addFollowComp', function(req, res, next) {
    dbHelper.addFollow(req.body, function (success, doc) {
        res.send(doc)
    })
});


module.exports = router;