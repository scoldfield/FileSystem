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

    var userType;
    var schoolState = {
        '0': {text: '停用', cssclass: 'stoping', operateName: '查看'},
        '1': {text: '已通过', cssclass: 'ok', operateName: '查看'},
        '-1': {text: '未通过', cssclass: 'unuse', operateName: '查看'},
        '2': {text: '待审核', cssclass: 'audit', operateName: '审核'},
        '-2': {text: '删除', cssclass: 'unuse'},
        '3': {text: '未知'},
        '999': {text: '未知'}
    };

    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/schoolAudit/auditList',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();
            /* ？获取数据总数 */
            if(!resObj || !checkUtil.hasProperty(resObj)){
                $trlist = '<tr><td colspan="8" align="center"><span class="f-cr">没有查询到审核的学校信息</span> </td></tr> ';
            }else if(!resObj.pageInfo.total || !resObj.type || !resObj.pageInfo.list.length){
                $trlist = '<tr><td colspan="8" align="center"><span class="f-cr">没有可以审核的学校信息</span> </td></tr> ';
            }else{
                userType = resObj.type;
                (!_self.pageCount && resObj.pageInfo.total) && (_self.pageCount = resObj.pageInfo.total);
                var $list = resObj.pageInfo.list, listlen = $list.length;
                if(listlen > 0){
                    for(var i in $list){
                        if($list.hasOwnProperty(i)){
                            var _list = $list[i];
                           // if(typeof _list.schoolId !== 'undefined'){
                              var  _id = _list.schoolId || 0, /* id */
                                _referredName = _list.referredName || '', /* 学校简称 */
                                _agentName = _list.personName || '', /* 申请人 */
                                _applyTimeString = _list.applyTimeString || '', /* 申请时间*/
                                _auditType = _list.auditType || '', /* 操作类型 */
                                _operatorName = _list.operatorName || '', /* 审核人*/
                                _disable = _list.disable,
                                _disableUrlPara = _disable,
                                _disableName = schoolState[_disable].text || '未知', /* 状态 名称 */
                                _disableClass = schoolState[_disable].cssclass || '', /* 不同状态名称对应的不同样式 */
                                _auditDate = _list.auditDateString || '',
                                _operateName = schoolState[_disable].operateName;

                            if(userType != 2 && _disable == 2){
                                _disableUrlPara = 1;
                                _operateName = '查看'
                            }

                            $trlist += ('<tr> <td>' + _referredName + '</td> <td>' + _agentName + '</td> <td>' + _applyTimeString + '</td> <td>' + _auditType + '</td> <td><span class="' + _disableClass + '"> ' + _disableName + '</span></td> <td>' + _operatorName + '</td> <td>' + _auditDate + '</td> <td> <a href="' + window.globalPath + '/schoolAudit/auditSchool?id=' + _list.id + '&schoolId=' + _id + '&state=' + _disableUrlPara + '">' + _operateName + '</a> </td> </tr>');
                        }
                    }

                }else{
                    $trlist = '<tr><td colspan="7" align="center">没有查询到审核的学校信息</td></tr> ';
                }
            }
            _self.returnPage.html($trlist);
        }
    };

    var agentPendingList = new Pagination(options);
    var queryListOptions = {
        itemsOnPage: 10,
        pageNumber: 1,
        keyword: ''
    };
    agentPendingList.init(queryListOptions);

    $('.j-queryaudit').bind('click', pendingListQuery);

    function pendingListQuery(){
        queryListOptions.keyword = $('.j-keyword').val();
        queryListOptions.pageNumber=1;
        agentPendingList.init(queryListOptions);
    }

});
