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
    User.findById(data.user, function (err, user) {
        User.findOne({"_id": data.user, "friends.friendId": data.friend}, function (err, doc) {
            if(err) {
                console.log(err);
            } else if(doc != null) {
                entries.code = 98;
                entries.msg = '该好友已添加！';
                cb(false, entries);
            } else if(doc == null) {
                user.friends.push({
                    friendId: data.friend
                });
                user.save(function (err, doc) {
                    if(err) {
                        entries.code = 99;
                        console.log(err);
                    } else {
                        console.log("好友添加成功");
                        cb(true, entries);
                    }
                })
            }
        });
        
    });
    User.findById(data.friend, function (err, user) {
        User.findOne({"_id": data.friend, "friends.friendId": data.user}, function (err, doc) {
            if(err) {
                console.log(err);
            } else if(doc != null) {
                console.log("对方已添加！");
            } else if(doc == null) {
                user.friends.push({
                    friendId: data.user
                });
                user.save(function (err, doc) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("both add!")
                    }
                })
            }
        });

    });
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

exports.findFriend = function (userId, friendId, cb) {
    User.findOne({"_id": userId, "friends._id": friendId})
        .populate('friends.friendId', 'username')
        .exec(function (err, data) {
            var user = (data !== null) ? data.toObject() : '';
            for(var i =0; i < data.friends.length; i++) {
                var item = data.friends[i];
                if(item._id.toString() == friendId){
                    user = item;
                    break;
                }
            }
            // console.log(user.friendId);
            var $unreadMsg = {};
            var messageList = new Array();
            $unreadMsg.results = messageList;
            $unreadMsg.friend = user.friendId;
            if(user.unread != 0) {
                // var $unreadMsg = {};
                Message.find({"from": user.friendId._id, "to": userId, "status": 0}, function (err, data) {
                    // var messageList = new Array();
                    for (var i = 0; i < data.length; i++) {
                        messageList.push(data[i].toObject());
                    }
                    $unreadMsg.results = messageList;
                    // $unreadMsg.friend = user.friendId;
                    // console.log(messageList);
                })
            }
            cb(true, $unreadMsg);
            // console.log($unreadMsg);
            // else {
            //     cb(true, user.friendId);
            // }
        })
};

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
            cb(false, entries);
            console.log("add message fail !");
        }
    });
    //如果是未读消息，则
    if(data.status == 0) {
        User.findById(data.to, function (err, user) {
            for(var i = 0; i < user.friends.length; i++) {
                var item = user.friends[i];
                if(item.friendId.toString() == data.from) {
                    item.unread++;
                    break;
                }
            }
            user.save(function (err, doc) {
                if(err) {
                    console.log("add unread fail !");
                }
            })
        })
    }
};
exports.updateMsgStatus = function (data, cb) {
    Message.find({"from": data.from, "to": data.to, "status": 0}, function (err, message) {
        for(var i =0; i < message.length; i++) {
            message[i].status = 1;
            message[i].save(function (err, doc) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("成功修改消息status为1");
                }
            })
        }
    });
    //在用户对应的好友未处理消息改为0
    User.findById(data.to, function (err, user) {
        for(var i = 0; i < user.friends.length; i++) {
            var item = user.friends[i];
            if(item.friendId.toString() == data.from) {
                item.unread = 0;
                break;
            }
        }
        user.save(function (err, doc) {
            if(err) {
                console.log("update unread fail !");
            }
        })
    })
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

