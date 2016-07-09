/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
    urlArgs: 'v=' + new Date().getTime(),
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/baseTeacher',
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
require(['jquery', 'function', 'base', 'Pagination', 'ymPrompt'], function(){

    /* 获取全部班级信息 */
    $.ajax({
        url: window.globalPath + '/student/getAllClass',
        type: 'POST',
        dataType: 'json',
        data: {resourceId: window.resourceId},
        success: function(resList){

            if(resList.count){
                $('.j-applyCount').append('<span class="num">' + resList.count + '</span>')
            }

            var $classList = '<li data-value="">所有班级</li>';
            for(var i = 0, ilen = resList.result.length; i < ilen; i++){
                var classSingle = resList.result[i],
                    _gradeName = classSingle.gradeName,
                    _className = classSingle.className,
                    _classId = classSingle.classId;
                $classList += '<li data-value="' + _classId + '">' + _gradeName + '  ' + _className + '</li>';
            }
            $('.j-classTabList').html($classList)
        }
    });


    /* 分页 */
    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/student/getAllStudent',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();

            /* 获取数据失败 */
            if(!resObj || !resObj.pageInfo || resObj.pageInfo.total == 0){
                $trlist = '<tr><td colspan="5"><div class="f-cr f-tac">没有当前条件下的学生 或 未获得学生数据</div> </td></tr>';
                $('.j-getClassNum').text(0);
            }else{
                /* 正常获取数据 */
                _self.pageCount = resObj.pageInfo.total;
                $('.j-getClassNum').text(_self.pageCount);
                var $list = resObj.result, listlen = $list.length;

                var stateText = {
                    '0': {text: '待审核', cssClass: 'tips-blue'},
                    '1': {text: '未通过', cssClass: 'tips-red'},
                    '2': {text: '已通过', cssClass: 'tips-gr'},
                    '99': {text: '未知状态', cssClass: ''}
                };

                for(var i = 0; i < listlen; i++){
                    var _studentSingle = $list[i],
                        _id = _studentSingle.studentId,
                        _applystate = typeof _studentSingle.applyState == 'undefined' ? '99' : _studentSingle.applyState,
                        _stuNum = _studentSingle.stuNum || '/',
                        _stuName = _studentSingle.stuName || '/',
                        _sex = _studentSingle.sex || '/',
                        _mobile = _studentSingle.mobile || '/',
                        _parentId = _studentSingle.parentId || '',
                        _remark = !!_studentSingle.remark ? '<div class="overflowContent"><p>' + _studentSingle.remark + '</p></div>' : '';


                    if(_applystate !== '99'){
                        var _applyText = stateText[_applystate].text,
                            _applyCss = stateText[_applystate].cssClass;
                    }
                    var isPass = 'general  j-ispass';
                    if(_applystate == '2' || _applystate == '1'){
                        isPass = 'gray';
                    }

                    if(window.isApply){// 审核页面
                        $trlist += ' <tr>' +
                            ' <td>' + _stuNum + '</td>' +
                            ' <td>' + _stuName + '</td>' +
                            ' <td>' + _sex + '</td>' +
                            ' <td>' + _mobile + '</td>' +
                            ' <td>' + _remark + '</td>' +
                            ' <td><span class="s-tips ' + _applyCss + '" >' + _applyText + '</span></td>' +
                            ' <td><a class="' + isPass + '"  href="javascript:void(0)"  data-pid="' + _parentId + '" data-id="' + _id + '" data-item="2">通过</a><a class="' + isPass + '"  data-pid="' + _parentId + '"  data-id="' + _id + '"  data-item="1" href="javascript:void(0)" >拒绝</a></td>' +
                            ' </tr>'
                    }else{   //全部列表
                        $trlist += ' <tr>' +
                            ' <td>' + _stuNum + '</td>' +
                            ' <td>' + _stuName + '</td>' +
                            ' <td>' + _sex + '</td>' +
                            ' <td>' + _mobile + '</td>' +
                            ' <td><a class="general" href="' + window.globalPath + '/student/' + _studentSingle.studentId + '/toview">修改</a>' +
                            //'<a class="general j-removeStudent" data-id="' + _id + '" href="javascript:void(0)" >移除</a>' +
                            '</td>' +
                            ' </tr>';
                    }
                }
            }

            /* 插入 */
            _self.returnPage.html($trlist);
        }
    };


    var PaginationOptions = {
        itemsOnPage: 10,
        pageNumber: 1,
        tempstr: '',
        classId: '',
        resourceId: window.resourceId
    };

    /* 是否是审核页面  true 为审核，false 为所有列表 */
    if(!window.isApply){
        PaginationOptions.applystate = 2;
    }


    var studentsList = new Pagination(options);
    studentsList.init(PaginationOptions);

    /* 切换班级 */
    var classTab = new SelectUi($('.j-selectui-class'));
    classTab.bindE(function(_val, _text){
        PaginationOptions.classId = _val;
        PaginationOptions.pageNumber = 1;
        PaginationOptions.tempstr = $('.j-Keyword').val();
        studentsList.init(PaginationOptions);
        $('.j-getClassName').text(_text);
    });

    /* 搜索 */
    $('.j-queryKeyword').bind('click', function(){
        PaginationOptions.tempstr = $('.j-Keyword').val();
        PaginationOptions.pageNumber = 1;
        studentsList.init(PaginationOptions);
    });


    /* 业务逻辑方法 */
    options.returnPage.delegate('.j-removeStudent', 'click', function(){
        var _id = $(this).attr('data-id'),
            _html = '<div class="ym-inContent ym-inContent-warning">' +
                '<div class="content">' +
                '<h2>确认移除该学生？</h2></div></div>';
        ymPrompt.confirmInfo({
            message: _html,
            title: '移除学生',
            width: 450,
            height: 300,
            handler: function(res){
                if(res == 'ok'){
                    $.ajax({
                        url: window.globalPath + '/student/' + _id + '/moveout',
                        type: 'POST',
                        success: function(res){
                            ymPrompt.close()
                            if(res.result == 'success'){
                                ymPrompt.succeedInfo({
                                    message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>移除成功</h2></div>',
                                    width: 450,
                                    height: 300
                                })
                            }
                        }
                    });
                }
            }
        });
    }).delegate('.j-ispass', 'click', function(){
        var _id = $(this).attr('data-id'),
            _applystate = $(this).attr('data-item'),
            _parentId = $(this).attr('data-pid');
        isApply(_id, _applystate, _parentId);
    });

    function isApply(_id, applystate, _parentId){
        var applytext = applystate == '2' ? '将该学生加入本班' : applystate == '1' ? '拒绝该学生加入本班' : '待审核';
        var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
            '<h2>' + applytext + '？</h2></div>';
        ymPrompt.confirmInfo({
            message: _html,
            width: 380,
            height: 260,
            titleBar: false,
            handler: function(res){
                if(res == 'ok'){
                    $.ajax({
                        url: window.globalPath + '/student/setState',
                        type: 'POST',
                        data: {studentId: _id, parentId: _parentId, applystate: applystate},
                        success: function(resData){
                            var res = JSON.parse(resData);
                            if(res.result == 'success'){
                                ymPrompt.succeedInfo({
                                    message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>操作成功!</h2></div>',
                                    width: 300,
                                    height: 220,
                                    titleBar: false,
                                    handler: function(){
                                        location.reload();
                                    }
                                });
                            }else if(res.result == 'error'){
                                ymPrompt.succeedInfo({
                                    message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>审核失败</h2></div>',
                                    width: 300,
                                    height: 220,
                                    titleBar: false,
                                    handler: function(){
                                        location.reload();
                                    }
                                });
                            }else{
                                ymPrompt.succeedInfo({
                                    message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>' + res.result + '</h2></div>',
                                    width: 300,
                                    height: 220,
                                    titleBar: false,
                                    handler: function(){
                                        location.reload();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
});