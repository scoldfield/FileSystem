/**
 * Document by wangshuyan@chinamobile.com on 2015/11/12 0012.
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
        'Pagination': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']}
    },
    waitSeconds: 0
});
require(['jquery', 'ymPrompt', 'base', 'function'], function(jquery){

    (new SelectUi($('.j-selectui-roletype'))).bindE(function(){
        resetIpt(localAccountEdit.$elements.$rolesType)
    });

    function resetIpt($ele){
        var $tips = $ele.parents('li').find('.j-tips');
        $ele.removeClass('erro');
        $tips.removeClass('ok erro').empty();
    }

    function showErro($ele, msg){
        var $tips = $ele.parents('li').find('.j-tips');
        $ele.addClass('erro');
        $tips.addClass('erro').html(msg);
    }

    var localAccountEdit = {
        $elements: {
            $ipt: $('.u-gipt'),
            $userName: $('.j-userName'),
            $userMobile: $('.j-userMobile'),
            $rolesType: $('.j-rolesType'),
            $area: $('.j-area'),
            $submit: $('.j-submitAddCount')
        },
        isEdit: false,
        isRepeat: {
            /* 有重复则为wrong 可以添加为ok，请求中为waiting */
            IR_userName: 'waiting',
            IR_userMobile: 'waiting'
        },
        isSubmit: true
    };

    localAccountEdit.isEdit = window.isEdit || false

    var confirmText = localAccountEdit.isEdit ? '修改' : '新增'

    localAccountEdit.bindE = function(){
        var _self = this;

        _self.$elements.$ipt.bind({
            'focus': function(){
                var $this = $(this);
                resetIpt($this);
            },
            'blur': function(){
                var $this = $(this), _val = $.trim($this.val()), _dafaultValue = $.trim($this[0].defaultValue);
                /*
                 * if($this.is('.j-userName')){ if(_val &&
                 * (!localAccountEdit.isEdit || _val !== _dafaultValue)){
                 * localAccountEdit.isRepeat.IR_userName =
                 * checkUtil.isRepeatAjax(window.globalPath +
                 * '/localAccount/validateAccount', _val) ? 'wrong' : 'ok'; }
                 * if(localAccountEdit.isRepeat.IR_userName == 'wrong'){
                 * showErro(localAccountEdit.$elements.$userName, '角色名称已存在！');
                 * }else if(localAccountEdit.isRepeat.IR_userName == 'ok'){
                 * resetIpt(localAccountEdit.$elements.$userName); } }
                 *
                 * if($this.is('.j-userMobile')){ if(_val &&
                 * !checkUtil.checkPhoneNumber(_val)){
                 * showErro(localAccountEdit.$elements.$userMobile,
                 * '手机号码格式不对！'); }else if(_val && (!localAccountEdit.isEdit ||
                 * _val !== _dafaultValue)){
                 * localAccountEdit.isRepeat.IR_userMobile =
                 * checkUtil.isRepeatAjax(window.globalPath +
                 * '/localAccount/validateMobile', _val) ? 'wrong' : 'ok'; }
                 * if(localAccountEdit.isRepeat.IR_userMobile == 'wrong'){
                 * showErro(localAccountEdit.$elements.$userMobile, '手机号码已存在！');
                 * }else if(localAccountEdit.isRepeat.IR_userMobile == 'ok'){
                 * resetIpt(localAccountEdit.$elements.$userMobile); } }
                 */
            }

        });

        _self.$elements.$area.find('input').bind('click', function(){
            var $this = $(this);
            resetIpt($this);
        });


        var areaInput = new ChooseIpt($('.j-chooseIpt')),
            hasChosedStr = $('.j-chooseIpt').attr('data-value') ? $('.j-chooseIpt').attr('data-value') : [];
        areaInput.init({
            hasChosed: hasChosedStr,
            choseType: 'checkbox',
            bindECallback: function(){
                $('.j-chooseIptStr').val(areaInput.data);
                resetIpt(localAccountEdit.$elements.$area)
            }
        });

        /* 提交 */
        _self.$elements.$submit.bind({
            'click': function(){
                /* 角色名称 检测 */
                var _userName = localAccountEdit.$elements.$userName.val(),
                    _userNamedafaultValue = $.trim(localAccountEdit.$elements.$userName[0].defaultValue),
                    _userNameResponMsg = '',
                    _userNameResult = true;
                switch(true){
                    case (_userName == ''):
                        _userNameResponMsg = '请填写角色名称';
                        _userNameResult = false;
                        break;
                    case !checkUtil.checkCharSize(_userName, 0, 25):
                        _userNameResponMsg = '角色名称不能超过25个字';
                        _userNameResult = false;
                        break;
                    case checkUtil.checkSpecialChar(_userName):
                        _userNameResponMsg = '角色名称请勿填写特殊字符';
                        _userNameResult = false;
                        break;
                    case  (_userName != _userNamedafaultValue) && checkUtil.isRepeatAjax(window.globalPath + '/localAccount/validateAccount', {key: _userName}):
                        _userNameResponMsg = '角色名称已重复';
                        _userNameResult = false;
                        break;
                }
                if(!_userNameResult){
                    showErro(localAccountEdit.$elements.$userName, _userNameResponMsg);
                }


                /* 手机帐号 检测 */
                var _userMobile = localAccountEdit.$elements.$userMobile.val(),
                    _userMobiledafaultValue = $.trim(localAccountEdit.$elements.$userMobile[0].defaultValue),
                    _userMobileResponMsg = '',
                    _userMobileResult = true;
                switch(true){
                    case (_userMobile == ''):
                        _userMobileResponMsg = '请填写手机号码';
                        _userMobileResult = false;
                        break;
                    case !checkUtil.checkPhoneNumber(_userMobile):
                        _userMobileResponMsg = '请填写正确格式的手机号码';
                        _userMobileResult = false;
                        break;
                    case  (_userMobile != _userMobiledafaultValue ) && checkUtil.isRepeatAjax(window.globalPath + '/localAccount/validateMobile', {key: _userMobile}):
                        _userMobileResponMsg = '手机号码已存在';
                        _userMobileResult = false;
                        break;
                }
                if(!_userMobileResult){
                    showErro(localAccountEdit.$elements.$userMobile, _userMobileResponMsg);
                }

                /* 角色类型检测 */
                var _userRoleType = localAccountEdit.$elements.$rolesType.val(),
                    _userRoleTypeResponMsg = '',
                    _userRoleTypeResult = true;
                switch(true){
                    case (_userRoleType == ''):
                        _userRoleTypeResponMsg = '请选择角色类型';
                        _userRoleTypeResult = false;
                        break;
                }
                if(!_userRoleTypeResult){
                    showErro(localAccountEdit.$elements.$rolesType, _userRoleTypeResponMsg);
                }

                /* 接入地区 检测 */
                var _userAreaResult = true;
                if(!!localAccountEdit.isEdit){ // 是否为编辑

                }
                if(areaInput.data.length == 0){
                    showErro(localAccountEdit.$elements.$area, '接入地区不能为空！');
                    _userAreaResult = false;
                }


                if(_userNameResult && _userMobileResult && _userRoleTypeResult && _userAreaResult && localAccountEdit.isSubmit){
                    localAccountEdit.isSubmit = false;
                    ymPrompt.confirmInfo({
                        message: '确定' + confirmText + '该人员吗?', titleBar: false, handler: function(res){
                            if(res == 'ok'){
                                $('#creatuser').submit();
                            }else{
                                localAccountEdit.isSubmit = true;
                            }
                        }
                    });
                }
            }
        });

        $('.j-submitCancel').bind('click', function(){
            ymPrompt.confirmInfo({
                message: '确定取消' + confirmText + '人员吗?', titleBar: false, handler: function(res){
                    if(res == 'ok'){
                        location.href = window.globalPath + '/localAccount';
                    }else{

                    }
                }
            })
        })
    };
    localAccountEdit.bindE();
    return localAccountEdit;

});