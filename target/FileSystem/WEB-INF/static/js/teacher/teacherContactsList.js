/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/baseTeacher',
        'function': '../common/function',
        'mypannel': '../common/teacherSideBar',
        'ymPrompt': '../plug/ymPrompt/ymPrompt',
        'Pagination': '../plug/simplePagination/jquery.simplePagination',
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']},
        'mypannel': {deps: ['jquery']},
        'Pagination': {deps: ['jquery']},
    },
    waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'Pagination'], function(jquery){
    /* 全选 */

    var $elements = {
        $keywords: $('.j-Keyword'),
        $queryKeywords: $('.j-queryKeyword')
    }

    var PaginationOptions = {
        itemsOnPage: 4,
        pageNumber: 1,
    }


    /* 分页 */
    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/contact/getTeacherList',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();

            /* 获取数据失败 */

            if(!resObj || typeof resObj.pageInfo === 'undefined' || typeof resObj.teacherList === 'undefined' || resObj.pageInfo.total == 0 || resObj.teacherList.length == 0){
                $trlist = '<tr><td colspan="6"><div class="f-cr f-tac">没有当前条件下的教师通讯录 或 未获得教师通讯录列表数据</div> </td></tr>';
                $('.j-classNum').html(0);
            }else{
                var resDataInfo = resObj.pageInfo, $list = resObj.teacherList,schoolName = resObj.schoolName;
                /* 正常获取数据 */
                _self.pageCount = resDataInfo.total;
                $('.j-classNum').html(_self.pageCount);

                for(var i = 0, listlen = $list.length; i < listlen; i++){
                    var _studentSingle = $list[i];
                    $trlist += ' <tr><td>' + _studentSingle.workNumber + '</td>' +
                        ' <td>' + _studentSingle.name + '</td>' +
                        ' <td>' + _studentSingle.mobile + '</td>' +
                        ' <td><div class="overflowContent"><p> ' + _studentSingle.positionName + '</p></div></td>' +
                       // ' <td>查看</td>' +
                        ' </tr>';
                    $('.j-getClassName').html(schoolName)
                }
            }
            _self.returnPage.html($trlist);
        }
    }

    var contactList = new Pagination(options);
    contactList.init(PaginationOptions);


    /* 搜索 */
    $elements.$keywords.on('blur', function(){
        PaginationOptions.tempstr = $(this).val();
    })
    $elements.$queryKeywords.on('click', function(){
        PaginationOptions.tempstr = $elements.$keywords.val();
        PaginationOptions.pageNumber=1;
        contactList.init(PaginationOptions);
    });

});