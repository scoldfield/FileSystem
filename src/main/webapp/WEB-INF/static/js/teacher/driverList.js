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
        'ymPrompt': '../plug/ymPrompt/ymPrompt'
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'Pagination': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']},
        'mypannel': {deps: ['jquery']}
    },
    waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'Pagination'], function(jquery){

    /* 分页 */
    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/driver/getDriversList',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();
            /* 获取数据失败 */
            if(!resObj || typeof resObj.total === 'undefined' || resObj.total == 0){
                $trlist = '<tr><td colspan="6"><div class="f-cr f-tac">没有当前条件下的司机 或 未获得司机列表数据</div> </td></tr>';
                $('.j-getDriverNum').text(0);
            }else{
                /* 正常获取数据 */
                _self.pageCount = resObj.total;
                $('.j-getDriverNum').text(_self.pageCount);
                var $list = resObj.list;
                for(var i = 0, listlen = $list.length; i < listlen; i++){
                    var _driverSingle = $list[i];
                    $trlist += ' <tr><td>' + _driverSingle.name + '</td>' +
                        ' <td>' + _driverSingle.mobile + '</td>' +
                        ' <td>' + _driverSingle.driveAgeForShow + '</td>' +
                        ' <td>' + _driverSingle.bustype + '</td>' +
                        ' <td>' + _driverSingle.platenum + '</td>' +
                        ' <td><a class="general" href="' + window.globalPath + '/driver/' + _driverSingle.id + '/update">编辑</a>' +
                        '<a data-id="' + _driverSingle.id + '" class="general j-delete" >删除</a></td>' +
                        ' </tr>'
                }
            }
            _self.returnPage.html($trlist);
        }
    }

    var PaginationOptions = {
        itemsOnPage: 10,
        pageNumber: 1,
        key: ''
    }

    var noticeList = new Pagination(options);
    noticeList.init(PaginationOptions);


    /* 搜索 */
    $('.j-queryKeyword').bind('click', function(){
        PaginationOptions.key = $('.j-Keyword').val();
        PaginationOptions.pageNumber = 1;
        noticeList.init(PaginationOptions);
    });


    options.returnPage.delegate('.j-delete', 'click', function(){
        var $this = $(this), _id = $this.attr('data-id');
        ymPrompt.confirmInfo({
            message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>    是否删除该司机信息？</h2></div>',
            width: 320,
            height: 200,
            titleBar: false,
            handler: function(res){
                if(res == 'ok'){
                    location.href = window.globalPath + '/driver/' + _id + '/delete';
                }
            }
        });
    })
});