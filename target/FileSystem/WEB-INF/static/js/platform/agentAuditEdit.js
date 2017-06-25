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
require(['jquery', 'base', 'function', 'ymPrompt'], function(jquery){
    var countIpt = new CountInput($('.pendingarea'));
    countIpt.init({
        callback: function(len){
            var $iptSize = $('.j-iptSize'), msg;
            if(len <= 100){
                msg = '还可以输入<span class="fit">' + (100 - len) + '</span>个字'
            }else{
                msg = '输入已超出<span class="out">' + (len - 100) + '</span>个字'
            }
            $iptSize.html(msg);
        }
    });

    var isApprove = {
        data: {
            id: 0,
            disable: 2,
            describe: ''

        },
        isSubmit: true,
        bindE: function(){

            var $errotips = $('.j-errotips'),
                $isapprove = $('.j-isapprove'),
                $pendingarea = $('.j-pendingarea');


            var _self = this;
            /* 审核选项 */
            $isapprove.delegate('a.s-isapprove', 'click', function(){
                var $this = $(this);
                _self.data.disable = $this.is('.approve') ? 1 : 0;
                $this.addClass('active').siblings().removeClass('active');
                $errotips.empty();
            });

            $pendingarea.bind('click', function(){
                $errotips.empty();
            });
            /* 提交审核 */
            $('.j-submitApprove').bind('click', function(){
                var isState = true, isDescriber = true;
                _self.data.describe = $.trim($pendingarea.val());
                _self.data.id=$('#j-userId').val();
                var _msg = '';
                if(_self.data.disable === 2){
                    _msg += '请选择是否审核通过！';
                    isState = false;
                }
                if(_self.data.describe === ''){
                    _msg += '请填写审核意见！';
                    isDescriber = false;
                }
                if(_self.data.describe.length > 251){
                    _msg += '审核意见字数不能大于250个字！';
                    isDescriber = false;
                }

                if(isState && isDescriber && _self.isSubmit){
                    $.ajax({
                        url: window.globalPath + '/agentAudit/audit',
                        data: _self.data,
                        type: 'post',
                        datatype: 'json',
                        success: function(resData){
                            var resObj = JSON.parse(resData);
                            if(resObj && resObj.result == 'success'){
                                _self.isSubmit = false;
                                location.href = window.globalPath + '/agentAudit/list';
                            }else{
                                alert('审核失败，请重新审核');
                            }
                        },
                        error: function(){
                            alert('链接数据失败');
                        }
                    })
                }else{
                    $errotips.html(_msg);
                }
            });

            /* 取消 */
            $('.j-cancelApprove').bind('click', function(){
                ymPrompt.confirmInfo({
                    message: '是否取消审核', titleBar: false, handler: function(resmsg){
                        if(resmsg == 'ok'){
                            location.href = window.globalPath + '/agentAudit/list';
                        }
                    }
                })
            });
        }
    };

    isApprove.bindE();

});