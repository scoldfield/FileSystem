/**
 * Document by wangshuyan@chinamobile.com on 2015/11/23 0023.
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
require(['jquery', 'function', 'base', 'ymPrompt'], function(jquery){

    var choseType = window.agentConstant.areaType == 1 ? 'checkbox' : 'radio';
    var chooseIpt = new ChooseIpt($('.m-chooseIpt'));
    chooseIpt.init({
        hasChosed: window.agentConstant.agentAreaCode,
        choseType: choseType,
        initCallback: function(){
            if(choseType == 'checkbox'){
                chooseIpt.$ele.addClass('checkbox');
            }else{
                chooseIpt.$ele.addClass('radio');
                chooseIpt.$ele.find('a.all').hide();
            }
        }
    });

    $('.j-submitAgentArea').bind('click', function(){
        var data = {
            agentId: window.agentConstant.agentId,
            areaIds: ''
        };
        if(chooseIpt.data.length > 0){
            if(choseType == 'radio'){
                data.areaIds = chooseIpt.data;
            }else if(chooseIpt.data instanceof Array){
                data.areaIds = chooseIpt.data.join(',');
            }
            $.ajax({
                url: window.globalPath + '/agent/saveAgentArea',
                data: data,
                datatype: 'json',
                type: 'post',
                success: function(resMsg){
                    var _resMsg = !!resMsg ? JSON.parse(resMsg) : {result: 'error'};
                    if(_resMsg.result == 'success'){
                        ymPrompt.succeedInfo({
                            message: "地市接入成功！", titleBar: false, handler: function(){
                                location.href = window.globalPath + '/agent/list';
                            }
                        })
                    }else{
                        alert('未提交成功！')
                    }
                }
            });
        }else{
            ymPrompt.alert({message: '未选择任何地区！', titleBar: false});
        }
    });

    $('.u-gbtn-cancel').click(function(){
        ymPrompt.confirmInfo({
            message: '确定取消设置地区接入吗？', titleBar: false, handler: function(resmsg){
                if(resmsg == 'ok'){
                    location.href = window.globalPath + '/agent/list';
                }
            }
        });
    })
});