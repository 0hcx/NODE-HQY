var mongoose = require('../db');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* 用户定义 */
var followSchema = new Schema({
    uid: String,
    company: String,
    vaild: 0,	// 1代表已取消跟踪，默认为0
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

module.exports = mongoose.model('Follow', followSchema);
