/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/base',
        'function': '../common/function',
        'ymPrompt': '../plug/ymPrompt/ymPrompt',
        'Pagination': '../plug/simplePagination/jquery.simplePagination'
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'Pagination': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']}
    },
    waitSeconds: 0
});
require(['jquery', 'Pagination', 'ymPrompt', 'base', 'function'], function(jquery){

    var activeConfigList = {}

    activeConfigList.options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/activeconfig/activeconfiglist ',
        render: function(res){
            var _self = this, $trlist = '', _colspan = 0;
            if(res && res.result == 'success'){
                var resObj = res.pageInfo;
                _self.returnPage.empty();
                !_self.pageCount && (_self.pageCount = resObj.total);
                for(var i = 0, ilen = resObj.list.length; i < ilen; i++){
                    if(resObj.list.hasOwnProperty(i)){
                        var single = resObj.list[i];
                        $trlist += '<tr>' +
                            ' <td>' + single.time + '</td>' +
                            ' <td>' + single.title + '</td>' +
                            ' <td><div class="s-showmore"><b>' + single.url + '</b></div></td>' +
                            '<td>' + single.weight + '</td>' +
                            '<td><div class="s-showmore"><b>' + single.areaName + '</b></div></td>' +
                            '<td>' + single.applyCount + '人; <a class="j-download" data-id="' + single.id + '" target="_blank"  href="' + window.globalPath + '/activeconfig/download?activeId=' + single.id + '">下载</a></td>' +
                            ' <td><span><a data-id="' + single.id + '" class="general edit" href="' + window.globalPath + '/activeconfig/detail?id=' + single.id + '">修改</a><a data-id="' + single.id + '" class="general j-del" href="javascript:void(0)">删除</a></span></td>' +
                            '</tr>'
                    }
                }

            }else{
                var errormessage = res && res.result ? res.result : '暂无活动配置'
                $trlist += '<tr><td colspan="7">' + errormessage + '</td></tr>';
            }
            _self.returnPage.html($trlist);
        }
    };

    activeConfigList.PaginationOptions = {
        itemsOnPage: 10,
        pageNumber: 1
    }

    activeConfigList.pagination = new Pagination(activeConfigList.options);
    activeConfigList.pagination.init(activeConfigList.PaginationOptions);

    /* 搜索 */
    $('.j-queryBtn').on('click', function(){
        var _val = $('.j-queryIpt').val();
        activeConfigList.PaginationOptions.title = _val;
        activeConfigList.PaginationOptions.pageNumber = 1;
        activeConfigList.pagination.init(activeConfigList.PaginationOptions);
    });


    activeConfigList.options.returnPage.delegate('.j-del', 'click', function(){
        /* 获取参数 */
        var $this = $(this), _id = $this.attr('data-id');
        ymPrompt.confirmInfo({
            message: '是否删除该活动配置',
            titleBar: false,
            handler: function(res){
                if(res === 'ok'){
                    $.ajax({
                        url: window.globalPath + '/activeconfig/delete ',
                        type: 'POST',
                        dataType: 'json',
                        data: {id: _id},
                        success: function(res){
                            if(res.result == 'success'){
                                $this.parents('tr').remove();
                            }else{
                                ymPrompt.alert({
                                    message: '删除失败!<br />' + res.results,
                                    titleBar: false
                                });
                            }
                        }, error: function(){
                            ymPrompt.alert({
                                message: '删除失败!<br />',
                                titleBar: false
                            });
                        }
                    });
                }
            }
        });
    })
    //发布时间的排序;
    $('#tabHead').delegate('.j-sort', 'click', function(){
        var $this = $(this), _val = $this.attr('data-value');
        activeConfigList.PaginationOptions.orderBy = _val;
        activeConfigList.PaginationOptions.pageNumber = 1;
        activeConfigList.pagination.init(activeConfigList.PaginationOptions);
        $this.addClass('current').siblings().removeClass('current');
    })
});