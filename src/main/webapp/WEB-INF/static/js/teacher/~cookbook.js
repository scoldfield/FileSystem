/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/baseTeacher',
        'function': '../common/function',
        'mypannel': '../common/teacherSideBar',
        'ymPrompt': '../plug/ymPrompt/ymPrompt'
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']},
        'mypannel': {deps: ['jquery']}
    },
    waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel'], function(jquery){

    /* 年份选择 */
    var $elements = {
        $sltYear: $('.j-selectyear'),
        $selectMonth: $('.j-selectmonth'),
        $currentMonth: $('.j-currentmonth'),
        $dataWrap: $('#tab'),
        $content: $('.j-contentWrap')
    };

    var today = new Date();
    var currentMonth = today.getMonth() + 1,
        currentYear = today.getFullYear(),
        currentDay = today.getDate(),
        dfY = today.getFullYear(),
        dfM = today.getMonth() + 1,
        dfD = today.getDate();

    var dataId = 0, defaultPostData = {breakfast: '', lunch: '', dinner: ''}, preveData = {breakfast: '', lunch: '', dinner: ''};

    /* 计算月天数 */
    function calculateMDays(year, month){
        var FebDays = (year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0) ? 29 : 28,
            mDays;
        /* 正常越长度 */
        switch(parseInt(month)){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                mDays = 31;
                break;
            case 2:
                mDays = FebDays;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                mDays = 30;
                break;
        }
        return mDays;
    }

    function siblingsMonth(year, month){
        var prevY, prevM, nextY, nextM;
        /*  常规  */
        prevM = month - 1;
        prevY = year;
        nextM = month + 1;
        nextY = year;
        /* 特殊计算覆盖 */
        /* 计算上一个月天数 */
        if(month == 1){
            prevM = 12;
            prevY = year - 1;
        }
        /* 计算下一个月天数 */
        if(month == 12){
            nextM = 1;
            nextY = year + 1
        }
        return {
            prevY: prevY, prevM: prevM, nextY: nextY, nextM: nextM
        }
    }

    /* 渲染月份日期表 */
    function renderCalendar(year, month){
        var normalDay = timeFunction.getTimes(year + '-' + month + '-' + '01').getDay(),
            firstDay = normalDay == 0 ? 7 : normalDay,
            mDays = calculateMDays(year, month),
            timeleave = (firstDay - 1 + mDays) % 7 === 0 ? 0 : 7 - (firstDay - 1 + mDays) % 7,
            fmDays = firstDay - 1 + mDays + timeleave;
        /* 定义前后日期 */
        var prevDateDays, nextDateDays;
        prevDateDays = calculateMDays(siblingsMonth(year, month).prevY, siblingsMonth(year, month).prevM);
        nextDateDays = calculateMDays(siblingsMonth(year, month).nextY, siblingsMonth(year, month).nextM);

        var trHtml = '<tr>';
        for(var i = 1; i <= fmDays; i++){
            var tempDate = 0, isgray = '';
            if(i < firstDay){
                tempDate = parseInt(prevDateDays - firstDay + 1 + i);
                isgray = 'j-prev gray';
            }else if(i > (firstDay - 1 + mDays)){
                tempDate = parseInt(i - mDays - firstDay + 1);
                isgray = 'j-next gray';
            }else{
                tempDate = parseInt(i - firstDay + 1);
                if(currentYear == dfY && currentMonth == dfM && tempDate == currentDay){
                    isgray = 'current';
                }
            }
            var _year = year < 10 ? '0' + year : year;
            var _month = month < 10 ? '0' + month : month;
            var _tempDate = tempDate < 10 ? '0' + tempDate : tempDate;

            trHtml += '<td><a href="javascript:void(0)" data-value="' + _year + '-' + _month + '-' + _tempDate + '" class="' + isgray + '">' + tempDate + '</a></td>';


            if(i % 7 === 0 && i !== 1 && i !== fmDays){
                trHtml += '</tr><tr>'
            }
            if(i === fmDays){
                trHtml += '</tr>';
            }
        }
        $elements.$dataWrap.html(trHtml);

        //renderBookList()
    }


    /*function renderBookList(time){
     postData = ['11', '22', '44'];
     defaultPostData = ['11', '22', '44'];
     }*/

    function initIpt(sltYear){
        sltYear.init(currentYear, currentYear);
        /* 初始化当前年月日*/
        $elements.$currentMonth.val(currentMonth);
    }

    function getData(date){
        $.ajax({
            url: window.globalPath + '/recipess/day',
            type: 'POST',
            dataType: 'json',
            data: {date: date},
            success: function(res){
                if(res && res.recipes){
                    $('.j-recipessBreakfast').val(res.recipes.breakfast || '');
                    $('.j-recipessLunch').val(res.recipes.lunch || '');
                    $('.j-recipessDinner').val(res.recipes.dinner || '');
                    defaultPostData.breakfast = res.recipes.breakfast || '';
                    defaultPostData.lunch = res.recipes.lunch || '';
                    defaultPostData.dinner = res.recipes.dinner || '';
                    preveData.breakfast = res.recipes.breakfast || '';
                    preveData.lunch = res.recipes.lunch || '';
                    preveData.dinner = res.recipes.dinner || '';
                    dataId = res.recipes.id;
                }else{
                    $('.j-recipessBreakfast').val('');
                    $('.j-recipessLunch').val('');
                    $('.j-recipessDinner').val('');
                    defaultPostData.breakfast = '';
                    defaultPostData.lunch = '';
                    defaultPostData.dinner = '';
                    dataId = 0;
                }
            }
        });
    }


    function save($ele){
        var $ta = $ele,
            _currentMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth,
            _currentDay = currentDay < 10 ? '0' + currentDay : currentDay;

        var time = currentYear + '-' + _currentMonth + '-' + _currentDay,
            ajaxUrl, data = {};
        data.type = $ta.attr('data-item');
        data.content = $ta.val();

        if(dataId == 0){
            data.time = time;
        }else{
            data.id = dataId;
        }

        $.ajax({
            url: window.globalPath + '/recipess/save',
            type: 'POST',
            dataType: 'json',
            data: data,
            //async: false,
            success: function(res){
                if(res.result == true){
                    dataId = res.recipes.id;
                    defaultPostData[data.type] = data.content;
                }else{
                    ymPrompt.alert({
                        message: ' <div class="ym-inContent ym-inContent-warning oneline"><h2> ' + res.msg + '</h2></div>',
                        titleBar: false
                    })
                }
            }
        });
    }

    (function(){
        /* 年份选择事件 */
        var sltYear = new SelectUi($elements.$sltYear);
        sltYear.bindE(function(val){
            currentYear = val;
            renderCalendar(currentYear, currentMonth);// 事件 渲染
        });
        /* 渲染 年月 */
        initIpt(sltYear);
        renderCalendar(currentYear, currentMonth);
        var _currentYear = currentYear < 10 ? '0' + currentYear : currentYear,
            _currentMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth,
            _currentDay = currentDay < 10 ? '0' + currentDay : currentDay;
        getData(_currentYear + '-' + _currentMonth + '-' + _currentDay);
        /* *********** 事件 *************** */
        /* 加减月 */
        $elements.$selectMonth.bind('click', function(e){
            var $this = $(e.target);
            if($this.hasClass('prev')){
                currentMonth--;
                if(currentMonth === 0){
                    currentMonth = 12;
                    currentYear--;
                    sltYear.init(currentYear, currentYear);
                }
            }else if($this.hasClass('next')){
                currentMonth++;
                if(currentMonth === 13){
                    currentMonth = 1;
                    currentYear++;
                    sltYear.init(currentYear, currentYear);
                }
            }
            $elements.$currentMonth.val(currentMonth);
            renderCalendar(currentYear, currentMonth)
        });
        /*  单个日期选择  */
        $elements.$dataWrap.delegate('a', 'click', function(){
            var $this = $(this), val = $this.attr('data-value');
            var prevY = siblingsMonth(currentYear, currentMonth).prevY,
                prevM = siblingsMonth(currentYear, currentMonth).prevM,
                nextY = siblingsMonth(currentYear, currentMonth).nextY,
                nextM = siblingsMonth(currentYear, currentMonth).nextM;
            if($this.hasClass('j-prev')){
                currentYear = prevY;
                currentMonth = prevM;
                initIpt(sltYear);
                renderCalendar(currentYear, currentMonth);
            }else if($this.hasClass('j-next')){
                currentYear = nextY;
                currentMonth = nextM;
                initIpt(sltYear);
                renderCalendar(currentYear, currentMonth);
            }else{
                $elements.$dataWrap.find('a.current').removeClass('current');
                $this.addClass('current');
                currentDay = $this.text();
                getData($this.attr('data-value'))
            }
        });

        /* 不可编辑  */
        if(window.couldEdit !== 1){
            $elements.$content.find('textarea').attr('readonly', 'readonly');
        }

        $elements.$content.delegate('textarea', {
            'focus': function(){
                if(window.couldEdit === 1){
                    var $this = $(this),
                        $p = $this.parent();
                    $('.j-content').removeClass('active');
                    $p.addClass('active');
                }
            },
            'blur': function(event){
                if(window.couldEdit === 1){
                    $(this).parent().removeClass('active');
                    save($(this));
                }
            }
        }).delegate('.reset', 'click', function(){
            var $ta = $(this).parent().prev();
            $ta.val(preveData[$ta.attr('data-item')]);
            $ta.focus();
            $ta.parent().addClass('active');
        }).delegate('.save', 'click', function(){
            save($(this).parent().prev());
        });
    })();
});