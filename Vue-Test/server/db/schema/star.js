var mongoose = require('../db');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* 用户定义 */
var starSchema = new Schema({
    uid: String,
    jobId: { type: ObjectId, ref: 'Job' },
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

module.exports = mongoose.model('Star', starSchema);
