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
        'My97DatePicker': '../plug/My97DatePicker/WdatePicker',
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
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'My97DatePicker', 'Pagination'], function(jquery){
    /* 全选 */

    var $elements = {
        $tab: $('#tab'),
        $queryKeywords: $('.j-queryKeywordBtn'), // 关键字搜索按钮
        $keywords: $('.j-queryKeyword')
    }

    var PaginationOptions = {
        itemsOnPage: 10,
        pageNumber: 1,
    }


    /*    if(resList.count){
     $('.j-applyCount').append('<span class="num">' + resList.count + '</span>')
     }*/

    /* 分页 */
    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/askforleaves/getList',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();

            /* 班级名称 */
            $('.j-getClassName').html(resObj.Name);

            var resData = resObj.pageInfo; //获取列表数据
            /* 获取班级列表 */
            var classList = resObj.middleList, class_html = '';
            for(var c_i = 0, cilen = classList.length; c_i < cilen; c_i++){
                var classSingle = classList[c_i];
                class_html += '<li data-value="' + classSingle.classId + '">' + classSingle.gradeName + classSingle.className + '</li>'
            }
            $('.j-classListWrap').html(class_html);
            /* 获取数据失败 */
            if(!resObj || typeof resData.total === 'undefined' || resData.total == 0){
                $trlist = '<tr><td colspan="8"><div class="f-cr f-tac">无当前条件下的请假记录</div> </td></tr>';
                $('.j-getAttendanceNum').text(0);
                $('.j-classNum').text(0);
            }else{
                /* ****正常获取数据*** */
                /* 页面数据 */

                _self.pageCount = resData.total;
                $('.j-classNum').text(resObj.ask);
                var $list = resData.list;
                for(var i = 0, listlen = $list.length; i < listlen; i++){
                    var _attendanceSingle = $list[i],
                        sTimer = new Date(_attendanceSingle.starttime.time),
                        eTimer = new Date(_attendanceSingle.endtime.time),
                        startTime = sTimer.getFullYear() + '-' + parseInt(sTimer.getMonth() + 1) + '-' + sTimer.getDate() + ' ' + sTimer.getHours() + ':' + sTimer.getMinutes(),
                        endTime = eTimer.getFullYear() + '-' + parseInt(eTimer.getMonth() + 1) + '-' + eTimer.getDate() + ' ' + eTimer.getHours() + ':' + eTimer.getMinutes();

                    $trlist += ' <tr>' +
                        '<td>' + _attendanceSingle.stuNum + '</td>' +
                        ' <td>' + _attendanceSingle.stuName + '</td>' +
                        ' <td>' + _attendanceSingle.mobile + '</td>' +
                        ' <td>' + startTime + ' 至 ' + endTime + '</td>' +
                        ' <td>' + _attendanceSingle.leaveType + '</td>' +
                        ' <td><div class="overflowContent"><p> ' + _attendanceSingle.content + '</p></div></td> ';
                    if(_attendanceSingle.disable == 2){
                        $trlist += ' <td>待审核</td><td><a class="general j-oprate" data-type="refused" data-id="' + _attendanceSingle.id + '" href="javascript:void(0);">通过</a><a  class="general j-oprate" data-type="through" data-id="' + _attendanceSingle.id + '" href="javascript:void(0);">拒绝</a></td>';
                    }else if(_attendanceSingle.disable == 1){
                        $trlist += ' <td>通过</td><td><span class="f-cgray" >通过</span>  <span class="f-cgray" >拒绝</span></td>';
                    }else if(_attendanceSingle.disable == 0){
                        $trlist += ' <td>未通过</td><td><span class="f-cgray" >通过</span>  <span class="f-cgray" >拒绝</span></td>';
                    }else if(_attendanceSingle.disable == -1){
                        $trlist += ' <td>删除</td><td><span class="f-cgray" >通过</span>  <span class="f-cgray" >拒绝</span></td>';
                    }
                    $trlist += '</tr>'
                }
            }
            _self.returnPage.html($trlist);
        }
    }


    var attendanceList = new Pagination(options);
    attendanceList.init(PaginationOptions);

    /* 搜索 */
    $elements.$keywords.on('blur', function(){
        PaginationOptions.keyword = $(this).val();
    })
    $elements.$queryKeywords.on('click', function(){
        PaginationOptions.keyword = $elements.$keywords.val();
        PaginationOptions.pageNumber = 1;
        attendanceList.init(PaginationOptions);
    });

    /* 切换班级 */
    var selectClass = new SelectUi($('.j-selectui-class'));
    selectClass.bindE(function(val, text){
        PaginationOptions.classIds = val;
        $('.j-getClassName').html(text);
        PaginationOptions.pageNumber = 1;
        attendanceList.init(PaginationOptions);
    });


    options.returnPage.on('click', '.j-oprate', function(event){
        var $this = $(this),
            _type = $this.attr('data-type'),
            _id = $this.attr('data-id'),
            ajaxUrl = '',
            typeText = '';
        if(_type == 'through'){
            ajaxUrl = 'through';
            typeText = '拒绝'
        }else if(_type == 'refused'){
            ajaxUrl = 'refused';
            typeText = '批准'
        }
        var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
            '<h2>' + typeText + '请假申请？</h2></div>';
        ymPrompt.confirmInfo({
            message: _html,
            width: 400,
            height: 220,
            titleBar: false,
            handler: function(res){
                if(res == 'ok'){
                    $.ajax({
                        url: window.globalPath + '/askforleaves/' + ajaxUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: {id: _id, content: ''},
                        success: function(res){
                            if(res.result == true){
                                setTimeout(function(){
                                    location.reload()
                                }, 3000);
                                ymPrompt.succeedInfo({
                                    width: 320,
                                    height: 220,
                                    message: '<div class="ym-inContent ym-inContent-success oneline"><h2>已' + typeText + '！</h2></div>',
                                    handler: function(){
                                        location.reload()
                                    }
                                })
                            }else{
                                ymPrompt.succeedInfo({
                                    width: 320,
                                    height: 220,
                                    message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>' + typeText + '失败！</h2></div>',
                                    handler: function(){
                                        location.reload()
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });


});