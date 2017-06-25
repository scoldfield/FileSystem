/**
 * simplePagination.js v1.6
 * A simple jQuery pagination plugin.
 * http://flaviusmatis.github.com/simplePagination.js/
 *
 * Copyright 2012, Flavius Matis
 * Released under the MIT license.
 * http://flaviusmatis.github.com/license.html
 */

(function($){

    var methods = {
        init: function(options){
            var o = $.extend({
                items: 0,
                itemsOnPage: 10,
                pages: 0,
                displayedPages: 3,
                edges: 2,
                currentPage: 0,
                hrefTextPrefix: '#page-',
                hrefTextSuffix: '',
                prevText: '上一页',
                nextText: '下一页',
                ellipseText: '&hellip;',
                cssStyle: 'compact-theme',
                listStyle: '',
                labelMap: [],
                selectOnClick: true,
                nextAtFront: false,
                invertPageOrder: false,
                useStartEdge: true,
                useEndEdge: true,
                onPageClick: function(page){
                    // Callback triggered when a page is clicked
                    // Page number is given as an optional parameter
                },
                onInit: function(){
                    // Callback triggered immediately after initialization
                }
            }, options || {});

            var self = this;

            o.pages = o.pages ? o.pages : Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1;
            if(o.currentPage)
                o.currentPage = o.currentPage - 1;
            else
                o.currentPage = !o.invertPageOrder ? 0 : o.pages - 1;
            o.halfDisplayed = o.displayedPages / 2;

            this.each(function(){
                self.addClass(o.cssStyle + ' simple-pagination').data('pagination', o);
                methods._draw.call(self);
            });

            o.onInit();

            return this;
        },

        selectPage: function(page){
            methods._selectPage.call(this, page - 1);
            return this;
        },

        prevPage: function(){
            var o = this.data('pagination');
            if(!o.invertPageOrder){
                if(o.currentPage > 0){
                    methods._selectPage.call(this, o.currentPage - 1);
                }
            }else{
                if(o.currentPage < o.pages - 1){
                    methods._selectPage.call(this, o.currentPage + 1);
                }
            }
            return this;
        },

        nextPage: function(){
            var o = this.data('pagination');
            if(!o.invertPageOrder){
                if(o.currentPage < o.pages - 1){
                    methods._selectPage.call(this, o.currentPage + 1);
                }
            }else{
                if(o.currentPage > 0){
                    methods._selectPage.call(this, o.currentPage - 1);
                }
            }
            return this;
        },

        getPagesCount: function(){
            return this.data('pagination').pages;
        },

        setPagesCount: function(count){
            this.data('pagination').pages = count;
        },

        getCurrentPage: function(){
            return this.data('pagination').currentPage + 1;
        },

        destroy: function(){
            this.empty();
            return this;
        },

        drawPage: function(page){
            var o = this.data('pagination');
            o.currentPage = page - 1;
            this.data('pagination', o);
            methods._draw.call(this);
            return this;
        },

        redraw: function(){
            methods._draw.call(this);
            return this;
        },

        disable: function(){
            var o = this.data('pagination');
            o.disabled = true;
            this.data('pagination', o);
            methods._draw.call(this);
            return this;
        },

        enable: function(){
            var o = this.data('pagination');
            o.disabled = false;
            this.data('pagination', o);
            methods._draw.call(this);
            return this;
        },

        updateItems: function(newItems){
            var o = this.data('pagination');
            o.items = newItems;
            o.pages = methods._getPages(o);
            this.data('pagination', o);
            methods._draw.call(this);
        },

        updateItemsOnPage: function(itemsOnPage){
            var o = this.data('pagination');
            o.itemsOnPage = itemsOnPage;
            o.pages = methods._getPages(o);
            this.data('pagination', o);
            methods._selectPage.call(this, 0);
            return this;
        },

        _draw: function(){
            var o = this.data('pagination'),
                interval = methods._getInterval(o),
                i,
                tagName;

            methods.destroy.call(this);

            tagName = (typeof this.prop === 'function') ? this.prop('tagName') : this.attr('tagName');

            var $panel = tagName === 'UL' ? this : $('<ul' + (o.listStyle ? ' class="' + o.listStyle + '"' : '') + '></ul>').appendTo(this);
            //总页
            $panel.prepend('<li class="pageInfo"><span class="page-mdl">共' + o.items + '条 第' + (o.currentPage + 1) + '/' + o.pages + '页 </span></li>');
            // Generate Prev link
            if(o.prevText){
                methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage - 1 : o.currentPage + 1, {text: o.prevText, classes: 'prev'});
            }

            // Generate Next link (if option set for at front)
            if(o.nextText && o.nextAtFront){
                methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage + 1 : o.currentPage - 1, {text: o.nextText, classes: 'next'});
            }

            // Generate start edges
            if(!o.invertPageOrder){
                if(interval.start > 0 && o.edges > 0){
                    if(o.useStartEdge){
                        var end = Math.min(o.edges, interval.start);
                        for(i = 0; i < end; i++){
                            methods._appendItem.call(this, i);
                        }
                    }
                    if(o.edges < interval.start && (interval.start - o.edges != 1)){
                        $panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
                    }else if(interval.start - o.edges == 1){
                        methods._appendItem.call(this, o.edges);
                    }
                }
            }else{
                if(interval.end < o.pages && o.edges > 0){
                    if(o.useStartEdge){
                        var begin = Math.max(o.pages - o.edges, interval.end);
                        for(i = o.pages - 1; i >= begin; i--){
                            methods._appendItem.call(this, i);
                        }
                    }

                    if(o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)){
                        $panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
                    }else if(o.pages - o.edges - interval.end == 1){
                        methods._appendItem.call(this, interval.end);
                    }
                }
            }

            // Generate interval links
            if(!o.invertPageOrder){
                for(i = interval.start; i < interval.end; i++){
                    methods._appendItem.call(this, i);
                }
            }else{
                for(i = interval.end - 1; i >= interval.start; i--){
                    methods._appendItem.call(this, i);
                }
            }

            // Generate end edges
            if(!o.invertPageOrder){
                if(interval.end < o.pages && o.edges > 0){
                    if(o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)){
                        $panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
                    }else if(o.pages - o.edges - interval.end == 1){
                        methods._appendItem.call(this, interval.end);
                    }
                    if(o.useEndEdge){
                        var begin = Math.max(o.pages - o.edges, interval.end);
                        for(i = begin; i < o.pages; i++){
                            methods._appendItem.call(this, i);
                        }
                    }
                }
            }else{
                if(interval.start > 0 && o.edges > 0){
                    if(o.edges < interval.start && (interval.start - o.edges != 1)){
                        $panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
                    }else if(interval.start - o.edges == 1){
                        methods._appendItem.call(this, o.edges);
                    }

                    if(o.useEndEdge){
                        var end = Math.min(o.edges, interval.start);
                        for(i = end - 1; i >= 0; i--){
                            methods._appendItem.call(this, i);
                        }
                    }
                }
            }

            // Generate Next link (unless option is set for at front)
            if(o.nextText && !o.nextAtFront){
                methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage + 1 : o.currentPage - 1, {text: o.nextText, classes: 'next'});
            }
            //跳转
            var jump = $('<input type="button" class="jump" value="跳转">');
            var jumpInfo = $('<span><!--每页显示--></span>');
            var jumpPagesize = $('<input type="text"   autocomplete="off"   id="pagenationSize" class="page-input" value="' + o.itemsOnPage + '">');
            var jumpPage = $('<input type="text"   autocomplete="off"   id="pagenationNumber" class="page-input" value="1">');
            var jumpMDL = $('<li></li>');


            jump.click(function(event){
                var textPagesize = Math.ceil(jumpPagesize.val());
                if(isNaN(textPagesize)){
                    textPagesize = o.itemsOnPage;
                }
                if(textPagesize < 1){
                    textPagesize = 1;
                }
                jumpPagesize.val(textPagesize);

                var textPage = Math.ceil(jumpPage.val());
                if(textPage < 1 || isNaN(textPage)){
                    textPage = 1;
                }
                if(textPage > Math.ceil(o.items / o.itemsOnPage)){
                    textPage = Math.ceil(o.items / o.itemsOnPage);
                }
                jumpPage.val(textPage);

                o.onPageClick({
                    pageNumber: jumpPage.val(),
                    pageSize: jumpPagesize.val()
                });
            });
            jumpPagesize.blur(function(){
                var textPagesize = Math.ceil(jumpPagesize.val());
                if(isNaN(textPagesize)){
                    textPagesize = o.itemsOnPage;
                }
                if(textPagesize < 1){
                    textPagesize = 1;
                }
                jumpPagesize.val(textPagesize);
            });
            jumpPagesize.bind('keypress', function(event){
                if(event.keyCode == "13"){
                    var textPagesize = Math.ceil(jumpPagesize.val());
                    if(isNaN(textPagesize)){
                        textPagesize = o.itemsOnPage;
                    }
                    if(textPagesize < 1){
                        textPagesize = 1;
                    }
                    jumpPagesize.val(textPagesize);

                    var textPage = Math.ceil(jumpPage.val());
                    if(textPage < 1 || isNaN(textPage)){
                        textPage = 1;
                    }
                    if(textPage > Math.ceil(o.items / o.itemsOnPage)){
                        textPage = Math.ceil(o.items / o.itemsOnPage);
                    }
                    jumpPage.val(textPage);

                    o.onPageClick({
                        pageNumber: jumpPage.val(),
                        pageSize: jumpPagesize.val()
                    });
                }
            });
            jumpPage.blur(function(){
                var textPage = Math.ceil(jumpPage.val());
                if(textPage < 1 || isNaN(textPage)){
                    textPage = 1;
                }
                if(textPage > Math.ceil(o.items / o.itemsOnPage)){
                    textPage = Math.ceil(o.items / o.itemsOnPage);
                }
                jumpPage.val(textPage);
            });
            jumpPage.bind('keypress', function(event){
                if(event.keyCode == "13"){
                    var textPagesize = Math.ceil(jumpPagesize.val());
                    if(isNaN(textPagesize)){
                        textPagesize = o.itemsOnPage;
                    }
                    if(textPagesize < 1){
                        textPagesize = 1;
                    }
                    jumpPagesize.val(textPagesize);

                    var textPage = Math.ceil(jumpPage.val());
                    if(textPage < 1 || isNaN(textPage)){
                        textPage = 1;
                    }
                    if(textPage > Math.ceil(o.items / o.itemsOnPage)){
                        textPage = Math.ceil(o.items / o.itemsOnPage);
                    }
                    jumpPage.val(textPage);

                    o.onPageClick({
                        pageNumber: jumpPage.val(),
                        pageSize: jumpPagesize.val()
                    });
                }
            });
           // jumpInfo.append(jumpPagesize);
            jumpInfo.append('转到');
            jumpInfo.append(jumpPage);
            jumpInfo.append('页 ');
            jumpInfo.append(jump);
            jumpMDL.append(jumpInfo);

            $panel.append(jumpMDL);
        },

        _getPages: function(o){
            var pages = Math.ceil(o.items / o.itemsOnPage);
            return pages || 1;
        },
        _getInterval: function(o){
            return {
                start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) : 0),
                end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
            };
        },

        _appendItem: function(pageIndex, opts){
            var self = this, options, $link, o = self.data('pagination'), $linkWrapper = $('<li></li>'), $ul = self.find('ul');

            pageIndex = pageIndex < 0 ? 0 : (pageIndex < o.pages ? pageIndex : o.pages - 1);

            options = {
                text: pageIndex + 1,
                classes: ''
            };

            if(o.labelMap.length && o.labelMap[pageIndex]){
                options.text = o.labelMap[pageIndex];
            }

            options = $.extend(options, opts || {});

            if(pageIndex == o.currentPage || o.disabled){
                if(o.disabled){
                    $linkWrapper.addClass('disabled');
                }else{
                    $linkWrapper.addClass('active');
                }
                $link = $('<span class="current">' + (options.text) + '</span>');
            }else{
                $link = $('<a href="' + o.hrefTextPrefix + (pageIndex + 1) + o.hrefTextSuffix + '" class="page-link">' + (options.text) + '</a>');
                $link.click(function(event){
                    return methods._selectPage.call(self, pageIndex, event);
                });
            }

            if(options.classes){
                $link.addClass(options.classes);
            }

            $linkWrapper.append($link);

            if($ul.length){
                $ul.append($linkWrapper);
            }else{
                self.append($linkWrapper);
            }
        },

        _selectPage: function(pageIndex, event){
            var o = this.data('pagination');
            o.currentPage = pageIndex;
            if(o.selectOnClick){
                methods._draw.call(this);
            }
            return o.onPageClick({
                pageNumber: pageIndex + 1,
                pageSize: o.itemsOnPage

            });
        }

    };
    $.fn.pagination = function(method){

        // Method calling logic
        if(methods[method] && method.charAt(0) != '_'){
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || !method){
            return methods.init.apply(this, arguments);
        }else{
            $.error('Method ' + method + ' does not exist on jQuery.pagination');
        }
    };

})(jQuery);

