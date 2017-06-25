//内容滑块导航
$('.choose-native ul li a').click(function(){
    $(this).parent().parent().find('.selected').removeClass('selected');
    $(this).parent().addClass('selected');
});


//表格全选
$('.table .all-selected').live('click', function(){
    if($(this).is(":checked")){
        $(this).parent().parent().parent().find('.tr-sel').attr('checked', true);
    }else{
        $(this).parent().parent().parent().find('.tr-sel').attr('checked', false);
    }
});
$('.u-tab-selectAll').click(function(){
    $(this).parent().prev().find('.all-selected').attr('checked', true);
    $(this).parent().prev().find('.tr-sel').attr('checked', true);
});
$('.form-reset').click(function(){
    $('.form-grounp .label-info select').val("");
    $('.form-grounp .label-info .u-inputtext').val("");
});


function TyperReader($txtarea, $count, totleNum, timelime, _fn){
    this.$txtarea = $txtarea;
    this.$count = $count;
    this.totleNum = totleNum;
    this.timelime = timelime;
    this.typerTimer = null;
    this.fn = _fn || function(){
        };
}

TyperReader.prototype.bindE = function(){
    var _self = this;

    function counttext(){
        var vallen = _self.$txtarea.val().length,
        counthtml = vallen <= _self.totleNum ? '还可以输入' + parseInt(_self.totleNum - vallen) + '个字' : '已超过 <span style="color:#f60;"> ' + parseInt(vallen - _self.totleNum) + ' </span> 个字';
        _self.$count.html(counthtml);
        _self.typerTimer = setTimeout(function(){
            counttext();
        }, _self.timelime);
    }

    _self.$txtarea.bind({
        'focus': counttext,
        'blur': function(){
            clearTimeout(_self.typerTimer);
            /* 截取 */
            //var $this = $(this);
            //$this.val($this.val().length > 200 ? $this.val().substring(0, 200) : $this.val());
            //_self.$count.html('还可以输入<span>'+ parseInt(_self.totleNum - $this.val().length) +'</span>个字');
            _self.fn();
        }
        /* 'keyup': function(){
         if($(this).val().length > 200){
         $(this).val($(this).val().substring(0, 200));
         }else{
         $(this).next().next().html('（' + $(this).val().length + '/200）');
         }
         }*/
    });
};

var $textearaps = $('.textarea-ps .area-full');
var typerReader = new TyperReader($textearaps, $textearaps.parent().find('.count'), 200, 500);
typerReader.bindE();

if($textearaps != undefined && $textearaps.length > 0){
    var num = 200 - $textearaps.val().length;
    if(num < 0){
        $textearaps.next().next().html('已超过 <span style="color:#f60;"> ' + (-num) + ' </span> 个字');
    }else{
        $textearaps.next().next().html('还可以输入<span style="font-size:16px">' + num + '</span>个字');
    }
}

