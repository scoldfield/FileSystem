/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/base',
        'function': '../common/function',
        'ymPrompt': '../plug/ymPrompt/ymPrompt'
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']}
    },
    waitSeconds: 0
});
require(['jquery', 'ymPrompt', 'base', 'function'], function(jquery){

    /* 获取类型 */
    var _userType = getUrlQuery('type') || '1';

    var creditset = {
        postData: [],
        postDataMap: {},
        isSubmit: true,
        setTitle: {
            '1': '登录',
            '2': '课程设置',
            '3': '发布通知',
            '4': '发布作业',
            '5': '发布考试',
            '6': '录入成绩',
            '7': '班级圈',
            '8': '个人设置',
            '9': '注册',
            '10': '邀请',
            '11': '考试',
            '12': '作业',
            '13': '通知',
            '14': '考勤',
            '15': '请假条',
            '16': '班级圈',
            '17': '添加宝贝',
            '18': '个人设置',
            '19': '客户端签到',
            '20': '客户端签到'
        },
        isBindE: true,
        $elements: {
            $submit: $('.j-submit'),
            $container: $('.m-creditsetContentbody')
        },
        isUpperCanEdit: 0
    }


    creditset.bindE = function(){
        var _self = this
        _self.isBindE = false;

        /* 随页面固定 */
        $(window).scroll(function(){
            if($(window).scrollTop() > 120){
                $('.m-creditsetContentHead,.m-creditsetContentbody').addClass('fixed');
            }else{
                $('.m-creditsetContentHead,.m-creditsetContentbody').removeClass('fixed');
            }
        });

        creditset.$elements.$container.delegate('.j-editCan', {
            'focus': function(){
                var $this = $(this), $parent = $this.parent(), $tips = $parent.find('.erroTips'), _val = $this.val(), _id = $parent.attr('data-id');
                $tips.fadeOut();
                _self.postDataMap[_id].isError = false;
                _self.postDataMap[_id].isErrorMsg = '';
            },
            'blur': function(){
                var $this = $(this), $parent = $this.parent(), $tips = $parent.find('.erroTips'), _val = $this.val(), _id = $parent.attr('data-id');
                _self.postDataMap[_id].id = _id;
                if(_val !== ''){
                    /* 非数字 */
                    if(isNaN(_val)){
                        _self.postDataMap[_id].isError = true;
                        _self.postDataMap[_id].isErrorMsg = '非纯数字：请输入纯数字';
                        $tips.html(_self.postDataMap[_id].isErrorMsg).fadeIn();
                        return;
                    }
                    /* 超过最大值 */
                    if(_val > 999999){
                        _self.postDataMap[_id].isError = true;
                        _self.postDataMap[_id].isErrorMsg = '积分设置请勿超过 999999';
                        $tips.html(_self.postDataMap[_id].isErrorMsg).fadeIn();
                        return;
                    }
                    /* 如果是上限值，不能低于当前积分值 */
                    if($this.hasClass('upper')){
                        var prevVal = parseInt($this.prev().val());
                        if(_val < prevVal){
                            _self.postDataMap[_id].isError = true;
                            _self.postDataMap[_id].isErrorMsg = '积分上限请勿小于该项积分值';
                            $tips.html(_self.postDataMap[_id].isErrorMsg).fadeIn();
                        }else{
                            _self.postDataMap[_id].maxValue = _val;
                        }
                    }else{
                        var nextVal = parseInt($this.next().val());
                        if(_val > nextVal){

                            _self.postDataMap[_id].isError = true;
                            _self.postDataMap[_id].isErrorMsg = '积分上限请勿小于该项积分值';
                            $tips.html(_self.postDataMap[_id].isErrorMsg).fadeIn();
                        }else{
                            _self.postDataMap[_id].value = _val;
                        }
                    }
                }else{
                    _self.postDataMap[_id].isError = true;
                    _self.postDataMap[_id].isErrorMsg = '积分不能没空';
                    $tips.html(_self.postDataMap[_id].isErrorMsg).fadeIn();
                }
            }
        });

        _self.$elements.$submit.on('click', function(){
            var $this = $(this);
            if($this.hasClass('edit')){
                $('.j-editCan').removeAttr('disabled')
                $this.removeClass('edit').text('设置完成！');
            }else{
                if(_self.isSubmit){
                    var isError = false
                    for(var pi in _self.postDataMap){
                        if(_self.postDataMap.hasOwnProperty(pi)){
                            if(_self.postDataMap[pi].isError){
                                isError = true;
                                break;
                            }else{
                                _self.postData.push({id: _self.postDataMap[pi].id, value: _self.postDataMap[pi].value, maxValue: _self.postDataMap[pi].maxValue});
                            }
                        }
                    }
                    if(!isError){
                        ymPrompt.confirmInfo({
                            message: '是否提交积分设置',
                            widht: 320,
                            height: 180,
                            titleBar: false,
                            handler: function(res){
                                if(res == 'ok'){
                                    _self.isSubmit = false;
                                    $.ajax({
                                        url: window.globalPath + '/pointSet/edit',
                                        type: 'POST',
                                        dataType: 'json',
                                        data: {pointsJson: JSON.stringify(_self.postData)},
                                        success: function(res){
                                            if(res.result == 'success'){

                                                $('.j-editCan').attr('disabled', 'disabled')
                                                $this.addClass('edit').text(' 编 辑 ');

                                                setTimeout(function(){
                                                    location.href = window.globalPath + '/pointSet/gotoEdit';
                                                }, 3000);
                                                ymPrompt.succeedInfo({
                                                    message: '设置成功！',
                                                    width: 320,
                                                    height: 220,
                                                    titleBar: false,
                                                    handler: function(){
                                                        location.href = window.globalPath + '/pointSet/gotoEdit';
                                                    }
                                                });
                                            }else{
                                                _self.isSubmit = true;
                                            }
                                        },
                                        error: function(){
                                            _self.isSubmit = true;
                                        }
                                    });
                                }
                            }
                        });
                    }else{
                        ymPrompt.alert({
                            message: '有错误的填写！<span class="f-db f-fs1" style="padding-top:10px;">请按错误提示重新填写</span>',
                            titleBar: false
                        })
                    }
                }
            }
        });

        /* $('.j-reset').on('click', function(){
         _self.postData = [];
         $('.j-editCan').val('');
         $('.erroTips').fadeOut();
         })*/
    }

    creditset.renderList = function(type){
        var _self = this;
        $('.j-editCan').attr('disabled', 'disabled')
        _self.$elements.$submit.addClass('edit').text(' 编 辑 ');
        $.ajax({
            url: window.globalPath + '/pointSet/getList',
            type: 'POST',
            dataType: 'json',
            data: {type: type},
            async: false,
            success: function(res){
                if(res && res.length > 0){
                    var $div = $('<div></div>')
                    for(var i = 0, ilen = res.length; i < ilen; i++){
                        var resSingle = res[i];
                        var $dl = $('<dl></dl>'),
                            _title = _self.setTitle[resSingle.module] || '未知',
                            $title = $('<dt>' + _title + '</dt>'),
                            $dd = $('<dd></dd>');
                        $dl.append($title);
                        var isUpperCanEdit = resSingle.type == 2 ? '' : ' j-editCan';

                        for(var j in resSingle.contents){
                            if(resSingle.contents.hasOwnProperty(j)){
                                var contentsSingle = resSingle.contents[j];
                                var nob = j == resSingle.contents.length - 1 ? 'nob' : ''
                                var $setUnit = $('<div class="setUnit ' + nob + '" data-id="' + contentsSingle.id + '"></div>'), _html = ''
                                _html += '<p class="setDetail">' + contentsSingle.description + '</p> ' +
                                    '<input type="text"   autocomplete="off"   disabled="disabled"  class="u-gipt u-gtip-cdset j-editCan" value="' + contentsSingle.value + '"/>' +
                                    ' <input  type="text"   autocomplete="off"    disabled="disabled"  class="u-gipt u-gtip-cdset upper' + isUpperCanEdit + '"  value="' + contentsSingle.maxValue + '"/> ' +
                                    ' <div class="erroTips"></div>';
                                $setUnit.append(_html);
                                $dd.append($setUnit);
                                _self.postDataMap[contentsSingle.id] = {id: contentsSingle.id, value: contentsSingle.value, maxValue: contentsSingle.maxValue, isError: false, isErrorMsg: ''}
                            }
                        }
                        if($dd.children().length > 0){
                            $dl.append($dd);
                            $div.append($dl);
                        }
                    }
                    creditset.$elements.$container.html($div);
                }
            }
        });
    }

    creditset.init = function(){
        var _self = this;
        _self.renderList(_userType);
        if(_self.isBindE){
            _self.bindE();
        }
        var selectType = new SelectUi($('.j-selectui-type'))
        selectType.init(_userType);
        selectType.bindE(function(val){
                _self.renderList(val);
            }
        );
    }
    creditset.init();
});