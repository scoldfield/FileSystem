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
        ajaxurl: window.globalPath + '/agentnotice/receiveNoticeJson',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();
            !_self.pageCount && (_self.pageCount = resObj.total);
            if(!resObj){
                $trlist = '<li class="f-tac">没有公告</li> ';
            }else{
                var $list = resObj.list, listlen = $list.length;
                if($list.length == 0){
                    $trlist = '<li class="f-tac">没有公告</li> ';
                }else{
                    for(var i in $list){
                        if($list.hasOwnProperty(i)){
                            var noticeSingle = $list[i];
                            var content = noticeSingle.content.length > 200 ? noticeSingle.content.substr(0, 200) + '...' : noticeSingle.content;
                            var isread = noticeSingle.isread === '1' ? 'isread' : ''
                            $trlist += ('<li>' +
                            ' <p class="title">' +
                            ' <a  class="j-title ' + isread + '" data-id="' + noticeSingle.id + '" data-pid="' + noticeSingle.pId + '" href="javascript:void(0)">' + content + '</a>' +
                            ' </p>' +
                            ' <p class="info"><a class="author">' + noticeSingle.sendName + ' </a><a class="date">' + noticeSingle.time + '</a></p>' +
                            ' </li>');
                        }
                    }
                }
            }
            _self.returnPage.html($trlist);
        }
    };

    var optionsNoticeObj = {
        itemsOnPage: 3,
        pageNumber: 1,
    }

    var noticeList = new Pagination(options);
    noticeList.init(optionsNoticeObj);


    options.returnPage.delegate('.j-title', 'click', function(){
        var $this = $(this), id = $this.attr('data-id'), pid = $this.attr('data-pid');
        $this.removeClass('isread');

        $.ajax({
            url: window.globalPath + '/agentnotice/readDetail',
            type: 'POST',
            dataType: 'json',
            data: {id: id, personid: pid},
            success: function(res){
                var w = $(window).width(), h = $(window).height();
                var _html = '<div class="m-noticeDetail">' +
                    '<h2>' + res.title + '</h2>' +
                    '<div class="info f-cb"><p class="author f-fl">发布人：' + res.sendName + '</p><p class="date f-fl">发布时间：' + res.time + '</p></div>' +
                    '<div class="content">' + res.content + '</div> </div>'
                ymPrompt.win({
                    message: _html,
                    width: w - 200,
                    height: h - 100,
                    title: '查看公告:' + res.title,
                    maskAlpha: 0.7
                })
            }
        });


    });


});