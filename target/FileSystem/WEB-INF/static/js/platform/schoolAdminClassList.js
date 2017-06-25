/**
 * Document by wangshuyan@chinamobile.com on 2015/11/20 0020.
 */
require.config({
    paths: {
        'jquery': 'lib/jquery-1.8.3.min',
        'base': 'common/base',
        'function': 'common/function',
        'ymPrompt': 'plug/ymPrompt/ymPrompt',
        'Pagination': 'plug/simplePagination/jquery.simplePagination'
    },
    shim: {
        'base': {deps: ['jquery']},
        'function': {deps: ['jquery']},
        'Pagination': {deps: ['jquery']},
        'ymPrompt': {deps: ['jquery']}
    },
    waitSeconds: 0
});

require(['jquery', 'base', 'function', 'ymPrompt', 'Pagination'], function(jquery){
    (new SelectUi($('.j-selectui-area'))).bindE();
    (new SelectUi($('.j-selectui-schoolType'))).bindE();
    (new SelectUi($('.j-selectui-eduStartDate'))).bindE();
});