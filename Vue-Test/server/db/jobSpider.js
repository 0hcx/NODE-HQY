// Spider

var cheerio = require('cheerio');
var fs = require('fs');
var request = require('superagent');
var async = require('async');
var jobCode = require('../data/jobCode')
var dbHelper = require('./dbHelper')

//连接数据库
var jsonData = [];
var jobLinks = [];

exports.getJobCode = function () {
    console.log('职业代码：');
    var str = '', data = [];
    var readStream = fs.createReadStream('./data/jobCode.js');

    readStream.setEncoding('UTF8');
    readStream.on('data', function (chunk) {
        str += chunk;
    });
    readStream.on('end', function () {
        //str = str.replace(/(\d|@)/g, '').replace(/\|\|/g, '|').replace(/(^\||\|$)/g, '');
        str = str.replace(/\|160000/g, '').split('@');

        for(let n of str) {
            n = n.split('|');
            let item = `{ "code": "${n[0]}", "name": "${n[1]}" }`;
            data.push(JSON.parse(item));
        }
        fs.writeFile('./data/jobs.js', JSON.stringify(data), function (err) {
            if (err) {
                console.log(err.stack)
            }
        });
        console.log(data);
    });
    readStream.on('error', function (err) {
        console.log(err.stack);
    })
}

exports.saveToDB = function () {
    async.waterfall([
        getLinkTemplate,
        getJobLinks,
        startSpider
    ], function (err, result) {
        if(err) {
            console.log('error: ' + err);
        } else {
            console.log('任务完成！！！');
            console.log(jobLinks.length);
        }
    });
}

// 从数据库获取代码组装成第一层链接
function getLinkTemplate(cb) {
    var linkTemplate = []; // 每个职位的链接
    var linkArr = [];   // 全部爬取页面，各50
    var pages = 50;

    // 封装成链接
    for (let item of jobCode) {
        let link = `http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%E6%9D%AD%E5%B7%9E&isadv=0&ispts=1&isfilter=1&bj=160000&sj=${item.code}&p=`;
        linkTemplate.push(link);
    }
    for (let i = 0; i < linkTemplate.length;) {
        for(let j = 0; j < pages; j++) {
            let linkStr = `${linkTemplate[i]}${j}`;
            linkArr.push(linkStr);
        }
        i++;
    }
    cb(null, linkArr);
}
// 获取第二层链接
function getJobLinks(linkArr, cb) {
    async.eachLimit(linkArr, 40, function(item, callback) {  // 限制允许并发执行的任务数为5，防止访问过快
        setTimeout(function () {                            // 设置每批任务之间休息1s，防止访问过快
            request.get(item).end(function (err, res) {       // get请求页面
                try {
                    if(res.ok) {
                        console.log(item + ' 获取具体页面中...');
                        getJobLink(res.text);
                        callback();
                    } else {
                        console.log(item + ' 获取具体页面失败...');
                        callback();
                    }
                } catch (e) {
                    console.log(e.stack);
                    callback();
                }
            })
        }, 1000)
    }, function(err) {
        if (err) {
            console.log('Mession Failed!');
        } else {
            console.log(`共获取到${jobLinks.length}个具体页面`);
            cb(null, jobLinks);
        }
    });
}

// 分析第一层页面获取第二层链接
function getJobLink(html) {
    // 获取每个职位链接
    var $ = cheerio.load(html);
    var jobTd = $('td.zwmc').toArray();
    for (let i = 0; i < jobTd.length; i++) {
        let jobHref = $(jobTd[i]).find('div a').attr('href');   // 获取到单个链接
        if (jobLinks.indexOf(jobHref) === -1) {
            jobLinks.push(jobHref);
        }
    }
}
// 获取完全部连接后开始爬取
function startSpider(links, cb) {
    async.eachLimit(links, 30, function(item, callback) {
        setTimeout(function () {
            request.get(item).end(function (err, res) {
                try {
                    if(res.ok) {
                        console.log(item + ' 获取具体页面中...');
                        saveJob(res.text);
                        callback();
                    } else {
                        console.log(item + ' 获取具体页面失败...');
                        callback();
                    }
                } catch (e) {
                    console.log(e.stack);
                    callback();
                }
            })
        }, 1000)
    }, function(err) {
        if (err) {
            console.log('Mession Failed!');
        } else {
            console.log('Mession Completed!');
            cb(null, jsonData);
        }
    });
}

// 分析最终的页面数据保存到数据库
function saveJob(html) {
    var $ = cheerio.load(html);
    var job = {};

    job.title = $('div.inner-left.fl h1').text().replace(/\s+/g, '');   // 职位名称
    job.company = $('div.inner-left.fl h2').text().replace(/\s+/g, ''); // 公司
    var welfare = $('div.inner-left.fl div.welfare-tab-box span').toArray();
    job.welfare = '';  // 福利
    for(let item of welfare) {
        job.welfare += `/${$(item).text()}`;
    }
    job.welfare = job.welfare.replace(/(^\/)/,'').replace(/\s+/g, '');
    job.salary = 0;
    var terminal = $('div.terminalpage-left>ul li strong');
    var salary = $(terminal).eq(0).text().replace(/\s+/g, '').replace(/[^-|0-9]/g, '').split('-');  // 职位月薪
    if (isNaN(salary)) {
        job.salary = (parseInt(salary[0]) + parseInt(salary[1])) / 2;
    }
    job.address = $(terminal).eq(1).text().replace(/\s+/g, '');  // 工作地点
    job.publish = $(terminal).eq(2).text().replace(/\s+/g, '');  // 发布日期
    job.experience = $(terminal).eq(4).text().replace(/\s+/g, '');  // 工作经验
    job.education = $(terminal).eq(5).text().replace(/\s+/g, '');  // 最低学历
    job.numbers = $(terminal).eq(6).text().replace(/\s+/g, '');  // 招聘人数
    job.category = $(terminal).eq(7).text().replace(/\s+/g, '');  // 职位类别
    job.description = $('div.tab-inner-cont').eq(0).text().replace(/\s+/g, '').replace(/\\/g, "/").replace(/(")/g, "'").replace(/查看职位地图/g, ''); // 职位描述

    if (job.welfare === '') {
        job.welfare = "无";
    }

    var jsonItem = `{"title":"${job.title}", "company":"${job.company}", "salary":"${job.salary}", "address":"${job.address}", "publish":"${job.publish}", "education":"${job.education}", "experience":"${job.experience}", "numbers":"${job.numbers}", "category":"${job.category}", "welfare":"${job.welfare}", "description":"${job.description}"}`;
    var jsonStr = JSON.stringify(jsonData);
    // var sqlInsert = `insert into backup values (null, "${job.title}", "${job.company}", "${job.salary}", "${job.address}", "${job.publish}", "${job.education}", "${job.experience}", "${job.numbers}", "${job.category}", "${job.welfare}", "${job.description}")`;

    if(jsonStr.indexOf(jsonItem) === -1) {     //查重
        console.log(jsonItem);
        try {
            jsonData.push(JSON.parse(jsonItem));  // 将json格式的字符串push进data数组
            // 插入数据库
            dbHelper.addJobs(job.title, job.company, job.salary, job.address, job.publish, job.education, job.experience, job.description, job.welfare, job.category, job.numbers);
        } catch(e) {
            console.log(e.stack);
        }
    }
}
