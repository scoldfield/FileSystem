/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'base': '../common/baseTeacher',
        'function': '../common/function',
        'mypannel': '../common/teacherSideBar',
        'My97DatePicker': '../plug/My97DatePicker/WdatePicker',
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
require(['jquery', 'function', 'base', 'My97DatePicker', 'mypannel', 'ymPrompt'], function(jquery){
    (function(){
        if(window.homeworkImgs !== ''){
            var sAr = window.homeworkImgs.split(';'), homeworkImgsAr = [], img_list = '', img_showlist = '';
            for(var i in sAr){
                if(sAr[i] !== ''){
                    homeworkImgsAr.push(sAr[i]);
                }
            }

            for(var j in homeworkImgsAr){
                img_list += '<div class="img"><img src="' + homeworkImgsAr[j] + '"/></div>';
                img_showlist += '<li><img src="' + homeworkImgsAr[j] + '"/></li>'
            }

            $('.j-imagesGroup').append(img_list);
            $('.j-imagesOpenList').append(img_showlist);

            var imgFloat = new ImgFloatCompane();
            imgFloat.init({
                dataLength: homeworkImgsAr.length,
                container: '.j-floatimg',
                imgwrap: '.floatcontent',
                currentIndex: 1,
                leftCtrl: '.aleft',
                rightCtrl: 'aright',
                imgwidth: 720,
                rollSpeed: 500,
                mask: '.u-mask'
            });

            $('.imgwrap').delegate('.img', 'click', function(){
                var t = $(this).index();
                imgFloat.showImg(t);
            });
        }
    })();
});