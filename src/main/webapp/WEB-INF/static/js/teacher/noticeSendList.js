/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/baseTeacher',
        'function': '../common/function',
        'Pagination': '../plug/simplePagination/jquery.simplePagination',
        'mypannel': '../common/teacherSideBar',
        'ymPrompt': '../plug/ymPrompt/ymPrompt',
        'emoji': '../common/emoji'
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'Pagination': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']},
        'mypannel': {deps: ['jquery']},
        'emoji': {deps: ['jquery']}
    },
    waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'Pagination', 'emoji'], function(jquery){
    var PaginationOptions = {
        itemsOnPage: 10,
        pageNumber: 1,
        noticetype: window.noticeType,
        appTitle: ''
    }

    /* 搜索 */
    $('.j-queryKeyword').bind('click', function(){
        PaginationOptions.appTitle = $('.j-Keyword').val();
        PaginationOptions.pageNumber = 1;
        noticeList.init(PaginationOptions);
    });


    /* 分页 */
    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/schoolnotice/sendNoticeJson',
        render: function(resObj){
            var _self = this, $trlist = '', _pathUrl = PaginationOptions.noticetype === 0 ? 'schoolnotice' : 'classnotice';
            _self.returnPage.empty();
            if(!resObj || typeof resObj.total == 'undefined' || resObj.total == 0){
                $trlist = '<tr><td colspan="4"><div class="f-cr">暂没有消息公告</div> </td></tr>'
            }else{
                !_self.pageCount && (_self.pageCount = resObj.total);
                var $list = resObj.list, listlen = $list.length;
                for(var i = 0; i < listlen; i++){
                    var listSingle = $list[i];
                    $trlist += ' <tr><td> <label class="checkbox-ui"><input type="checkbox" value="' + listSingle.id + '"/><b></b></label> </td>' +
                        ' <td><a class="long" href="' + window.globalPath + '/' + _pathUrl + '/noticeDetail?id=' + listSingle.id + '&pId=' + listSingle.pId + '">' + listSingle.content + '</a></td>' +
                        ' <td><a class="long j-selectRecipientBtn" data-id="' + listSingle.id + '" href="javascript:void(0)">共' + listSingle.total + '人</a></td>' +
                        ' <td>' + listSingle.publishtime.split('.')[0] + '</td>' +
                        ' </tr>'
                }
            }
            _self.returnPage.html($trlist);
            _self.returnPage.find('.emoji').emoji();
        }
    }


    var noticeList = new Pagination(options);
    noticeList.init(PaginationOptions);


    /* 全选 */
    $('.j-selectAll').bind('change', function(){
        var $this = $(this);
        var isAllCheck = $this.attr('checked');
        options.returnPage.find('input[type=checkbox]').each(function(){
            var _$this = $(this);
            if(_$this.is(':checked')){
                if(!isAllCheck){
                    _$this.removeAttr('checked');
                }
            }else{
                if(isAllCheck){
                    _$this.attr('checked', 'checked');
                }
            }
        });
    });

    options.returnPage.on('click', 'input[type=checkbox]', function(){
        if(options.returnPage.find('input[type=checkbox]').length === options.returnPage.find('input[type=checkbox]:checked').length){
            $('.j-selectAll').attr('checked', 'checked');
        }else{
            $('.j-selectAll').removeAttr('checked');
        }
    });


    /* 批量删除*/
    $('.j-batchDelete').bind('click', function(){

        var deleteAr = [], deleteStr = ''
        options.returnPage.find('input[type=checkbox]').each(function(){
            var _$this = $(this);
            if(_$this.is(':checked')){
                deleteAr.push(_$this.val());
            }
        });
        if(deleteAr.length > 0){
            var html = '<div class="ym-inContent ym-inContent-warning">' +
                '<div class="content">' +
                '<h2>确认删除？</h2>' +
                '<p>删除信息后将无法回复</p></div></div>';
            ymPrompt.confirmInfo({
                message: html, width: 450, height: 300, handler: function(res){
                    if(res == 'ok'){
                        var deleteAr = [], deleteStr = ''
                        options.returnPage.find('input[type=checkbox]').each(function(){
                            var _$this = $(this);
                            if(_$this.is(':checked')){
                                deleteAr.push(_$this.val());
                            }
                        });
                        deleteStr = deleteAr.join(',');
                        $.ajax({
                            url: window.globalPath + '/schoolnotice/senddelete',
                            data: {'ids': deleteStr},
                            type: 'POST',
                            dataType: 'json',
                            success: function(resMsg){
                                if(resMsg.result == 'success'){
                                    ymPrompt.succeedInfo({
                                        message: '成功删除' + resMsg.num + '条消息!', titleBar: false, handler: function(){
                                            location.reload();
                                            setTimeout(function(){
                                                location.reload();
                                            }, 3000);
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            });
        }else{
            ymPrompt.succeedInfo({
                message: '未勾选任何通知',
                width: 260,
                height: 200,
                titleBar: false
            })
        }
    });

    options.returnPage.on('click', 'a.j-selectRecipientBtn', function(){
        var $this = $(this), _id = $this.attr('data-id');
        var contentHTML = '<ul class="m-noticeRecipientContent"></ul>'
    });


});