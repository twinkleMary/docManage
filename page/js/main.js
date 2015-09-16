(function(w,$){
// 加载模板
    $.ajax({
        url : 'template.html',
        dataType : 'html'
    }).done(function(html){
           renderTemplate(html, function(){
               app.models.ItemModel = Backbone.Model.extend({
                   urlRoot : map_path + '/item'
               });

               app.models.PagingModel = Backbone.Model.extend({
                   url : map_path + '/paging',
                   setPages: function(){
                       this.set('pages', Math.ceil(this.get('count') / app.pagingNum));
                       return this;
                   },
                   initialize: function(){
                       this.on('change:count', this.setPages);
                   }
               });

               app.models.pagingModel = new app.models.PagingModel({count: 0,page: 1,pages: 1,keyword: ''});

               app.models.HeaderModel = Backbone.Model.extend({

               })
               app.models.headerModel = new app.models.HeaderModel({});

               // 数据集合
               app.collections.ListCollection = Backbone.Collection.extend({
                   model : app.models.ItemModel,
                   url : map_path + '/list',
                   initialize :  function(){

                   }
               });

               app.collections.listCollection = new app.collections.ListCollection();

               app.collections.LinkCollection = Backbone.Collection.extend({

               });

               app.collections.linkCollection = new app.collections.LinkCollection([
                   { hash:'#addItem' , title:'创建项目' , ico:'ico-plus' , pageTitle:'项目列表' , pageLink: '#list/1' },
                   { hash:'#addItem' , title:'创建项目' , ico:'ico-plus' , pageTitle:'项目列表' , pageLink: '#list/1' },
                   { hash:'#addItem' , title:'创建项目' , ico:'ico-plus' , pageTitle:'项目列表' , pageLink: '#list/1' },
               ])

               app.views.HeaderView = Backbone.View.extend({
                   el: '#base_hd',
                   template: $.tpl['header'],
                   render: function(){
                       console.log('render header');

                       this.$el.html(this.template(this.model));
                       return this;
                   }
               })

               // 列表页
               app.views.ListView = Backbone.View.extend({
                   el: '#base_bd',
                   template: $.tpl['list'],
                   initialize : function(){
                       this.listenTo(this.model, 'change:count', this.renderTotalCounts);
                   },
                   render : function(){
                       console.log('render list view');
                       this.$el.html(this.template(this.model.toJSON()));
                       if(!app.views.listDataView && !app.views.pagingView){
                           app.views.listDataView = new app.views.ListDataView({model: this.model, collection: app.collections.listCollection}).render();
                           app.views.pagingView = new app.views.PagingView({model: this.model}).render();
                       }
                       return this;
                   },
                   renderTotalCounts: function(){
                       this.$el.find('#totalCount').html(app.models.pagingModel.get('count'));
                   },
                   events : {
                       "keyup #searchBox"  :  'search'
                   },
                   search: function(){
                       app.routers.appRouter.navigate("list/1");
                       var keyword = $.trim(this.$el.find('#searchBox').val());
                       app.models.pagingModel.set({keyword: keyword, page: 1});
                   }
               });

               app.views.ListDataView = Backbone.View.extend({
                   el: '#listTbody',
                   template: $.tpl['listData'],
                   initialize: function(){
                       //this.listenTo(this.collection, 'reset', this.render);
                       this.listenTo(this.model, 'change:keyword', this.searchByKeyword);
                   },
                   render: function(){
                       console.log('render list data view');
                       $('#listTbody').html(this.template({items: this.collection.toJSON()}));
                       return this;
                   },
                   searchByKeyword: function(){
                       var keyword = app.models.pagingModel.get('keyword'),
                           page = app.models.pagingModel.get('page'),
                           _this = this;
                       this.collection.fetch({
                           //搜索关键字， 当前页码， 1页多少条数据
                           data: {keyword: keyword, currentPage: page, pageSize: app.pagingNum},
                           success: function(collection, res){
                               _this.render();
                           }
                       });
                   }
               })

               app.views.PagingView = Backbone.View.extend({
                   //el: '#paging',
                   initialize: function(){
                       this.listenTo(this.model, 'change:keyword', this.render);
                   },
                   render: function(){
                       console.log('render paging view');
                       var keyword = app.models.pagingModel.get('keyword'),
                           _this = this;

                       app.models.pagingModel.fetch({
                           data: {keyword: keyword},
                           success: function (model, res) {
                               $('#paging').pagination({
                                   pages: _this.model.get('pages'),
                                   cssStyle: 'light-theme',
                                   displayedPages: 3,//开始的页码数量
                                   edges: 2, //两边的页码数量
                                   hrefTextPrefix: '#list/',
                                   currentPage: _this.model.get('page')
                               });
                           }
                       })
                       return this;
                   }
               })

               // 详情页
               app.views.DetailView = Backbone.View.extend({
                   el : '#base_bd',
                   template: $.tpl['detail'],
                   viLinks: [],
                   viewCaches: [],
                   initialize : function(){

                   },
                   render : function(){
                       console.log('rendering detail!');

                       //遍历views数组，并对每个view调用Backbone的remove
                       _.each(this.viewCaches,function(view){
                           view.remove().off();
                       })
                       this.viewCaches =[];
                       this.$el.empty();
                       if(!this.model.get('viLink')){
                           this.viLinks = [];
                       }else{
                           this.viLinks = this.model.get('viLink');
                       }

                       var item = this.model.toJSON();
                       item.proTypeIcon = app.proTypeIcon[this.model.get('proClass')];
                       this.$el.html(this.template({item : item}));
                       app.views.uploadView = new app.views.UploadView({viLinks: this.viLinks, $parentNode: this.$el.find('#uploadBox'), opts: {isEdit: false} }).render();
                       this.viewCaches.push(app.views.uploadView);

                       for(var i= 0; i< this.viLinks.length; i++){
                           this.viLinks[i].isEdit = false;
                           this.viLinks[i].thumbnail = app.util.uploadThumbnail(this.viLinks[i].name, this.viLinks[i].path);
                           var uploadEditDataView = new app.views.UploaEditDataView({viLinks: this.viLinks, viLink: this.viLinks[i]}).render();
                           this.$el.find('#editVI').append(uploadEditDataView.el);
                           this.viewCaches.push(uploadEditDataView);
                       }
                       return this;
                   },
                   events :  {
                       // 编辑文本数据
                       "click .edit": "editTxt",
                       "click .save": "saveTxt",
                       // 编辑项目成员
                       "click .editPerson": "editPerson",
                       "click .savePerson": "savePerson",
                       // 编辑视觉稿
                       "click .editVI": "editVI",
                       "click .saveVI": "saveVI"
                   },
                   editPerson : function(){
                       var $content = $('#'+event.target.getAttribute('data-target'));
                       $('span',$content).attr('contenteditable','true');
                   },
                   savePerson : function(){
                       var key = event.target.getAttribute('data-target'),
                           $content = $('#'+key);
                       var updateData = this.model.get('person');
                       $('span',$content).each(function(key){
                           updateData[key]['value'] = this.innerHTML;
                       })
                       this.updateAndRender(key,updateData);
                   },
                   editTxt  :  function(event){
                       var $content = $('#'+event.target.getAttribute('data-target')),
                           $id = $content.attr('id');

                       if(!$content.attr('state')){
                           if($id == 'proDes' || $id == 'repository' || $id == 'proName'){
                               $content.attr('contenteditable','true')
                           }else{
                               $content.editor();
                           }
                           $content.attr('state','onEdit');
                       }
                   },
                   saveTxt : function(event){
                       var key = event.target.getAttribute('data-target');
                       var updateData = $('#'+key).html();
                       this.updateAndRender(key,updateData);
                       event.target.setAttribute('state','');
                   },
                   editVI : function(e){
                       var $this = $(e.srcElement ? e.srcElement : e.target);
                       $('.glyphicon-remove','#viLink').css('display','inline-block');
                       $this.closest('.itemInfo').find('#uploadifive-files,.viBox .glyphicon-remove').removeClass('hidden');
                   },
                   saveVI : function(){
                       this.updateAndRender('viLink',this.viLinks);
                   },
                   updateAndRender : function($key,updateData){
                       var _this =this;
                       if(_.isArray(updateData) && updateData.length == 0){
                           updateData = null;
                       }
                       console.log('updating');
                       this.model.save($key,updateData,{
                           patch: true, wait: true,
                           success: function(model, res){
                               _this.render();
                           }
                       })
                   }
               });

               // 填写页
               app.views.AddView = Backbone.View.extend({
                   el : '#base_bd',
                   template: $.tpl['add'],
                   viLinks: [],
                   isInitialize: false,
                   initialize: function(){

                   },
                   render : function(){
                       console.log('render add page!');

                       this.$el.html(this.template({}));
                       this.$el.find('#editPicsLink').editor();
                       this.$el.find('#editCssLink').editor();
                       this.$el.find('#editLowfiLink').editor();

                       if(app.views.uploadView){
                           app.views.uploadView.remove().off();
                           this.viLinks = [];
                       }
                       app.views.uploadView = new app.views.UploadView({viLinks: this.viLinks, $parentNode: this.$el.find('#uploadBox'), opts: {isEdit: true} }).render();

                       return this;
                   },
                   events  :  {
                       "click #addItemBtn" :  "saveModel"
                   },
                   saveModel   :  function(){
                       //item info
                       var tagArr = [],
                           ueder = [],
                           proClass = $('#proClass').val(),
                           $picsLink = $('#editPicsLink').html() || '无',
                           $uiLink = $('#editLowfiLink').html() || '无',
                           $proNameVal = $('#editProName').html() || '无',
                           $cssLink = $('#editCssLink').html() || '无',
                           $proDes = $('#editDes').html() || '无',
                           $submitTimeVal = new Date(),
                           $repositoryVal = $('#editRepository').html() || '无',
                           viLinkArr = this.viLinks;
                       _.map($('input','#tags'),function(input){
                           if(input.checked)
                               tagArr.push(input.getAttribute('data-value'));
                       });
                       _.map($('input','#editPerson'),function(input){
                           var data = {};
                           data.group = input.getAttribute('data-group');
                           data.value = input.value;
                           ueder.push(data);
                       });
                       var itemModel = new app.models.ItemModel({
                           'proName' : $proNameVal,
                           'person' : ueder,
                           'proDes' : $proDes,
                           'submitTime' : $submitTimeVal,
                           'repository' : $repositoryVal,
                           'lowfiLink' : $uiLink,
                           'viLink' : viLinkArr,
                           'cssLink' : $cssLink,
                           'picsLink' : $picsLink,
                           'proClass' : proClass,
                           'tag' : tagArr
                       });
                       app.collections.listCollection.create(itemModel,{
                           success:function(model,response){
                               w.location.hash = '#item/'+response.id;
                           }
                       })
                   },
               });

               app.views.UploadView = Backbone.View.extend({
                   tagName: 'div',
                   render: function(){
                       this.template = $.tpl['upload'];
                       this.$el.html(this.template({}));
                       this.options.$parentNode.html(this.el);
                       this.initializeUpload();
                       return this;
                   },
                   initializeUpload: function(){
                       var _this = this;
                       var viLinksObj = _this.options.viLinks;

                       var $fileSelect = this.$('#files');
                       $fileSelect.uploadifive({
                           'queueID': 'editVI',
                           'uploadScript': map_path + '/upload',
                           'itemTemplate': $.tpl['uploadCreateData'],
                           'buttonText': '上传文件',
                           'fileSizeLimit' : 200000,
                           //'dropTarget': '#editVI',
                           onInit: function(){
                               if(!_this.options.opts.isEdit){
                                   _this.$('#uploadifive-files').addClass('hidden');
                               }
                           },
                           'onUploadComplete': function (file, data) {
                               var dataObj = JSON.parse(data)[0],
                                   fileName = dataObj.name,
                                   filePath = dataObj.path,
                                   fileThumbnail = app.util.uploadThumbnail(fileName, dataObj.path),
                                   pic = {
                                       $item: file.queueItem,
                                       name: fileName,
                                       path: filePath,
                                       isEdit: true,
                                       thumbnail: fileThumbnail
                                   }
                               for(var i= 0; i< viLinksObj.length; i++){
                                   var item = viLinksObj[i];
                                   if(item.name == fileName){
                                       item.path = filePath;
                                   }
                               }
                               new app.views.UploaEditDataView({viLink: dataObj,viLinks: viLinksObj, pic: pic}).render();
                           },
                           'onAddQueueItem' : function(file) {
                               var name = file.name,
                                   queueItem = file.queueItem;
                               if(!app.util.uploadExtCheck(name)){
                                   $(this).uploadifive('cancel', queueItem.data('file'));
                                   queueItem.remove();
                               }else{
                                   viLinksObj.push({name: name});
                               }
                           }
                       });
                   }
               })

               app.views.UploaEditDataView = Backbone.View.extend({
                   tagName: 'div',
                   className: 'viBox editItem',
                   initialize: function(){
                       _.bindAll(this, 'removeVI');
                   },
                   render: function(){
                       this.template = $.tpl['uploadEditData'];

                       if(this.options.pic){
                           this.$el.append(this.template(this.options.pic));
                           this.options.pic.$item.after(this.el).remove();
                       }else{
                           this.$el.append(this.template(this.options.viLink));
                       }
                       return this;
                   },
                   events: {
                       'click .glyphicon-remove': 'removeVI'
                   },
                   removeVI: function(e){
                       var $this = $(e.srcElement ? e.srcElement : e.target),
                           path = $this.data('path'),
                           _this = this;
                       $.ajax({
                           url : map_path + '/deletePic/',
                           type : 'delete',
                           data: 'imgPath=' + path
                       }).success(function(data){
                           _this.options.viLinks = app.util.sliceViLinks(_this.options.viLinks,_this.options.viLink);
                           _this.$el.remove();
                       })
                   }
               })

               app.routers.appRouter = new app.routers.AppRouter();
               Backbone.history.start();
           })
        });
// render模板
    function renderTemplate(html, fn){
        $('head').append(html);
        $.tpl = {};

        $('script.backboneTemplate').each(function(index) {
            var $this = $(this);
            $.tpl[$this.attr('id')] = _.template($this.html());
            $this.remove();
        });

        $('script.template').each(function(index) {
            var $this = $(this);
            $.tpl[$this.attr('id')] = $this.html();
            $this.remove();
        });

        fn();
    }



})(window,jQuery)
  
