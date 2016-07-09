/**
 * Document by wangshuyan@chinamobile.com on 2015/11/12 0012.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'jqueryForm': '../lib/jquery.form',
        'base': '../common/base', /*  全局函数、方法、对象*/
        'function': '../common/function',
        'ymPrompt': '../plug/ymPrompt/ymPrompt',
        'My97DatePicker': '../plug/My97DatePicker/WdatePicker'
    },
    shim: {
        'jqueryForm': {deps: ['jquery']},
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']},
        'My97DatePicker': {deps: ['jquery']}
    },
    waitSeconds: 0
});

require(['jquery', 'base', 'jqueryForm', 'ymPrompt', 'function', 'My97DatePicker'], function(jquery){

    var $elements = {
        $upLevel: $('.j-upLevel'),
        $selectDateY: $('.j-selectui-year'),
        $selectDateM: $('.j-selectui-month'),
        $detail: $('.j-bc'),
        $type: $('.j-type'),
        $schoolType: $('.j-schoolType'),
        $userType: $('.j-userType'),
        $submit: $('.j-submitBtn')
    }

    /* 是否为空验证 */
    var isUserTypeReqired = true,
        isSchoolTypeReqired = true,
        isSubmit = true;

    function isAllCheck(ele, all){
        var result = true;
        $(ele).each(function(){
            var $this = $(this);
            if(!$this.is(':checked')){
                result = false;
            }
        });
        document.querySelector(all).checked = result;
    }

    function checkAll(ele, isAll){
        $(ele).each(function(){
            var $this = $(this);
            if(isAll){
                $this.attr('checked', 'checked');
            }else{
                $this.removeAttr('checked');
            }
        })
    }

    function renderInput(inputType, dataArray, $container, noneMsg, name, isnav){
        var _html = '', checkstyle = isnav || 'checkbox-ui';
        if(dataArray && dataArray.length > 0){
            for(var i = 0, ilen = dataArray.length; i < ilen; i++){
                var single = dataArray[i];
                if(single.indexOf('##')){
                    var singleAr = single.split('##'),
                        _name = 'name="' + name + '"' || '';
                    _html += '<label class="' + checkstyle + ' f-fl"><input ' + _name + ' type="' + inputType + '" value="' + singleAr[0] + '" data-value="' + singleAr[1] + '"/><b></b>' + singleAr[1] + '</label>'
                }
            }
        }else{
            _html += '没有' + noneMsg;
        }
        $container.append(_html);
        // 类型特例
        if(name === 'detail'){
            $container.append('<div class="isall"><label class="checkbox-ui  isall f-fl"><input type="checkbox" class="j-typeall" checked="checked" /><b></b>全选</label></div>');
        }
    }

    function resetInput(){
        $('.m-statisticsdown input').removeAttr('disabled');
        isUserTypeReqired = true;
        isSchoolTypeReqired = true;
    }

    function relaseSubmit(){
        if(isSubmit == false){
            isSubmit = true;
            $elements.$submit.removeAttr('disabled');
        }
    }

    var GlobalrelationSingle = [];


    /* 业务逻辑及事件绑定*/
    (function(){
        /*任何一个输入框改动，释放提交限制*/
        $('.m-statisticsdown').on('change', 'input', relaseSubmit);

        $.ajax({
            url: window.globalPath + '/statistics/detail',
            type: 'POST',
            dataType: 'json',
            success: function(res){
                if(res){
                    renderInput('radio', res.upLevel, $elements.$upLevel, '统计类型', 'uplevel', 'checkbox-nav');
                    /* 统计类型页面渲染 */
                    renderInput('checkbox', res.detail, $elements.$detail, '统计类型', 'detail');
                    /*  统计纬度 */
                    renderInput('radio', res.type, $elements.$type, '统计纬度', 'dtype');
                    /*  统计纬度 */
                    renderInput('checkbox', res.schoolType, $elements.$schoolType, '统计学校类型', 'schoolType');
                    /*  统计纬度 */
                    renderInput('checkbox', res.userType, $elements.$userType, '统计用户类型', 'userType');
                    /* 统计类型区间 */
                    if(res.relation && res.relation.length > 0){
                        for(var i = 0, ilen = res.relation.length; i < ilen; i++){
                            var relationSingle = res.relation[i];
                            if(relationSingle.indexOf('-')){
                                var relationSingleAr = relationSingle.split('-');
                                GlobalrelationSingle.push({from: +relationSingleAr[0], to: +relationSingleAr[1]});
                            }
                        }
                    }

                }
            }
        });


        var selectYear = new SelectUi($elements.$selectDateY);
        selectYear.bindE(function(){
            relaseSubmit();
        });
        var selectMonth = new SelectUi($elements.$selectDateM);
        selectMonth.bindE(function(){
            relaseSubmit();
        });

        /* *** 事件绑定*** */
        /* 统计类型 */
        $elements.$upLevel.on('change', 'input:radio', function(){
            var $this = $(this), _val = $this.val();
            /* 重置 所有区域 */
            $elements.$detail.find('label:not(.isall)').hide();
            $elements.$detail.show();
            $elements.$detail.find('input[name]').removeAttr('checked');
            if($this.is(':checked')){
                /* for循环  */
                for(var i = GlobalrelationSingle[+_val].from, len = GlobalrelationSingle[+_val].to; i <= len; i++){
                    $elements.$detail.find('input[value=' + i + ']').attr('checked', 'checked').parent().show();
                }
                $('.squire').removeClass('squire-0 squire-1 squire-2').addClass('squire-' + _val);
            }
            resetInput();
            if(_val === '0'){
                $elements.$type.find('input[value=3]').attr('disabled', 'disabled');
                $elements.$userType.find('input').attr('disabled', 'disabled');
                isUserTypeReqired = false;
            }
            if(_val === '1' && $('input[name=dtype]:checked').val() == '3'){
                $elements.$schoolType.find('input').attr('disabled', 'disabled');
                isSchoolTypeReqired = false;
            }
        });

        $elements.$detail.delegate('input.j-typeall', 'change', function(){
            if($(this).is(':checked')){
                $elements.$detail.find('.checkbox-ui:visible').find('input[name=detail]').attr('checked', 'checked');
            }else{
                $elements.$detail.find('.checkbox-ui:visible').find('input[name=detail]').removeAttr('checked');
            }
        }).delegate('input:not(.j-typeall)', 'change', function(){
            var alllength = $elements.$detail.find('.checkbox-ui:visible').find('input[name=detail]').length,
                checkedlength = $elements.$detail.find('.checkbox-ui:visible').find('input[name=detail]:checked').length;
            $elements.$detail.find('.j-typeall')[0].checked = (alllength === checkedlength);
        })


        /* 纬度选择其他类型的disabled判断*/
        $elements.$type.on('click', 'input', function(){
            var $this = $(this), _val = $this.val();
            resetInput();
            if(_val === '3'){
                $elements.$schoolType.find('input').attr('disabled', 'disabled');
                isSchoolTypeReqired = false;
            }
            if($elements.$upLevel.find('input:checked').val() === '0'){
                $elements.$type.find('input[value=3]').attr('disabled', 'disabled');
                $elements.$userType.find('input').attr('disabled', 'disabled');
                isUserTypeReqired = false;
            }

        })

        /* 全选与非全选 */
        //* 学校类型
        $elements.$schoolType.on('change', 'input:not(.j-schoolTypeAll)', function(){
            isAllCheck('.j-schoolType  input:not(.j-schoolTypeAll)', '.j-schoolTypeAll');
        });
        //全部
        $('.j-schoolTypeAll').on('change', function(){
            var isAll = !!$(this).attr('checked');
            checkAll('.j-schoolType input:not(.j-schoolTypeAll)', isAll)
        });
        //* 学校类型
        $elements.$userType.on('change', 'input:not(.j-userTypeAll)', function(){
            isAllCheck('.j-userType input:not(.j-userTypeAll)', '.j-userTypeAll');
        });
        //全部
        $('.j-userTypeAll').on('change', function(){
            var isAll = !!$(this).attr('checked');
            checkAll('.j-userType input:not(.j-userTypeAll)', isAll);
        });


        /* 提交 */
        $elements.$submit.on('click', function(){
            var $submitThis = $(this);
            var erroMsg = [], postData = {};
            /* 获取统计类型 */
            postData.detail = '';
            if($('input[name=uplevel]:checked').length > 0){
                var detailPVal = +$('input[name=uplevel]:checked').val(), dAr = [];
                $('input[name=detail]:checked').each(function(){
                    var $this = $(this), _val = $this.val();
                    if(_val >= GlobalrelationSingle[detailPVal].from && _val <= GlobalrelationSingle[detailPVal].to){
                        dAr.push(_val);
                    }
                });
                if(dAr.length > 0){
                    postData.detail = dAr.join(',');
                }else{
                    erroMsg.push('请选择统计类型');
                }
            }else{
                erroMsg.push('请选择统计类型');
            }

            /* 获取选择时间 */
            var _y = $.trim($('.j-slty').val()), _m = $.trim($('.j-sltm').val())
            if(_y === '' || _m === ''){
                erroMsg.push('请选择统计时间');
            }else{
                postData.time = _y + '-' + _m;
            }

            /* 选择统计纬度 */
            if($('input[name=dtype]:not(:disabled)').length > 0){ // 现判断统计纬度可点击的选项是否存在
                if($('input[name=dtype]:checked').length > 0 && $('input[name=dtype]:checked').val() && !$('input[name=dtype]:checked').is(':disabled')){
                    postData.item = +$('input[name=dtype]:checked').val();
                }else{
                    erroMsg.push('请选择统计纬度');
                }
            }else{
                postData.item = 3;
            }

            if(isSchoolTypeReqired){
                /* 选择统计学校类型 */
                if($('input[name=schoolType]:not(:disabled):checked').length > 0){
                    var stAr = []
                    $('input[name=schoolType]:not(:disabled):checked').each(function(){
                        stAr.push($(this).val());
                    });
                    if(stAr.length > 0){
                        postData.schoolType = stAr.join(',');
                    }else{
                        erroMsg.push('请选择统计学校类型');
                    }
                }else{
                    erroMsg.push('请选择统计学校类型');
                }
            }

            if(isUserTypeReqired){
                /* 选择统计用户类型 */
                if($('input[name=userType]:not(:disabled):checked').length > 0){
                    var utAr = []
                    $('input[name=userType]:not(:disabled):checked').each(function(){
                        utAr.push($(this).val());
                    });
                    if(utAr.length > 0){
                        postData.userType = utAr.join(',');
                    }else{
                        erroMsg.push('请选择统计用户类型');
                    }
                }else{
                    erroMsg.push('请选择统计用户类型');
                }
            }

            if(erroMsg.length > 0){
                $('.j-errorTips').html(erroMsg.join('; ')).fadeIn();
                setTimeout(function(){
                    $('.j-errorTips').fadeOut(1000);
                }, 3000)
            }else{
                if(isSubmit){
                    isSubmit = false;
                    $submitThis.attr('disabled', 'disabled');
                    var _dtype = $('input[name=dtype]:checked').attr('data-value') ? '_' + $('input[name=dtype]:checked').attr('data-value') : '';
                    postData.name = $('input[name=uplevel]:checked').attr('data-value') + '_' + _y + _m + _dtype;
                    $.ajax({
                        url: window.globalPath + '/statistics/download',
                        type: 'POST',
                        dataType: 'json',
                        data: postData,
                        success: function(res){
                            /* $('.j-download').attr('href', window.globalPath + res);
                             $('.j-download')[0].click();*/
                            if(res == '0'){
                                ymPrompt.alert({message: '<br /> &nbsp;下载失败', titleBar: false, width: 220});
                            }else if(res == '999'){
                                ymPrompt.alert({message: '<br /> &nbsp;当前用户下的数据为空,<br />请添加相应数据后再点击下载', titleBar: false, width: 440});
                            }else{
                                location.href = window.globalPath + res;
                            }
                        }
                    });
                }
            }
        });
        //清空
        $('.j-reset').on('click', function(){
            $('input:radio,input:checkbox').each(function(){
                $(this).get(0).checked = false;
                $(this).get(0).disabled = false;
                $elements.$detail.hide();
            });
        });
    })();
});