//对Date的扩展，将 Date 转化为指定格式的String 
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
//例子： 
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt){ //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

$('#ym-window .close-win').live('click', function(){
    window.parent.ymPrompt.doHandler('error', true);
});
$('.sim-radio').click(function(){
    $('.sim-radio').attr('checked', false);
    $(this).attr('checked', true);
});
function startSort(str){
    var arg = str.split(',')
    arg.sort(function(a, b){
        return a.localeCompare(b)
    });
    return arg;
}
$('.checkform .form-grounp input').focus(function(){
    $('#validate').html("");
});
$('.checkform .form-grounp select').focus(function(){
    $('#validate').html("");
});
$('.checkform .form-grounp textarea').focus(function(){
    $('#validate').html("");
});
var replaceSlt = {
    attrDate: [],
    init: function(obj){
        var _self = this;
        var $ele = $(obj['ele']),
        _id = obj['id'] ? ' id="' + obj['id'] + '" ' : '',
        _class = obj['addclass'] ? ' class="u-rpsipt ' + obj['addclass'] + '" ' : ' class="u-rpsipt" ',
        ele = document.querySelector(obj['ele']),
        w = ele.offsetWidth,
        h = ele.offsetHeight;

        var $options = $ele.find('option');
        var $div = $('<div class="m-replaceslt" style="width:' + w + 'px; height:' + h + 'px;positon:relative;"></div>'),
        $ipt = $('<input type="text"   autocomplete="off"  ' + _id + _class + ' placeholder="' + obj.placeholder + '" readonly="readonly" />'),
        $ul = $('<ul></ul>'), lihtml = '';

        for(var i = 0, len = $options.length; i < len; i++){
            var _attr = '';
            if(obj.attr && obj.attr.length > 1){
                for(var j = 0, jlen = obj.attr.length; j < jlen; j++){
                    _attr += obj.attr[j] + '="' + $options.eq(i).attr(obj.attr[j]) + '" ';
                }
            }
            lihtml += '<li ' + _attr + ' data-value="' + $options[i].value + '">' + $options[i].text + '</li>';
        }
        $ul.append(lihtml);
        $div.append($ipt);
        $div.append($ul);
        $ele.after($div);
        $ele.hide();
        $ul.delegate('li', 'click', function(event){
            var e = event || window.event;
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            var $this = $(this);
            _self.attrDate = [];
            $ipt.val($this.text());
            $ele.val($this.attr('data-value'));
            if(obj.attr && obj.attr.length > 1){
                for(var j = 0, jlen = obj.attr.length; j < jlen; j++){
                    _self.attrDate.push($this.attr(obj.attr[j]));
                }
            }
            $ele.change();
            $ul.hide();

        });
        $ipt.bind('click', function(event){
            var e = event || window.event;
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            $ul.toggle();
        });
        $(document).bind('click', function(){
            $ul.hide();
        });
    }
};

/*
 replaceSlt.init({
 ele: '.j-replaceslt',
 placeholder:'请选择角色类型',
 attr:['data-rolelim','data-classlim']
 });
 */

var checkUnit = {
    'checkPhoneNumber': function(number){
        return number.match(/^13\d{9}$|^14\d{9}$|^15\d{9}$|^18\d{9}$|^17\d{9}$|^16\d{9}$/);
    },
    'checkMail': function(emailStr){
        return emailStr.match(/^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/);
    },
    'checkPhone': function(number){
        return number.match(/^0\d{2,3}-?\d{7,8}$/);
    },
    'checkPassword': function(password){
        return password.match(/[\w.,~!@#$%^&*()+]{6,12}/);
    },
    'checkName': function(name){
        return name.match(/^[\u4e00-\u9fa5A-Za-z0-9-_]*$/);
    }
};

//验证帐户
$.fn.extend({
    checkName: function(url, info, box, parameter, callback){
        var name = "名称";
        if(info != null && info.length > 0){
            name = info;
        }
        $(this).parent().css('position', 'private');
        $(this).unbind('focus');
        $(this).bind('focus', function(){
            $(this).parent().find(box).html('&nbsp;');
        });
        var $this = $(this);
        var left = parseInt($(this).css('width').replace('px', '')) + 32;
        $.ajax({
            url: url,
            type: "post",
            async: false,
            data: parameter,
            dataType: "json",
            success: function(da){
                if(da.result == 'true'){
                    $this.parent().find(box).html('该' + name + '已存在');
                    $this.parent().find(box).css('color', '#ff0000');
                }else{
                    $this.parent().find(box).html('该' + name + '可以使用');
                    $this.parent().find(box).css('color', '#33cc66');
                }
                if(callback){
                    callback(da.result);
                }
            }
        });
    }
});
var replace_em = function(str, path){
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\n/g, '<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g, '<img class="face" src="' + path + '/static/plug/emFace/face/$1.gif" border="0" />');
    return str;
};


/*  增减模块  */
function NumPandR(_ipt, _p, _r, max){
    this.ipt = $(_ipt);
    this.p = $(_p);
    this.r = $(_r);
    this.max = max;
    this.bindE();
}
NumPandR.prototype.getVal = function(){
    return isNaN(parseInt(this.ipt.val())) ? 1 : parseInt(this.ipt.val());
};
NumPandR.prototype.bindE = function(){
    var self = this;
    self.p.bind({
        'click': function(){
            var num = self.getVal() >= self.max ? self.max : self.getVal() + 1;
            self.ipt.val(num);
        }
    });
    self.r.bind({
        'click': function(){
            var num = self.getVal() <= 1 ? 1 : self.getVal() - 1;
            self.ipt.val(num);
        }
    });
};

// Brower 版本提示
(function(){
    var b_name = navigator.appName;
    var b_version = navigator.appVersion;
    if (b_name == "Microsoft Internet Explorer") {
        var version = b_version.split(";");
        var trim_version = version[1].replace(/[ ]/g, "");
        if (trim_version == "MSIE7.0" || trim_version == "MSIE6.0" || trim_version == "MSIE8.0") {
           var $windowTips = $('<div class="windowTip">您的浏览器版本过低，为了保证您的使用体验和访问安全，建议您升级浏览器! <a href="http://www.microsoft.com/china/windows/IE/upgrade/index.aspx" target="_blank">IE 最新浏览器</a> |  <a href="http://www.google.cn/chrome/browser/desktop/index.html" target="_blank">chrome浏览器最新版 </a> </div>');
            $('body').prepend($windowTips);
        }
    }
})();