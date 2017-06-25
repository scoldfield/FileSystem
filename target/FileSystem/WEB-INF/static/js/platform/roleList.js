/**
 * Document by wangshuyan@chinamobile.com on 2015/11/30 0030.
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
require(['jquery', 'function', 'base', 'ymPrompt', 'Pagination'], function(jquery){
    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/roleManager/listRoles',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();
            !_self.pageCount && (_self.pageCount = resObj.total);
            if(!resObj && !checkUtil.hasProperty(resObj)){
                $trlist = '<tr><td colspan="4" align="center">没有查询到角色信息</td></tr> ';
            }else{
                var $list = resObj.list, listlen = $list.length;
                if(listlen > 0){
                    for(var i in $list){
                        if($list.hasOwnProperty(i)){
                            var _list = $list[i],
                                _id = _list.id || 0,
                                _role = _list.role, /* 角色名称 */
                                _description = _list.description, /* 角色描述 */
                                _resourceIdsStr = _list.resourceNames;
                            /* 权限名称*/
                            $trlist += ('<tr> <td align="center">' + _role + '</td> <td><div class="s-showmore"><b>' + _description + '</b></div></td> <td><div class="s-showmore"><b>' + _resourceIdsStr + '</b></div></td> <td align="center"><a class="general" href="' + window.globalPath + '/roleManager/' + _id + '/update">修改</a><a class="general j-delete" data-id="' + _id + '"  >删除</a></td> </tr>');
                        }
                    }
                }else{
                    $trlist = '<tr><td colspan="4" align="center">没有查询到角色信息</td></tr>';
                }
            }
            _self.returnPage.html($trlist);
        }
    };

    var agentPendingList = new Pagination(options);
    var queryListOptions = {
        itemsOnPage: 10,
        pageNumber: 1,
        referredName: '',
        auditType: ''
    };
    agentPendingList.init(queryListOptions);

    options.returnPage.delegate('a.j-delete', 'click', function(){
        var $this = $(this), _id = $this.attr('data-id');
        ymPrompt.confirmInfo({
            message: '确定删除角色', titleBar: false, handler: function(resObj){
                if(resObj == 'ok'){
                    $.ajax({
                        url: window.globalPath + '/roleManager/' + _id + '/delete',
                        type: 'POST',
                        success: function(resData){
                            var resMsg = JSON.parse(resData);
                            if(resMsg && resMsg.result){
                                if(resMsg.result === '22'){
                                    ymPrompt.alert({
                                        message: ' 不能删除', titleBar: false
                                    });
                                }else if(resMsg.result === true){
                                    ymPrompt.succeedInfo({
                                        message: ' 删除成功', titleBar: false, handler: function(){
                                            location.reload();
                                            setTimeout(function(){
                                                location.reload();
                                            }, 3000);
                                        }
                                    });
                                }else{
                                    ymPrompt.alert({message: '删除失败', titleBar: false});
                                }
                            }
                        }
                    });
                }
            }
        })
    });
});
