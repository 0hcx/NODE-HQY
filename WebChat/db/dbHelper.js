var mongoose = require('./db.js');
var entries = require('./jsonRes');
var User = require('./schema/user');
var Message = require('./schema/message');
var Schema = mongoose.Schema;

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
    }).populate('friends', 'username')
};

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

exports.searchFriend = function (req, cb) {
    User.find({}, function (err, data) {
        var categoryList = new Array();
        for (var i = 0; i < data.length; i++) {
            categoryList.push(data[i].toObject());
        }
        // console.log(categoryList);
        cb(true, categoryList);
    })
};

exports.addFriend = function (data, cb) {
    entries.code = 0;
    console.log(data);
    User.findById(data.user, function (err, user) {
        User.findOne({"_id": data.user, "friends": data.friend}, function (err, doc) {
            if(err) {
                console.log(err);
            } else if(doc != null) {
                entries.code = 98;
                entries.msg = '该好友已添加！';
                cb(false, entries);
            } else if(doc == null) {
                user.friends.push(data.friend);
                user.save(function (err, doc) {
                    if(err) {
                        entries.code = 99;
                        console.log(err);
                    } else {
                        cb(true, entries);
                    }
                })
            }
        });
        
    })
};
exports.matchUser = function (req, id, cb) {
  User.findById(id, function (err, data) {
      if(err) {
          console.log(err);
      } else {
          var user = (data !== null) ? data.toObject() : '';
          cb(true, user);
      }
  })
};

exports.addMessage = function (data, cb) {
    var message= new Message({
       from: data.from,
        to: data.to,
        content: data.content
    });
    message.save(function (err, doc) {
        if(err) {
            entries.code = 99;
            cb(false, entries);
            console.log("add message fail !");
        }
    })
};
