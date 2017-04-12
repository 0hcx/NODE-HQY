var mongoose = require('./db.js')
var entries = require('./jsonRes')
var moment = require('moment')
var jwt = require('jwt-simple')
var nodemailer = require('nodemailer');
var Schema = mongoose.Schema

var User = require('./schema/user')
var Captcha = require('./schema/captcha')

const jwtTokenSecret = 'vue-exercise'

// addUser
exports.addUser = function (data, cb) {
    User.findOne({
        username: data.usr
    }, function(err, doc) {
        if (err) {
            console.log(err)
        } else if (doc !== null) {
            entries.code = 99
            cb(false, entries)
        } else if (doc === null) {
            var user = new User({
                username: data.usr,
                password: data.pwd
            })
            user.save(function(err, doc) {
                if (err) {
                    entries.code = 99
                    cb(false, err)
                } else {
                    cb(true, entries)
                }
            })
        }
    })
}

// findUser
exports.findUser = function (data, cb) {
    User.findOne({
        username: data.usr
    }, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : ''
        if (err) {
            console.log(err)
        } else if (doc === null) {
            entries.code = 99
            cb(false, entries)
        } else if (user.password !== data.pwd) {
            entries.code = 99
            cb(false, entries)
        } else {
            entries.data = user
            entries.code = 0
            var time = moment().add(1, 'days').valueOf()
            entries.access_token = jwt.encode({
                iss: user._id,
                exp: time
            }, jwtTokenSecret)
            cb(true, entries)
        }
    })
 }

// 登录验证
exports.authority = function (req, cb) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['access-token']
  if (token) {
    try {
      var decoded = jwt.decode(token, jwtTokenSecret)
      if (decoded.exp <= Date.now()) {
        entries.code = 99
        cb(false, entries)
      } else {
        User.findOne({ _id: decoded.iss }, function(err, user) {
          if (err) {
            console.log(err)
          } else if (user !== null) {
            entries.code = 0
            cb(true, entries)
          }
        })
      }
    } catch (err) {
      console.log(err)
    }
  } else {
    entries.code = 99
    cb(false, entries)
  }
}

// 发送验证码
exports.sendCaptcha = function (data, cb) {
    let randomWord = this.getRandomWord(false, 6, 6)
    let that = this
    Captcha.findOne({
        email: data.email
    }, function(err, doc) {
        console.log(data.email)
        var docData = (doc !== null) ? doc.toObject() : ''
        if (err) {
            console.log(err)
        } else if (doc !== null) {
            let [updateAt, nowAt] = [parseInt(docData.meta.update / 1000 / 60), parseInt(Date.now() / 1000 / 60)]
            if (nowAt - updateAt >= 30) {    // 验证码超过30分钟才允许重新发送
                Captcha.update({"_id": docData._id}, {$set : {
                    "captcha": randomWord
                }
                }, function (err, result) {
                    if(err) {
                        console.log(error)
                    }
                    if (that.sendCaptchaMail(data.email, randomWord) === 99) {
                        entries.code = 99
                    }
                    cb(true, entries)
                })
            } else {
                entries.code = 88   // 提示已经发送
                cb(true, entries)
            }
        } else if (doc === null) {
            var captcha = new Captcha({
                email: data.email,
                captcha: randomWord
            })
            captcha.save(function(err, doc) {
                if (err) {
                    console.log(err)
                }
                if (that.sendCaptchaMail(data.email, randomWord) === 99) {
                    entries.code = 99
                }
                cb(true, entries)
            })
        }
    })
}

exports.getRandomWord = function (randomFlag, min, max) {
    var str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max-min)) + min
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length-1))
        str += arr[pos]
    }
    return str
}

exports.sendCaptchaMail = function (emailTo, msg) {
    let result = 0
    // 配置邮件
    let transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        secure: true,
        port: 465,
        auth: {
            user: 'huqiyang0124@163.com',
            pass: 'qq201014789qq'
        }
    })
    let mailOptions = {
        from: 'huqiyang0124@163.com',
        to: emailTo,
        subject: '前端社团注册验证码',
        html: `<h2>您的验证码为： ${msg}</h2><h2>验证时间为30分钟，请及时注册，请勿回复！</h2>`
    }
    // 发送邮件
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            result = 99
        } else {
            console.log('111');
            console.log('Message sent: ' + info.response);
        }
    })
    return result
}