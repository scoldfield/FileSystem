/**
 * Document by wangshuyan@chinamobile.com on 2015/11/12 0012.
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
require(['jquery', 'base', 'function', 'ymPrompt', 'Pagination'], function(jquery){
    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/localAccount/getPersonList',
        render: function(resData){
            var _self = this, $trlist = '',resObj=resData.list;
            _self.returnPage.empty();
            !_self.pageCount && (_self.pageCount = resObj.total);
            
            var isDel = resData.isDel
            
            if(!resObj){
                $trlist = '<tr><td colspan="6" align="center">未获取到列表数据</td></tr> ';
            }else{
                var $list = resObj.list, listlen = $list.length;
                if($list.length == 0){
                    $trlist = '<tr><td colspan="6" align="center">暂无相关结果</td></tr> ';
                }else{
                    for(var i in $list){
                        if($list.hasOwnProperty(i)){
                            var _list = $list[i], _id = _list.id || 0, _username = _list.username || '', _areaNames = _list.areaNames || '', _mobile = _list.mobile || '', _name = _list.name || '', _password = _list.password || '', _roleNames = _list.roleNames;

 
                        	var isDelHtml = isDel ==='true' ? ('<a data-id="' + _id + '"  class="general j-del"  href = "javascript:void(0)" >删除</a>') : ''

                            $trlist += ('<tr><td>' + _name + '</td>' +
                            '<td><div class="s-showmore"><b> ' + _areaNames + '</b></div></td>' +
                            '<td>' + _mobile + '</td>' +
                            '<td>' + _username + '</td>' +
                            '<td>' + _roleNames + '</td>' +
                            '<td><a class="general" href="' + window.globalPath + '/localAccount/' + _id + '/update">修改</a>' +
                            isDelHtml +
                            '</td></tr>');
                        }
                    }
                }
            }
            _self.returnPage.html($trlist);
        }
    };

    var optionsQueryObj = {
        itemsOnPage: 10,
        pageNumber: 1,
        keyword: ''
    }

    var localCountList = new Pagination(options);
    localCountList.init(optionsQueryObj);

    $('.j-queryBtn').bind('click', function(){

        optionsQueryObj.keyword = $('.j-queryWords').val();
        optionsQueryObj.pageNumber = 1;
        localCountList.init(optionsQueryObj);

    });


    (function(){

        function reloadHref(){
            location.reload()
        }

        options.returnPage.delegate('.j-del', 'click', function(){
            var id = $(this).attr('data-id');
            ymPrompt.confirmInfo({
                message: '确定删除该人员吗?', titleBar: false, handler: function(res){
                    if(res == 'ok'){
                        $.ajax({
                            url: window.globalPath + '/localAccount/' + id + '/delete',
                            type: 'get',
                            success: function(resmsg){
                                var _msg = JSON.parse(resmsg);
                                if(_msg.result == true){
                                    ymPrompt.succeedInfo({
                                        message: '删除成功', titleBar: false, handler: reloadHref
                                    });
                                    setTimeout(reloadHref, 3000);
                                }else{
                                    alert('未删除成功');
                                }
                            },
                            error: function(){
                                alert('未删除成功');
                            }
                        });
                    }
                }
            });


        });
    })();


});