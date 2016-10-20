var express = require('express');
var router = express.Router();
var config = require('../config');
var dbHelper = require('../db/dbHelper');

/* GET home page. */
router.get('/index', function(req, res, next) {
    var id = req.session.user._id;
    dbHelper.searchAllUsers(req, function (success, data) {
        dbHelper.getFriends(id, function (success, doc) {
            res.render('new', {
                entries: data.results,
                userCount: data.count,
                user: req.session.user,
                friendList: doc
            });
        });
    });
});
//获取历史聊天记录
router.post('/getHistoryMsg', function (req, res, next) {
    dbHelper.findHistoryMsg(req.body, function (success, doc) {
        res.send(doc);
    })
});

router.post('/addFriend', function(req, res, next) {
    //添加好友
    dbHelper.addFriend(req.body, function (success, doc) {
        res.send(doc);
    });
});
//
router.post('/addMessage', function(req, res, next) {
    dbHelper.addMessage(req.body, function (success, doc) {
        res.send(doc);
    });
});

router.post('/getUnreadMsg', function(req, res, next) {
    dbHelper.getUnreadMsg(req.body, function (success, doc) {
        res.send(doc);
    });
});
router.post('/updateMsgStatus', function (req, res, next) {
    dbHelper.updateMsgStatus(req.body, function (success, doc) {
        res.send(doc);
    });
});

module.exports = router;
