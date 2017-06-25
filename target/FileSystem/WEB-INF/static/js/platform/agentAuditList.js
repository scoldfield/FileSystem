/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
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
require(['jquery', 'Pagination', 'ymPrompt', 'base', 'function'], function(jquery){
    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/agentAudit/agentauditList',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();
            !_self.pageCount && (_self.pageCount = resObj.total);
            if(!resObj){
                $trlist = '<tbody><tr><td colspan="7" align="center">没有查询到代理商信息</td></tr></tbody> ';
            }else{
                var $list = resObj.list, listlen = $list.length;
                if(listlen > 0){
                    $trlist += ('<thead class="thread"> <tr> <td>代理商简称</td> <td width="120">申请帐号</td> <td width="130">申请时间</td> <td width="60">类型</td> <td width="90">状态</td> <td width="120">审核人</td> <td width="130">审核时间</td> <td width="120">操作</td> </tr> </thead><tbody id="tab">');
                    for(var i in $list){
                        if($list.hasOwnProperty(i)){
                            var _list = $list[i],
                                _id = _list.id || 0,
                                _referredName = _list.referredName,
                                _creatName = _list.creatName,
                                _applyTime = _list.apptimeStr,
                                _auditType = _list.auditType,
                                _disableName = _list.disableName,
                                _operatorId = _list.operatorId,
                                _operateName = _list.operateName,
                                _href = _operateName == '查看' ? 'auditlook?id=' + _id : 'auditdetail?id=' + _id,
                                _auditDate = _list.audittimeStr;
                            $trlist += ('<tr> <td>' + _referredName + '</td> <td>' + _creatName + '</td> <td>' + _applyTime + '</td> <td>' + _auditType + '</td> <td>' + _disableName + '</td> <td>' + _operatorId + '</td> <td>' + _auditDate + '</td> <td> <a href="' + _href + '">' + _operateName + '</a> </td> </tr>');
                        }
                    }
                    $trlist += '</tbody>';
                }else{
                    $trlist = '<tbody><tr><td colspan="7" align="center">没有查询到代理商信息</td></tr></tbody> ';
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

    var agentPendingStatus = new SelectUi($('.j-selectui-pendingagent'));
    agentPendingStatus.bindE(pendingListQuery);
    $('.j-queryaudit').bind('click', pendingListQuery);

    function pendingListQuery(){
        queryListOptions.auditType = $('.j-queryaudittype').val();
        queryListOptions.referredName = $('.j-queryname').val();
        queryListOptions.pageNumber=1;
        agentPendingList.init(queryListOptions);
    }
});