// var entries = require('./jsonRes');
// var mongoose = require('./db.js');
// var User = require('./schema/user');
// var News = require('./schema/news');
// var webHelper = require('../lib/webHelper');
// var async = require('async');
// var md = webHelper.Remarkable();
var entries = require('./jsonRes');
var mongoose = require('./db.js');
var User = require('./schema/user');
var News = require('./schema/news');
var Mooc = require('./schema/mooc');
var Chapter = require('./schema/chapter');
var _ = require('underscore');


var webHelper = require('../lib/webHelper');
var config = require('../config');
var async = require('async');
var md = webHelper.Remarkable();

var PAGE_SIZE = 5;

exports.findUsr = function(data, cb) {

    User.findOne({
        username: data.usr
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
    })
}

exports.addUser = function(data, cb) {
    
    //检查用户名是否已经存在
    User.findOne({
        username: data.usr
    }, function(err, doc) {
        if (err) {
            console.log(err)
        } else if (doc != null) {
            entries.code = 99;
            entries.msg = '该用户名已存在！';
            cb(false, entries);
        } else if (doc==null) {
            //不存在则添加
            var user = new User({
                username: data.usr,
                password: data.pwd,
                email: data.email,
                adr: data.adr
            });

            user.save(function(err, doc) {
                if (err) {
                    cb(false, err);
                    console.log("注册失败！");
                } else {
                    console.log("注册成功！");
                    cb(true, entries);
                }
            })
        }
    })

};

//添加新闻
exports.addNews = function(data, cb) {
	
	//将markdown格式的新闻内容转换成html格式
	data.content = md.render(data.content);
	
    var news = new News({
        title: data.title,
        content: data.content,
        author:data.id,
        newThumb: data.newThumb
    });

    news.save(function(err,doc){
        if (err) {
            // cb(false,err);
	        entries.code = 99;
	        entries.msg = err;
	        cb(false,entries);
        }else{
            // cb(true,entries);
	        entries.code = 0;
	        entries.msg = '发布新闻成功！';
	        entries.data = doc.toObject();
	        cb(true,entries);
        }
    })
};

//删除新闻
exports.deleteNews = function(id, cb) {

    News.findById(id, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                if (err) {
                    entries.msg = err;
                    cb(false,entries);
                }else{
                    entries.msg = '删除新闻成功！';
                    cb(true,entries);
                }
            });
        } else {
            next(err);
        }
    });

};

exports.findNews = function(req, cb) {
	// News.find({author:'577374a73e5758541ed9beaa'})
	// 	.populate('author')
	// 	.exec(function(err, docs) {
	//
	// 		var newsList=new Array();
	// 		for(var i=0;i<docs.length;i++) {
	// 			newsList.push(docs[i].toObject());
	//
	// 		}
	// 		// console.log(newsList);
	// 		cb(true,newsList);
	// 	});
    var page = req.query.page || 1 ;
    this.pageQuery(page, PAGE_SIZE, News, 'author', {}, {
        created_time: 'desc'
    }, function(error, data){
        if(error){
            next(error);
        }else{
            cb(true,data);
        }
    });
};

exports.findNewsOne = function(req, id, cb) {
	News.findOne({_id: id})
		.populate('author')
		.exec(function(err, docs) {
            var docs = (docs !== null) ? docs.toObject() : '';
            cb(true,docs);
			// cb(true,docs.toObject());
		});
	console.log("查找一个");
};


//添加慕课
exports.addMooc = function (data,cb) {
    var mooc = new Mooc({
        moocName: data.moocName,
        teacher: data.teacher,
        moocThumb: data.moocThumb
    });
    for (var i = 0; i < data.weekCount; i++){
        for(var j = 0; j < data.classHour; j++) {
            mooc.children.push({
                content: ' ',
                title: 'XXXX',
                week: i,
                chapter: j
            });
        }
    }
    mooc.save(function (err,doc) {
        cb(err,doc);
    })
};

//查找慕课
exports.findMoocOne = function () {
    Mooc.findOne({_id: id}, function (err,docs) {
        var mooc = docs.toObject() || ' ';

        mooc.children = _.sortBy( mooc.children , "chapter");
        mooc.children = _.groupBy( mooc.children , 'week');
        cb(true,mooc);
    });
};

exports.findMooc = function(req, cb) {
    var page = req.query.page || 1 ;
    this.pageQuery(page, PAGE_SIZE, Mooc, 'author', {}, {
        created_time: 'desc'
    }, function(error, data){
        if(error){
            next(error);
        }else{
            cb(true,data);
        }
    });
};

exports.pageQuery = function (page, pageSize, Model, populate, queryParams, sortParams, callback) {
	var start = (page - 1) * pageSize;
	var $page = {
		pageNumber: page
	};
	async.parallel({
		count: function (done) {  // 查询数量
			Model.count(queryParams).exec(function (err, count) {
				done(err, count);
			});
		},
		records: function (done) {   // 查询一页的记录
			Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
				done(err, doc);
			});
		}
	}, function (err, results) {
		
		var newsList=new Array();
		for(var i=0;i<results.records.length;i++) {
			newsList.push(results.records[i].toObject());
		}
		
		var count = results.count;
		$page.pageCount = parseInt((count - 1) / pageSize + 1);
		$page.results = newsList;
		$page.count = count;
		callback(err, $page);
	});
};
