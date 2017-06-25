/**
 * Document by wangshuyan@chinamobile.com on 2015/11/23 0023.
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
        'Pagination': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']}
    },
    waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt'], function(jquery){
    var roleOriginalId = $('#id').val() || false;

    var typeTxt = '新增'
    if(+roleOriginalId){
        typeTxt = '修改'
        $('.j-edittype').html('修改')
    }else{
        typeTxt = '新增'
        $('.j-edittype').html('新增')
    }

    var countIpt = new CountInput($('.pendingarea'));
    countIpt.maxlen = 100;
    countIpt.init({
        callback: function(len){
            var $iptSize = $('.j-iptSize'), msg;
            if(len <= countIpt.maxlen){
                msg = '还可以输入<span class="fit">' + ( countIpt.maxlen - len) + '</span>个字'
            }else{
                msg = '输入已超出<span class="out">' + (len - countIpt.maxlen) + '</span>个字'
            }
            $iptSize.html(msg);
        }
    });

    (function(){
        /*  重置单个表单 */
        function resetIpt($ele){
            var $parents = $ele.parents('li'), $tips = $parents.find('.j-tips');
            $ele.removeClass('erro');
            $tips.removeClass('ok erro').empty();
            $('.j-erroAll').empty();
        }

        /* 显示错误 */
        function showErro($ele, msg){
            var $parents = $ele.parents('li'), $tips = $parents.find('.j-tips');
            $ele.addClass('erro');
            $tips.addClass('erro').html(msg);
        }

        var roleSubmit = {
            $element: {
                $roleName: $('.j-roleName'),
                $description: $('.j-auditDescription'),
                $resourceIds: $('#resourceIds')
            },
            isRoleNameRepeat: false,
            isEdit: true,
            isSubmit: true
        };
        roleSubmit.bindE = function(){
            var _self = this;
            /* 角色名称焦点交互 */
            _self.$element.$roleName.bind({
                'focus': function(){
                    var $this = $(this);
                    resetIpt($this)
                },
                'blur': function(){
                    var $this = $(this), _val = $this.val(), _defaultValue = $this[0].defaultValue;
                    if(_val){
                        var msg = '', result = true;
                        switch(true){
                            case  _defaultValue == '' || (_defaultValue !== '' && _val != _defaultValue):
                                _self.isRoleNameRepeat = checkUtil.isRepeatAjax(window.globalPath + '/roleManager/checkDuplicate', {'roleName':_val});
                                if(_self.isRoleNameRepeat === 'false'){
                                    result = false;
                                    msg = '角色名称已存在';
                                }
                                break;
                            case !checkUtil.checkCharSize(_val, 0, 17):
                                result = false;
                                msg = '角色名称长度超过16个字';
                        }
                        if(!result){
                            showErro($this, msg);
                        }
                    }
                }
            });
            /* 角色描述焦点描述 */
            _self.$element.$description.bind({
                'focus': function(){
                    var $this = $(this);
                    resetIpt($this);
                },
                'blur': function(){

                }
            });

            $('.j-submitaddrole').bind('click', function(){
                var rolev = $.trim(_self.$element.$roleName.val()),
                    descriptionVal = $.trim(_self.$element.$description.val()),
                    resourceIdsv = $.trim(_self.$element.$resourceIds.val()),
                    _roleMsg = '',
                    _roleResult = true,
                    _descriptionMsg = '',
                    _descriptionResult = true,
                    _resourceMsg = '',
                    _resourceResult = true;


                switch(true){
                    case rolev === '':
                        _roleMsg = '角色名不能为空';
                        _roleResult = false;
                        break;
                    case _self.isRoleNameRepeat === true:
                        _roleMsg = '角色名已存在';
                        _roleResult = false;
                        break;
                    case !checkUtil.checkCharSize(rolev, 0, 26):
                        _roleMsg = '角色名长度大于25';
                        _roleResult = false;
                        break;
                }
                if(!_roleResult){
                    showErro(_self.$element.$roleName, _roleMsg);
                }

                switch(true){
                    case descriptionVal === '':
                        _descriptionMsg = '角色描述不能为空';
                        _descriptionResult = false;
                        break;
                    case !checkUtil.checkCharSize(descriptionVal, 0, countIpt.maxlen):
                        _descriptionMsg = '角色描述数量不能超过' + countIpt.maxlen;
                        _descriptionResult = false;
                        break;
                }
                if(!descriptionVal){
                    showErro(_self.$element.$description, _descriptionMsg);
                }

                switch(true){
                    case resourceIdsv === '' :
                        _resourceMsg = '角色权限不能为空';
                        _resourceResult = false;
                        break;
                }
                if(!resourceIdsv){
                    showErro(_self.$element.$resourceIds, _resourceMsg);
                }

                if(_resourceResult && _descriptionResult && _roleResult && _self.isSubmit){
                    _self.isSubmit = false;
                    $('form#role').submit();
                }else{
                    var _totalMsg = '<b>表单出现上述错误：</b>';
                    _roleMsg && (_totalMsg += _roleMsg + '; ');
                    _descriptionMsg && (_totalMsg += _descriptionMsg + '; ');
                    _resourceMsg && (_totalMsg += _resourceMsg + '; ');
                    //$('.j-erroAll').html(_totalMsg)
                }
            });
            $('.j-submitCancle').bind('click', function(){
                ymPrompt.confirmInfo({
                    message: '确定取消' + typeTxt + '角色吗？', titleBar: false, handler: function(resmsg){
                        if(resmsg == 'ok'){
                            location.href = window.globalPath + '/roleManager';
                        }
                    }
                });
            });
        };
        roleSubmit.bindE();
    })();

    var zRNodesObj = (function(){
        /* tips nodes */
        var $haschoosedId = $('.j-haschoose'),
            $resourceIds = $('#resourceIds'),
            $idstips = $('.j-tips-ids'),
            $alltips = $('.j-erroAll'),
            $ztreemain = $('.j-ztreemain');

        var nodeTree = {
            level2group: [],
            level3group: [],
            level4group: [],
            datalist: [],
            $leve1wrap: $('<ul id="tree_1"></ul>')
        };

        function _addData(arg){
            if(arg instanceof  Array){
                for(var i = 0; i < arg.length; i++){
                    nodeTree.datalist.push(arg[i]);
                }
            }else{
                var _$this = arg.ele,
                    _dataid = arg.dataid,
                    _dataname = arg.dataname;
                _$this.addClass('active');
                $haschoosedId.append('<a data-id="' + _dataid + '">' + _dataname + '</a>');
                nodeTree.datalist.push(_dataid);
            }
        }

        function _removeData(_$this, _dataid){
            _$this.removeClass('active');
            $haschoosedId.find('a[data-id=' + _dataid + ']').remove();
            nodeTree.datalist.splice(nodeTree.datalist.indexOf(_dataid), 1);
        }

        /* 数组去重 */
        function unique(arr){
            var result = [], hash = {};
            for(var i = 0, elem; (elem = arr[i]) != null; i++){
                if(!hash[elem]){
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }

        /* 赋值准备 */
        function transformData($ele){
            nodeTree.datalist = unique(nodeTree.datalist);
            var str = nodeTree.datalist.join(',');
            $ele.val(str);
            $idstips.empty().removeClass('erro ok');
            $alltips.empty();
        }

        /*  检查子集的li是否全选  后代li中如果有一个不是active 则返回false，否则返回true ，表示全部是active */
        function parentIsAll($ele){
            var isAll = true;
            var $lis = $ele.find('li');
            for(var i = 0, lislen = $lis.length; i < lislen; i++){
                if(!$lis.eq(i).is('.active')){
                    isAll = false;
                    break;
                }
            }
            return isAll;
        }

        /*  检查子集的li是否含有active : 后代li中如果有一个含有active 则返回true，否则表示全都没有active，返回false*/
        function parentHasActive($ele){
            var isHas = false;
            var $lis = $ele.find('li');
            for(var i = 0, lislen = $lis.length; i < lislen; i++){
                if($lis.eq(i).is('.active')){
                    isHas = true;
                    break;
                }
            }
            return isHas;
        }


        function removeParents($plis){
            $plis.each(function(){
                var $plisthis = $(this);
                $plisthis.removeClass('active');
                if(!parentHasActive($plisthis)){
                    var pid = $plisthis.attr('data-id');
                    nodeTree.datalist.indexOf(pid) != -1 && nodeTree.datalist.splice(nodeTree.datalist.indexOf(pid), 1);
                }
            });
        }

        function addParents($plis){
            var parentDataId = []; //父节点ID的临时容器
            $plis.each(function(){
                var $plisthis = $(this);
// parentDataId.push($plisthis.attr('data-id'));
                parentIsAll($plisthis) && $plisthis.addClass('active');
            });
// _addData(parentDataId);  //  父节点id推入数据
        }

        nodeTree.initRender = function(zRNodes){
            var _self = this;
            for(var i = 0, len = zRNodes.length; i < len; i++){
                if(zRNodes[i] && typeof  zRNodes[i].pId !== 'undefined' && typeof  zRNodes[i].id !== 'undefined' && typeof  zRNodes[i].name !== 'undefined'){
                    var level;
                    switch(true){
                        case zRNodes[i].pId == '1':
                            level = ' class="level1"';
                            break;
                        case $.inArray(zRNodes[i].pId, _self.level2group) != -1:
                            level = ' class="level2"';
                            break;
                        case $.inArray(zRNodes[i].pId, _self.level3group) != -1:
                            level = ' class="level3"';
                            break;
                        case $.inArray(zRNodes[i].pId, _self.level4group) != -1:
                            level = ' class="level4"';
                            break;
                    }

                    var $li = $('<li data-pid="' + zRNodes[i].pId + '" data-id="' + zRNodes[i].id + '"' + level + '><a href="javascript:void(0)">' + zRNodes[i].name + '<i></i></a></li>');

                    if(zRNodes[i].pId == '1'){
                        _self.$leve1wrap.append($li);
                        _self.level2group.push(zRNodes[i].id);
                    }else{
                        $.inArray(zRNodes[i].pId, _self.level2group) != -1 ? _self.level3group.push(zRNodes[i].id) : _self.level4group.push(zRNodes[i].id);
                        var $Pul = _self.$leve1wrap.find('li[data-id="' + zRNodes[i].pId + '"]');
                        if($Pul.children('ul').length <= 0){
                            var $ul = $('<ul></ul>');
                            $ul.append($li);
                            $Pul.append($ul);
                        }else{
                            $Pul.children('ul').append($li);
                        }
                    }
                }
            }

            $ztreemain.append(_self.$leve1wrap);

            _self.$leve1wrap.find('li').each(function(){
                var $this = $(this);
                if($this.children('ul').length > 0){
                    $this.addClass('hassub')/*.children('a').find('i').text('[全选]')*/;
                }
            });

            /* 如果已有权限数据 则渲染 */
            if(roleOriginalId && $resourceIds.val()){
                _self.datalist = $resourceIds.val().split(',');
                var lisHassub = [];
                for(var ilen = 0, rllen = _self.datalist.length; ilen < rllen; ilen++){
                    var $liOriginal = $ztreemain.find('li[data-id=' + _self.datalist[ilen] + ']');
                    if($liOriginal.is('.hassub')){
                        lisHassub.push($liOriginal);
                    }else{
                        $liOriginal.addClass('active');
                        var _dataid = $liOriginal.attr('data-id'),
                            _dataname = $liOriginal.children('a').text();
                        $haschoosedId.append('<a data-id="' + _dataid + '">' + _dataname + '</a>');
                    }
                }

                for(var jlen = 0, hassublen = lisHassub.length; jlen < hassublen; jlen++){
                    if(parentIsAll(lisHassub[jlen])){
                        lisHassub[jlen].addClass('active');
                    }
                }
            }
            _self.bindE();
        };

        nodeTree.bindE = function(){
            var _self = this;

            _self.$leve1wrap.delegate('li', 'click', function(){

            }).delegate('li.level1', 'click', function(){
                var $this = $(this);
                if($this.children('ul').length > 0){
                    /* 子集UL显示 */
                    $this.children('ul').show();
                    $this.siblings().children('ul').hide();
                    /* 自我样式切换 */
                    $this.addClass('showul');
                    $this.siblings().removeClass('showul');
                }
            }).delegate('li:not(.hassub)', 'click', function(){ /*   最底层权限    */
// 收集
                var $this = $(this);
                var dataid = $this.attr('data-id'),
                    dataname = $this.children('a').text(), //自我信息
                    $plis = $this.parents('li');// 所有父节点

                if($this.is('.active')){
                    _removeData($this, dataid); // 自我实现
                    removeParents($plis)
                }else{
                    _addData({ele: $this, dataid: dataid, dataname: dataname});
                    addParents($plis)
                }

                transformData($resourceIds);

            }).delegate('li.hassub > a > i', 'click', function(){
                var $this_p = $(this).parent('a').parent('li'),
                    dataid_p = $this_p.attr('data-id'),
                    $lis = $this_p.find('li'), // 所有子节点
                    $plis = $this_p.parents('li'); // 所有父节点

                if($this_p.is('.active')){
                    $this_p.removeClass('active');
//所有后代操作
                    $lis.each(function(){
                        var $this = $(this),
                            dataid = $this.attr('data-id');
                        var idIndex = nodeTree.datalist.indexOf(dataid);
                        $this.removeClass('active');
                        if(idIndex != -1){
                            nodeTree.datalist.splice(idIndex, 1);
                            $haschoosedId.find('a[data-id=' + dataid + ']') && $haschoosedId.find('a[data-id=' + dataid + ']').remove();
                        }
                    });
                    nodeTree.datalist.indexOf(dataid_p) != -1 && nodeTree.datalist.splice(nodeTree.datalist.indexOf(dataid_p), 1);
                    removeParents($plis);

                }else{
                    $this_p.addClass('active');
                    $lis.each(function(){
                        var $this = $(this),
                            dataid = $this.attr('data-id'),
                            dataname = $this.children('a').text(),
                            idIndex = nodeTree.datalist.indexOf(dataid);

                        $this.addClass('active');
                        if(!$this.is('.hassub') && idIndex == -1){
                            $haschoosedId.append('<a data-id="' + dataid + '">' + dataname + '</a>');
                        }
                        nodeTree.datalist.push(dataid);
                    });
                    addParents($plis);
                }
                transformData($resourceIds);
            });

            $haschoosedId.delegate('a', 'click', function(){
                var $this = $(this);
                var dataid = $this.attr('data-id');
                var $this_znode = $ztreemain.find('li[data-id=' + dataid + ']');
                var $plis = $this_znode.parents('li');

                $this.remove();

                $this_znode.removeClass('active');
                _self.datalist.indexOf(dataid) != -1 && _self.datalist.splice(_self.datalist.indexOf(dataid), 1);

                removeParents($plis);
                transformData($resourceIds);
            });
        };
        nodeTree.initRender(window.zRNodes);
        return nodeTree;
    })();

});