/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/base',
        'function': '../common/function',
        'ymPrompt': '../plug/ymPrompt/ymPrompt',
        'My97DatePicker': '../plug/My97DatePicker/WdatePicker',
        'jqueryForm': '../lib/jquery.form'
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']},
        'jqueryForm': {deps: ['jquery']},
        'My97DatePicker': {deps: ['jquery']},
    },
    waitSeconds: 0
});
require(['jquery', 'ymPrompt', 'base', 'function', 'jqueryForm', 'My97DatePicker'], function(jquery){

    var isEditAr = location.pathname.split('/')
    var isEdit = isNaN(+isEditAr[isEditAr.length - 2]) ? 0 : +isEditAr[isEditAr.length - 2];

    var versioningEdit = {
        $elements: {
            $submit: $('.j-submit'),
            $cancel: $('.j-cancel'),
            $appName: $('.j-appName'),
            $appFilewrap: $('.j-fileuploadwrap'),
            $appFile: $('#appFile'),
            $version: $('.j-version'),
            $build: $('.j-buildNumber'),
            $publishDate: $('.j-publishDate'),
            $appTypeCk: $('input.j-apptype:checked'),
            $appType: $('.j-apptype'),
            $upflg: $('.j-upflg'),
            $icon: $('.j-icon'),
            $intro: $('.j-intro'),
            $ugipt: $('.u-gipt')
        },
        postData: {},
        defaultData: null,
        showError: function
            ($ele, msg){
            $ele.parents('li').find('.j-tips').html(msg).show();
        },
        clearError: function($ele){
            $ele.parents('li').find('.j-tips').empty().hide();
        },
        isSubmit: false,
        typeText: '新增',
        submitUrl: window.globalPath + '/version/create'
    }

    if(isEdit){
        versioningEdit.defaultData = {}
        $.ajax({
            url: window.globalPath + '/version/' + isEdit + '/view',
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function(res){
                if(res){
                    versioningEdit.$elements.$appName.val(res.result.appname);
                    versioningEdit.defaultData.appname = res.result.appname;

                    $('.j-fileoutput').html(res.result.appurl);
                    versioningEdit.defaultData.appurl = res.result.appurl;

                    versioningEdit.$elements.$version.val(res.result.version);
                    versioningEdit.defaultData.version = res.result.version;

                    versioningEdit.$elements.$build.val(res.result.build);
                    versioningEdit.defaultData.build = res.result.build;

                    versioningEdit.$elements.$appType.find('input[value=' + res.result.apptype + ']').attr('checked', 'checked');
                    versioningEdit.defaultData.apptype = res.result.apptype;

                    versioningEdit.$elements.$upflg.find('input[value=' + res.result.upflg + ']').attr('checked', 'checked');
                    versioningEdit.defaultData.upflg = res.result.upflg;

                    versioningEdit.$elements.$intro.val(res.result.directions);
                    versioningEdit.defaultData.directions = res.result.directions;

                    versioningEdit.defaultData.id = res.result.id;
                    versioningEdit.postData.id = res.result.id;

                    versioningEdit.typeText = '修改';

                    $('.j-textType').html(versioningEdit.typeText);

                    versioningEdit.submitUrl = window.globalPath + '/version/' + versioningEdit.defaultData.id + '/update';
                }
            }
        });
    }
    versioningEdit.$elements.$appType.on('change', 'input', function(){
        if($(this).val() == 0 && $(this)[0].checked){
            versioningEdit.$elements.$appFilewrap.hide();
        }else{
            versioningEdit.$elements.$appFilewrap.show();
        }
    })


    function formAjax($form, url, type){
        $form.ajaxSubmit({
            url: url,
            type: 'POST',
            async: false,
            success: function(resData){
                var result = null;
                if(resData){
                    if(typeof resData == 'string'){
                        result = JSON.parse(resData);
                    }else if(typeof resData == 'object'){
                        result = resData;
                    }
                    if(result && result.result){
                        $('.j-fileoutput').html(result.result);
                    }
                }
                versioningEdit.$elements.$appFile.val('');
            }
        });
    }

    versioningEdit.$elements.$appFile.on('change', function(){
        var $this = $(this), _val = $this.val();
        formAjax($('#fileUpload'), window.globalPath + '/version/upload', 'file');
        versioningEdit.clearError(versioningEdit.$elements.$appFile);
    });

    //versioningEdit.$elements.$publishDate.bind('click', WdatePicker);

    versioningEdit.$elements.$ugipt.on('focus', function(){
        versioningEdit.clearError($(this));
    });
    $('.j-apptype input').on('change', function(){
        versioningEdit.clearError($(this));
    })

    versioningEdit.$elements.$submit.on('click', function(){
        if(versioningEdit.isSubmit) return;
        versioningEdit.isSubmit = true;
        var errorAr = [];
        $('.j-tips').empty().hide();

        versioningEdit.postData.appname = versioningEdit.$elements.$appName.val();
        if(versioningEdit.postData.appname == ''){
            versioningEdit.showError(versioningEdit.$elements.$appName, '请输入应用名称');
            errorAr.push('请输入应用名称');
        }


        versioningEdit.postData.apptype = +versioningEdit.$elements.$appType.find('input:checked').val();
        if(versioningEdit.postData.apptype===''){
            versioningEdit.showError(versioningEdit.$elements.$appType, '请发布版本类型');
            errorAr.push('请发布版本类型');
        }

        versioningEdit.postData.appurl = $('.j-fileoutput').html();

        if(versioningEdit.postData.apptype == 1){
            if(versioningEdit.postData.appurl == ''){
                versioningEdit.showError(versioningEdit.$elements.$appFile, '请上传app文件');
                errorAr.push('请上传app文件');
            }
        }

        versioningEdit.postData.version = versioningEdit.$elements.$version.val();
        if(versioningEdit.postData.version == ''){
            versioningEdit.showError(versioningEdit.$elements.$version, '请填写Version');
            errorAr.push('请填写Version');
        }

        versioningEdit.postData.build = versioningEdit.$elements.$build.val();
        if(versioningEdit.postData.build == ''){
            versioningEdit.showError(versioningEdit.$elements.$build, '请填写build号');
            errorAr.push('请填写build号');
        }

        versioningEdit.postData.upflg = versioningEdit.$elements.$upflg.find('input:checked').val();

        versioningEdit.postData.directions = versioningEdit.$elements.$intro.val();

        if(versioningEdit.postData.directions == ''){
            versioningEdit.showError(versioningEdit.$elements.$intro, '请填写升级说明');
            errorAr.push('请填写升级说明');
        }

        if(errorAr.length > 0){
            $('.j-errortips').html(errorAr.join(';')).fadeIn();
            setTimeout(function(){
                $('.j-errortips').fadeOut();
            }, 4000);
            versioningEdit.isSubmit = false
        }else{
            var _isEdit = false;
            if(versioningEdit.defaultData){
                for(var i in versioningEdit.defaultData){
                    if(versioningEdit.defaultData.hasOwnProperty(i) && versioningEdit.postData.hasOwnProperty(i) && versioningEdit.defaultData[i] !== versioningEdit.postData[i]){
                        _isEdit = true;
                    }
                }
            }

            if(!versioningEdit.defaultData || _isEdit){
                ymPrompt.confirmInfo({
                    message: '确定' + versioningEdit.typeText + '该版本?',
                    width: 300,
                    height: 220,
                    titleBar: false,
                    handler: function(res){
                        if(res == 'ok'){
                            $.ajax({
                                url: versioningEdit.submitUrl,
                                type: 'POST',
                                dataType: 'json',
                                data: versioningEdit.postData,
                                success: function(res){
                                    if(res && res.result == 'success'){
                                        ymPrompt.succeedInfo({
                                            message: versioningEdit.typeText + '成功！',
                                            width: 300,
                                            height: 200,
                                            titleBar: false,
                                            handler: function(){
                                                location.href = window.globalPath + '/version'
                                            }
                                        });
                                        setTimeout(function(){
                                            location.href = window.globalPath + '/version'
                                        }, 5000);
                                    }else{
                                        versioningEdit.isSubmit = false;
                                        ymPrompt.alert({message: versioningEdit.typeText + '失败', titleBar: false});
                                    }
                                }, error: function(){
                                    versioningEdit.isSubmit = false;
                                    ymPrompt.alert({message: versioningEdit.typeText + '失败', titleBar: false});
                                }
                            });
                        }else{
                            versioningEdit.isSubmit = false;
                        }
                    }
                });
            }else{
                location.href = window.globalPath + '/version';
            }
        }
    });
});