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

    var stateText = {
        0: ['离线', 'unuse'],
        1: ['正常', 'ok'],
        2: ['离线', 'unuse']
    };


    var options = {
        returnPage: $('#tab'),
        tabPagination: $('.tab-pagination'),
        ajaxurl: window.globalPath + '/device/getList',
        render: function(resData){
            var _self = this, $trlist = '';
            _self.returnPage.empty();
            var lihtml = '';
            if(resData && resData.districtMap && !areaSelect.ishasList){
                for(var di in resData.districtMap){
                    if(!resData.districtMap.hasOwnProperty(di)) continue;
                    lihtml += ('<li data-value="' + di + '">' + resData.districtMap[di] + '</div>');
                }
                $('.j-arealist').append(lihtml);
                areaSelect.ishasList = true;
            }


            if(!resData || !resData.pageInfo){
                $trlist = '<tr><td colspan="7" align="center">未获取到视频数据</td></tr> ';
            }else{
                var resObj = resData.pageInfo;
                !_self.pageCount && (_self.pageCount = resObj.total);
                var $list = resObj.list, listlen = $list.length;
                if($list.length == 0){
                    $trlist = '<tr><td colspan="7" align="center">未获取到视频数据</td></tr> ';
                }else{
                    for(var i in $list){
                        if($list.hasOwnProperty(i)){
                            var _list = $list[i];
                            var _id = _list.id || 0,
                                _state = _list.state || 0,
                                _areaNames = _list.districtName || '',
                                _schoolId = _list.schoolName || '',
                                _url = _list.url || '',
                                _sysId = _list.deviceCode || '',
                                _mobile = _list.mobile || '';
                            $trlist += ('<tr><td><span class="tdstatus ' + stateText[_state][1] + '"> ' + stateText[_state][0] + '</span></td>' +
                            '<td>' + _areaNames + '</td>' +
                            '<td>' + _schoolId + '</td>' +
                            '<td>' + _url + '</td>' +
                            '<td>' + _sysId + '</td>' +
                            '<td>' + _mobile + '</td>' +
                            '<td><a class="general" href="' + window.globalPath + '/device/' + _id + '/update">修改</a>' +
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
        pageNumber: 1
    };


    var videoList = new Pagination(options);
    videoList.init(optionsQueryObj);

    $('.j-queryBtn').bind('click', function(){
        optionsQueryObj.schoolName = $('.j-queryWords').val();
        optionsQueryObj.pageNumber = 1;
        videoList.init(optionsQueryObj);
    });


    var areaSelect = new SelectUi($('.j-selectui-area'));
    areaSelect.bindE(function(val){
        optionsQueryObj.pageNumber = 1;
        optionsQueryObj.distrCode = val;
        optionsQueryObj.schoolName = $('.j-queryWords').val();
        videoList.init(optionsQueryObj);
    });
    areaSelect.ishasList = false;


    options.returnPage.delegate('.j-del', 'click', function(){
        var id = $(this).attr('data-id');
        ymPrompt.confirmInfo({
            message: '确定删除该设备?',
            titleBar: false,
            handler: function(res){
                if(res == 'ok'){
                    $.ajax({
                        url: window.globalPath + '/device/' + id + '/delete',
                        type: 'get',
                        success: function(resmsg){
                            var _resmsg = JSON.parse(resmsg);
                            if(_resmsg && _resmsg.msg && _resmsg.msg == 'ok'){
                                ymPrompt.succeedInfo({
                                    message: '删除成功',
                                    titleBar: false,
                                    handler: function(){
                                        location.reload();
                                    }
                                });
                                setTimeout(function(){
                                    location.reload();
                                }, 3000);
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

});