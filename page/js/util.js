app.util = {
    sliceViLinks: function(viLinks, viLink){
        var sliceVILinks = [];
        for(var i= 0; i< viLinks.length; i++){
            if(viLinks[i].name === viLink.name && viLinks[i].path === viLink.path){
                return viLinks.splice(i,1);
            }
        }
    },
    uploadExtCheck: function(name){
        var reg = /.jpg$|.png$|.psd$/;
        return reg.test(name);
    },
    uploadThumbnail: function(name, path){
        var filePath = 'img/';
        if(/.psd$/.test(name)){
            filePath = filePath + 'img_ps.png';
        }else{
            filePath = path;
        }
        return filePath;
    }
}