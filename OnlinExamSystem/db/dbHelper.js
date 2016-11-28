var mongoose = require('./db.js');
var entries = require('./jsonRes');
var User = require('./schema/user');
var Question = require('./schema/question');
var Answer = require('./schema/answer');
var ExamTime = require('./schema/examTime');
var async = require('async');
var _ = require('underscore');
var Schema = mongoose.Schema;

exports.findUsr = function(data, cb) {
    User.findOne({
        userId: data.usr
    }, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : '';
        if (err) {
            console.log(err)
        } else if (doc === null) {
            entries.code = 99;
            entries.msg = '用户名错误！';
            cb(false, entries);
        } else if (user.password !== data.pwd) {
            entries.code = 99;
            entries.msg = '密码错误！';
            cb(false, entries);
        } else if (user.password === data.pwd) {
            entries.data = user;
            entries.code = 0;
            cb(true, entries);
        }
    });
};
//添加学生
exports.addUser = function(data, cb) {
    //检查用户名是否已经存在
    User.findOne({
        userId: data.usr
    }, function(err, doc) {
        if (err) {
            console.log(err)
        } else if (doc != null) {
            entries.code = 99;
            entries.msg = '该用户名已存在！';
            cb(false, entries);
        } else if (doc == null) {
            //不存在则添加
            var user = new User({
                userId: data.usr,
                username: data.username,
                password: data.pwd,
                category: "STUDENT",
                status: "INIT"  //状态设置为初始化
            });
            user.save(function(err, doc) {
                console.log(doc._id);
                if (err) {
                    cb(false, err);
                } else {
                    cb(true, entries);
                }
            })
        }
    })
};
//获取学生列表
exports.getAllStudents = function (req, cb) {
    var $student = {};
    User.find({"category": "STUDENT"}, function (err, data) {
        var studentList = new Array();
        for (var i = 0; i < data.length; i++) {
            studentList.push(data[i].toObject());
        }
        $student.results = _.sortBy(studentList, function (item) {
            return parseInt(item.userId);
        });
        $student.count = studentList.length;
        cb(true, $student);
    })
};
//更新status
exports.updateStatus = function (data, cb) {
    User.findOne({"_id": data.userId}, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : '';
        if(user.status !== "SUBMIT") {
            User.update({"_id": data.userId}, {$set :{
                "status": data.status
            }
            },function(err, result){
                if(err) {
                    entries.code = 99;
                    console.log(error);
                }
                // if(data.status === "SUBMIT") {
                    cb(true, entries);

            })
        }
    });
};
//添加题目
exports.addQuestion = function(data, cb) {
    var question = new Question({
        content: data.content,
        score: data.score
    });
    question.save(function (err, doc) {
        if(err) {
            entries.code = 99;
            console.log("add question fail !");
        }
        cb(true, entries);
    });
};
//获取题目列表
exports.getAllQuestions = function (req, cb) {
    var $question = {};
    Question.find({}, function (err, data) {
        var questionList = new Array();
        for (var i = 0; i < data.length; i++) {
            questionList.push(data[i].toObject());
        }
        $question.results = questionList;
        $question.count = questionList.length;
        cb(true, $question);
    })
};
//获取指定ID的单个题目内容
exports.getQuestionOne = function (id, cb) {
    Question.findOne({_id: id}, function (err, doc) {
        var question = (doc !== null) ? doc.toObject() : '';
        cb(true, question);
    })
};
//更新题目内容
exports.updateQuestion = function (data, cb) {
    Question.update({"_id": data._id}, {$set :{
        "content": data.content,
        "score": data.score
    }
    },function(error, result){
        if(error) {
            entries.code = 99;
            console.log(error);
        }
        cb(true, entries);
    })
};
//保存学生的答题内容
exports.saveAnswer = function (data, cb) {
    Answer.findOne({"userId": data.userId, "questionId": data.questionId}, function (err, doc) {
        if(doc === null) {
            var answer = new Answer({
                userId: data.userId,
                questionId: data.questionId,
                answerCtn: data.answerCtn
            });
            answer.save(function (err, doc) {
                if(err) {
                    entries.code = 99;
                    console.log("save answer fail!");
                }
                cb(true, entries);
            });
        } else {
            Answer.update({"userId": data.userId, "questionId": data.questionId}, {$set :{
                "answerCtn": data.answerCtn
            }
            }, function(error, result){
                if(error) {
                    entries.code = 99;
                    console.log("update answer fail!");
                }
                cb(true, entries);
            })
        }
    })
};
//获得学生答题内容
exports.getAnswerOne = function (data, cb) {
  Answer.findOne({"userId": data.userId, "questionId": data.questionId}, function (err, doc) {
      var answer = (doc !== null) ? doc.toObject() : "99";
      cb(true, answer);
  })  
};
//获取单个学生信息
exports.getUserInfo = function (id, cb) {
    User.findById(id, function (err, doc) {
        if(err) {
            console.log(err);
        } else {
            var user = (doc !== null) ? doc.toObject() : "";
            cb(true, user);
        }
    })
};
//保存分数
exports.saveScore = function (data, cb) {
    console.log(data);
    Answer.update({"userId": data.userId, "questionId": data.questionId}, {$set: {
        "score": data.score
    }
    }, function (err, result) {
        if(err) {
            entries.code = 99;
            console.log(err);
        }
        cb(true, entries);
    })
};
//删除学生
exports.deleteStudent = function(id, cb) {
    //删除用户表
    User.findById(id, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                if (err) {
                    entries.msg = err;
                    cb(false, entries);
                } else {
                    entries.msg = '删除新闻成功！';
                    cb(true, entries);
                }
            });
        }
    });
    //删除学生答题表
    Answer.findById(id, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
};
//删除题目
exports.deleteQuestion = function(id, cb) {
    Question.findById(id, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                if (err) {
                    entries.msg = err;
                    cb(false, entries);
                } else {
                    entries.msg = '删除新闻成功！';
                    cb(true, entries);
                }
            });
        } else {
            next(err);
        }
    });
};
//批量添加学生
exports.batchAddStudent = function (data, cb) {
    async.waterfall([
        function (cb) {
            User.remove({"category": "STUDENT"}, function (err, doc) {
                cb(err, entries);
            });
        },
        function (result, cb) {
            for(var i = 1; i < data.length; i++) {
                var user = new User({
                    userId: data[i][0],
                    username: data[i][1],
                    password: 123456,
                    category: "STUDENT",
                    status: "INIT"  //状态设置为初始化
                });
                user.save(function(err, doc) {
                    if (err) {
                        entries.code = 99;
                        console.log("批量添加失败");
                        cb(err, entries);
                    }
                });
            }
            cb(null, entries);
        }
    ], function (err, result) {
        cb(true, result);
    });
};
//设置考试时间
exports.setExamTime =function (data, cb) {
    ExamTime.findOne({"subject": data.subject}, function (err, doc) {
        if(doc === null) {
            var examTime = new ExamTime({
                subject: data.subject,
                startTime: data.startTime,
                endTime: data.endTime
            });
            examTime.save(function(err, doc) {
                if (err) {
                    entries.code = 99;
                    console.log("设置失败");
                }
                cb(true, entries);
            });
        } else {
            ExamTime.update({"subject": data.subject}, {$set: {
                    startTime: data.startTime,
                    endTime: data.endTime
            }},
            function (err, result) {
                if(err) {
                    entries.codev = 99;
                    console.log("更新时间失败");
                }
                cb(true, entries);
            })
        }
    });
};
//获取考试时间
exports.getExamTime = function (data, cb) {
    ExamTime.findOne({"subject": data.subject}, function (err, doc) {
        if(err) {
            console.log(err);
        } else {
            var time = (doc !== null) ? doc.toObject() : '';
            cb(true, time);
        }
    })
};