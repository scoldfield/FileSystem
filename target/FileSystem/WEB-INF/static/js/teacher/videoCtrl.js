/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'jqueryForm': '../lib/jquery.form',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'mypannel': '../common/teacherSideBar',
		'ymPrompt': '../plug/ymPrompt/ymPrompt'
	},
	shim: {
		'base': {deps: ['jquery']},
		'jqueryForm': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'jqueryForm'], function(jquery){

	if($('.g-videoWrap li').length == 0){
		$('.g-videoWrap').html('<div class="f-tac">本校尚未安装摄像头，暂无监控视频列表</div>');
		$('.m-teacherNav').on('click', 'li', function(){
			var $this = $(this), _activenow = $this.children('a').html();
			$this.addClass('active').siblings().removeClass('active');
			//  getTypeList(_activenow);
		});
	}else{
		var activenow = $('.m-teacherNav .active a').html();
		var $videoList = $('.g-videoWrap li');
		for(var i = 0, len = $videoList.length; i < len; i++){
			if($videoList.eq(i).attr('data-value') === activenow){
				$videoList.eq(i).show();
			}
		}

		function getTypeList(activeNow){
			var $videoList = $('.g-videoWrap li');
			for(var i = 0, len = $videoList.length; i < len; i++){
				if($videoList.eq(i).attr('data-value') === activeNow){
					$videoList.eq(i).show();
				}else{
					$videoList.eq(i).hide();
				}
			}
			if($('.g-videoWrap li[data-value=' + activeNow + ']').length === 0){
				$('.j-addrname').html(activeNow);
				$('.j-noclass').show();
			}else{
				$('.j-noclass').hide();
			}

			/* 检查存在状况 */
		}

		$('.m-teacherNav').on('click', 'li', function(){
			var $this = $(this), _activenow = $this.children('a').html();
			$this.addClass('active').siblings().removeClass('active');
			getTypeList(_activenow);
		});

		getTypeList('校车');
	}

});