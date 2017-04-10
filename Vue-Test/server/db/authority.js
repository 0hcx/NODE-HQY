/*权限验证中间件*/
'use strict';
var entries = require('./jsonRes')
var dbHelper = require('./dbHelper')

module.exports = {
    /**
     * 登陆权限验证
     */
    // isAuthenticated: function (req, res, next) {
    //     var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    //     if (token) {
    //         try {
    //             var decoded = jwt.decode(token, app.get('jwtTokenSecret'))
    //             if (decoded.exp <= Date.now()) {
    //               res.end('Access token has expired', 400)
    //               User.findOne({ _id: decoded.iss }, function(err, user) {
    //                   req.user = user;
    //               });
    //           }
    //         } catch (err) {
    //             entries.code = 99;
    //         }
    //     } else {
    //         entries.code = 99;
    //     }
    //     res.send(entries)
    // }

}
