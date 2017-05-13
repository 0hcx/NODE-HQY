var Config = {
    site: {
        title: '前端社区',
        description: '利用Vue重构在线考试项目',
        version: '1.0'
    },
    db: {
        cookieSecret: 'VueExam',
        name: 'VueExam',
        host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/VueExam'
    },
    page: {
        path:'',
        pagesize: 17
    },
    sql: {
        count: [{ $group: { _id: "$type", value: { $sum: 1 }}}],
        salary: [{ $group: { _id: "$type", value: { $avg: "$money" }}}, { $sort: { value: -1 }}]
    }
};
module.exports = Config;