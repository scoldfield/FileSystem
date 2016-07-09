/**
 * Document by wangshuyan@chinamobile.com on 2015/11/20 0020.
 */
require.config({
    paths: {
        'jquery': 'lib/jquery-1.8.3.min',
        'base': 'common/base',
        'function': 'common/function',
        'ymPrompt': 'plug/ymPrompt/ymPrompt',
        'Pagination': 'plug/simplePagination/jquery.simplePagination'
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
    (new SelectUi($('.j-selectui-classDetailsc'))).bindE();
    (new SelectUi($('.j-selectui-classDetailcl'))).bindE();


    var transferObj = {
        transferDialog: null,
        bindE: function($submit, $cancle, _id){
            function _submit(){
                var _val = $('.j-schooltransferVal').val();
                if(!_val){
                    $('.j-schooltransfertips').text('请选择代理商！');
                    return false
                }
                $.ajax({
                    url: window.globalPath + '/school/transferUpdate?id=' + _val + '&schoolId=' + _id,
                    success: function(resMsg){
                        if(resMsg){
                            ymPrompt.close();
                            ymPrompt.succeedInfo({
                                message: '转移成功<br /><span style="font-size:12px;">该代理商及下属代理商帐号均停用</span>', width: 360, height: 200, titleBar: false, maskAlpha: 0.6, handler: function(){
                                    location.reload();
                                }
                            });
                        }else{
                            ymPrompt.alert({message: '未转移成功', width: 280, height: 200, titleBar: false, maskAlpha: 0.6});
                        }
                    },
                    error: function(){
                        ymPrompt.alert({message: '未转移成功', width: 280, height: 200, titleBar: false, maskAlpha: 0.6});
                    }
                });
            }

            $submit.bind('click', _submit);
            $cancle.bind('click', function(){
                $submit.unbind('click', _submit);
                ymPrompt.close();
            })
        }
    };

    $('#tab').delegate('.j-transfer', 'click', function(){
        var $this = $(this);
        var _id = $this.attr('data-id');
        if(!transferObj.transferDialog){
            transferObj.transferDialog = $('<div class="g-disableWrap"></div>');
            var _html = '';

            /*  渲染窗体节点 */
            _html += '<div class="ym-dwbody"><h2>确认停用该代理商</h2><p>请选择将该代理商下的学校转移至</p><div class="m-selectui m-selectui-scCltransfer j-selectui-schooltransfer"><input type="hidden" class="intoval j-schooltransferVal"/><input type="text"   autocomplete="off"   class="intotext" readonly placeholder="请选择代理商" /><ul class="optionwarp">';
            /* for(var ri = 0, rilen = resObj.list.length; ri < rilen; ri++){
             var _agent = resObj.list[ri];
             _html += '<li data-value="' + _agent.id + '">' + _agent.fullName + '</li>';
             }*/
            _html += '</ul><b class="trigon"></b></div><div class="m-selectui m-selectui-scCltransfer j-selectui-classTransfer"><input type="hidden" class="intoval j-schooltransferVal"/><input type="text"   autocomplete="off"   class="intotext" readonly placeholder="请选择代理商" /><ul class="optionwarp">';
            /* for(var ri = 0, rilen = resObj.list.length; ri < rilen; ri++){
             var _agent = resObj.list[ri];
             _html += '<li data-value="' + _agent.id + '">' + _agent.fullName + '</li>';
             }*/
            _html += '</ul><b class="trigon"></b></div><p class="transfertips j-schooltransfertips"></p></div><div class="ym-btn"><input type="button" style="cursor:pointer" class="btnStyle handler j-submitTransfer" value=" 确 定 "><input type="button" style="cursor:pointer" class="btnStyle handler j-cancelTransfer "   value=" 取 消 "></div></div>';

            /*   _html += '<div class="ym-dwbody"><h2>确认停用该代理商</h2><p>获取代理商列表失败！请关闭窗口重新获取</p><div class="ym-btn"><input type="button" style="cursor:pointer" class="btnStyle" onclick="ymPrompt.close();"   value=" 取 消 "></div></div>'*/
            transferObj.transferDialog.append(_html);
        }
        ymPrompt.win({message: '<div class="j-transferWrap"></div>', titleBar: false, width: 420, height: 288, maskAlpha: 0.6});
        $('.j-transferWrap').append(transferObj.transferDialog);
        (new SelectUi($('.j-selectui-schooltransfer'))).bindE();
        (new SelectUi($('.j-selectui-classTransfer'))).bindE();
        transferObj.bindE($('.j-submitTransfer'), $('.j-cancelTransfer'), _id);
    });
})
;