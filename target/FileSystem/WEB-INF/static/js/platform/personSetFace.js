/**
 * Document by wangshuyan@chinamobile.com on 2015/11/23 0023.
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
		'jqueryForm': {deps: ['jquery']},
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'jqueryForm', 'function', 'base', 'ymPrompt'], function(jquery){

	var personSet = {
		$elements: {
			$table: $('.tableContent'),
			$getFaceImg: $('#faceImgFileUpd'),
			$editFaceBtn: $('.j-editFace'),
			$faceImg: $('.j-faceimg'),
			$uploadFile: $('#PicFileForm'),
			$errortips: $('.j-errortips')
		},
		zoomImg: function(val){
			var _html = '<div class="g-zoomImg"><img src="' + val + '" /></div>';
			ymPrompt.win({message: _html, title: '个人头像', width: 445, height: 485, maskAlpha: 0.5});
			$('.g-zoomImg').delegate('.j-closeZoomImg', 'click', function(){
				ymPrompt.close();
			});
		},
		data: {result: ''},
		compareData: {},
		uploadFile: function(url, data){
			this.$elements.$uploadFile.ajaxSubmit({
				url: url,
				type: 'POST',
				async: false,
				success: function(resData){
					var result = ''
					if(typeof resData == 'string'){
						result = JSON.parse(resData)
					}else{
						result = resData;
					}


					if(result.result === 'bigimageError'){
						ymPrompt.alert({
							message: '上传图片大小<br />应控制在500k以内',
							titleBar: false
						});
						personSet.$elements.$getFaceImg.val('')
					}else{
						personSet.data.result = result.result;
						personSet.$elements.$faceImg.attr('src', result.result);
					}
				}
			});
		},
		isSubmit: true,
		// 渲染已有信息
		/*   init: function(){
		 $.ajax({
		 url: window.globalPath + '/personalSet/view',
		 type: 'POST',
		 dataType: 'json',
		 success: function(resData){
		 var resObj = resData.result;

		 /!* 取值 *!/
		 personSet.data.result = resObj.result || false; //头像路径
		 if(personSet.data.result){
		 personSet.$elements.$faceImg.attr('src', personSet.data.result);
		 }
		 }
		 });
		 }*/
		defaultImg: ''
	}

	/*   personSet.init();*/

	personSet.defaultImg = personSet.$elements.$faceImg.attr('src');
	/* ********************** 图片处理 ******************* */

	/* 头像图像上传 */
	personSet.$elements.$editFaceBtn.bind('click', function(){
		personSet.$elements.$getFaceImg.click();
	});
	personSet.$elements.$getFaceImg.bind('change', function(){
		var val = $(this).val();
		var valAr = val.split('.');
		var extension = valAr[valAr.length - 1];
		if(val){
			if(extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'bmp' || extension == 'JPG' || extension == 'PNG' || extension == 'GIF' || extension == 'BMP' || extension == 'JPEG' || extension == 'jpeg'){
				personSet.uploadFile(window.globalPath + '/personalSet/upload');
			}else{
				ymPrompt.alert({
					message: '上传图片格式不正确<span class="f-db f-fs1" style="padding-top:9px;" >请上传jpg,gif,png,bmp,jpeg格式的图片</span>',
					titleBar: false,
					widht: 320
				});
				$(this).val('');
			}
		}
	});

	/* 放大图片 */
	personSet.$elements.$table.delegate('img', 'click', function(){
		personSet.zoomImg($(this).attr('src'));
	});

	/*    $("#personSetCansel").on('click', function(){
	 location.href = window.globalPath + '/schoolnotice/receiveNotice';
	 });*/
	/* ********************** 提交验证  ******************* */
	$('#personSetSubmit').on('click', function(){
		var $this = $(this)
		/* 取值  校验 赋值 */
		var errorMsgAr = [];

		//个人头像
		if(checkUtil.isEmpty(personSet.data.result)){
			errorMsgAr.push('头像还是原头像，没有被修改。');
		}

		/* 判断是否有数据修改 */
		var isEdit = personSet.defaultImg == personSet.data.result


		/* 提交 */
		if(isEdit){
			// location.href = window.globalPath + '/schoolnotice/receiveNotice';
			ymPrompt.alert({
				message: '图像没有更好',
				titleBar: false
			});
		}else if(errorMsgAr.length > 0){
			personSet.$elements.$errortips.html(errorMsgAr.join('; ')).fadeIn();
			setTimeout(function(){
				personSet.$elements.$errortips.fadeOut(1000)
			}, 4000);
		}else if(personSet.isSubmit){
			ymPrompt.confirmInfo({
				message: '确认修改个人设置？',
				width: 300,
				height: 240,
				titleBar: false,
				handler: function(res){
					if(res == 'ok'){
						personSet.isSubmit = false;
						$this.attr('disabled', 'disabled');
						$.ajax({
							url: window.globalPath + '/personalSet/updPortrait',
							type: 'POST',
							data: personSet.data,
							dataType: 'json',
							success: function(resMsg){
								if(resMsg.result == 'success'){
									setTimeout(function(){
										location.reload();
									}, 4000);
									ymPrompt.close();
									ymPrompt.succeedInfo({
										message: '修改成功',
										width: 320,
										height: 220,
										titleBar: false,
										handler: function(){
											setTimeout(function(){
												location.reload();
											}, 4000);
										}
									});
								}else{
									personSet.$elements.$errortips.html('添加失败，错误信息：' + resMsg.result).fadeIn();
									setTimeout(function(){
										personSet.$elements.$errortips.fadeOut(1000)
									}, 4000);
									personSet.isSubmit = true;
									$this.removeAttr('disabled');
								}
							}, error: function(){
								ymPrompt.alert('添加失败')
								personSet.isSubmit = true;
								$this.removeAttr('disabled');
							}
						})
					}
				}
			});
		}
	});
})
;