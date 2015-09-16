var Manage = require('./model');


for(var i= 1; i<= 200; i++) {
    var doc = {
        "proName" : "批量测试数据" + i,
        "proClass" : "变更",
        "proDes" : "防爬虫页面优化",
        "submitTime" : Date.now(),
        "lowfiLink" : "<a target=\"_blank\" href=\"http://pic.c-ctrip.com/hotels121118/only_hotel/icon_tip.png\" style=\"background-color: rgb(255, 255, 255);\">http://pic.c-ctrip.com/hotels121118/only_hotel/icon_tip.png</a>",
        "cssLink" : "<a target=\"_blank\" href=\"http://hfdoc.qa.nt.ctripcorp.com/online/hotels121118/only_hotel.php?b=qunar_404_lzj\" style=\"background-color: rgb(255, 255, 255);\">http://hfdoc.qa.nt.ctripcorp.com/online/hotels121118/only_hotel.php?b=qunar_404_lzj</a><br>",
        "picsLink" : "无",
        "repository" : "dev/qunar_404_lzj",
        "tag" : [
            "Offline",
            "Mobile"
        ],
        "viLink" : [],
        "person" : [
            {
                "value" : "李志嘉",
                "group" : "CSS"
            },
            {
                "value" : "吴慧敏",
                "group" : "VI"
            },
            {
                "value" : "UI",
                "group" : "UI"
            },
            {
                "value" : "PM",
                "group" : "PM"
            }
        ]
    }
    var manage = new Manage(doc);
    manage.create(function (docs) {
        console.log('create success');
    })
}

//search test case
/*Manage.getPagingDataByKeyword('', 1, 10, function(err, datas){
    console.log(datas.length);
}, 'submitTime', -1)*/

//count test case
/*
Manage.getCountByKeyword('51', function(err, count){
    console.log(count);
}, 'submitTime', -1)*/
