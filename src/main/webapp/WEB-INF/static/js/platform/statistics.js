/**
 * Document by wangshuyan@chinamobile.com on 2015/11/12 0012.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'jqueryForm': '../lib/jquery.form',
        'base': '../common/base',
        'function': '../common/function',
        'ymPrompt': '../plug/ymPrompt/ymPrompt',
        'My97DatePicker': '../plug/My97DatePicker/WdatePicker'
    },
    shim: {
        'base': {deps: ['jquery']},
        'jqueryForm': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']},
        'My97DatePicker': {deps: ['jquery']}
    },
    waitSeconds: 0
});

require(['jquery', 'jqueryForm', 'ymPrompt', 'base', 'function', 'My97DatePicker'], function(jquery){


    var statisticsAction = {
        $elements: {
            $selectMonth: $('.j-selectui-month'),
            $selectYear: $('.j-selectui-year'),
            $schoolType: $('.j-selectui-schoolType'),
            $puserType: $('.j-selectui-puserType'),
            $fuserType: $('.j-selectui-fuserType'),
            /* num数据显示 */
            $schoolNum: $('.j-schoolNum'),
            $schoolNewNum: $('.j-schoolNewNum'),
            $puserNum: $('.j-puserNum'),
            $puserReduceNum: $('.j-puserReduceNum'),
            $puserNewNum: $('.j-puserNewNum'),
            $activeNum: $('.j-activeNum')
        },
        dataModule: null,
        selectYear: null,
        selectMonth: null,
        schoolType: null,
        p_userType: null,
        f_userType: null,
        isBindE: false,
        bindEvent: function(){
            /* 学校统计选择 */
            statisticsAction.schoolType = new SelectUi(statisticsAction.$elements.$schoolType);
            statisticsAction.schoolType.bindE(statisticsAction.querySchools);

            /* 付费用户用户类型 */
            statisticsAction.p_userType = new SelectUi(statisticsAction.$elements.$puserType);
            statisticsAction.p_userType.bindE(statisticsAction.queryPremiumUser);

            statisticsAction.f_userType = new SelectUi(statisticsAction.$elements.$fuserType);
            statisticsAction.f_userType.bindE(statisticsAction.pillarCalculate);

            statisticsAction.isBindE = true;
        }
    };

    /* 学校统计计算 函数*/
    statisticsAction.querySchools = function(val){
        /* 学校总数 */
        statisticsAction.$elements.$schoolNum.html(statisticsAction.accumulation(val, 'schoolType', 0));
        /* 新增总量 */
        statisticsAction.$elements.$schoolNewNum.html(statisticsAction.accumulation(val, 'schoolType', 1));
    }

    statisticsAction.queryPremiumUser = function(val){
        /* 付费用户计算 函数*/
        statisticsAction.$elements.$puserNum.html(statisticsAction.accumulation(val, 'type', 17));
        statisticsAction.$elements.$puserNewNum.html(statisticsAction.accumulation(val, 'type', 2));
        statisticsAction.$elements.$puserReduceNum.html(statisticsAction.accumulation(val, 'type', 3));
    }

    /* 输入数组，输出level数组*/
    statisticsAction.getTopNumber = function(sar){

        var ar = [], levelAr = [];
        for(var j = 0, len = sar.length; j < len; j++){
            ar[j] = sar[j];
        }
        ar.sort(function(a, b){
            return b - a;
        });
        var maxNumStr = ar[0] + '', // 最大值变成字符串
            str = +(maxNumStr)[0], // 获取最大值第一位
            numLen = maxNumStr.length,// 获取最大值字符串长度;
            upperFnum = str + 1
        var upperNum = 1;
        for(var i = 0, maxLen = numLen - 1; i < maxLen; i++){
            upperNum *= 10;
        }
        for(var k = 0; k <= 5; k++){
            levelAr[k] = k * upperNum * upperFnum / 5;
        }
        levelAr.sort(function(a, b){
            return b - a
        });
        return levelAr;
    }

    statisticsAction.renderPillars = function(_level, _pillarsWrap, ar, wdar, pillarWidth, colorAr){

        /*  先清空 */
        $(_level).empty();
        $(_pillarsWrap).empty();
        var leveAr = statisticsAction.getTopNumber(ar),
            arLen = ar.length,
            wdarLen = wdar.length;
        /* 标尺渲染 */
        var userLevel = '';
        for(var i = 0; i < 5; i++){
            userLevel += '<li> <p class="levelNum">' + leveAr[i] + '</p> </li>';
        }
        userLevel += '<li><div class="levelCategory f-cb">';//坐标
        // /* 坐标渲染 */
        for(var k = 0; k < wdarLen; k++){
            userLevel += ' <p style="width:' + pillarWidth / wdarLen + 'px;">' + wdar[k] + '</p>';//坐标
        }
        userLevel += '</li></div>';//坐标
        $(_level).html(userLevel);
        /* 柱体渲染 */
        var pillarHtml = '';
        for(var j = 0; j < arLen; j++){
            var color = ''
            if(typeof colorAr == 'string'){
                color = colorAr;
            }else if(typeof colorAr == 'object' && colorAr instanceof  Array){
                for(var ci = 0, crLen = colorAr.length; ci < crLen; ci++){
                    if(j == ci || j % crLen == ci){
                        color = colorAr[ci];
                    }
                }
            }
            pillarHtml += '<div class="line" style="height:' + ar[j] / leveAr[0] * 100 + '%;left:' + (pillarWidth / arLen * (j + 1) - 40) + 'px; background-color:' + color + '"><span>' + ar[j] + '</span></div>';
        }


        $(_pillarsWrap).html(pillarHtml);

    }

    statisticsAction.pillarCalculate = function(val){

        /* 功能使用 柱状图 */
        var pillarAr = [], pillarWdAr = [];
        for(var i = 6; i <= 14; i++){
            /*  数值处理 */
            var pillarSingle = statisticsAction.dataModule.statistics[i];
            var pillarVal = 0;
            for(var j = 0, jlen = pillarSingle.length; j < jlen; j++){
                if(val === '0'){
                    pillarVal += pillarSingle[j].userNumber;
                }else if(pillarSingle[j].type === val){
                    pillarVal += pillarSingle[j].userNumber;
                }
            }
            /* 坐标处理*/
            var pillarWd = statisticsAction.dataModule.content[i]
            pillarWdAr.push(pillarWd.substring(0, pillarWd.length - 7));
            pillarAr.push(pillarVal);
        }
        /* 功能使用 渲染  */
        statisticsAction.renderPillars('.j-fuserLevelRuler', '.j-fuserPillarwrap', pillarAr, pillarWdAr, 520, '#56c1e6');
    }

    statisticsAction.renderSelectUi = function(type, $container){
        if(statisticsAction.dataModule[type]){
            var type_html = '<li data-value="0" class="optionHead">全部</li>';
            for(var t_i = 0, schoolTypeLen = statisticsAction.dataModule[type].length; t_i < schoolTypeLen; t_i++){
                var typeVal = statisticsAction.dataModule[type][t_i];
                type_html += '<li data-value="' + typeVal + '">' + typeVal + '</li>';
            }
            $($container).html(type_html)
        }
    }

    /* 累加函数*/
    statisticsAction.accumulation = function(val, type, index){
        var _num = 0;
        for(var i = 0, ilen = statisticsAction.dataModule.statistics[index].length; i < ilen; i++){
            var numSingle = statisticsAction.dataModule.statistics[index][i];
            if(val === '0'){
                _num += numSingle.userNumber;
            }else if(numSingle[type] && numSingle[type] === val){
                _num += numSingle.userNumber;
            }
        }
        return _num
    }

    statisticsAction.activePillarCalculate = function(){
        var pillarArGroup = {'15': [0, 0], '16': [0, 0]};

        for(var i = 15; i <= 16; i++){

            var pillarSingle = statisticsAction.dataModule.statistics[i];
            var pillarFval = 0, pillarTval = 0;
            for(var j = 0, jlen = pillarSingle.length; j < jlen; j++){
                if(pillarSingle[j].type === '家长'){
                    pillarFval += pillarSingle[j].userNumber;
                }
                if(pillarSingle[j].type === '老师'){
                    pillarTval += pillarSingle[j].userNumber;
                }
            }

            pillarArGroup['' + i][0] = pillarTval;
            pillarArGroup['' + i][1] = pillarFval
        }
        var ar = pillarArGroup['15'].concat(pillarArGroup['16'])
        statisticsAction.renderPillars('.j-pointLevelRuler', '.j-pointsPillarwrap', ar, ['兑换积分', '兑换人次'], 240, ['#56c1e6', '#fc4a79']);
    }

    /* * * * * * * * * * * * * * *   渲染函数  * * * * * * * * * * * * * * * * * * */
    statisticsAction.renderPage = function(){
        /*渲染学校类型*/
        statisticsAction.renderSelectUi('schoolType', '.j-schoolType');
        /* 渲染用户类型 */
        statisticsAction.renderSelectUi('userType', '.j-userType');

        if(!statisticsAction.isBindE){
            statisticsAction.bindEvent();
        }

        /* 学校统计选择 */
        statisticsAction.schoolType.init('0');
        statisticsAction.querySchools('0');

        /* 付费用户用户类型 */

        statisticsAction.p_userType.init('0');
        statisticsAction.queryPremiumUser('0');

        /* 活跃用户 */
        statisticsAction.$elements.$activeNum.html(statisticsAction.accumulation('0', 'schoolType', 5));

        /* 功能用户用户类型 */
        statisticsAction.f_userType.init('0');
        statisticsAction.pillarCalculate('0');

        /* 积分 */
        statisticsAction.activePillarCalculate();

    }

    statisticsAction.ajaxGet = function(data){
        $.ajax({
            url: window.globalPath + '/statistics/list',
            type: 'POST',
            dataType: 'json',
            data: {time: data},
            async: false,
            success: function(res){
                if(res){
                    statisticsAction.dataModule = res;
                    statisticsAction.renderPage(statisticsAction.dataModule);
                }else{
                    alert('未获得统计数据');
                }
            }
        });
    }



    statisticsAction.getDate = function(){
        statisticsAction.ajaxGet($('.j-year').val() + '-' + $('.j-month').val());
    }

    statisticsAction.init = function(){
        var date = new Date();
        /*  年 */
        statisticsAction.selectYear = new SelectUi(statisticsAction.$elements.$selectYear);
        statisticsAction.selectYear.init(date.getFullYear())
        statisticsAction.selectYear.bindE();
        /*  月 */
        var m = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        statisticsAction.selectMonth = new SelectUi(statisticsAction.$elements.$selectMonth);
        statisticsAction.selectMonth.init(m)
        statisticsAction.selectMonth.bindE();

        statisticsAction.getDate();
    }

    statisticsAction.init();

    $('.j-queryStatistics').on('click', function(){
        statisticsAction.getDate();
    })
});