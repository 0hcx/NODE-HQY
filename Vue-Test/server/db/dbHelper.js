var mongoose = require('./db.js')
var entries = require('./jsonRes')
var User = require('./schema/user')
var moment = require('moment')
var jwt = require('jwt-simple')
var express = require('express')
var app = express()
var Schema = mongoose.Schema

const jwtTokenSecret = 'vue-exercise'

// addUser
exports.addUser = function(data, cb) {
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
exports.findUser = function(data, cb) {
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
