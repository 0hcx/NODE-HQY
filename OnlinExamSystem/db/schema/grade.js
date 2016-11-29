var mongoose = require('../db');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* 学生成绩定义 */
var gradeSchema = new Schema({
    userId: {type: ObjectId, ref: 'User'},
    subject: String,
    score: Number,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

gradeSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
});

module.exports = mongoose.model('Grade', gradeSchema);
