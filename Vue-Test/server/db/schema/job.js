var mongoose = require('../db');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* 用户定义 */
var jobSchema = new Schema({
    posname: String,
    company: String,
    money: Number,
    area: String,
    pubdate: String,
    edu: String,
    exp: String,
    desc: String,
    welfare: String,
    type: String,
    count: String
});

module.exports = mongoose.model('Job', jobSchema);
