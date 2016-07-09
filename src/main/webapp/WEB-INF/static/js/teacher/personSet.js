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
require(['jquery', 'function', 'base', 'mypannel', 'ymPrompt', 'jqueryForm'], function(jquery){
	var personSet = {
		$elements: {
			$table: $('.tableContent'),
			$getFaceImg: $('#faceImgFileUpd'),
			$editFaceBtn: $('.j-editFace'),
			$faceImg: $('.j-faceimg'),
			$uploadFile: $('#PicFileForm'),
			$worknumber: $('#worknumber'),
			$seniority: $('#seniority'),
			$name: $('#name'),
			$imid: $('#imid'),
			$characteristics: $('#characteristics')
		},
		zoomImg: function(val){
			var _html = '<div class="g-zoomImg"><img src="' + val + '" /></div>';
			ymPrompt.alert({
				message: _html,
				titleBar: false,
				width: 485,
				height: 550,
				maskAlpha: 0.5
			});
		},
		data: {},
		compareData: {},
		uploadFile: function(url, data){
			var result = null;
			this.$elements.$uploadFile.ajaxSubmit({
				url: url,
				type: 'POST',
				async: false,
				success: function(resData){
					if(typeof resData == 'string'){
						result = JSON.parse(resData)
					}else{
						result = resData;
					}
					if(result && result.result){
						if(result.result === 'bigimageError'){
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning" ><h2> 上传头像过大<h2><p>上传头像大小应该在500kb内</p></div>',
								titleBar: false,
								width: 360,
								height: 240
							});
						}else if(result.result === 'error'){
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning oneline" ><h2>上传失败<h2></div>',
								titleBar: false,
								width: 360,
								height: 240
							});
						}else{
							personSet.data.imageUrl = result.result;
							personSet.$elements.$faceImg.attr('src', result.result);
						}
					}
					personSet.$elements.$getFaceImg.val('');
				}
			});
		},
		isSubmit: true,
		// 渲染已有信息
		init: function(){
			$.ajax({
				url: window.globalPath + '/personalSet/view',
				type: 'POST',
				dataType: 'json',
				success: function(resData){
					var resObj = resData.result;
					/* 取值 */
					personSet.data.imageUrl = resObj.imageUrl || false; //头像路径
					personSet.data.workNumber = resObj.workNumber || ''; //工号
					personSet.data.seniority = resObj.seniority || ''; //教学时长
					personSet.data.name = resObj.name || ''; //教师姓名
					personSet.data.imid = resObj.imid || ''; //考勤卡号
					personSet.data.characteristics = resObj.characteristics || ''; //教学风格
					personSet.data.familyCard = resObj.familyCard || ''; //亲情号码
					personSet.data.type = resObj.type || 0;
					personSet.compareData.imageUrl = resObj.imageUrl || false; //头像路径
					personSet.compareData.workNumber = resObj.workNumber || ''; //工号
					personSet.compareData.seniority = resObj.seniority || ''; //教学时长
					personSet.compareData.name = resObj.name || ''; //教师姓名
					personSet.compareData.imid = resObj.imid || ''; //考勤卡号
					personSet.compareData.characteristics = resObj.characteristics || ''; //教学风格
					personSet.compareData.familyCard = resObj.familyCard || ''; //亲情号码
					if(personSet.data.imageUrl){
						personSet.$elements.$faceImg.attr('src', personSet.data.imageUrl);
					}
					personSet.$elements.$worknumber.val(personSet.data.workNumber);
					personSet.$elements.$seniority.val(personSet.data.seniority);
					personSet.$elements.$name.val(personSet.data.name);
					personSet.$elements.$imid.val(personSet.data.imid);
					personSet.$elements.$characteristics.val(personSet.data.characteristics);
					/* 亲情号码渲染 */
					if(personSet.data.familyCard){
						var familyCardAr = personSet.data.familyCard.split(';');
						for(var i in familyCardAr){
							if(familyCardAr[i] !== ''){
								var ffSingle = familyCardAr[i].split(',');
								var n = +i + 1
								$('.j-kinship' + n).val(ffSingle[0]);
								$('.j-relations' + n).val(ffSingle[1]);
							}
						}
					}
					if(personSet.data.type === 9){
						$('.j-otherType').hide();
					}
				}
			});
		}
	}
	personSet.init();
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
	$("#personSetCansel").on('click', function(){
		location.href = document.referrer || window.globalPath + '/schoolnotice/receiveNotice';
	});
	/* ********************** 提交验证  ******************* */
	$('#personSetSubmit').on('click', function(){
		var $this = $(this);
		/* 取值  校验 赋值 */
		var errorMsgAr = [];
		//个人头像
		if(checkUtil.isEmpty(personSet.data.imageUrl)){
			errorMsgAr.push('请上传个人图像');
		}
		// 姓名
		personSet.data.name = $.trim(personSet.$elements.$name.val());
		if(personSet.data.type !== 9){
			if(checkUtil.isEmpty(personSet.data.name)){
				errorMsgAr.push('请填写教师姓名');
			}else if(checkUtil.checkSpecialChar(personSet.data.name)){
				errorMsgAr.push('教师姓名不能含有特殊字符串');
			}else if(personSet.data.name.length > 15){
				errorMsgAr.push('教师姓名不能超过15个字符');
			}
		}
		// 工号
		personSet.data.workNumber = $.trim(personSet.$elements.$worknumber.val());
		if(personSet.data.type !== 9){
			if(checkUtil.isEmpty(personSet.data.workNumber)){
				errorMsgAr.push('请填写工号');
			}else if(personSet.data.workNumber.length > 15){
				errorMsgAr.push('工号不能超过15个字符');
			}
		}
		//教学时长
		personSet.data.seniority = $.trim(personSet.$elements.$seniority.val());
		if(personSet.data.seniority !== '' && personSet.data.seniority.length > 15){
			errorMsgAr.push('教学时长不能超过15个字符');
		}else if(personSet.data.seniority.indexOf(' ') >= 0){
			errorMsgAr.push('教学时长不能含有空格');
		}
		// 教学考勤卡号
		personSet.data.imid = $.trim(personSet.$elements.$imid.val());
		/* if(checkUtil.isEmpty(personSet.data.imid)){
		 errorMsgAr.push('请填写考勤卡号！');
		 }*/
		// 教学风格
		personSet.data.characteristics = $.trim(personSet.$elements.$characteristics.val());
		if(personSet.data.characteristics !== '' && personSet.data.characteristics.length > 100){
			errorMsgAr.push('教学风格不能超过100个字符');
		}else if(personSet.data.characteristics.indexOf(' ') >= 0){
			errorMsgAr.push('教学风格不能含有空格');
		}
		/* 亲情号码 */
		var familyCard = '', _kpresult = true, _kperroMsg = '',
			kpgroup = [
				{k: $.trim($('.j-kinship1').val()), kp: $.trim($('.j-relations1').val())},
				{k: $.trim($('.j-kinship2').val()), kp: $.trim($('.j-relations2').val())},
				{k: $.trim($('.j-kinship3').val()), kp: $.trim($('.j-relations3').val())},
				{k: $.trim($('.j-kinship4').val()), kp: $.trim($('.j-relations4').val())},
				{k: $.trim($('.j-kinship5').val()), kp: $.trim($('.j-relations5').val())}
			];
		/*   for(var kpg_i in kpgroupAr){
		 if(kpgroupAr[kpg_i].k){
		 kpgroup.push(kpgroupAr[kpg_i]);
		 }
		 }*/
		var kpArray = kpgroup.sort(function(v1, v2){
			return (function(k){
				if(v1[k] > v2[k]){
					return 1
				}else if(v1[k] > v2[k]){
					return -1
				}else{
					return 0
				}
			})('k');
		});
		kpArray[5] = {k: 0, kp: 0};
		for(var kpi = 0; kpi <= 4; kpi++){
			if(kpArray[kpi].k){
				if(!checkUtil.checkPhoneNumber(kpArray[kpi].k)){
					_kpresult = false;
					_kperroMsg = '亲情号码中有存在格式不对的手机号码';
					break;
				}else if(+kpArray[kpi].k === +kpArray[kpi + 1].k){
					_kpresult = false;
					_kperroMsg = '亲情号码中有重复的手机号码';
					break;
				}else{
					familyCard += kpArray[kpi].k + ',' + kpgroup[kpi].kp + ';'
				}
			}
		}
		if(_kpresult){
			personSet.data.familyCard = familyCard;
		}else{
			errorMsgAr.push(_kperroMsg);
		}
		/* 判断是否有数据修改 */
		var isEdit = false;
		for(var ci in personSet.data){
			if(personSet.data.hasOwnProperty(ci) && personSet.compareData.hasOwnProperty(ci) && personSet.compareData[ci] !== personSet.data[ci]){
				isEdit = true;
				break;
			}
		}
		/* 提交 */
		if(!isEdit){
			location.href = window.globalPath + '/schoolnotice/receiveNotice';
		}else if(errorMsgAr.length > 0){
			$('.j-errortips').text(errorMsgAr.join('; '));
		}else if(personSet.isSubmit){
			var _html = '<div class="ym-inContent ym-inContent-warning oneline"><h2>确认修改个人设置？</h2></div>';
			var ajaxUrl = personSet.data.type === 9 ? 'updPortrait' : 'updTeacher';
			ymPrompt.confirmInfo({
				message: _html,
				width: 450,
				height: 300,
				title: '修改个人设置',
				handler: function(res){
					if(res == 'ok'){
						personSet.isSubmit = false;
						$this.attr('disabled', 'disabled');
						$.ajax({
							url: window.globalPath + '/personalSet/' + ajaxUrl,
							type: 'POST',
							data: personSet.data,
							dataType: 'json',
							success: function(resMsg){
								if(resMsg.result == 'success'){
									ymPrompt.close();
									ymPrompt.succeedInfo({
										message: '<div class="ym-inContent ym-inContent-warning oneline" ><h2>修改成功</h2></div>',
										width: 450,
										height: 300,
										titleBar: false,
										handler: function(){
											location.href = window.globalPath + '/schoolnotice/receiveNotice';
										}
									});
								}else{
									$('.j-errortips').html('添加失败，错误信息：' + resMsg.result);
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
});