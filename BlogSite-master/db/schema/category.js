var mongoose = require('../db');
var Schema = mongoose.Schema;


/* 用户定义 */
var categorySchema = new Schema({
    name: String,
    news: [{
        type: Schema.Types.ObjectId,
        ref: 'News'
    }],
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

categorySchema.pre('save', function (next) {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
});


module.exports = mongoose.model('Category', categorySchema);
