var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');

router.post('/addQuestion', function(req, res, next) {
    dbHelper.addQuestion(req.body, function (success, doc) {
        res.send(doc);
    })
});
//获取单个题目内容
router.post('/getQuestionOne', function(req, res, next) {
    var id = req.body._id;
    dbHelper.getQuestionOne(id, function (success, doc) {
        res.send(doc);
    })
});
//更新题目内容
router.post('/updateQuestionCtn', function(req, res, next) {
    dbHelper.updateQuestion(req.body, function (success, doc) {
        res.send(doc);
    })
});
//获取学生列表
router.post('/getAllStudents', function(req, res, next) {
    dbHelper.getAllStudents(req.body, function (success, doc) {
        res.send(doc);
    })
});
//获取题目列表
router.post('/getQuestionList', function (req, res, next) {
    dbHelper.getAllQuestions(req, function (success, doc) {
        res.send(doc);
    }); 
});
//保存分数
router.post('/saveScore', function (req, res, next) {
    dbHelper.saveScore(req.body, function (success, doc) {
        res.send(doc);
    });
});

module.exports = router;
