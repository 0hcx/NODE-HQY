var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var formidable = require('formidable');
var entries = require('../db/jsonRes');

router.post('/addComment', function(req, res, next) {
	//发表评论
	console.log("发表评论1");
	dbHelper.addComment(req.body, function (success, doc) {
		res.send(doc);
	})
});

// 新建文章
router.get('/news', function(req, res, next) {
	dbHelper.findCategory(req, function (success, data) {
		res.render('./admin/news', {
			category: data,
			user: req.session.user,
			title: 'Express',
			layout: 'admin'
		})
	});
});

router.post('/news', function(req, res, next) {
  dbHelper.addNews(req.body, function (success, doc) {
    res.send(doc);
  })
});

// 修改用户信息
router.get('/userEdit', function (req, res, next) {
	res.render('./admin/userEdit', {
		user: req.session.user,
		title:'Express',
		layout: 'admin'
	});
});
router.post('/userEdit', function(req, res, next) {
	dbHelper.updateUser(req.body, function (success, doc) {
		res.send(doc);
	})
});

//添加文章类别
router.get('/categoryCreate', function(req, res, next) {
	res.render('./admin/categoryCreate', { user: req.session.user,title: 'Express', layout: 'admin' });
});

router.post('/categoryCreate', function(req, res, next) {
	dbHelper.addCategory(req.body, function (success, doc) {
		res.send(doc);
	})
});

//渲染新闻列表页面
router.get('/newsList', function(req, res, next) {

	var msg = req.session['message'] || '';
	req.session['message'] = "";

	dbHelper.findNews(req, function (success, data) {

		res.render('./admin/newsList', {
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			user: req.session.user,
			layout: 'admin',
			message: msg
		});
	})
});

//删除新闻
router.get('/newsDelete/:id', function(req, res, next) {

	var id = req.params.id;
	dbHelper.deleteNews(id, function (success, data) {

		req.session['message'] = data.msg;
		res.redirect("/admin/newsList");
	})
});

//上传图片
router.post('/uploadImg', function(req, res, next) {
console.log("开始上传");
	var io = global.io;

	var form = new formidable.IncomingForm();
	var path = "";
	var fields = [];

	form.encoding = 'utf-8';                    //上传文件编码格式
	form.uploadDir = "public/uploadFile";     //上传文件保存路径（必须在public下新建）
	form.keepExtensions = true;                 //保持上传文件后缀
	form.maxFieldsSize = 30000 * 1024 * 1024;   //上传文件格式最大值


	var uploadprogress = 0;
	console.log("start:upload----"+uploadprogress);

	form.parse(req);

	form.on('field', function(field, value) {
		console.log(field + ":" + value);       //上传的参数数据
	})
		.on('file', function(field, file) {
			path = '\\' + file.path;            //上传的文件数据
		})
		.on('progress', function(bytesReceived, bytesExpected) {

			uploadprogress = (bytesReceived / bytesExpected * 100).toFixed(0);  //计算进度
			console.log("upload----"+ uploadprogress);
			io.sockets.in('sessionId').emit('uploadProgress', uploadprogress);
		})
		.on('end', function() {
			//上传完发送成功的json数据
			console.log('-> upload done\n');
			entries.code = 0;
			entries.data = path;
			res.writeHead(200, {
				'content-type': 'text/json'
			});
			res.end(JSON.stringify(entries));
		})
		.on("err",function(err){
			var callback="<script>alert('"+err+"');</script>";
			res.end(callback);//这段文本发回前端就会被同名的函数执行
		}).on("abort",function(){
		var callback="<script>alert('"+ttt+"');</script>";
		res.end(callback);
	});

});

//渲染慕课页面
router.get('/moocList', function (req, res, next) {
	console.log("渲染慕课");
	dbHelper.findMooc(req, function (success, data) {
		res.render('./admin/moocList',{
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			user: req.session.user,
			layout: 'admin'
		});
	});
});

//渲染新建慕课页面
router.get('/moocCreate', function (req, res, next) {
	res.render('./admin/moocCreate',{ user: req.session.user, layout: 'admin'});
});

router.post('/moocCreate', function (req, res, next) {
	dbHelper.addMooc(req.body, function (success, doc) {
		res.send(doc);
	})
});

//渲染编辑慕课页面
router.get('/moocEdit/:id', function(req, res, next) {

	var id = req.params.id;
	dbHelper.findMoocOne( id, function (success, data) {
		res.render('./admin/moocEdit',{
			user: req.session.user,
			entries: data,
			layout: 'admin'
		})
	});
});

router.post('/moocGetChapContent', function(req, res, next) {

	var moocId    = req.body.moocId;
	var chapId    = req.body.chapId;
	var preChapId = req.body.preChapId;
	var content   = req.body.content;

	dbHelper.findMoocChapContent( moocId, chapId, preChapId, content, function (success, doc) {
		res.send(doc);
	});
});

router.post('/moocSetChapTitle', function(req, res, next) {

	var moocId    = req.body.moocId;
	var chapTitle = req.body.chapTitle;
	var chapId    = req.body.chapId;

	dbHelper.updateMoocChapTitle( moocId, chapId, chapTitle, function (success, doc) {
		res.send(doc);
	});
});


router.post('/moocGetChapTitle', function(req, res, next) {

	var moocId    = req.body.moocId;
	var chapId    = req.body.chapId;

	dbHelper.queryMoocChapTitle( moocId, chapId, function (success, doc) {
		res.send(doc);
	});
});

router.post('/moocDeleteChap', function(req, res, next) {

	var moocId    = req.body.moocId;
	var chapId    = req.body.chapId;

	dbHelper.deleteMoocChap( moocId, chapId, function (err, doc) {
		if(err) {
			return next(err);
		}else{
			res.send(doc);
		}
	});
});


router.post('/moocAddChap', function(req, res, next) {

	var moocId    = req.body.moocId;
	var chapId    = req.body.chapId;

	dbHelper.addMoocChap( moocId, chapId, function (err, doc) {
		if(err) {
			return next(err);
		}else{
			res.send(doc);
		}
	});
});


router.post('/moocUpChap', function(req, res, next) {

	var moocId    = req.body.moocId;
	var chapId    = req.body.chapId;

	dbHelper.upMoocChap( moocId, chapId, function (err, doc) {
		if(err) {
			return next(err);
		}else{
			res.send(doc);
		}
	});
});

router.post('/moocDownChap', function(req, res, next) {

	var moocId    = req.body.moocId;
	var chapId    = req.body.chapId;

	dbHelper.MoocChap( moocId, chapId, function (err, doc) {
		if(err) {
			return next(err);
		}else{
			res.send(doc);
		}
	});
});

module.exports = router;
