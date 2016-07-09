require.config({
    paths: {
        'jquery': '../lib/jquery-1.8.3.min',
        'function': '../common/function',
        'ymPrompt': '../plug/ymPrompt/ymPrompt'
    },
    shim: {

        'function': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']},

    },
    waitSeconds: 0
});
require(['jquery', 'function', 'ymPrompt'], function(jquery){

    $('.j-cancel').on('click', function(){
        var _html = '<div class="ym-inContent ym-inContent-warning">' +
            '<h2>不同意用户协议?</h2><p>同意本用户协议才可以继续使用</p></div>';
        ymPrompt.confirmInfo({
            message: _html,
            width: 400,
            height: 240,
            titleBar: false,
            okTxt: '我确定不同意',
            cancelTxt: '我点错了',
            maskAlpha: 0.8,
            handler: function(res){
                if(res === 'ok'){
                    var _href = 'http://' + location.host + window.globalPath + '/logout';
                    location.href = _href;
                }
            }
        })
    });

});
