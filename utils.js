var moment = require('moment'),
    util = {};

util.formatDatas = function(collection){
    for(var i= 0; i< collection.length; i++){
        var item = collection[i];
        item._doc.id = item._id;
        item._doc.submitTime = moment(item.submitDate).format('YYYY/MM/DD hh:mm a');
    }
    return collection;
}

util.formatData = function(model){
    if(model){
        model._doc.id = model._id;
        model._doc.submitTime = moment(model.submitDate).format('YYYY/MM/DD hh:mm a');
        return model;
    }
}

module.exports = util;