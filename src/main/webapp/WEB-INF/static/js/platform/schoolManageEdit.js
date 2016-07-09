/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/base',
        'function': '../common/function',
        'ymPrompt': '../plug/ymPrompt/ymPrompt',
        'My97DatePicker': '../plug/My97DatePicker/WdatePicker'
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']}
    },
    waitSeconds: 0
});
require(['jquery', 'ymPrompt', 'base', 'function', 'My97DatePicker'], function(jquery){

    /* ******* 本页面常用函数 ******* */

    /*  重置单个表单 */
    function resetIpt($ele){
        var $parents = $ele.parents('li'), $tips = $parents.find('.j-tips');
        $ele.removeClass('erro');
        $tips.removeClass('ok erro').empty();
        $('.j-erroAll').empty();
    }

    /* 显示错误 */
    function showErro($ele, msg){
        var $parents = $ele.parents('li'), $tips = $parents.find('.j-tips');
        $ele.addClass('erro');
        $tips.addClass('erro').html(msg);
    }

    /* 是否重复的 ajax */
    function isRepeatAjax(url, data){
        var result;
        $.ajax({
            url: url,
            type: 'post',
            data: data,
            datatype: 'String',
            async: false,
            success: function(resData){
                result = (JSON.parse(resData)).result
            }
        });
        return !result;
    }

    var schoolEdit = {
        /* 常用节点 */
        $elements: {
            $schoolId: $('.j-schoolId'),
            $schoolCountryc: $('.j-schoolCountry-c'),
            $schoolCountrya: $('.j-schoolCountry-a'),
            $schoolType: $('.j-schoolType'),
            $schoolName: $('.j-schoolName'),
            $schoolShortName: $('.j-schoolShortName'),
            $schoolAddress: $('.j-schoolAddress'),
            $principal: $('.j-principal'),
            $schoolMobile: $('.j-schoolMobile'),
            $schoolBuildTime: $('.j-schoolBuildTime'),
            $studentsNumber: $('.j-studentsNumber'),
            /* 其他 */
            $setAreaList: $('.j-setAreaList')
        },
        /* 是否是编辑 */
        isEdit: false,
        /* 重复项标记 */
        isRepeat: {
            IR_schoolName: false,
            IR_schoolShortName: false,
            IR_schoolMobile: false
        },
        /* 防重复提交 */
        isSubmit: true,
        typeText: '新增'
    };


    /*  业务逻辑  */
    var editDataCompare = {}

    /* 是否是编辑 true 编辑，*/
    if(window.userInfo.schoolId !== ''){
        schoolEdit.isEdit = true;
        schoolEdit.typeText = '修改'
    }

    /* 学校类型数据 渲染 */
    var shoolType_html = '';
    var shoolTypeGrade = ['幼儿园', '6年制小学', '初级中学(3年)', '高级中学(3年)', '完全中学(3+3)'];
    for(var schooltype_i = 0, ilen = shoolTypeGrade.length; schooltype_i < ilen; schooltype_i++){
        for(var schooltype_j=0, jlen = gradeCategory.length; schooltype_j < jlen; schooltype_j++){
            if(gradeCategory[schooltype_j].schoolType === shoolTypeGrade[schooltype_i]){
                var gradeCategoryItem = gradeCategory[schooltype_j];
                shoolType_html += '<li data-value="' + gradeCategoryItem.schoolType + '">' + gradeCategoryItem.schoolType + '</li>'
            }
        }
    }
    $('.j-shoolTypeList').append(shoolType_html);

    /* 选取控件 */
    var $country_a = $('.j-selectui-county-a'),
        $country_c = $('.j-selectui-county-c'),
        $schoolType = $('.j-selectui-schoolType');

    /*  选择区县 */
    var sltCountry_c = new SelectUi($country_c);
    // 修改初始化
    window.userInfo.areaId && sltCountry_c.init(window.userInfo.areaId);
    // 选择监控
    sltCountry_c.bindE(function(val){
        resetIpt(schoolEdit.$elements.$schoolCountrya);
        if(val !== ''){
            $.ajax({
                url: window.globalPath + '/school/addArea',
                type: 'POST',
                data: {code: val},
                dataType: 'json',
                async: false,
                success: function(resObj){
                    if(resObj && resObj.areaList && resObj.areaList.length > 0){
                        schoolEdit.$elements.$setAreaList.empty();
                        var resMap = resObj.areaList;
                        var $html = '<li class="optionHead" data-value="">请选择所在区</li>';
                        for(var resDatai = 0, resDatalen = resMap.length; resDatai < resDatalen; resDatai++){
                            $html += '   <li data-value="' + resMap[resDatai].code + '">' + resMap[resDatai].areaName + '</li>';
                        }
                        schoolEdit.$elements.$setAreaList.append($html);
                        $country_a.find('.intoval,.intotext').val(''); // 初始化县
                    }else{
                        alert('获取区县列表失败')
                    }
                }
            });
        }
    });
    var sltCountry_a = new SelectUi($country_a);
    // 修改初始化
    window.userInfo.areaPId && sltCountry_a.init(window.userInfo.areaPId);
    // 选择监控
    sltCountry_a.bindE(function(){
        resetIpt(schoolEdit.$elements.$schoolCountryc);
    });

    var sltSchoolType = new SelectUi($schoolType);
    // 修改初始化
    window.userInfo.schoolType && sltSchoolType.init(window.userInfo.schoolType, window.userInfo.schoolType);
    // 选择监控    2：待审核（初始化）      1：启用             0：停用                -1：不可用             -2：删除
    if(window.userInfo.schoolState === '2' || window.userInfo.schoolState === '-1' || window.userInfo.schoolState === ''){  // 新建    待审核    不可用
        //上述条件可以选择学校类型
        sltSchoolType.bindE(function(){
            resetIpt(schoolEdit.$elements.$schoolType);
        });
        //上述条件 可以修改学校简称
        schoolEdit.$elements.$schoolShortName.removeAttr('readonly');
    }else{
        $schoolType.addClass('cssreadOnly')
    }

    if(schoolEdit.isEdit){
        /* 如果是修改 页面，则建立对比模型 */
        editDataCompare.districtCode = $.trim(schoolEdit.$elements.$schoolCountrya.val());
        editDataCompare.schoolType = $.trim(schoolEdit.$elements.$schoolType.val());
        editDataCompare.referredName = $.trim(schoolEdit.$elements.$schoolShortName.val());
        editDataCompare.address = $.trim(schoolEdit.$elements.$schoolAddress.val());
        editDataCompare.headmaster = $.trim(schoolEdit.$elements.$principal.val());
        editDataCompare.mobile = $.trim(schoolEdit.$elements.$schoolMobile.val());
        editDataCompare.studentNum = $.trim(schoolEdit.$elements.$studentsNumber.val());
        editDataCompare.time = $.trim(schoolEdit.$elements.$schoolBuildTime.val());
    }


    /* 焦点获取与失去 */
    $('.formlist').delegate('.u-gipt', {
        'focus': function(){
            var $this = $(this);
            resetIpt($this);
            if($this.is('.j-schoolBuildTime')){
                WdatePicker();
            }
        },
        'blur': function(){
            var $this = $(this), _val = $.trim($this.val()), _defaultValue = $.trim($this[0].defaultValue);
            /* 学校简称 */
            if($this.is('.j-schoolShortName')){
                if(_val && (!schoolEdit.isEdit || _val != _defaultValue)){
                    schoolEdit.isRepeat.IR_schoolShortName = isRepeatAjax(window.globalPath + '/school/rechecking', {schoolName: _val});
                }
                if(schoolEdit.isRepeat.IR_schoolShortName){
                    showErro(schoolEdit.$elements.$schoolShortName, '学校简称已存在');
                }
            }

            if($this.is('.j-schoolMobile')){
                if(_val){
                    /* 手机号码查重*/
                    if(!schoolEdit.isEdit || _val != _defaultValue){
                        schoolEdit.isRepeat.IR_schoolMobile = isRepeatAjax(window.globalPath + '/school/recheckingMobile', {mobile: _val});
                    }
                    if(schoolEdit.isRepeat.IR_schoolMobile){
                        showErro(schoolEdit.$elements.$schoolMobile, '手机号码已存在');
                    }
                }
            }
        }
    });

    /*  提交  ajax 需要同步  async:false */
    $('.j-submit').bind('click', function(){
        var errorAr = []
        /* 学校所在区县检测 */
        var _schoolCountrya = $.trim(schoolEdit.$elements.$schoolCountrya.val()),
            _schoolCountryaResult = true,
            _schoolCountryaErroMsg = '';
        switch(true){
            case (_schoolCountrya === ''):
                _schoolCountryaErroMsg = '请填写学校所在市县';
                _schoolCountryaResult = false;
                break;
        }
        var _schoolCountryc = $.trim(schoolEdit.$elements.$schoolCountryc.val()),
            _schoolCountrycResult = true,
            _schoolCountrycErroMsg = '';
        switch(true){
            case (_schoolCountryc === ''):
                _schoolCountrycErroMsg = '请填写学校所在区';
                _schoolCountrycResult = false;
                break;
        }

        if(!_schoolCountryaResult || !_schoolCountrycResult){
            if(_schoolCountryaErroMsg){
                showErro(schoolEdit.$elements.$schoolCountrya, _schoolCountryaErroMsg);
                errorAr.push(_schoolCountryaErroMsg);
            }else{
                showErro(schoolEdit.$elements.$schoolCountryc, _schoolCountrycErroMsg);
                errorAr.push(_schoolCountrycErroMsg);
            }
        }


        /* 学校类型 */
        var _schoolType = $.trim(schoolEdit.$elements.$schoolType.val()),
            _schoolTypeResult = true,
            _schoolTypeErroMsg = '';
        switch(true){
            case (_schoolType === ''):
                _schoolTypeErroMsg = '请选择学校类别';
                _schoolTypeResult = false;
                break;
        }

        if(!_schoolTypeResult){
            showErro(schoolEdit.$elements.$schoolType, _schoolTypeErroMsg);
            errorAr.push(_schoolTypeErroMsg);
        }

        /*  学校简称 */
        var _schoolShortName = $.trim(schoolEdit.$elements.$schoolShortName.val()),
            _schoolShortNameResult = true,
            _schoolShortNameErroMsg = '';
        switch(true){
            case (_schoolShortName === ''):
                _schoolShortNameErroMsg = '请填写学校简称';
                _schoolShortNameResult = false;
                break;
            case checkUtil.checkSpecialChar(_schoolShortName):
                _schoolShortNameErroMsg = '学校名称不能包含特殊字符';
                _schoolShortNameResult = false;
                break;
            case !checkUtil.checkCharSize(_schoolShortName, 0, 25):
                _schoolShortNameErroMsg = '学校名称不能超过25个字符';
                _schoolShortNameResult = false;
                break;
            case schoolEdit.IR_schoolShortName:
                _schoolShortNameErroMsg = '学校简称已存在';
                _schoolShortNameResult = false;
                break;
        }
        if(!_schoolShortNameResult){
            showErro(schoolEdit.$elements.$schoolShortName, _schoolShortNameErroMsg);
            errorAr.push(_schoolShortNameErroMsg);
        }

        /*  学校地址 检测  */
        var _schoolAddress = $.trim(schoolEdit.$elements.$schoolAddress.val()),
            _schoolAddressResult = true,
            _schoolAddressErroMsg = '';
        switch(true){
            case (_schoolAddress === ''):
                _schoolAddressErroMsg = '请填写学校地址';
                _schoolAddressResult = false;
                break;
            case !checkUtil.checkCharSize(_schoolAddress, 0, 50):
                _schoolAddressErroMsg = '请勿超过50个字';
                _schoolAddressResult = false;
                break;
        }

        if(!_schoolAddressResult){
            showErro(schoolEdit.$elements.$schoolAddress, _schoolAddressErroMsg);
            errorAr.push(_schoolAddressErroMsg);
        }

        /* 校长姓名 */
        var _principal = $.trim(schoolEdit.$elements.$principal.val()),
            _principalResult = true,
            _principalErroMsg = '';
        switch(true){
            case (_principal === ''):
                _principalErroMsg = '请填写校长姓名';
                _principalResult = false;
                break;
            case !checkUtil.checkCharSize(_principal, 0, 25):
                _principalErroMsg = '请勿超过25个字';
                _principalResult = false;
                break;
        }
        if(!_principalResult){
            showErro(schoolEdit.$elements.$principal, _principalErroMsg);
            errorAr.push(_principalErroMsg);
        }

        /*  手机号码 */
        var _schoolMobile = $.trim(schoolEdit.$elements.$schoolMobile.val()),
            _schoolMobileResult = true,
            _schoolMobileErroMsg = '';
        switch(true){
            case (_schoolMobile === ''):
                _schoolMobileErroMsg = '请填写手机号码';
                _schoolMobileResult = false;
                break;
            case !checkUtil.checkPhoneNumber(_schoolMobile):
                _schoolMobileErroMsg = '请填写正确格式的手机号码';
                _schoolMobileResult = false;
                break;
            case schoolEdit.isRepeat.IR_schoolMobile:
                _schoolMobileErroMsg = '手机号码已存在';
                _schoolMobileResult = false;
                break;
        }
        if(!_schoolMobileResult){
            showErro(schoolEdit.$elements.$schoolMobile, _schoolMobileErroMsg);
            errorAr.push(_schoolMobileErroMsg);
        }

        /* 建校时间 */
        var _schoolBuildTime = $.trim(schoolEdit.$elements.$schoolBuildTime.val()),
            _schoolBuildTimeResult = true,
            _schoolBuildTimeErroMsg = '';
        switch(true){
            case (_schoolBuildTime === ''):
                _schoolBuildTimeErroMsg = '请填写建校时间';
                _schoolBuildTimeResult = false;
                break;
            case (new Date(_schoolBuildTime) > new Date()):
                _schoolBuildTimeErroMsg = '建校时间请勿晚于当前时间';
                _schoolBuildTimeResult = false;
        }
        if(!_schoolBuildTimeResult){
            showErro(schoolEdit.$elements.$schoolBuildTime, _schoolBuildTimeErroMsg);
            errorAr.push(_schoolBuildTimeErroMsg);
        }

        /*  在校学生数量  */
        var _studentsNumber = $.trim(schoolEdit.$elements.$studentsNumber.val()),
            _studentsNumberResult = true,
            _studentsNumberErroMsg = '';
        switch(true){
            case (_studentsNumber === ''):
                _studentsNumberErroMsg = '请填写在校学生数量';
                _studentsNumberResult = false;
                break;
            case isNaN(+_studentsNumber):
                _studentsNumberErroMsg = '在校学生数必须为阿拉伯数字！';
                _studentsNumberResult = false;
                break;
            case (+_studentsNumber < 0 || +_studentsNumber > 9999999) :
                _studentsNumberErroMsg = '在校学生数请务小于0，大于999999999！';
                _studentsNumberResult = false;
                break;
        }
        if(!_studentsNumberResult){
            showErro(schoolEdit.$elements.$studentsNumber, _studentsNumberErroMsg);
            errorAr.push(_studentsNumberErroMsg);
        }


        /* */
        var addedMsg = '';
        if(_schoolCountrycResult && _schoolCountryaResult && _schoolTypeResult && _schoolShortNameResult && _schoolAddressResult && _principalResult && _schoolMobileResult && _schoolBuildTimeResult && _studentsNumberResult && schoolEdit.isSubmit){

            var schoolParameter = {
                districtCode: _schoolCountrya, /*地区school*/
                schoolType: _schoolType, /* 学校类别school.*/
                referredName: _schoolShortName, /*学校简称school*/
                address: _schoolAddress, /*学校地址school*/
                headmaster: _principal, /*校长姓名school*/
                mobile: _schoolMobile, /*手机号码school*/
                studentNum: _studentsNumber, /*在校学生school*/
                time: _schoolBuildTime /*建校时间school*/
            };


            var url; //定义ajax地址
            /* 如果是修改验证 是否有编辑项*/
            var hasEdit = false;
            if(schoolEdit.isEdit){
                for(var i in schoolParameter){
                    if(schoolParameter.hasOwnProperty(i) && editDataCompare.hasOwnProperty(i) && schoolParameter[i] !== editDataCompare[i]){
                        hasEdit = true;//有编辑项
                        break;
                    }
                }
                schoolParameter.id = window.userInfo.schoolId;
                url = '/school/schoolUpdate';
            }else{
                schoolParameter.id = '';
                url = '/school/insert';
            }
            if(schoolEdit.isEdit && !hasEdit){
                location.href = window.globalPath + '/school/list';
                return false;
            }


            $.ajax({
                url: window.globalPath + url,
                data: schoolParameter,
                type: 'post',
                datatype: 'json',
                success: function(resMsg){
                    if(resMsg){
                        schoolEdit.isSubmit = false; // 防止二次提交
                        addedMsg = '<span style="font-size:30px">' + schoolEdit.typeText + '完成</span><br /><span style="font-size:16px;">请等待地市审核</span>';
                        ymPrompt.succeedInfo({
                            message: addedMsg, titleBar: false, width: 300, height: 220, maskAlpha: 0.5, handler: function(){
                                location.href = window.globalPath + '/school/list';
                            }
                        });
                    }else{
                        alert('提交失败');
                    }
                },
                error: function(){
                    alert('提交失败');
                }
            });
        }else{
            var _totalMsg = errorAr.join('; ')
            $('.j-erroAll').html(_totalMsg);
        }
    });
    /* 取消 ｛ */
    $('.j-cancle').bind('click', function(){
        ymPrompt.confirmInfo({
            message: '确定取消' + schoolEdit.typeText + '学校吗？', titleBar: false, handler: function(resmsg){
                if(resmsg == 'ok'){
                    location.href = window.globalPath + '/school/list';
                }
            }
        });
    });
    /* ｝取消*/


});