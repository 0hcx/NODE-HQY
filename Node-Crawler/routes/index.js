var express = require('express');
var router = express.Router();
var dbHelp = require('../db/dbHelp');

/* GET main page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express'});
});

/* POST */
router.post('/getData', function(req, res, next) {
  dbHelp.DBQuery(req.body, function (success, doc) {
    res.send(doc);
  });
});

module.exports = router;
