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
        itemsOnPage: 10,
        pageNumber: 1,
        resourceId: window.resourceId
    }

    /* 获取班级列表 */
    $.ajax({
        url: window.globalPath + '/student/getTeacherClass',
        type: 'POST',
        dataType: 'json',
        data: {resourceId: window.resourceId},
        success: function(resData){
            var classList = resData.result, class_html = '';
            for(var c_i= 0,c_iLen =classList.length; c_i<c_iLen; c_i++){
                var classSingle = classList[c_i]
                class_html += ' <li data-value="' + classSingle.classId + '">' + classSingle.gradeName + classSingle.className + '</li>';
            }
            $('.j-getAllClass').append(class_html);
        }
    });


    /* 分页 */
    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/student/getTeacherStudent',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();

            /* 获取数据失败 */

            if(!resObj || typeof resObj.pageInfo === 'undefined' || typeof resObj.result === 'undefined' || resObj.pageInfo.total == 0 || resObj.result.length == 0){
                $trlist = '<tr><td colspan="6"><div class="f-cr f-tac">没有当前条件下的学生通讯录信息 或 未获得学生通讯录信息列表数据</div> </td></tr>';
                $('.j-classNum').html(0);
            }else{
                var resDataInfo = resObj.pageInfo, $list = resObj.result;
                /* 正常获取数据 */
                _self.pageCount = resDataInfo.total;
                $('.j-classNum').html(_self.pageCount);

                for(var i = 0, listlen = $list.length; i < listlen; i++){
                    var _studentSingle = $list[i];
                    $trlist += ' <tr><td>' + _studentSingle.stuNum + '</td>' +
                        ' <td>' + _studentSingle.stuName + '</td>' +
                        ' <td>' + _studentSingle.sex + '</td>' +
                        ' <td>' + _studentSingle.mobile + '</td>' +
                        ' <td>' + _studentSingle.address + '</td>' +
                        ' </tr>'
                }
            }
            _self.returnPage.html($trlist);
        }
    }

    var contactList = new Pagination(options);
    contactList.init(PaginationOptions);

    var allClassList = new SelectUi($('.j-selectui-class'));
    allClassList.bindE(function(resVal, text){
        PaginationOptions.classId = resVal;
        $('.j-getClassName').html(text);
        PaginationOptions.pageNumber = 1;
        contactList.init(PaginationOptions);
    });

    /* 搜索 */
    $elements.$keywords.on('blur', function(){
        PaginationOptions.tempstr = $(this).val();
    })
    $elements.$queryKeywords.on('click', function(){
        PaginationOptions.tempstr = $elements.$keywords.val();
        PaginationOptions.pageNumber = 1;
        contactList.init(PaginationOptions);
    });

});