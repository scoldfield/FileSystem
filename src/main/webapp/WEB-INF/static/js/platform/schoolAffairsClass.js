/**
 * Document by wangshuyan@chinamobile.com on 2015/11/20 0020.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/base',
        'function': '../common/function',
        'ymPrompt': '../plug/ymPrompt/ymPrompt'
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']}
    },
    waitSeconds: 0
});

require(['jquery', 'base', 'function', 'ymPrompt'], function(jquery){

    /* 获取学校ID */
    var schoolId = getUrlQuery('schoolId');
    var gradeQueryId = getUrlQuery('gradeItem') || 0;
    var gradeQueryItem = getUrlQuery('gradeItem') || 0;
    /*  建立本地学校数据 */
    var schoolData = {};
    var maxClass = 9;
    /* 节点集合 */
    var $gradeListTab = $('.j-gradelist'),
        $classList = $('.j-classList'),
        $editTeacher = $('.j-selectui-editTeacher'),
        $mask = $('.u-mask'),
        $sltTeacher = $('.j-sltTeacher'),
        $addClass = $('<li class="addli"><a class="s-addClass j-addClass">+</a><a class="s-reduceClass j-reduceClass">-</a></li>'),
    /* 常用静态表头  */
        html_liHead = '<li class="head"> <span class="li-td">班级</span><div class="li-td"><span>班主任</span></div><div class="li-td"><span>学生</span></div></li>';


    function renderGradeInfo(item){
        currentGradeItem = item; //当前编辑年级id
        $gradeListTab.find('li[data-item=' + currentGradeItem + ']').addClass('active').siblings().removeClass('active');
        var gradeSingle = schoolData.gradeList[currentGradeItem]; //获取班级组
        var html_li = '';
        html_li += html_liHead;
        for(var i = 0, ilen = gradeSingle.classList.length; i < ilen; i++){
            /* 五行加表头 */
            if(i != 0 && i % 5 == 0){
                html_li += html_liHead;
            }
            var classUnit = gradeSingle.classList[i];
            var _schoolId = schoolData.schoolId,
                _gradeId = gradeSingle.gradeId,
                _classId = classUnit.id,
                _className = classUnit.className;
            var teacherName = classUnit.teacherName ? '<span class="headerteacher">' + classUnit.teacherName + '</span>' : '<span style="font-size:12px; color:#999">暂无</span>', //<span style="font-size:12px;" data-classid="' + _classId + '" class="j-setTeacher" >' + teacherName + '</span>
                classCount = classUnit.classCount || '设置',
                classEditUrl = classUnit.classCount ? '/student/stuList/?schoolId=' + _schoolId + '&gradeItem=' + currentGradeItem + '&gradeId=' + _gradeId + '&classId=' + _classId : '/student/forExcel';
            html_li += ' <li data-classid="' + _classId + '"><span class="li-td">' + _className + ' </span>' +
                '<div class="li-td"> ' + teacherName + '</div>' +
                '<div class="li-td"><a class="j-setClass" href="' + window.globalPath + classEditUrl + '">' + classCount + '</a></div>' +
                '</li>';
        }
        $classList.empty().append(html_li);
        $classList.append($addClass);

        if(ilen >= maxClass){
            $addClass.find('.j-addClass').hide();
        }else{
            $addClass.find('.j-addClass').show();
        }

    }

    function ajaxEdit(url, parameter, callback){
        $.ajax({
            url: url,
            data: parameter,
            dataType: 'json',
            type: 'POST',
            async: false,
            success: function(resMsg){
                if(resMsg && resMsg.msg == 'success' && callback){
                    callback(resMsg)
                }else{
                    alert('数据添加失败');
                }
            },
            error: function(){
                alert('服务器链接错误');
            }
        })
    }

    function showTeacherList(_top, _left, _width){
        editTeacher.reset();
        $mask.fadeIn();
        $sltTeacher.css({'top': _top + 36, 'left': _left}).fadeIn();
    }

    function closeSltTeacher(){
        $mask.fadeOut();
        $sltTeacher.fadeOut();
        $('.j-setTeacher').removeClass('j-sltOpen');
    }

    var editTeacher = new SelectUi($editTeacher);
    editTeacher.bindE(function(val, text){
        $('.j-sltOpen').html(text);
        //schoolData.gradeList[currentGradeItem].classList[editTeacherClassId - 1].teacherId = val;
        ajaxEdit(window.globalPath + '/class/updateHeadTeacher', {
            id: editTeacherClassId - 1,
            teacherId: val
        }, function(resmsg){
            closeSltTeacher();
        });
    });

    /* 请求渲染页面 */
    $.ajax({
        url: window.globalPath + '/class/getClassInfo',
        data: {schoolId: schoolId},
        type: 'POST',
        dataType: 'json',
        async: false,
        success: function(res){
            if(res){
                /* 创建本地数据模型 */
                schoolData.schoolId = res.schoolId;
                schoolData.schoolName = res.schoolName;
                schoolData.schoolType = res.schoolType;
                schoolData.teacherList = res.teacherList;
                schoolData.gradeList = res.gradeList;
                schoolData.gradeItem = gradeQueryItem;
                //schoolData.gradeItem = gradeQueryItem;
                $('.j-schoolName').text(schoolData.schoolName);
                /* 渲染年级组页面 */
                var $tabli = '';
                for(var classi = 0, classlen = schoolData.gradeList.length; classi < classlen; classi++){
                    var gradeUnit = schoolData.gradeList[classi];
                    $tabli += '<li data-item="' + classi + '">' + gradeUnit.gradeName + '</li>';
                }
                $gradeListTab.append($tabli);
                renderGradeInfo(gradeQueryItem);
            }else{
                alert('数据未获取');
            }
        }
    });
    /* 当前年级组 */
    var currentGradeItem = 0, editTeacherClassId = 0;
    /* 切换年级 */
    $gradeListTab.delegate('li', 'click', function(){
        var $this = $(this), item = $this.attr('data-item');
        schoolData.gradeItem = item;
        if(item !== currentGradeItem){
            renderGradeInfo(item);
        }
    });

    $classList.delegate('a.j-addClass', 'click', function(){ /* 增加班级 */
        var $this = $(this);
        /*  var obj = {};
         schoolData.gradeList[currentGradeItem].classList.push(obj);*/
        var classNum = schoolData.gradeList[currentGradeItem].classList.length;
        var _schoolId = schoolData.schoolId;
        /*   _gradeId = schoolData.gradeList[currentGradeItem].gradeId; */
        ajaxEdit(window.globalPath + '/class/insertBatch', {
            schoolId: _schoolId,
            gradeId: schoolData.gradeList[currentGradeItem].gradeId,
            className: (classNum + 1) + '班'
        }, function(resmsg){
            if(resmsg.classId && resmsg.gradeId){
                var _classId = resmsg.classId, _gradeId = resmsg.gradeId;
                var html_li = '';
                if(classNum !== 0 && classNum % 5 == 0){
                    html_li += html_liHead;
                }
                html_li += ' <li data-classid="' + _classId + '"><span class="li-td">' + (classNum + 1) + '班</span>' +
                    '<div class="li-td"><span style="font-size:12px; color:#999" > 暂无 </span></div>' +
                    '<div class="li-td"><a class="j-setClass"  href="' + window.globalPath + '/student/stuList/?schoolId=' + _schoolId + '&gradeItem=' + schoolData.gradeItem + '&gradeId=' + _gradeId + '&classId=' + _classId + '">设置</a></div>' +
                    '</li>';
                schoolData.gradeList[currentGradeItem].classList.push({className: parseInt(classNum + 1) + '班', id: resmsg.classId});
                $(html_li).insertBefore($this.parent());
                ymPrompt.succeedInfo({message: '添加班级成功！', titleBar: false});
                /* alert*/
                if(schoolData.gradeList[currentGradeItem].classList.length >= maxClass){
                    $this.hide();
                }
            }else{
                alert('获取班级ID发生错误，添加班级失败');
            }
        });
    }).delegate('a.j-reduceClass', 'click', function(){/* 删除班级 */
        var $this = $(this),
            classLen = schoolData.gradeList[currentGradeItem].classList.length,
            _id = schoolData.gradeList[currentGradeItem].classList[classLen - 1].id,
            $deleLi = $('li[data-classid=' + _id + ']'), $deleLiStudentNum = $deleLi.find('a.j-setClass[href]'), $lihead = $('li.head');
        if(isNaN(parseInt($deleLiStudentNum.html()))){
            $.ajax({
                url: window.globalPath + '/class/' + _id + '/delete',
                type: 'POST',
                success: function(resMsg){
                    resMsg = JSON.parse(resMsg);
                    if(resMsg && resMsg.msg && resMsg.msg == 'success'){
                        $deleLi.remove();
                        $this.prev('a.j-addClass').show();
                        schoolData.gradeList[currentGradeItem].classList.splice(classLen - 1, 1);
                        if(classLen !== 1 && (classLen - 1) % 5 == 0){
                            $lihead.eq($lihead.length - 1).remove();
                        }
                        ymPrompt.succeedInfo({message: '删除班级成功！', titleBar: false});
                    }else{
                        alert('未删除成功！')
                    }
                }
            });
        }else{
            ymPrompt.alert({message: '含有学生的班级不准许删除！', titleBar: false});
        }


    });
    /*.delegate('a.j-setTeacher', 'click', function(){    /!* 修改班级班主任 *!/
     var $this = $(this), $li = $this.parent('.li-td'), _top = $li.offset().top, _left = $li.offset().left, _width = $li.innerWidth();
     showTeacherList(_top, _left, _width);
     $this.addClass('j-sltOpen');
     editTeacherClassId = parseInt($this.attr('data-classid')) + 1;
     });*/

    $('.j-colorSltTeacher').bind('click', closeSltTeacher);

});