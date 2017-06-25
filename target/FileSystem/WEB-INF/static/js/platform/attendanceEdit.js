/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/base',
        'function': '../common/function',
        'ymPrompt': '../plug/ymPrompt/ymPrompt',
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']}
    },
    waitSeconds: 0
});
require(['jquery', 'ymPrompt', 'base', 'function'], function(jquery){

    var adDevController = {
        $elements: {
            /* 下拉框 */
            $selectorAcc: $('.j-selectui-acc'),
            $selectorAcp: $('.j-selectui-acp'),
            $selectorAcs: $('.j-selectui-acs'),
            $selectorSysType: $('.j-selectui-sysType'),
            $selectorMfName: $('.j-selectui-mfName'),
            /* 数据节点 */
            $schoolId: $('.j-schoolId'),
            $sysType: $('.j-sysType'),
            $mobile: $('.j-mobile'),
            $sysAddr: $('.j-sysAddr'),
            //$sysId: $('.j-sysId'),
            $mfName: $('.j-mfName'),
            $mfContact: $('.j-mfContact'),
            //临时
            $city: $('.j-schoolAcc'),
            $country: $('.j-schoolAcp'),
            /* other */
            $ipt: $('.u-gipt'),
            $errorTips: $('.errortips'),
            /* 提交取消 */
            $submit: $('.j-submit'),
            $cancel: $('.j-cancel'),

            $urlDevice: $('.j-deviceurl')
        },
        renderCounty: function(code){
            if(code){
                $.ajax({
                    url: window.globalPath + '/device/getDistrict',
                    type: 'GET',
                    dataType: 'json',
                    data: {cityCode: code},
                    async: false,
                    success: function(res){
                        var _html = ''
                        if(res && typeof res.areaList !== 'undefined' && res.areaList.length > 0){
                            for(var a_i in res.areaList){
                                if(res.areaList.hasOwnProperty(a_i)){
                                    var aSingle = res.areaList[a_i]
                                    _html += '<li data-value="' + aSingle.code + '">' + aSingle.areaName + '</li>'
                                }
                            }
                        }else{
                            _html += '<li data-value="">没有可选择的区县</li>'
                        }
                        $('.j-districtList').html(_html);
                    }
                });
            }
        },
        renderSchools: function(code){
            $.ajax({
                url: window.globalPath + '/device/getSchool',
                type: 'GET',
                dataType: 'json',
                data: {districtId: code},
                async: false,
                success: function(res){
                    var _html = '';
                    if(res && res.length > 0){
                        for(var s_i in res){
                            if(res.hasOwnProperty(s_i)){
                                var sSingle = res[s_i]
                                _html += '<li data-value="' + sSingle.id + '">' + sSingle.referredName + '</li>';
                            }
                        }
                    }else{
                        _html += '<li data-value="">没有可选择的学校</li>';
                    }
                    $('.j-schoolList').html(_html);
                }
            });
        },
        showError: function($ele, msg){
            $ele.parents('li').find('.j-tips').html(msg).show();
        },
        clearErro: function($ele){
            $ele.parents('li').find('.j-tips').empty().hide();
        },
        PostData: {},
        compareData: {},
        isSubmit: true,
        init: function(){
            var _self = this;

            _self.textType = window.userInfo.id == '' ? '新增' : '修改';
            $('.j-textType').html(_self.textType)

            //获取设备类型
            $.ajax({
                url: window.globalPath + '/device/getType',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function(res){
                    var _html = ''
                    if(res && !!checkUtil.hasProperty(res)){
                        for(var type_i in res){
                            if(res.hasOwnProperty(type_i)){
                                _html += '<li data-value="' + type_i + '">' + res[type_i] + '</li>'
                            }
                        }
                    }else{
                        _html += '<li data-value="">没有可选择的设备</li>'
                    }
                    $('.j-sysTypeList').html(_html);
                }
            });

            //获取厂商名称
            $.ajax({
                url: window.globalPath + '/device/getFatories',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function(res){
                    var _html = ''
                    if(res && res.length > 0){
                        for(var name_i in res){
                            var nameSingle = res[name_i]
                            if(res.hasOwnProperty(name_i)){
                                _html += '<li data-value="' + nameSingle.id + '">' + nameSingle.name + '</li>'
                            }
                        }
                    }else{
                        _html += '<li data-value="">没有可选择的厂商</li>'
                    }
                    $('.j-mfNameList').html(_html);
                }
            });


            /* 定义下拉框 */
            _self.selectUiAcc = new SelectUi(_self.$elements.$selectorAcc);
            _self.selectUiAcp = new SelectUi(_self.$elements.$selectorAcp);
            _self.selectUiAcs = new SelectUi(_self.$elements.$selectorAcs);
            _self.selectUiSysType = new SelectUi(_self.$elements.$selectorSysType);
            _self.selectUiMfName = new SelectUi(_self.$elements.$selectorMfName);

            /* 设置下拉框动作 */
            //市选择获取区县
            _self.selectUiAcc.bindE(function(val){
                _self.renderCounty(val);
                _self.clearErro(_self.$elements.$selectorAcs);
                _self.selectUiAcp.reset();
                _self.selectUiAcs.reset();
            });
            //地区选择获取学校
            _self.selectUiAcp.bindE(function(val){
                _self.renderSchools(val);
                _self.clearErro(_self.$elements.$selectorAcs);
                _self.selectUiAcs.reset();
            });

            _self.selectUiAcs.bindE();
            _self.selectUiSysType.bindE(function(){
                _self.clearErro(_self.$elements.$selectorSysType);
            });
            _self.selectUiMfName.bindE(
                function(){
                    _self.clearErro(_self.$elements.$selectorMfName);
                }
            );

            /* 如果存在id 则为修改，渲染下拉框 */
            if(window.userInfo.id !== ''){

                _self.renderCounty(window.userInfo.cityCode);
                _self.renderSchools(window.userInfo.districtCode);

                _self.selectUiAcc.init(window.userInfo.cityCode);
                _self.selectUiAcp.init(window.userInfo.districtCode);
                _self.selectUiAcs.init(window.userInfo.schoolId);
                _self.selectUiSysType.init(window.userInfo.type);
                _self.selectUiMfName.init(window.userInfo.factoryId);

                /* 获取对比数据 */
                _self.compareData.id = window.userInfo.id;
                _self.compareData.cityCode = adDevController.$elements.$city.val();
                _self.compareData.districtCode = adDevController.$elements.$country.val();
                _self.compareData.schoolId = adDevController.$elements.$schoolId.val();
                _self.compareData.type = adDevController.$elements.$sysType.val();
                _self.compareData.deviceAddress = adDevController.$elements.$sysAddr.val();
                _self.compareData.factoryId = adDevController.$elements.$mfName.val();
                _self.compareData.factoryPhone = adDevController.$elements.$mfContact.val();
                _self.compareData.mobile = adDevController.$elements.$mobile.val();

                //显示信息
                var url = _self.$elements.$urlDevice.attr('data-ip'), deviceCode = _self.$elements.$urlDevice.attr('data-id'), _ip = '', _port = '';
                _self.compareData.url = url;
                _self.compareData.deviceCode = deviceCode;
                if(url && url.indexOf(':')){
                    var urlAr = url.split(':');
                    _ip = urlAr[0];
                    _port = urlAr[1];
                }
                _self.$elements.$urlDevice.html('本机的IP地址为：' + _ip + '; 端口号为：' + _port + '; 设备ID为：' + deviceCode)
            }

            _self.bindE();

        },
        bindE: function(){
            var _self = this;
            /* 提交 */
            _self.$elements.$submit.on('click', function(){
                if(adDevController.isSubmit){
                    adDevController.isSubmit = false;
                    /* 重置 */
                    adDevController.postData = {};
                    var errorAr = [];
                    /* 获取数据 */
                    if(window.userInfo.id){
                        adDevController.postData.id = window.userInfo.id;
                    }
                    adDevController.postData.cityCode = adDevController.$elements.$city.val();
                    adDevController.postData.districtCode = adDevController.$elements.$country.val();
                    adDevController.postData.schoolId = adDevController.$elements.$schoolId.val();
                    adDevController.postData.type = adDevController.$elements.$sysType.val();
                    adDevController.postData.deviceAddress = adDevController.$elements.$sysAddr.val();
                    //adDevController.postData.deviceCode = adDevController.$elements.$sysId.val();
                    adDevController.postData.mobile = adDevController.$elements.$mobile.val();
                    adDevController.postData.factoryId = adDevController.$elements.$mfName.val();
                    adDevController.postData.factoryPhone = adDevController.$elements.$mfContact.val();
                    adDevController.postData.url = adDevController.$elements.$urlDevice.attr('data-ip');
                    adDevController.postData.deviceCode = adDevController.$elements.$urlDevice.attr('data-id');

                    //临时数组
                    var _city = adDevController.$elements.$city.val(),
                        _country = adDevController.$elements.$country.val();
                    /*  验证 */
                    //  学校
                    switch(true){
                        case _city === '':
                            adDevController.showError(adDevController.$elements.$schoolId, '请先选择市，然后选择学校');
                            errorAr.push('请选择学校');
                            break;
                        case _country === '':
                            adDevController.showError(adDevController.$elements.$schoolId, '请先选择区县，然后选择学校');
                            errorAr.push('请选择学校');
                            break;
                        case adDevController.postData.schoolId === '':
                            adDevController.showError(adDevController.$elements.$schoolId, '请选择学校');
                            errorAr.push('请选择学校');
                            break;
                    }

                    //设备类型
                    if(adDevController.postData.type === ''){
                        adDevController.showError(adDevController.$elements.$sysType, '请选择设备类型');
                        errorAr.push('请选择设备类型');
                    }
                    //安装地点
                    switch(true){
                        case adDevController.postData.deviceAddress === '':
                            adDevController.showError(adDevController.$elements.$sysAddr, '请填写安装地点');
                            errorAr.push('请填写安装地点');
                            break;
                        case adDevController.postData.deviceAddress.length > 50:
                            adDevController.showError(adDevController.$elements.$sysAddr, '安装地点请勿超过50个字');
                            errorAr.push('安装地点请勿超过50个字');
                            break;
                    }

                    //设备ID
                    /*
                     * switch(true){
                     case adDevController.postData.deviceCode === '':
                     adDevController.showError(adDevController.$elements.$sysId, '请填写设备ID');
                     errorAr.push('请填写设备ID');
                     break;
                     case checkUtil.checkSpecialChar(adDevController.postData.deviceCode):
                     adDevController.showError(adDevController.$elements.$sysAddr, '设备ID请勿包含特殊字符');
                     errorAr.push('设备ID请勿包含特殊字符');
                     break;
                     }
                     */

                    //手机号码
                    switch(true){
                        case adDevController.postData.mobile === '':
                            adDevController.showError(adDevController.$elements.$mobile, '请填写手机号码');
                            errorAr.push('请填写手机号码');
                            break;
                        case !checkUtil.checkPhoneNumber(adDevController.postData.mobile):
                            adDevController.showError(adDevController.$elements.$mobile, '手机号码格式不正确');
                            errorAr.push('手机号码格式不正确');
                            break;
                    }


                    //厂商
                    if(adDevController.postData.factoryId === ''){
                        adDevController.showError(adDevController.$elements.$mfName, '请选择厂商');
                        errorAr.push('请选择厂商');
                    }

                    //厂商联系方式
                    switch(true){
                        case adDevController.postData.factoryPhone === '':
                            adDevController.showError(adDevController.$elements.$mfContact, '请填写厂商联系方式');
                            errorAr.push('请填写厂商联系方式');
                            break;
                        case adDevController.postData.factoryPhone.length > 50:
                            adDevController.showError(adDevController.$elements.$mfContact, '厂商联系方式请勿超过50个字');
                            errorAr.push('厂商联系方式请勿超过50个字');
                            break;
                    }

                    var isEdit = false;
                    for(var i in adDevController.postData){
                        if(adDevController.postData.hasOwnProperty(i) && adDevController.compareData.hasOwnProperty(i) && adDevController.postData[i] !== adDevController.compareData[i]){
                            isEdit = true;
                        }
                    }
                    var ajaxUrl = window.userInfo.id !== '' ? 'update' : 'create';

                    if(!window.userInfo.id || (window.userInfo.id && isEdit)){
                        if(errorAr.length > 0){
                            adDevController.$elements.$errorTips.html(errorAr.join('； ')).fadeIn();
                            setTimeout(function(){
                                adDevController.$elements.$errorTips.fadeOut(1500);
                            }, 5000);
                            adDevController.isSubmit = true
                        }else{
                            ymPrompt.confirmInfo({
                                message: '确定' + adDevController.textType + '设备？',
                                titleBar: false,
                                width: 300,
                                height: 200,
                                handler: function(res){
                                    if(res == 'ok'){
                                        $.ajax({
                                            url: window.globalPath + '/device/' + ajaxUrl,
                                            type: 'POST',
                                            dataType: 'json',
                                            data: adDevController.postData,
                                            success: function(resData){
                                                if((resData.num && resData.num > 0) || (resData.msg && resData.msg == 'ok')){
                                                    var _ip = '', _port = '';
                                                    if(resData.url && resData.url.indexOf(':')){
                                                        var urlAr = resData.url.split(':');
                                                        _ip = urlAr[0];
                                                        _port = urlAr[1];
                                                    }
                                                    ymPrompt.succeedInfo({
                                                        message: '<p style="font-size:24px;height:40px;color:#2E692A;">设置成功</p><p style="font-size:14px; line-height:1.8em;">本机的IP地址为：' + _ip + '<br/>端口号为：' + _port + '<br/>设备ID:' + resData.deviceCode + '</p>',
                                                        titleBar: false,
                                                        width: 420,
                                                        height: 260,
                                                        handler: function(){
                                                            location.href = window.globalPath + '/device/goToList';
                                                        }
                                                    });
                                                    //setTimeout(function(){
                                                    //    location.href = window.globalPath + '/device/goToList';
                                                    //}, 3000)
                                                }else{
                                                    ymPrompt.alert({
                                                        message: adDevController.textType + '设备失败',
                                                        titleBar: false
                                                    })
                                                    adDevController.isSubmit = true
                                                }
                                            }, error: function(){
                                                adDevController.isSubmit = true
                                            }
                                        })
                                    }else{
                                        adDevController.isSubmit = true
                                    }
                                }
                            });
                        }
                    }else{
                        location.href = window.globalPath + '/device/goToList';
                    }
                }
            });
            _self.$elements.$cancel.on('click', function(){
                ymPrompt.confirmInfo({
                    message: '是否取消' + adDevController.textType + '设备？',
                    titleBar: false,
                    width: 300,
                    height: 200,
                    handler: function(res){
                        if(res == 'ok'){
                            location.href = window.globalPath + '/device/goToList';
                        }
                    }
                });
            });

            _self.$elements.$ipt.on('focus', function(){
                $(this).parents('li').find('.j-tips').fadeOut()
            });
        }
    }

    adDevController.init();

});