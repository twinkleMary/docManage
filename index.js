var express = require('express'),
    Manage = require('./database/model'),
    formidable = require('formidable'),
    bodyParser = require('body-parser'),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
    now = require('./now'),
    utils = require('./utils'),
    config = require('./config.js'),
    cookieParser = require('cookie-parser');
    STATIC = config.STATIC;

    //server
    //UPLOAD_DIR = conf.UPLOAD_DIR,
    UPLOAD_DIR_TODAY = STATIC + 'upload/' + now,
    //PIC_PATH = conf.PIC_PATH,
    //local
    //UPLOAD_DIR = './page/upload/',
    //UPLOAD_DIR_TODAY = UPLOAD_DIR+now,

    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieParser());
app.use(express.static(__dirname + '/page'));

// route
app.get('/', function(req, res) {
    //notice /docmapp is deleted
    res.redirect('/app.html');
})

// 全部列表
app.get('/list', function(req, res) {
    var keyword = req.query.keyword,
        currentPage = req.query.currentPage,
        pageSize = req.query.pageSize;
    Manage.getPagingDataByKeyword(keyword, currentPage, pageSize, function(err, datas){
        if(err){
            console.log(err.toString());
            return res.send(err.toString());
        }
        utils.formatDatas(datas);
        res.send(datas);
    })
});

app.get('/paging', function(req, res){
    var keyword = req.query.keyword;
    Manage.getCountByKeyword(keyword, function(err, count){
        if(err){
            console.log(err.toString());
            return res.send(err.toString());
        }
        return res.send({count: count});
    })
})

// 添加项目
app.post("/item", function(req, res) {
    var content = req.body;
    var manage = {
        proName: content.proName,
        proClass: content.proClass,
        tag: content.tag,
        proDes: content.proDes,
        person: content.person,
        submitTime: content.submitTime,
        lowfiLink: content.lowfiLink,
        viLink: content.viLink,
        cssLink: content.cssLink,
        picsLink: content.picsLink,
        repository: content.repository,
    }
    var db = new Manage(manage);
    db.create(function(err, model){
        if(err){
            console.log(err.toString());
            return res.send(err.toString());
        }
        utils.formatData(model);
        res.send(model);
    })

});
// 删除项目
app.delete("/item/:id", function(req, res) {
    Manage.deleteById(req.param('id'),function(err, model){
        if(err){
            console.log(err.toString());
            return res.send(err.toString());
        }
        res.send(model);
    })
});

// 更新项目
app.patch("/item/:id", function(req, res) {
    req.body.submitTime = new Date;  //更新时间
    Manage.updateById(req.params.id, req.body , {new: true}, function(err, model){
        if(err){
            console.log(err.toString());
            return res.send(err.toString());
        }
        utils.formatData(model);
        res.send(model);
    })
});

// 项目详情
app.get("/item/:id", function(req, res) {
    Manage.getById(req.params.id, function(err, model){
        if(err){
            console.log(err.toString());
            return res.send(err.toString());
        }
        utils.formatData(model);
        res.send(model);
    })
});

// 图片上传
app.post("/upload", function(req, res) {
   fs.exists(UPLOAD_DIR_TODAY, function (exists) {
        if(!exists){
            fs.mkdir(UPLOAD_DIR_TODAY,function(){
                upload();
            });
        }else{
            upload();
        }
    });

    function upload(){
        var form = new formidable.IncomingForm(),
            files = [],
            fields = [],
            file_name = [];

        form.uploadDir = UPLOAD_DIR_TODAY;
        form.keepExtensions = true;     //保留后缀

        form
            .on('field', function (field, value) {
                fields.push([field, value]);
            })
            .on('file', function (field, file) {
                //server
                var fileJson = {};
                fileJson.name = file.name;
                fileJson.path = staticUploadPath(file.path);
                //local 
                //var fileJson = {};
                //fileJson.name = file.name;
                //fileJson.path = file.path.substring(5);
                file_name.push(fileJson);

                files.push([field, file]);
            })
            .on('end', function () {
                res.send(file_name);
            });
        form.parse(req);
    };
});

// 图片删除
app.delete('/deletePic', function(req, res) {
    var imgPath = serverUploadPath(req.body.imgPath);
    fs.exists(imgPath, function( exists ){
        if(exists){
            fs.unlink(imgPath, function(err){
                if(err){
                    return res.send(err.toString());
                }
                res.send('file is deleted');
            });
        }else{
            res.send(imgPath);
        }
    });
})

function staticUploadPath(dir){
    dir = path.relative(STATIC,dir);
    return dir;
}

function serverUploadPath(dir){
    return path.join(STATIC, dir);
}

//notice 3000
app.listen(8000);
