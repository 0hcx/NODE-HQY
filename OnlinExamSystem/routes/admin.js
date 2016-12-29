var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var xlsx = require('node-xlsx');
var fs = require('fs');

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
//获取学生成绩列表
router.post('/getStuGrades', function(req, res, next) {
    dbHelper.getStudentGrade(req.body, function (success, doc) {
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
//设置考试时间
router.post('/setExamTime', function (req, res, next) {
    dbHelper.setExamTime(req.body, function (success, doc) {
        res.send(doc);
    });
});
//statistic
router.post('/statistic', function (req, res, next) {
    dbHelper.statisticScore(req.body, function (success, doc) {
        res.send(doc);
    });
});
//导出EXCEL文件
router.post('/exportExcel', function(req, res, next){
    var id = req.body.idList;
    var name = req.body.nameList;
    var type = req.body.type;
    var data = [];
    var i = 0;
    if(type == "STUDENTS") {
        data[0] = ["学生学号", "学生姓名"];
        for(i = 0; i < id.length; i++) {
            data[i + 1] = [id[i], name[i]];
        }
        var buffer1 = xlsx.build([{name: "studentList", data: data}]);
        fs.writeFileSync('./public/exportFile/test_scores.xlsx', buffer1, 'binary');
    } else if (type == "GRADE"){
        var grade = req.body.gradeList;
        data[0] = ["序号", "学生学号", "学生姓名", "成绩"];
        for(i = 0; i < id.length; i++) {
            data[i + 1] = [i+1, id[i], name[i], grade[i]];
        }
        var buffer2 = xlsx.build([{name: "studentList", data: data}]);
        fs.writeFileSync('./public/exportFile/grades.xlsx', buffer2, 'binary');
    }


    res.send('export successfully!');
});
//导入学生信息EXCEL文件
router.post('/importExcel', function(req, res, next){
    var workbook = xlsx.parse("./public/exportFile/student_list.xlsx");
    var worksheet = workbook[0].data;
    console.log("导入中...");
    dbHelper.batchAddStudent(worksheet, function (success, doc) {
        res.send(doc);
    });
    console.log("导入完成");
});

module.exports = router;
