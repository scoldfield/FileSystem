/**
 * Document by wangshuyan@chinamobile.com on 2015/11/23 0023.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'Md5': '../lib/jQuery.md5',
        'base': '../common/base',
        'function': '../common/function',
        'ymPrompt': '../plug/ymPrompt/ymPrompt'
    },
    shim: {
        'Md5': {deps: ['jquery']},
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']}
    },
    waitSeconds: 0
});
require(['jquery', 'Md5', 'function', 'base', 'ymPrompt'], function(jquery){

    var setNewPassword = {
        data: {},
        $element: {
            $oldVal: $('#oldVal'),
            $newVal: $('#newVal'),
            $checkVal: $('#checkVal'),
            $errorTips: $('#errotips'),
            $submitCancel: $('#submitCancel'),
            $personSetSubmit: $('#personSetSubmit')
        }
    }
    setNewPassword.bindE = function(){
        var _self = this;
        _self.$element.$personSetSubmit.on('click', function(){
            var _oldVal = setNewPassword.$element.$oldVal.val(),
                _newVal = setNewPassword.$element.$newVal.val(),
                _checkVal = setNewPassword.$element.$checkVal.val();
            var erroMsg = '';
            switch(true){
                case _oldVal === '':
                    erroMsg = '请输入原密码';
                    break;
                case _newVal === '':
                    erroMsg = '请输入新密码';
                    break;
                case _newVal.length < 6 || _newVal.length > 16 :
                    erroMsg = '新密码长度必须在6-16之间';
                    break;
                case _checkVal === '':
                    erroMsg = '请输入确认密码';
                    break;
                case _checkVal !== _newVal:
                    erroMsg = '两次输入新密码不一致';
                    break;
                case !checkUtil.checkCharSize(_newVal, 6, 12)  :
                    erroMsg = '密码长度需在6-12位之间';
                    break;
                case _newVal.indexOf(' ') >= 0:
                    erroMsg = '密码请勿包含空格';
                    break;

            }

            if(erroMsg){
                setNewPassword.$element.$errorTips.html(erroMsg).show();
                setTimeout(function(){
                    setNewPassword.$element.$errorTips.fadeOut(1000)
                }, 4000);
            }else{
                setNewPassword.data.password = $.md5(_oldVal);
                setNewPassword.data.newPassword = $.md5(_newVal);
                $.ajax({
                    url: window.globalPath + '/personalSet/changePassword',
                    type: 'POST',
                    dataType: 'json',
                    data: setNewPassword.data,
                    success: function(resData){
                        if(resData.result == 'success'){
                            setTimeout(function(){
                                location.href =  window.globalPath +  '/agentnotice/receiveNotice';
                            }, 3000)
                            ymPrompt.succeedInfo({
                                message: '修改成功!',
                                width: 260,
                                height: 220,
                                titleBar: false,
                                handler: function(){
                                    location.href =  window.globalPath +  '/agentnotice/receiveNotice';
                                }
                            })
                        }else if(resData.result === 'fail'){
                            ymPrompt.alert('修改失败')
                        }else if(resData.result === 'error'){
                            ymPrompt.alert('修改失败')
                        }else{
                            setNewPassword.$element.$errorTips.html(resData.result).show();
                            setTimeout(function(){
                                setNewPassword.$element.$errorTips.fadeOut(1000)
                            }, 4000);
                        }
                    }
                });
            }
        });
    }
    setNewPassword.bindE();
});