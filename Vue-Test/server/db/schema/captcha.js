var mongoose = require('../db');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* 验证码定义 */
var captchaSchema = new Schema({
    email: String,
    captcha: String,
    deadline: Date,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

captchaSchema.pre('save', function (next) {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }

  next();
});

module.exports = mongoose.model('Captcha', captchaSchema);
