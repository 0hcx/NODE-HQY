var mongoose = require('../db');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* 回答内容定义 */
var answerSchema = new Schema({
    userId: {type: ObjectId, ref: 'User'},
    questionId: {type: ObjectId, ref: 'Question'},
    answerCtn: String,
    score: Number,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

answerSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
});

module.exports = mongoose.model('Answer', answerSchema);
