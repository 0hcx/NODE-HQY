var express = require('express');
var router = express.Router();
var config = require('../config');
var dbHelper = require('../db/dbHelper');

/* GET home page. */
router.get('/index', function(req, res, next) {
    var id = req.session.user._id;
    dbHelper.searchAllUsers(req, function (success, data) {
        dbHelper.matchUser(id, function (success, doc) {
            // console.log(doc.friends);
            res.render('index', {
                entries: data.results,
                userCount: data.count,
                user: doc
            });
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
router.post('/updateMsgStatus', function (req, res, next) {
   //标记消息已阅读
    console.log("标记消息已阅读");
    dbHelper.updateMsgStatus(req.body, function (success, doc) {
        res.send(doc);
    });
});

router.get('/chatRoom/:id', function(req, res, next) {
    var userId = req.session.user._id;
    var friendId = req.params.id;
    dbHelper.findFriend(userId, friendId, function (success, data) {
        // console.log(data.results);
        res.render('chatRoom', {
            title: 'Express' ,
            user: req.session.user,
            // friend: data
            friend: data.friend,
            message: data.results
        });
    });
});


module.exports = router;
