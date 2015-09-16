(function(w,$){
    app.routers.AppRouter = Backbone.Router.extend({
            routes : {
                ''  :  'list',
                'list'  :  'list',
                'list/:currentPage'  :  'listPaging',
                'item/:id'  :  'detail',
                'addItem'  :  'add'
            },
            initialize: function(){
                /*this.route(/./, "changeHeader", function(number){

                });*/
            },
            // 列表页
            list : function(){
                if(!app.views.listHeaderView){
                    app.views.listHeaderView = new app.views.HeaderView({model: app.pagesHeader.list}).render();
                }else{
                    app.views.listHeaderView.render();
                }

                app.collections.listCollection.fetch({
                    data: {keyword: app.models.pagingModel.get('keyword'), currentPage: 1, pageSize: app.pagingNum},
                    success: function (collection, res) {
                        if(! app.views.listView){
                            app.views.listView = new app.views.ListView({collection: collection, model: app.models.pagingModel}).render();
                        }else{
                            app.models.pagingModel.set({page: 1});
                            app.views.listView.render();
                            app.views.listDataView.render();
                            app.views.pagingView.render();
                        }
                        //app.views.listView = new app.views.ListView({collection: collection}).render();
                    }
                });
            },
            // 列表页
            listPaging : function(currentPage){
                if(!app.views.listHeaderView){
                    app.views.listHeaderView = new app.views.HeaderView({model: app.pagesHeader.list}).render();
                }else{
                    app.views.listHeaderView.render();
                }

                app.models.pagingModel.set('page',currentPage);
                app.collections.listCollection.fetch({
                    data: {keyword: app.models.pagingModel.get('keyword'), currentPage: currentPage, pageSize: app.pagingNum},
                    success: function (collection, res) {
                        if(!app.views.listView){
                            app.views.listView = new app.views.ListView({collection: collection, model: app.models.pagingModel}).render();
                        }else{
                            app.views.listDataView.render();
                        }
                    }
                });
            },
            // 详情页
            detail : function(id){
                if(!app.views.detailHeaderView){
                    app.views.detailHeaderView = new app.views.HeaderView({model: app.pagesHeader.detail}).render();
                }else{
                    app.views.detailHeaderView.render();
                }

                if(!this.model){
                    this.model = new app.models.ItemModel({id: id});
                }
                this.model.set({id: id});
                //有问题
                this.model.fetch({
                    success:function(model,response){
                        if(app.views.detailView){
                            app.views.detailView.render();
                        }else{
                            app.views.detailView = new app.views.DetailView({model: model}).render();
                        }
                    }
                })
            },
            // 填写页
            add :  function(){
                if(!app.views.addHeaderView){
                    app.views.addHeaderView = new app.views.HeaderView({model: app.pagesHeader.add}).render();
                }else{
                    app.views.addHeaderView.render();
                }

                if(app.views.addView){
                    app.views.addView.render();
                }else{
                    app.views.addView  = new app.views.AddView().render();
                }
            }
        })

})(window,jQuery);

