var mongoose = require('../db');
var Schema = mongoose.Schema;

/* 用户定义 */
var examTimeSchema = new Schema({
    subject: String,
    startTime: String,
    endTime: String,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

examTimeSchema.pre('save', function (next) {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('examTime', examTimeSchema);
