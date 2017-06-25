/**
 * Document by wangshuyan@chinamobile.com on 2015/11/20 0020.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/base',
        'function': '../common/function',
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

require(['jquery', 'base', 'function', 'Pagination'], function(jquery){
    (function(){
        var affairsClass = {
            /* 常用节点 */
            /* 搜寻节点 */
            $query: $('.j-queryByWord'),
            $queryKeyWord: $('.j-keyword'),
            /* 搜寻提示 已经未果节点 */
            $querytips: $('.s-querytips'),
            /* 学校列表容器 */
            $tab: $('#tab')
        };

        affairsClass.$query.bind('click', QuerySchools);

        function QuerySchools(){
            var _val = affairsClass.$queryKeyWord.val();
            $.ajax({
                url: window.globalPath + '/class/getSchholList',
                data: {referredName: _val},
                dataType: 'json',
                type: 'POST',
                asycn: false,
                success: function(resData){
                    if((resData instanceof  Array) && resData.length > 0){
                        var $tbodyhtml = '';
                        for(var i in resData){
                            if(resData.hasOwnProperty(i)){
                                var obji = resData[i];
                                $tbodyhtml += '<tr><td>' + obji.areaname + '</td><td>' + obji.schoolType + '</td><td>' + obji.referredName + '</td><td>' + obji.headmaster + '</td><td>' + obji.mobile + '</td><td><a class="general" data-item="' + i + '" data-id="' + obji.schoolId + '" href="' + window.globalPath + '/class/getClassInfo?schoolId=' + obji.id + '">查看</a></td></tr>';
                            }
                        }
                        affairsClass.$tab.empty().append($tbodyhtml);
                    }else{
                        affairsClass.$tab.empty().append('<tr> <td colspan="6"> <p class="s-querytips f-fl"><span class="f-cr">未能查询到相关学校，请检查搜过关键字或确定搜索的学校是否存在</span></p></td></tr>')
                    }
                }
            });
        }

        QuerySchools();
    })();
});