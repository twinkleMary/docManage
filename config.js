var path = require('path');

var config = {};
//config.dbConnect = 'mongodb://docmDEV:docmDEV@10.3.8.87/docmDEV';
config.dbConnect = 'mongodb://localhost:27017/doc';
config.UPLOAD_DIR = './page/upload/';
config.PIC_PATH = '';
config.STATIC = path.join(__dirname, 'page/');

module.exports = config;
