var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');

// register
router.post('/register', function(req, res, next) {
    dbHelper.addUser(req.body, function (success, doc) {
        res.send(doc);
    })
});

// login
router.post('/login', function(req, res, next) {
    dbHelper.findUser(req.body, function (success, doc) {
        res.send(doc);
    })
});

// login
router.post('/isLogin', function(req, res, next) {
    dbHelper.authority(req, function (success, doc) {
        res.send(doc)
    })
});


module.exports = router;