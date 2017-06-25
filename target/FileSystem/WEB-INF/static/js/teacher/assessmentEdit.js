/**
 * Document by wangshuyan@chinamobile.com on 2016/2/17 0017.
 */
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
		'jqueryForm': '../lib/jquery.form',
		'ymPrompt': '../plug/ymPrompt/ymPrompt'
	},
	shim: {
		'base': {deps: ['jquery']},
		'jqueryForm': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'My97DatePicker', 'mypannel', 'ymPrompt', 'jqueryForm'], function(jquery){

	var editData = null, typeText = '新增', returnUrl = '';

	/* 节点渲染 */
	var $elements = {

		$redListContent: $('.j-redListContent'),
		$selectRecipientBtn: $('.j-selectRecipientBtn'),
		$mask: $('.u-mask'),
		$selectRecipientWrap: $('.g-selectRecipient'),
		$selectRecipientContent: $('.j-RecipientContent'),
		$closeRecipient: $('.closeRecipient'),
		$selectRecipientType: $('.j-selectRecipientType'),
		$addAccessoryBtn: $('.j-addAccessoryBtn'),
		$photoFile: $('#addImg'),
		$AccessoryList: $('.j-AccessoryList'),
		$showImgContainer: $('.showImgContainer'),
		$errorMsg: $('.j-errorMsg')
	};
	$elements.$redListContent.val('');
	/* 缓存数据 */
	var submitTransferData = {
		titleLen: 0,
		tmpContentLen: 0,
		imgurl: [],
		imgRealName: [],
		remarkContentAr: [],
		remarkIdAr: [],
		errorMsg: [],
		errorMsgTimeer: null,
		isSubmit: false
	}
	var submitData = {
		receiveStuId: '',
		classIds: '',
		tmpContent: '',
		imgurl: '',
		isclassring: ''
	}

	/* 详细信息字数查询 */
	var contentCounter = new CountInput($elements.$redListContent);
	contentCounter.init({
		callback: function(_vlen){
			if(_vlen <= 300){
				$('.j-redListContentCounter').html('<span class="green"> ' + _vlen + ' </span> /300');
			}else{
				$('.j-redListContentCounter').html('<span class="f-cr">超出' + (_vlen - 300 ) + '</span>');
			}
			submitTransferData.tmpContentLen = _vlen;
		}
	});


	/* 触发添加事件 */
	var addFilesObj = {
		ajaxFormFn: function($form, url){
			var _self = this;
			var result = null;
			$form.ajaxSubmit({
				url: url,
				type: 'POST',
				async: false,
				success: function(resData){
					if(typeof resData === 'string'){
						if(resData === 'bigimageError'){
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning" > <h2> 上传图片过大</h2><p>上传图片大小应该在2M内</p></div></div>',
								titleBar: false,
								width: 360,
								height: 240
							});
						}else{
							result = JSON.parse(resData);
							var imgUrl = result[0].fileurl,
								_realName = result[0].realName;
							/* 暂存 */
							_self.addImages(imgUrl, _realName);
						}
					}else{
						result = resData;
					}
				}
			});
		},
		addImages: function(imgUrl, realName){
			var index_imgurl = submitTransferData.imgurl.length,
				index_realName = submitTransferData.imgRealName.length;
			submitTransferData.imgurl.push(imgUrl);
			submitTransferData.imgRealName.push(realName);
			/* 渲染缩略图 */
			$elements.$AccessoryList.append('<li class="j-fupload showImg"><span class="name">' + realName + '</span><a data-item="imgurl" data-nameItem ="imgRealName"  data-id="' + index_imgurl + '" class="close" href="javascript:void(0)"></a><div class="showImgContainer"><img src="' + imgUrl + '"/></div></li>');
		},
		init: function(){
			if(editData && editData.imgurl && editData.realimgurl){
				var iAr = editData.imgurl.split(';'),
					inameAr = editData.realimgurl.split(';');
				var imgGroup = [], imgNameGroup = [];
				for(var i_i in iAr){
					if(iAr[i_i] !== 0 && inameAr[i_i] !== 0){
						imgGroup.push(iAr[i_i]);
						imgNameGroup.push(inameAr[i_i]);
					}
				}
				for(var if_i in imgGroup){
					this.addImages(imgGroup[if_i], imgNameGroup[if_i]);
				}
			}
			this.bindE();
		},
		bindE: function(){
			var _self = this;
			$elements.$addAccessoryBtn.delegate('a.j-addImg', 'click', function(){
				var $this = $(this);
				/* 检验是否传满8张 */
				var imgAr = []
				for(var img_i in submitTransferData.imgurl){
					if(submitTransferData.imgurl[img_i] !== 0){
						imgAr.push(submitTransferData.imgurl[img_i]);
					}
				}
				if(imgAr.length >= 8){
					ymPrompt.succeedInfo({
						message: '<div class="ym-inContent ym-inContent-warning"><h2>最多上传8张图片<br />您已上传了8张照片</h2></div>',
						width: 420,
						height: 200,
						titleBar: false
					});
				}else{
					$elements.$photoFile.click();
				}
			});

			$elements.$photoFile.bind('change', function(){
				var val = $(this).val();
				/* 获取 */
				if(val !== ''){
					var valAr = val.split('.');
					var extension = valAr[valAr.length - 1];
					if(extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'bmp' || extension == 'JPG' || extension == 'PNG' || extension == 'GIF' || extension == 'BMP' || extension == 'JPEG' || extension == 'jpeg'){
						_self.ajaxFormFn($('#fileUpload'), window.globalPath + '/publishassessment/uploadimage.html');

					}else{
						ymPrompt.alert({
							message: '<div class="ym-inContent ym-inContent-warning"><h2>上传图片格式不正确</h2><p class="fs2">请上传jpg,gif,png,bmp,jpeg格式的图片</p></div>',
							titleBar: false,
							width: 400,
							height: 240
						});
					}
				}
			});

			$elements.$AccessoryList.delegate('a.close', 'click', function(){
				var $this = $(this), _index = $this.attr('data-id'), _type = $this.attr('data-item'), _nameType = $this.attr('data-nameItem');
				submitTransferData[_type][_index] = 0;
				submitTransferData[_nameType][_index] = 0;
				$this.parents('li.j-fupload').remove();
			});
		}
	}

	addFilesObj.init();

	/* ****　蛋疼的接收人模块   *********** */

	/* SelectRecipient 构造类 只负责弹窗，不负责业务逻辑 */
	var redListRecipient = new SelectRecipient({
		triggerEle: $elements.$selectRecipientBtn,  // 触发弹窗弹出的按钮
		mask: $elements.$mask,  // 蒙层
		selectRecipientWrap: $elements.$selectRecipientWrap,  // 弹窗最外层外壳
		selectRecipientContent: $elements.$selectRecipientContent,  //弹窗内容外壳
		closeRecipient: $elements.$closeRecipient  //关闭弹窗
	});

	redListRecipient.$recipientContainer = $('.g-recipientContainer');

	redListRecipient.data = {};      //已经在构造函数中创建 ====== 存储所有接收人数据
	redListRecipient.data.teacher = [];
	/* 接收人数据组 */
	redListRecipient.RecipientCompareData = {};  // 对比数据组，用于显示数据，====== 主要存储已经选择的部分
	redListRecipient.nameGroup = {}; // 数据对应的名字
	redListRecipient.RecipientPostData = []; // 发送数据组;
	redListRecipient.RecipientClassPostData = []; // 发送数据组 -- 班级;

	//  init 渲染页面内容
	redListRecipient.init(function(_self){
		// 获取数据
		$.ajax({
			url: window.globalPath + '/publishassessment/addreceive',
			type: 'POST',
			dataType: 'json',
			async: false,
			success: function(resData){
				//  建立容器
				var $sectionStHtml = $('<ul class="selectContent j-selectContent"></ul>');
				var _selectRecipientHtml = '';
				// 循环数据
				for(var i in resData){
					if(resData.hasOwnProperty(i)){
						var resDataSingle = resData[i],
							resAr = resDataSingle.strName.split('##'),
							resList = resDataSingle.strlist;
						var resListLen = resList.length;
						//建立容器数据
						_self.data['c_' + resAr[2] + '_' + resAr[3]] = [];
						_self.RecipientCompareData['c_' + resAr[2] + '_' + resAr[3]] = [];
						_self.nameGroup['c_' + resAr[2] + '_' + resAr[3]] = resAr[1]; //班级名称储存
						// 建立单元容器
						_selectRecipientHtml += '<li class="selectRecipient-classSingle">' +
							'<div class="selectRecipient-classTitle f-cb"><label class="checkbox-ui"><input type="checkbox" class="j-class-i" value="' + resAr[2] + '_' + resAr[3] + '"><b></b><span class="wd">' + resAr[1] + '</span></label><a href="javascript:void(0);" class="j-toggleStudents active" data-classid="' + resAr[3] + '"></a></div>';
						if(resListLen > 0){
							_selectRecipientHtml += '<div class="selectRecipient-student j-studentsGroup"><ul data-classid="' + resAr[3] + '" class="f-cb f-cbli"> ';
							for(var si = 0; si < resListLen; si++){
								_selectRecipientHtml += '<li><label class="checkbox-ui"><input type="checkbox" value="' + resList[si].studentId + '" data-id="' + resAr[2] + '_' + resAr[3] + '" data-type="1" class="j-stu-i"><b></b><span class="wd">' + resList[si].studentName + '</span><span class="tips-hover" >' + resList[si].mobile + '</span></label></li>';
								_self.data['c_' + resAr[2] + '_' + resAr[3]].push(resList[si].studentId);
								_self.nameGroup['s_' + resList[si].studentId] = resList[si].studentName;
							}
							_selectRecipientHtml += '</ul></div>';
						}else{
							_selectRecipientHtml = '<div>该班级下无学生</div>';
						}
						_selectRecipientHtml += '</li>';
					}
				}
				$sectionStHtml.append(_selectRecipientHtml);
				redListRecipient.selectRecipientContent.append($sectionStHtml);
			}
		});
	});

	redListRecipient.addRecipient = function(){
		var _self = this;
		_self.RecipientPostData = [];
		_self.RecipientClassPostData = []
		var $inputList = redListRecipient.$recipientContainer.find('input.j-stu-i:checked');
		$inputList.each(function(){
			_self.RecipientPostData.push($(this).val());
		});

		var $renderHtml = '';
		for(var i in _self.RecipientCompareData){
			var RecipientCompareDataSingle = _self.RecipientCompareData[i],
				redListRecipientDataSingle = _self.data[i];

			if(RecipientCompareDataSingle.length > 0){
				_self.RecipientClassPostData.push(i.split('_')[2]);
			}


			if(RecipientCompareDataSingle.length == redListRecipientDataSingle.length){
				$renderHtml += '<span class="name-unit">' + _self.nameGroup[i] + '</span>';
			}else{
				for(var j  in  RecipientCompareDataSingle){
					$renderHtml += '<span class="name-unit">' + _self.nameGroup['s_' + RecipientCompareDataSingle[j]] + '</span>';
				}
			}
		}
		if($renderHtml == ''){
			$renderHtml = '<div class="enterTips">请输入接收人</div>'
		}

		submitData.receiveStuId = _self.RecipientPostData.join(',');
		submitData.classIds = _self.RecipientClassPostData.join(',');

		$elements.$selectRecipientBtn.html($renderHtml);
	}


	//bindE 绑定数据  传递的参数函数，是业务逻辑，
	redListRecipient.bindE(function(_self){
		/* 全体事件 */
		_self.$recipientContainer.delegate('a.j-toggleStudents', 'click', function(){
			var $this = $(this), $studentGroup = $this.parents('li').find('.j-studentsGroup');
			$studentGroup.toggle();
			$this.toggleClass('active');
		}).delegate('input.j-stu-i', 'change', function(){
			var $this = $(this),
				_data = $this.attr('data-id'),
				_dataGroup = 'c_' + _data,
				_id = $this.val(),
				_$ul = $this.closest('ul');

			if($this.is(':checked')){
				_self.RecipientCompareData[_dataGroup].push(_id);
			}else{
				_self.RecipientCompareData[_dataGroup].splice(_self.RecipientCompareData[_dataGroup].indexOf(_id), 1);
			}
			/* 如果班级全部人员都全选，则班级名称全选 */
			var $classAllcheck = $('input[value=' + _data + ']'),
				$allChecked = _$ul.find('input:checked');
			if($allChecked.length == _self.data[_dataGroup].length){
				$classAllcheck.attr('checked', 'checked');
			}else{
				$classAllcheck.removeAttr('checked');
			}
		}).delegate('input.j-class-i', 'change', function(){
			var $this = $(this), _data = $this.val();
			if($this.is(':checked')){
				$('input.j-stu-i[data-id=' + _data + ']').each(function(){
					var _$this = $(this), _id = _$this.val();
					if(!_$this.is(':checked')){
						_$this.attr('checked', 'checked');
						_self.RecipientCompareData['c_' + _data].push(_id);
					}
				});
			}else{
				$('input.j-stu-i[data-id=' + _data + ']').each(function(){
					$(this).removeAttr('checked');
					_self.RecipientCompareData['c_' + _data] = [];
				});
			}
		});

		/* 添加 接收人 */
		$('.j-addRecipientData').bind('click', function(){
			_self.addRecipient();
			_self.closeClassGroup();
		});

		$('.j-cancelRecipientData').bind('click', function(){
			_self.closeClassGroup();
		});
	});

	/* 提交 */
	$('.j-submitRed').on('click', function(){
		if(!submitTransferData.isSubmit){
			// 清理错误信息
			clearTimeout(submitTransferData.errorMsgTimeer);
			$('.j-errorMsg').hide();
			submitTransferData.errorMsg = [];

			/* 整理缓存数据&赋值 */
			submitData.tmpContent = $elements.$redListContent.val();
			var imagesAr = [];
			for(var i = 0, ilen = submitTransferData.imgurl.length; i < ilen; i++){
				var image = submitTransferData.imgurl[i];
				if(image === 0)    continue;
				imagesAr.push(image)
			}
			submitData.images = imagesAr.join(';');
			submitData.classring = $('.j-isclassring')[0].checked ? 0 : 1;

			/* 验证 */
			if(submitData.receiveStuId === ''){
				submitTransferData.errorMsg.push('请选择评估对象');
			}
			/* if(submitData.remarkId === ''){
			 submitTransferData.errorMsg.push('请选择表扬内容');
			 }*/
			if(submitData.tmpContent === '' && submitData.images === ''){
				submitTransferData.errorMsg.push('请填写评估内容');
			}else if(submitData.tmpContent.length > 300){
				submitTransferData.errorMsg.push('评估内容不能超过300个字符');

			}

			if(submitTransferData.errorMsg.length > 0){
				$('.j-errorMsg').html(submitTransferData.errorMsg.join('; ')).fadeIn();
				submitTransferData.errorMsgTimeer = setTimeout(function(){
					$('.j-errorMsg').fadeOut(1000);
				}, 5000)
			}else{
				var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
					'<h2>确定评估学生</h2></div>';
				ymPrompt.confirmInfo({
					message: _html,
					width: 320,
					height: 220,
					titleBar: false,
					handler: function(res){
						if(res == 'ok'){
							$.ajax({
								url: window.globalPath + '/publishassessment/save',
								type: 'POST',
								dataType: 'json',
								data: submitData,
								success: function(res){
									if(res.result === 'success'){
										submitTransferData.isSubmit = true;
										ymPrompt.succeedInfo({
											message: '<div class="ym-inContent ym-inContent-success oneline"><h2>评估成功</h2></div>',
											titleBar: false,
											width: 300,
											height: 220,
											handler: function(){
												location.reload();
											}
										});
									}else{
										ymPrompt.alert({
											message: '<div class="ym-inContent ym-inContent-warning"><h2>  评估失败!<br/>' + res.result + '</h2></div>',
											width: 300,
											height: 220,
											titleBar: false
										})
									}
								},
								error: function(){
									ymPrompt.alert({
										message: '<div class="ym-inContent ym-inContent-warning"><h2>  评估失败!</h2></div>',
										width: 300,
										height: 220,
										titleBar: false
									})
								}
							});
						}
					}
				});
			}
		}
	});
});