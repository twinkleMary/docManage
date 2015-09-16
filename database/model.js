var mongoose = require('mongoose');
var config = require('./../config');
//mongoose.connect('mongodb://docmDEV:docmDEV@10.3.8.87/docmDEV');
mongoose.connect(config.dbConnect);
//mongoose.connect('mongodb://localhost/ctrip');
// Schema 结构
var manageSchema = new mongoose.Schema({
    proName : {type : String},
    person : {type : Array},
    proDes : {type : String},
    submitTime : {type : Date },
    lowfiLink : {type : String},
    viLink : {type : Array},
    cssLink : {type : String},
    picsLink : {type : String},
    proClass : {type : String},
    tag : {type : Array},
    repository : {type : String},
},{
    collection: 'manage'
});

var manageModel = mongoose.model('Manage', manageSchema);

function Manage(manage){
    this.proName = manage.proName;
    this.person = manage.person;
    this.proClass = manage.proClass;
    this.proDes = manage.proDes;
    this.tag = manage.tag;
    this.submitTime = manage.submitTime;
    this.lowfiLink = manage.lowfiLink;
    this.viLink = manage.viLink;
    this.cssLink = manage.cssLink;
    this.picsLink = manage.picsLink;
    this.repository = manage.repository;
}

Manage.prototype.create = function(callback){
    var manage = {
        proName: this.proName,
        person: this.person,
        proClass : this.proClass,
        proDes : this.proDes,
        tag : this.tag,
        submitTime: this.submitTime,
        lowfiLink: this.lowfiLink,
        viLink: this.viLink,
        cssLink: this.cssLink,
        picsLink: this.picsLink,
        repository: this.repository,
    }

    var newManage = new manageModel(manage);

    newManage.save(function(err, manage){
        if(err){
            console.log(err.toString());
            return callback(err);
        }
        callback(null, manage);
    })
}

Manage.getAll = function(callback, key, sortWay){
    manageModel.find().select('_id proName submitTime person tag proClass').sort('-'+key).exec(callback);
}

Manage.getByName = function(name,callback, key, sortWay){
    var regName = new RegExp(name,'i');
    var mongoCollection = manageModel.find({"$or" :  [ { 'proName':regName }, {'person.value' : regName , 'person.group' : 'CSS'} ] });
    mongoCollection.select('_id proName submitTime person person tag proClass').sort('-'+key).exec(callback);
}

Manage.deleteById = function(id, callback){
    manageModel.findByIdAndRemove(id,function(err,model){
        callback(null, model);
    })
}

Manage.updateById = function(id, itemInfo, options, callback){
   
    manageModel.findByIdAndUpdate(id, {$set: itemInfo}, options, function(err,model){
        if(err){
            return callback(err, model);
        }
        callback(null, model);
    })
}

Manage.update = function (id, item, callback) {
    manageModel.update({_id: id}, {$set: item}, function (err, num) {
        callback(err, num);
    });
}

Manage.getById = function(id,callback){
   
    manageModel.findById(id,function(err,model){
        if(err){
            return callback(err, model);
        }
        callback(null, model);
    })
}

Manage.getPagingDataByKeyword = function (regName, page, pageSize, callback) {
    if(!regName){
        regName = /./;
    }else{
        regName = new RegExp(regName,'i');
    }
    manageModel
        .find({"$or": [
            {'proName': regName},
            {'person.value': regName, 'person.group': 'CSS'}
        ]})
        .sort('-submitTime').skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(function(err,datas){
            callback(err, datas);
    });
}


Manage.getCountByKeyword = function (regName, callback) {
    if(!regName){
        regName = /./;
    }else{
        regName = new RegExp(regName,'i');
    }
    manageModel
        .find({"$or": [
            {'proName': regName}, {'person.value': regName, 'person.group': 'CSS'}
        ]})
        .count(function (err, count) {
            callback(err, count);
        })
}
module.exports = Manage;