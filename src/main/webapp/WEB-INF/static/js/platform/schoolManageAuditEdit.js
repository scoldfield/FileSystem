/**
 * Document by wangshuyan@chinamobile.com on 2015/11/18 0018.
 */
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

    /* 输入计数反馈 */
    var countIpt = new CountInput($('.pendingarea'));
    countIpt.init({
        callback: function(len){
            var $iptSize = $('.j-iptSize'), msg;
            if(len <= 100){
                msg = '还可以输入<span class="fit">' + (100 - len) + '</span> 个字'
            }else{
                msg = '输入已超出<span class="out">' + (len - 100) + '</span> 个字'
            }
            $iptSize.html(msg);
        }
    });

    /* 提交模块对象*/
    var isApprove = {
        data: {
            schoolAuditId: 0,
            state: 2, /* 1通过，2待通过，0不通过*/
            auditContent: ''
        },
        isApprove: true,
        isSubmit: true, /* 防止二次提交的标识 */
        bindE: function(){
            var _self = this;
            var $errotips = $('.j-errotips'),
                $isapprove = $('.j-isapprove'),
                $pendingarea = $('.j-pendingarea');

            _self.data.schoolAuditId = $('#j-schoolId').val() || 0;
            //   _self.isApprove = window.userInfo.isApprove;
            /* 审核选项 */
            $isapprove.delegate('a.s-isapprove', 'click', function(){
                var $this = $(this);
                _self.data.state = +$this.attr('data-value');
                $this.addClass('active').siblings().removeClass('active');
                $errotips.empty();
            });

            /* 输入描述去除错误提示 */
            $pendingarea.bind('click', function(){
                $errotips.empty();
            });

            /* 提交审核 */
            $('.j-submitApprove').bind('click', function(){
                var isState = true/* 审核状态是否通过标识 */, isDescriber = true/* 审核描述是否通过标识*/;
                _self.data.auditContent = $.trim($pendingarea.val());
                var _msg = '';

                if(_self.data.state === 2){
                    _msg += '请选择是否审核通过！';
                    isState = false;
                }
                if(_self.data.auditContent === ''){
                    _msg += '请填写审核意见！';
                    isDescriber = false;
                }
                if(_self.data.auditContent.length > 250){
                    _msg += '审核意见字数不能大于250个字！';
                    isDescriber = false;
                }

                if(isState && isDescriber && _self.isSubmit){
                    $.ajax({
                        url: window.globalPath + '/schoolAudit/auditUpdate',
                        data: _self.data,
                        type: 'POST',
                        datatype: 'json',
                        success: function(resData){
                            var resObj = JSON.parse(resData);
                            if(resObj && resObj.result == true){
                                _self.isSubmit = false;
                                ymPrompt.succeedInfo({
                                    message: '审核完成！', titleBar: false, handler: function(res){
                                        if(res == 'ok'){
                                            location.href = window.globalPath + '/schoolAudit/list';
                                        }
                                    }
                                });
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
                            location.href = window.globalPath + '/schoolAudit/list';
                        }
                    }
                })
            });
        }
    };

    isApprove.bindE();

});