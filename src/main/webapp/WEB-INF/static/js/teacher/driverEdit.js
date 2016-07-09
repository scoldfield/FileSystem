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


	/* 封装对象 */
	var driverEdit = {
		$elements: {
			$table: $('.tableContent'),
			$driverpicwrap: $('.j-driverpicwrap'),
			$buspicwrap: $('.j-buspicwrap'),
			$editFaceBtn: $('.j-editFace'),
			$editBusPicBtn: $('.j-editBusPic'),
			$getFaceImg: $('#driverPicFile'),
			$getBusImg: $('#busPicFile'),
			$faceImg: $('.j-faceimg'),
			$busImg: $('.j-busimg'),
			$uploadFile: $('#PicFileForm')
		},
		zoomImg: function(val){
			var _html = '<div class="g-zoomImg"><img src="' + val + '" /></div>';
			ymPrompt.win({message: _html, title: '图片放大', width: 515, height: 485, maskAlpha: 0.5});
			$('.g-zoomImg').delegate('.j-closeZoomImg', 'click', function(){
				ymPrompt.close();
			});
		},
		data: {
			driverpic: '',
			buspic: '',
			name: '',
			mobile: '',
			driverAge: '',
			email: '',
			bustype: '',
			platenum: '',
			line: ''
		},
		uploadFile: function(url, data, $ele, $this, $upbtn, resetText){
			var result;
			this.$elements.$uploadFile.ajaxSubmit({
				url: url,
				type: 'POST',
				success: function(resData){
					if(typeof resData == 'string'){
						result = JSON.parse(resData)
					}else{
						result = resData;
					}

					$this.val('');
					$upbtn.html('上传' + resetText).removeClass('disabled');

					if(result.msg == false || result.msg == 'sizeError'){
						ymPrompt.alert({
							message: '<div class="ym-inContent ym-inContent-warning" ><h2> 上传' + resetText + '过大<h2><p>上传' + resetText + '大小应该在500kb内</p></div>',
							titleBar: false,
							width: 360,
							height: 240
						});
						return;
					}

					driverEdit.data[data] = result.msg;
					$ele.attr('src', result.msg);

				}
			});
		},
		isSubmit: true,
		compareData: {}
	}

	var editTypeText,
		$editTypeTextPic = $('.j-editTypeTextPic'),
		$editTypeText = $('.j-editTypeText');
	if(window.driverOtherInf.Id){
		editTypeText = '修改';
		driverEdit.data.id = window.driverOtherInf.Id;
		driverEdit.data.schoolid = window.driverOtherInf.schoolId;
		driverEdit.data.state = window.driverOtherInf.state;
		driverEdit.compareData.id = window.driverOtherInf.Id;
		driverEdit.compareData.schoolid = window.driverOtherInf.schoolId;
		driverEdit.compareData.state = window.driverOtherInf.state;
		/* 其他对比数据创建 */
		driverEdit.compareData.name = $.trim($('.j-drName').val());
		driverEdit.compareData.mobile = $.trim($('.j-drMobile').val());
		driverEdit.compareData.email = $.trim($('.j-email').val());
		driverEdit.compareData.bustype = $.trim($('.j-bustype').val());
		driverEdit.compareData.platenum = $.trim($('.j-platenum').val());
		driverEdit.compareData.line = $.trim($('.j-line').val());

		//$editTypeTextPic.text(editTypeText);
	}else{
		editTypeText = '添加';
		//$editTypeTextPic.text('上传');
	}
	$editTypeText.text(editTypeText);

	var driverYear = new SelectUi($('.j-selectui-driverYear'));
	driverYear.bindE(function(val){
		driverEdit.data.driverAge = val;
	});

	/* 修改之页面渲染  */
	var driver_img = driverEdit.$elements.$driverpicwrap.attr('data-imgsrc');
	if(driver_img){
		driverEdit.$elements.$faceImg.attr('src', driver_img);
		driverEdit.data.driverpic = driver_img;
		driverEdit.compareData.driverpic = driver_img;
	}

	var bus_img = driverEdit.$elements.$buspicwrap.attr('data-imgsrc');
	if(bus_img){
		driverEdit.$elements.$busImg.attr('src', bus_img);
		driverEdit.data.buspic = bus_img;
		driverEdit.compareData.buspic = bus_img;
	}

	var driverAge = $('.j-drage').attr('data-id');
	var driver_sltVal = '';
	if(driverAge !== ''){
		if(driverAge == 1){
			driver_sltVal = '1年以下';
		}else if(driverAge == 2){
			driver_sltVal = '1-3年';
		}else if(driverAge == 3){
			driver_sltVal = '3-5年';
		}else{
			driver_sltVal = '5年以上';
		}
		driverYear.init(driver_sltVal);
		driverEdit.data.driverAge = driver_sltVal;
		driverEdit.compareData.driverAge = driver_sltVal;
	}


	/* ********************** 图片处理 ******************* */

	/* 头像图像上传 */
	driverEdit.$elements.$editFaceBtn.bind('click', function(){
		if($(this).hasClass('disabled')) return;
		driverEdit.$elements.$getFaceImg.click();
	});
	driverEdit.$elements.$getFaceImg.bind('change', function(){
		var val = $(this).val();
		if(val !== ''){
			var valAr = val.split('.');
			var extension = valAr[valAr.length - 1];
			if(extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'bmp' || extension == 'JPG' || extension == 'PNG' || extension == 'GIF' || extension == 'BMP' || extension == 'JPEG' || extension == 'jpeg'){
				driverEdit.uploadFile(window.globalPath + '/driver/uploadDriverPic', 'driverpic', driverEdit.$elements.$faceImg, $(this), driverEdit.$elements.$editFaceBtn, '头像');
				driverEdit.$elements.$editFaceBtn.html('上传中...').addClass('disabled');
			}else{
				ymPrompt.alert({
					message: '<div class="ym-inContent ym-inContent-warning" ><h2>上传图片格式不正确</h2><p>请上传jpg,gif,png,bmp,jpeg格式的图片</p></div>',
					titleBar: false,
					width: 360,
					height: 240
				});
				$(this).val('');
			}
		}
	});
	/* 校车图片上传  */
	driverEdit.$elements.$editBusPicBtn.bind('click', function(){
		if($(this).hasClass('disabled')) return;
		driverEdit.$elements.$getBusImg.click();
	});
	driverEdit.$elements.$getBusImg.bind('change', function(){
		var val = $(this).val();
		if(val !== ''){
			var valAr = val.split('.');
			var extension = valAr[valAr.length - 1];
			if(extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'bmp' || extension == 'JPG' || extension == 'PNG' || extension == 'GIF' || extension == 'BMP' || extension == 'JPEG' || extension == 'jpeg'){
				driverEdit.uploadFile(window.globalPath + '/driver/uploadBusPic', 'buspic', driverEdit.$elements.$busImg, $(this), driverEdit.$elements.$editBusPicBtn, '照片');
				driverEdit.$elements.$editBusPicBtn.html('上传中...').addClass('disabled');
			}else{
				ymPrompt.alert({
					message: '<div class="ym-inContent ym-inContent-warning" ><h2>上传图片格式不正确</h2><p>请上传jpg,gif,png,bmp,jpeg格式的图片</p></div>',
					titleBar: false,
					width: 360,
					height: 240
				});
				$(this).val('');
			}
		}
	});

	/* 放大图片 */
	driverEdit.$elements.$table.delegate('img', 'click', function(){
		driverEdit.zoomImg($(this).attr('src'));
	});


	/* ********************** 提交验证  ******************* */
	$('#driverSubmit').bind('click', function(){
		var $this = $(this)
		/* 取值  校验 赋值 */
		var errorMsgAr = [];

		/* //司机头像可以不需要上传
		 if(checkUtil.isEmpty(driverEdit.data.driverpic)){
		 errorMsgAr.push('请上传司机图像');
		 }*/

		/*        if(checkUtil.isEmpty(driverEdit.data.buspic)){
		 errorMsgAr.push('请上传班车照片');
		 }*/

		// 姓名
		driverEdit.data.name = $.trim($('.j-drName').val());
		if(checkUtil.isEmpty(driverEdit.data.name)){
			errorMsgAr.push('请填写司机姓名');
		}else if(checkUtil.checkSpecialChar(driverEdit.data.name)){
			errorMsgAr.push('司机姓名不能含有特殊字符串');
		}else if(!checkUtil.checkCharSize(driverEdit.data.name, 0, 15)){
			errorMsgAr.push('司机姓名输入请勿超出15个字符');
		}
		// 手机号
		driverEdit.data.mobile = $.trim($('.j-drMobile').val());
		if(checkUtil.isEmpty(driverEdit.data.mobile)){
			errorMsgAr.push('请填写司机手机号码');
		}else if(!checkUtil.checkPhoneNumber(driverEdit.data.mobile)){
			errorMsgAr.push('司机手机号码格式不正确！');
		}

		// 驾龄
		if(checkUtil.isEmpty(driverEdit.data.driverAge)){
			errorMsgAr.push('驾龄不能为空！');
		}
		// 邮箱
		driverEdit.data.email = $.trim($('.j-email').val());
		if(!checkUtil.isEmpty(driverEdit.data.email) && !checkUtil.checkMailFormat(driverEdit.data.email)){
			errorMsgAr.push('邮箱格式不正确！');
		}
		//车型
		driverEdit.data.bustype = $.trim($('.j-bustype').val());
		if(checkUtil.isEmpty(driverEdit.data.bustype)){
			errorMsgAr.push('请填写车型！');
		}else if(checkUtil.checkSpecialChar(driverEdit.data.bustype) || driverEdit.data.bustype.indexOf(' ') >= 0){
			errorMsgAr.push('车型不能输入空格及其他特殊字符！！');
		}
		//车牌
		driverEdit.data.platenum = $.trim($('.j-platenum').val());
		if(checkUtil.isEmpty(driverEdit.data.platenum)){
			errorMsgAr.push('请填写车牌号码！');
		}else if(!checkUtil.checkCharSize(driverEdit.data.platenum, 0, 7)){
			errorMsgAr.push('车牌号码请勿超出7个字符！');
		}else if(checkUtil.checkSpecialChar(driverEdit.data.platenum) || driverEdit.data.platenum.indexOf(' ') >= 0){
			errorMsgAr.push('车牌栏不能输入空格及其他特殊字符！');
		}

		//行车路线
		driverEdit.data.line = $.trim($('.j-line').val());
		if(checkUtil.isEmpty(driverEdit.data.line)){
			errorMsgAr.push('请填写行车路线！');
		}
		if(driverEdit.data.line.length > 100){
			errorMsgAr.push('行车路线字数不能超过100！');
		}
		/* 提交 */

		if(errorMsgAr.length > 0){
			$('.j-errortips').text(errorMsgAr.join('; '));
		}else if(driverEdit.isSubmit){

			/* 判断是否有修改 */
			var _isEdit = false;
			for(var isE_i in driverEdit.data){
				if(driverEdit.data[isE_i] !== driverEdit.compareData[isE_i]){
					_isEdit = true;
					break;
				}
			}

			if(_isEdit){
				var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
					'<h2>确认' + editTypeText + '该司机信息？</h2></div>';
				var _shtml = '<div class="ym-inContent ym-inContent-success">' +
					'<h2>' + editTypeText + '司机成功？</h2></div>';
				ymPrompt.confirmInfo({
					message: _html,
					width: 450,
					height: 300,
					title: editTypeText + '司机',
					handler: function(res){
						if(res == 'ok'){
							driverEdit.isSubmit = false;
							$this.attr('disabled', 'disabled');
							$.ajax({
								url: window.globalPath + '/driver/update',
								type: 'POST',
								data: driverEdit.data,
								dataType: 'json',
								success: function(resMsg){
									if(resMsg.msg == 'true'){
										ymPrompt.close();
										ymPrompt.succeedInfo({
											message: _shtml,
											width: 450,
											height: 300,
											title: editTypeText + '司机',
											handler: function(){
												location.href = window.globalPath + '/driver';
											}
										})
									}else{
										alert('添加失败')
										driverEdit.isSubmit = true;
										$this.removeAttr('disabled');
									}
								}, error: function(){
									alert('添加失败')
									driverEdit.isSubmit = true;
									$this.removeAttr('disabled');
								}
							})
						}
					}
				});
			}else{
				location.href = window.globalPath + '/driver';
			}
		}
	});

	$('.j-submitCancel').on('click', function(){

	})
});