/* Pagination expand */
function Pagination(options){
    this.pageCount = 0;//总条数
    this.parmester = null;  //* 接口发送参数；
    this.returnPage = options.returnPage; //返回结果放置的容器；
    this.tabPagination = options.tabPagination; //页码容器；
    this.ajaxurl = options.ajaxurl;
    this.render = options.render;
    this.hasPagination = false;
}

Pagination.prototype.init = function(parmester, callback){
    var _Pagination = this;
    _Pagination.hasPagination = false;
    _Pagination.pageCount=0;
    _Pagination.parmester = parmester;
    _Pagination.rendenList(_Pagination.parmester);
    if(callback){
        callback(options);
    }
};

Pagination.prototype.paginationFn = function(parmester){
    var _Pagination = this;
    this.hasPagination = true;
    _Pagination.tabPagination.pagination({
        items: _Pagination.pageCount, //总条数
        itemsOnPage: parmester.itemsOnPage, // 每页条数
        currentPage: parmester.pageNumber,// 当前页
        onPageClick: function(page){
            parmester.pageNumber = page.pageNumber;
            parmester.itemsOnPage = page.pageSize;
            _Pagination.rendenList(parmester);
        }
    });
};

Pagination.prototype.rendenList = function(parmester){
    var _Pagination = this;
    $.ajax({
        url: _Pagination.ajaxurl,
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(resObjData){
            if(resObjData){
                _Pagination.render(resObjData);
                !_Pagination.hasPagination && _Pagination.paginationFn(parmester);
            }else{
                alert('未能从服务器中获取数据.')
            }
        },
        erro:function(){
            alert('数据库获取失败.')
        }
    });
};


