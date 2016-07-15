var express = require('express');
var router = express.Router();

var fs = require('fs');
var NodePDF = require('nodepdf');
var config = require('../config');
var dbHelper = require('../db/dbHelper');


router.get('/:id', function (req, res, next) {
	console.log('进入pdf');
	var id = req.params.id;
	//获得导出PDF的文章页面地址
	var host = req.protocol + '://' + req.get('host') + '/pdf/blogPdf/' + id;
	//设置pdf文件名及属性
	var pdffile = config.site.path + '\\news-' + Date.now() + '.pdf';
	
	NodePDF.render(host, pdffile, function(err, filePath){
		if (err) {
			console.log(err);
		}else{
			//以异步的方式读取文件内容
			fs.readFile(pdffile , function (err,data){
				console.log("开始");
				console.log(data);
				//在网页上以pdf的格式打开文件
				res.contentType("application/pdf");
				res.send(data);

			});
		}
	});
})

router.get('/blogPdf/:id', function(req, res, next) {
	
	var id = req.params.id;
	console.log("开始查找 ");
	//查找并以blogPdf渲染页面
	dbHelper.findNewsOne(req, id, function (success, data) {
		res.render('blogPdf',{
			entries: data,
		});
	})
});

module.exports = router;
