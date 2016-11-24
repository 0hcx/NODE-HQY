var mongoose = require('../db');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* 用户定义 */
var userSchema = new Schema({
    userId: String,
    username: String,
    password: String,
    category: String,   //分类-学生
    status: String, //状态
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

userSchema.pre('save', function (next) {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }

  next();
});


module.exports = mongoose.model('User', userSchema);
