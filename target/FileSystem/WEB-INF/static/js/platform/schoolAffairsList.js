/**
 * Document by wangshuyan@chinamobile.com on 2015/11/20 0020.
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

    var tableHeadModule = {
        typeList: [],
        areaList: null
    };

    tableHeadModule
    /* 学校类型数据 数据获取 */

    for(var schooltype_i = 0, ilen = gradeCategory.length; schooltype_i < ilen; schooltype_i++){
        var gradeCategoryItem = gradeCategory[schooltype_i];
        tableHeadModule.typeList.push(gradeCategoryItem.schoolType);
    }

    /* 获取学校类型和所在区域 */
    $.ajax({
        url: window.globalPath + '/schoolAffairs/getAllSchool',
        type: 'POST',
        dataType: 'json',
        success: function(resObj){
            var shoolType_html = '';
            for(var s_i = 0, slen = resObj.typeList.length; s_i < slen; s_i++){
                var typeSingle = resObj.typeList[s_i];
                if(typeof  typeSingle == 'string'){
                    shoolType_html += '<li data-value="' + typeSingle + '">' + typeSingle + '</li>';
                }
            }
            $('.j-shoolTypeList').append(shoolType_html);
            var $arealist = '<li class="optionHead" data-value="0">所有地区</li>';
            for(var j = 0, alen = resObj.areaList.length; j < alen; j++){
                var _areaunit = resObj.areaList[j];
                $arealist += '<li data-value="' + _areaunit.code + '">' + _areaunit.areaName + '</li>'
            }
            $('.j-arealist').append($arealist);
        }
    });

    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/schoolAffairs/schoolList',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();
            if(!resObj || !checkUtil.hasProperty(resObj)){
                $trlist += '<tr><td colspan="7" align="center"><span class="f-cr"> 未获取到数据，或者获取的数据为空</span></td></tr>';
            }else{
                _self.pageCount === 0 && (_self.pageCount = resObj.pageInfo.total);
                var $list = resObj.pageInfo.list, listlen = $list.length;
                if(listlen == 0){
                    $trlist += '<tr><td colspan="7" align="center">未获取到列表数据</td></tr>';
                }else{
                    for(var i in $list){
                        if($list.hasOwnProperty(i)){
                            var _list = $list[i];
                            var _id = _list.id || 0,
                                _areaname = _list.areaname || '',
                                _referredName = _list.referredName || '', /* 简称 */
                                _schooltype = _list.schoolType || '',
                                _mobile = _list.mobile || '',
                                viewStudentsUrl = _list.studentCount ? '/student/stuList/?schoolId=' + _id : '/student/forExcel',
                                viewStudentsText = _list.studentCount || '设置',
                                viewTeacherUrl = _list.teacherCount ? '/teacher/teacherList?schoolId=' + _id : '/teacher/forExcel',
                                viewTeacherText = _list.teacherCount || '设置',
                                viewClassesText = _list.classCount || '设置';

                            $trlist += ('<tr><td>' + _areaname + '</td>' +
                            '<td>' + _referredName + '</td>' +
                            '<td>' + _schooltype + '</td>' +
                            '<td>' + _mobile + '</td>' +
                            '<td><a href="' + window.globalPath + '/class/getClassInfo?schoolId=' + _id + '">' + viewClassesText + '</a></td>' +
                            '<td><a href="' + window.globalPath + viewTeacherUrl + '">' + viewTeacherText + '</a></td>' +
                            '<td><a href="' + window.globalPath + viewStudentsUrl + '">' + viewStudentsText + '</a></td>' +
                                /*   '<td><a href="javascript:void(' + _id + ')">设置</a></td>' +*/
                            '</tr>');
                        }
                    }
                }
            }
            _self.returnPage.html($trlist);
        }
    };

    var queryOptions = {
        itemsOnPage: 10,
        pageNumber: 1,
        areaId: '',
        schoolType: '',
        keyword: ''
    };
    var schoolAffairsList = new Pagination(options);
    schoolAffairsList.init(queryOptions);

    /* 选择器插件 */
    var areaType = new SelectUi($('.j-selectui-schoolArea'));
    var schoolTyle = new SelectUi($('.j-selectui-schoolType'));

    areaType.bindE(function(val){
        queryOptions.areaId = +val;
        queryOptions.keyword = $('.j-Keyword').val();
        schoolAffairsList.init(queryOptions);
    });

    schoolTyle.bindE(function(val){
        queryOptions.schoolType = val;
        queryOptions.keyword = $('.j-Keyword').val();
        schoolAffairsList.init(queryOptions);
    });

    $('.j-queryKeyword').bind('click', function(){
        queryOptions.keyword = $('.j-Keyword').val();
        queryOptions.pageNumber = 1;
        schoolAffairsList.init(queryOptions);
    });
});