/**
 * Document by wangshuyan@chinamobile.com on 2015/11/12 0012.
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
require(['jquery', 'base', 'function', 'ymPrompt', 'Pagination'], function(jquery){

    var stateInstance = {
        '1': {name: '可用', cssClass: ' ok'},
        '0': {name: '不可用', cssClass: 'nouse'}
    }

    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/MonitorSetController/getMonitorSetList',
        render: function(resObj){
            var _self = this, $trlist = '';
            _self.returnPage.empty();
            !_self.pageCount && (_self.pageCount = resObj.total);
            if(!resObj){
                $trlist = '<tr><td colspan="7" align="center">未获取到视频数据</td></tr> ';
            }else{
                var $list = resObj.list, listlen = $list.length;
                if($list.length == 0){
                    $trlist = '<tr><td colspan="7" align="center">未获取到视频数据</td></tr> ';
                }else{
                    for(var i in $list){
                        if($list.hasOwnProperty(i)){
                            var _list = $list[i];
                            var _id = _list.id || 0,
                                _state = _list.state || 0,
                                _stateName = stateInstance[_state].name,
                                _stateClass = stateInstance[_state].cssClass,
                                _name = _list.name || '',
                                _areaNames = _list.areaName || '',
                                _schoolId = _list.schoolName || '',

                                _type = _list.type || '',
                                _rtsp = _list.rtsp;

                            $trlist += ('<tr><td><span class="tdstatus ' + _stateClass + '"> ' + _stateName + '</span></td>' +
                            '<td>' + _areaNames + '</td>' +
                            '<td>' + _schoolId + '</td>' +
                            '<td>' + _type + '</td>' +
                            '<td><div class="s-showmore" ><b>' + _rtsp + '</b></div></td>' +
                            '<td><a class="general" href="' + window.globalPath + '/MonitorSetController/' + _id + '/update">修改</a>' +
                            '<a data-id="' + _id + '"  class="general j-del"  href = "javascript:void(0)" > 删除 </a></td></tr>');
                        }
                    }
                }
            }
            _self.returnPage.html($trlist);
        }
    };

    var optionsQueryObj = {
        itemsOnPage: 10,
        pageNumber: 1,
        keyword: ''
    }

    var videoList = new Pagination(options);
    videoList.init(optionsQueryObj);

    $('.j-queryWords').bind('click', function(){
        optionsQueryObj.keyword = $('.j-queryBtn').val();
        optionsQueryObj.pageNumber = 1;
        videoList.init(optionsQueryObj);
    });


    options.returnPage.delegate('.j-del', 'click', function(){
        var id = $(this).attr('data-id');
        ymPrompt.confirmInfo({
            message: '确定删除该视频吗?', titleBar: false, handler: function(res){
                if(res == 'ok'){
                    $.ajax({
                        url: window.globalPath + '/MonitorSetController/delete?id=' + id,
                        type: 'get',
                        success: function(resmsg){
                            var _msg = JSON.parse(resmsg);
                            if(_msg.result == true){
                                ymPrompt.succeedInfo({
                                    message: '删除成功', titleBar: false, handler: reloadHref
                                });
                                setTimeout(reloadHref, 3000);
                            }else{
                                alert('未删除成功');
                            }
                        },
                        error: function(){
                            alert('未删除成功');
                        }
                    });
                }
            }
        });
    });
    function reloadHref(){
        location.reload();
    }

});