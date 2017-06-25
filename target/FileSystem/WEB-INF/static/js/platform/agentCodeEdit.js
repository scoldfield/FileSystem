/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
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
require(['jquery', 'ymPrompt', 'base', 'function'], function(jquery){

    var agentCodeEdit = {
        $elements: {
            $submit: $('.j-submit'),
            $cancel: $('.j-cancel'),
            $tab: $('#tab'),
            $errorTips: $('.j-errorTips')
        },
        postData: [],
        codeGroup: [] //用来本地查重
    }
    agentCodeEdit.showError = function($ele, msg){
        $ele.next('.j-tips').html(msg).show()
    }
    agentCodeEdit.clearError = function($ele){
        $ele.next('.j-tips').empty().hide();
        agentCodeEdit.$elements.$errorTips.empty().hide()
    }

    agentCodeEdit.isRepeat = function(val, defval){
        var result;
        if(defval == '' || (defval !== '' && defval !== val)){
            $.ajax({
                url: window.globalPath + '/agent/checkAgentCode',
                type: 'POST',
                dataType: 'json',
                data: {agentCode: val},
                async: false,
                success: function(res){
                    if(typeof  res !== 'undefined' && typeof  res.result !== 'undefined'){
                        result = res.result;
                    }else{
                        result = '查重失败！请与服务端管理员联系';
                    }
                }, error: function(){
                    result = '查重失败！请与服务端管理员联系';
                }
            });
        }
        return result
    }

    agentCodeEdit.$elements.$submit.on('click', function(){
        //重置数据
        var hasError = false;
        agentCodeEdit.postData = [];
        agentCodeEdit.codeGroup = [];

        //循环遍历获取
        agentCodeEdit.$elements.$tab.find('input.j-editCode').each(function(){
            var $this = $(this), _id = $this.attr('data-id'), _val = $.trim($this.val()), defval = $.trim($this[0].defaultValue);
            agentCodeEdit.codeGroup.push(_val);// 用于后面本地查重
            if(_val == ''){
                agentCodeEdit.showError($this, '请填写编码！');
                hasError = true
            }else if(isNaN(_val)){
                agentCodeEdit.showError($this, '编码必须是纯数字！');
                hasError = true
            }else if(_val.length > 10){
                agentCodeEdit.showError($this, '编码长度必须小于10位！');
                hasError = true
            }else if(agentCodeEdit.isRepeat(_val, defval)){
                agentCodeEdit.showError($this, '该编码已存在！');
                hasError = true
            }else{
                agentCodeEdit.postData.push(_id + '##' + _val);
            }
        });

        var locationErrorMsg = '填写的内容存在错误，请根据提示，返回查询修正。'

        /* 本地查重 */
        var codeGroup = agentCodeEdit.codeGroup.sort();
        for(var i = 0, ilen = codeGroup.length - 1; i < ilen; i++){
            if(codeGroup[i] == '' || codeGroup[i + 1] == '') continue;
            if(codeGroup[i] === codeGroup[i + 1]){
                locationErrorMsg = '存在重复的代理商代码，请返回检查。'
                hasError = true;
                break;
            }
        }


        // 检验 /提交
        if(hasError){
            agentCodeEdit.$elements.$errorTips.html(locationErrorMsg).show();
        }else{
            $.ajax({
                url: window.globalPath + '/agent/saveAgentCode',
                type: 'POST',
                dataType: 'json',
                data: {agentCodes: agentCodeEdit.postData.join(',')},
                success: function(res){
                    if(res.result == 'success'){
                        ymPrompt.succeedInfo({
                            message: '设置成功',
                            titleBar: false,
                            handler: function(){
                                location.href = window.globalPath + '/agent/list';
                            }
                        });
                        setTimeout(function(){
                            location.href = window.globalPath + '/agent/list';
                        }, 3000);
                    }else{
                        ymPrompt.alert({
                            message: '设置失败<br/>' + res.result,
                            titleBar: false
                        });
                    }
                }, error: function(){
                    ymPrompt.alert({
                        message: '设置失败<br/>',
                        titleBar: false
                    });
                }
            });
        }
    });
    agentCodeEdit.$elements.$cancel.on('click', function(){
        ymPrompt.confirmInfo({
            message: '确定取消编辑代理商编码？',
            titleBar: false,
            handler: function(res){
                if(res == 'ok'){
                    location.href = window.globalPath + '/agent/list';
                }
            }
        });
    });


    agentCodeEdit.$elements.$tab.delegate('.j-editCode', {
        'focus': function(){
            agentCodeEdit.clearError($(this));
        },
        'blur': function(){
        }
    });


});