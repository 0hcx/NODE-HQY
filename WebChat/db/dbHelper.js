var mongoose = require('./db.js');
var entries = require('./jsonRes');
var User = require('./schema/user');
var Message = require('./schema/message');
var Friend = require('./schema/friend');
var async = require('async');
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
    });
        // .populate('friends', 'username')
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

exports.searchAllUsers = function (req, cb) {
    var $user = {};
    User.find({}, function (err, data) {
        var userList = new Array();
        for (var i = 0; i < data.length; i++) {
            userList.push(data[i].toObject());
        }
        // console.log(categoryList);
        $user.results = userList;
        $user.count = userList.length;
        cb(true, $user);
    })
};

exports.addFriend = function (data, cb) {
    entries.code = 0;
    console.log(data);
    Friend.findOne({"uid": data.user, "fid": data.friend}, function (err, doc) {
        if(err) {
            console.log(err);
        } else if(doc != null) {
            entries.code = 98;
            entries.msg = '该好友已添加！';
            cb(false, entries);
        } else if(doc == null) {
            var friend1 = new Friend({ uid: data.user, fid: data.friend });
            var friend2 = new Friend({ uid: data.friend, fid: data.user });

            async.parallel({
                one: function(callback) {
                    friend1.save(function(err, doc) {
                        callback(null, doc);
                    })
                },
                two: function(callback) {
                    friend2.save(function(err, doc) {
                        callback(null, doc);
                    })
                }
            }, function(err, results) {
                cb(true, entries);
            });
        }
    })
};

exports.getFriends = function (id, cb) {
    Friend.find({"uid": id}, function (err, data) {
        var friendList = new Array();
        for (var i = 0; i < data.length; i++) {
            friendList.push(data[i].toObject());
        }
        cb(true, friendList);
    }).populate('fid', 'username')
};

exports.matchUser = function (id, cb) {
  User.findById(id, function (err, data) {
      if(err) {
          console.log(err);
      } else {
          var user = (data !== null) ? data.toObject() : '';
          cb(true, user);
      }
  }).populate('friends.friendId', 'username');
};

// exports.findFriend = function (userId, friendId, cb) {
//     User.findOne({"_id": userId, "friends._id": friendId})
//         .populate('friends.friendId', 'username')
//         .exec(function (err, data) {
//             var user = (data !== null) ? data.toObject() : '';
//             for(var i =0; i < data.friends.length; i++) {
//                 var item = data.friends[i];
//                 if(item._id.toString() == friendId){
//                     user = item;
//                     break;
//                 }
//             }
//             // console.log(user.friendId);
//             var $unreadMsg = {};
//             var messageList = new Array();
//             $unreadMsg.results = messageList;
//             $unreadMsg.friend = user.friendId;
//             if(user.unread != 0) {
//                 // var $unreadMsg = {};
//                 Message.find({"from": user.friendId._id, "to": userId, "status": 0}, function (err, data) {
//                     // var messageList = new Array();
//                     for (var i = 0; i < data.length; i++) {
//                         messageList.push(data[i].toObject());
//                     }
//                     $unreadMsg.results = messageList;
//                     // $unreadMsg.friend = user.friendId;
//                     // console.log(messageList);
//                 })
//             }
//             cb(true, $unreadMsg);
//             // console.log($unreadMsg);
//             // else {
//             //     cb(true, user.friendId);
//             // }
//         })
// };

exports.addMessage = function (data, cb) {
    console.log(data);
    var message= new Message({
        from: data.from,
        to: data.to,
        content: data.content,
        status: data.status
    });
    message.save(function (err, doc) {
        if(err) {
            entries.code = 99;
            console.log("add message fail !");
        }
        cb(true, entries);
    });
};
//获取未读消息
exports.getUnreadMsg = function (data, cb) {
    Message.find({'from': data.from, 'to': data.to, 'status': 0})
        .populate('from', 'username')
        .exec(function (err, message) {
            var messageList = new Array();
            for(var i =0; i < message.length; i++) {
                messageList.push(message[i].toObject());
            }
            console.log(messageList);
            cb(true, messageList);
        })
};
//将未读消息设置成已读
exports.updateMsgStatus = function (data, cb) {
    var conditions = {'from': data.from, 'to': data.to, 'status': 0};
    var update = {$set :{ 'status' : '1'}};
    var options = { multi: true };

    Message.update(conditions,update,options, function(error, result){
        if(error) {
            console.log(error);
        }else {
            result.id = data.from;
            cb(true, result);
        }
    });
};

//查看历史消息记录
exports.findHistoryMsg = function (from, to, cb) {
    Message.find({"from": from, "to": to})
        .populate("from to", "username username")
        .exec(function (err, data) {
            var $message = {};
            var messageList = new Array();
            for(var i =0; i < data.length; i++) {
                messageList.push(data[i].toObject());
            }
            // console.log(messageList);
            var name = messageList[0].from.username;
            $message.results = messageList;
            $message.name = name;
            cb(true, $message);
        })
};

