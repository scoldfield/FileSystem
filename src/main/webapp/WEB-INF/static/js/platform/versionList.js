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

    var appTypename = {'0':'IOS', '1':'Android'};
    var upflgName = {'0':'是','1':'否'};

    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/version/versionList',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();
            !_self.pageCount && (_self.pageCount = resObj.total);
            if(!resObj){
                $trlist = '<tr><td colspan="8" align="center">未获取到版本数据</td></tr> ';
            }else{
                var $list = resObj.list, listlen = $list.length;
                if($list.length == 0){
                    $trlist = '<tr><td colspan="8" align="center">未获取到版本数据</td></tr> ';
                }else{
                    for(var i in $list){
                        if($list.hasOwnProperty(i)){
                            var _list = $list[i];
                            $trlist += ('<tr><td>' + _list.releasedate + '</td>' +
                            '<td>' + _list.appname + '</td>' +
                            '<td>' + _list.version + '</td>' +
                            '<td>' + _list.build + '</td>' +
                            '<td>' + upflgName[_list.upflg] + '</td>' +
                            '<td><div class="s-showmore" ><b>' + _list.appurl + '</b></div></td>' +
                            '<td>' + appTypename[_list.apptype] + '</td>' +
                            '<td><a class="general" href="' + window.globalPath + '/version/' + _list.id + '/toUpd">修改</a>' +
                            '<a data-id="' + _list.id + '" class="general j-del"  href="javascript:void(0)">删除 </a></td></tr>');
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
        appname: ''
    }

    var versionList = new Pagination(options);
    versionList.init(optionsQueryObj);

    $('.j-queryWords').bind('click', function(){
        optionsQueryObj.appname = $('.j-queryBtn').val();
        optionsQueryObj.pageNumber = 1;
        versionList.init(optionsQueryObj);
    });


    options.returnPage.delegate('.j-del', 'click', function(){
        var id = $(this).attr('data-id');
        ymPrompt.confirmInfo({
            message: '确定删除该版本吗?',
            titleBar: false,
            handler: function(res){
                if(res == 'ok'){
                    $.ajax({
                        url: window.globalPath + '/version/' + id + '/delete',
                        type: 'get',
                        dataType: 'json',
                        success: function(resmsg){
                            if(resmsg.result == true){
                                ymPrompt.succeedInfo({
                                    message: '删除成功', titleBar: false, handler: function(){
                                        location.reload()
                                    }
                                });
                                setTimeout(function(){
                                    location.reload()
                                }, 3000);
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
});