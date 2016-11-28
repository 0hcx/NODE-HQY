var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', {
      user: req.session.user
  });
});
router.get('/addStudent', function(req, res, next) {
  res.render('admin/addStudent', {
      user: req.session.user
  });
});
router.get('/addQuestion', function(req, res, next) {
  res.render('admin/addQuestion', {
      user: req.session.user
  });
});
//进入学生答题界面
router.get('/indexStudent', function(req, res, next) {
    dbHelper.getAllQuestions(req, function (success, data) {
        res.render('student/answerArea', {
            user: req.session.user,
            entries: data.results,
            questionCount: data.count,
            layout: 'mainStudent'
        });
    });
});
//获取学生列表
router.get('/studentList', function(req, res, next) {
  dbHelper.getAllStudents(req, function (success, data) {
      res.render('admin/studentList', {
          user: req.session.user
      });
    });
});
//删除学生
router.get('/studentDelete/:id', function(req, res, next) {
    var id = req.params.id;
    dbHelper.deleteStudent(id, function (success, data) {
        res.redirect("/p/studentList");
    })
});
//获取题目列表
router.get('/questionList', function(req, res, next) {
    dbHelper.getAllQuestions(req, function (success, data) {
        res.render('admin/questionList', {
            user: req.session.user,
            entries: data.results,
            questionCount: data.count
        });
    });
});
//进入查看学生考试状态页面
router.get('/studentStatus', function(req, res, next) {
    res.render('admin/studentStatus', {
        user: req.session.user
    });
});
//设置考试时间
router.get('/setExamTime', function(req, res, next) {
    res.render('admin/setExamTime', {
        user: req.session.user
    });
});
//阅卷
router.get('/markPaper/:id', function(req, res, next) {
    var id = req.params.id;
    dbHelper.getUserInfo(id,  function (success, doc) {
        res.render('admin/markPaper', {
            user: req.session.user,
            student: doc
        });
    });
});



//学生保存答题内容
router.post('/saveAnswer', function(req, res, next) {
    dbHelper.saveAnswer(req.body, function (success, doc) {
        res.send(doc);
    })
});
//获取学生答题内容
router.post('/getAnswerOne', function (req, res, next) {
    dbHelper.getAnswerOne(req.body, function (success, doc) {
        res.send(doc);
    })
});
//更新状态
router.post('/updateStatus', function (req, res, next) {
    dbHelper.updateStatus(req.body, function (success, doc) {
        res.send(doc);
    })
});
//获取考试时间
router.post('/getExamTime', function (req, res, next) {
   dbHelper.getExamTime(req.body, function (success, doc) {
       res.send(doc);
   })
});

module.exports = router;
