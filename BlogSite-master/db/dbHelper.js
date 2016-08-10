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
var Comment = require('./schema/comment');
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
    console.log("查找单篇新闻");
	News.findOne({_id: id})
		.populate('author')
		.exec(function(err, docs) {
            var docs = (docs !== null) ? docs.toObject() : '';
            cb(true,docs);
			// cb(true,docs.toObject());
		});
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

//查找慕课
exports.findMoocOne = function ( id, cb) {
    Mooc.findOne({_id: id}, function (err,docs) {

        console.log("查找单个mooc")
        var mooc = docs.toObject() || ' ';

        mooc.children = _.sortBy( mooc.children , "chapter");
        mooc.children = _.groupBy( mooc.children , 'week');
        cb(true,mooc);
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

exports.findMoocChapContentOnly = function(moocId, chapId, preChapId, content, cb) {

    //取出章节内容显示
    Mooc.findOne({"_id": moocId, "children._id": chapId }, function(err, docs) {

        var doc = _.find(docs.children,function(item) {
            if (item._id.toString() === chapId)
                return this;
        })
        cb(err, doc);
    });

};

exports.findMoocChapContent = function(moocId, chapId, preChapId, content, cb) {

    // Mooc.findOne({_id: id}, function(err, docs) {
    //     var mooc = docs.toObject() || '';
    //     mooc.children = _.groupBy( mooc.children , "week" );
    //
    //     docs = mooc.children[week][chap];
    //     cb(true,docs);
    // });

    // Mooc.update({"_id": moocId, "children._id": preChapId },{$set :{
    //         'children.$.content': content
    //     }
    // },function(error,data){
    //     if(error) {
    //         console.log(error);
    //     }else {
    //         console.log(data);
    //     }
    // })



    async.waterfall([
        function (callback) {

            //取出章节内容显示
            Mooc.findOne({"_id": moocId, "children._id": chapId }, function(err, docs) {

                var doc = _.find(docs.children,function(item) {
                    if (item._id.toString() === chapId)
                        return this;
                })
                callback(err,doc);
            });
        },
        function (doc, callback) {

            //如果章节相同的话，不保存编辑内容
            if (chapId !== preChapId) {

                Mooc.update({"_id": moocId, "children._id": preChapId },{$set :{
                    'children.$.content': content
                }
                },function(err,data){
                    callback(err, doc);
                })
            }else{
                callback(true, doc);
            }
        }
    ], function (err, result) {
        cb(true, result);
    });
};

exports.updateMoocChapTitle = function( moocId, chapId, chapTitle, cb) {

    Mooc.update({"_id": moocId, "children._id": chapId },{$set :{
        'children.$.title': chapTitle
    }
    },function(err,result){
        cb(err, result);
    });
};

exports.queryMoocChapTitle = function( moocId, chapId, cb) {

    Mooc.findOne({"_id": moocId, "children._id": chapId },function(err,result){

        var doc = _.find(result.children,function(item) {
            if (item._id.toString() === chapId)
                return item;
        })

        cb(err, doc);
    });
};

//发表评论
exports.addComment = function(data, cb) {
    //将markdown格式的新闻内容转换成html格式
    data.content = md.render(data.content);

    if(data.comment) {
        Comment.findById(data.comment, function (err, comment) {
            console.log(comment);
            var reply = new Comment({
                commentId: data.comment,
                from: data.from,
                to: data.to,
                content: data.content
            });
            console.log("进入回复");
            comment.reply.push(reply);
            comment.save(function (err, doc) {
                if (err) {
                    console.log("reply-error");
                    cb(false,err);
                }else{
                    cb(true,err);
                }
            })
        });
    }
    else {
        var comment = new Comment({
            news: data.news,
            from: data.from,
            to: data.to,
            content: data.content
        });
        comment.save(function(err,doc){
            if (err) {
                console.log("db-error");
                cb(false,err);
            }else{
                console.log("reply-success");
                cb(true,err);
            }
        })
    }

};

//查找评论
exports.findComment = function (id, cb) {
    Comment.find({news: id})
        .populate('from', 'username')
        .populate('reply.from reply.to', 'username')
        .exec(function (err, docs) {
            // var docs = (docs !== null) ? docs.toObject() : '';
            cb(true,docs);
        })
};