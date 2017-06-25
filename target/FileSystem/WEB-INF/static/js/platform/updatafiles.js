/**
 * Document by wangshuyan@chinamobile.com on 2015/11/12 0012.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'jqueryForm': '../lib/jquery.form',
		'base': '../common/base',
		'function': '../common/function',
		'ymPrompt': '../plug/ymPrompt/ymPrompt'
	},
	shim: {
		'base': {deps: ['jquery']},
		'jqueryForm': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']}
	},
	waitSeconds: 0
});

require(['jquery', 'jqueryForm', 'ymPrompt', 'base', 'function'], function(jquery){

	(new SelectUi($('.j-selectui-school'))).bindE();
	(new SelectUi($('.j-selectui-grades'))).bindE();
	(new SelectUi($('.j-selectui-classes'))).bindE();

	var $getufbtn = $('.j-get-uf'),
		$upfiles = $('#j-upfilesid'),
		$showUpfilesName = $('.j-showfilesName'),
		$uploadstart = $('.j-uploadstart'),
		$uploadcancel = $('.j-uploadcancel');
	/* 选择文件 */
	$getufbtn.bind('click', function(){
		$upfiles.click();
	});
	$upfiles.bind('change', function(){
		var _val = $(this).val(), _msg = '';
		if(_val){
			var fileNameAr = _val.split('.'),
				uploadfiles = fileNameAr[fileNameAr.length - 1];
			if(uploadfiles !== 'xls' && uploadfiles !== 'xlsx'){
				ymPrompt.alert({
					message: '请上传正确格式的excel文件',
					titleBar: false
				});
			}else{
				_msg = '已选择文件：  ' + _val;
				$uploadstart.removeAttr('disabled');
				$showUpfilesName.text(_msg);
			}
		}else{
			$uploadstart.attr('disabled', 'disabled');
			_msg = '';
		}
	});

	/* 上传 */
	$uploadstart.bind('click', function(){
		if($upfiles.val() === '') return false;
		$(this).attr('disabled', 'disabled').val('上传中... ...');
		$getufbtn.attr('disabled', 'disabled');
		$uploadcancel.show();
		var ajax_option = {
			url: window.ajaxUrl,      // override for form's 'action' attribute
			dateType: 'json',
			type: 'post',
			success: function(da){
				window.location.href = window.resultUrl;
				/*  检测网络是否链接，如果未链接则弹出检查网络的
				 var isOnline = setInterval(function(){
				 $.ajax({
				 url: window.globalPath + '/platform/student/verification',
				 type: 'POST',
				 dataType: 'json',
				 success: function(res){

				 }, error: function(){
				 clearInterval(isOnline);

				 }
				 });
				 }, 10000);
				 */
			}
		};
		$('#uploadfiles').ajaxSubmit(ajax_option);
	});

	/* 取消上传 */
	$uploadcancel.bind('click', function(){
		ymPrompt.confirmInfo({
			message: '确认取消上传？',
			titleBar: false,
			handler: function(msg){
				if(msg == 'ok'){
					$.ajax({
						url: window.globalPath + '/' + window.pageType + '/cancel',
						type: 'POST',
						dataType: 'json',
						success: function(res){
							if(res.result === true){
								cancelUpdateUi();
							}
						}
					})
				}
			}
		});
	});

	function cancelUpdateUi(){
		$uploadstart.removeAttr('disabled').val('确定导入文件');
		$getufbtn.removeAttr('disabled');
		$uploadcancel.hide();
	}


});