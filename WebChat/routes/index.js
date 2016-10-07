var express = require('express');
var router = express.Router();
var config = require('../config');
var dbHelper = require('../db/dbHelper');

/* GET home page. */
router.get('/index', function(req, res, next) {
    var id = req.session.user._id;
    dbHelper.searchFriend(req, function (success, data) {
            res.render('index', {
                entries: data,
                user: req.session.user
            });
    });
});

router.get('/chatRoom/:id', function(req, res, next) {
    var id = req.params.id;
    dbHelper.matchUser(req, id, function (success, data) {
        res.render('chatRoom', {
            title: 'Express' ,
            user: req.session.user,
            friend: data
        });
    });
});

router.post('/addFriend', function(req, res, next) {
    //添加好友
    console.log("添加好友");
    dbHelper.addFriend(req.body, function (success, doc) {
        res.send(doc);
    });
});

router.post('/addMessage', function(req, res, next) {
    //添加新消息
    console.log("添加新消息");
    dbHelper.addMessage(req.body, function (success, doc) {
        res.send(doc);
    });
});


module.exports = router;
