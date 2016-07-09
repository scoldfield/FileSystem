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
		personStr: '',
		remarkId: '',
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
								message: '<div class="ym-inContent ym-inContent-warning" ><h2> 上传图片过大<h2><p>上传图片大小应该在2M内</p></div>',
								titleBar: false,
								width: 360,
								height: 240
							});
							$elements.$photoFile.val('')
							return ;
						}else{
							result = JSON.parse(resData)
						}
					}else{
						result = resData;
					}

					var imgUrl = result[0].fileurl,
						_realName = result[0].realName;
					_self.addImages(imgUrl, _realName);
					$elements.$photoFile.val('');
				}
			});
			return result[0];
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
					if(iAr[i_i] !== '' && inameAr[i_i] !== ''){
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
					if(submitTransferData.imgurl[img_i] !== ''){
						imgAr.push(submitTransferData.imgurl[img_i]);
					}
				}
				if(imgAr.length >= 8){
					ymPrompt.succeedInfo({
						message: ' 最多上传8张图片<br/>您已上传了8张照片',
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
						_self.ajaxFormFn($('#fileUpload'), window.globalPath + '/redlist/uploadimage.html')
					}else{
						ymPrompt.alert({
							message: '<div class="ym-inContent ym-inContent-warning" ><h2>上传图片格式不正确</h2><p>请上传jpg,gif,png,bmp,jpeg格式的图片</p></div>',
							titleBar: false,
							width: 400,
							height: 240
						});
						$(this).val('');
					}
				}
			});

			$elements.$AccessoryList.delegate('a.close', 'click', function(){
				var $this = $(this), _index = $this.attr('data-id'), _type = $this.attr('data-item'), _nameType = $this.attr('data-nameItem');
				submitTransferData[_type][_index] = '';
				submitTransferData[_nameType][_index] = '';
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

	//  init 渲染页面内容
	redListRecipient.init(function(_self){
		// 获取数据
		$.ajax({
			url: window.globalPath + '/redlist/addreceive',
			type: 'POST',
			dataType: 'json',
			async: false,
			success: function(resData){
				//  建立容器
				var $sectionStHtml = $('<ul class="selectContent j-selectContent"></ul>');
				// 循环数据
				var _selectRecipientHtml = '';
				for(var i in resData){
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
							_selectRecipientHtml += '<li><label class="checkbox-ui"><input type="checkbox" value="' + resList[si].studentId + '" data-id="' + resAr[2] + '_' + resAr[3] + '" data-type="1" class="j-stu-i"><b></b><span class="wd">' + resList[si].studentName + '</span></label><div class="tips-hover">' + resList[si].mobile + '</div></li>';
							_self.data['c_' + resAr[2] + '_' + resAr[3]].push(resList[si].studentId);
							_self.nameGroup['s_' + resList[si].studentId] = resList[si].studentName;
						}
						_selectRecipientHtml += '</ul></div>';
					}else{
						_selectRecipientHtml = '<div>该班级下无学生</div>';
					}
					_selectRecipientHtml += '</li>';
				}
				$sectionStHtml.append(_selectRecipientHtml);
				redListRecipient.selectRecipientContent.append($sectionStHtml);
			}
		});
	});

	redListRecipient.addRecipient = function(){
		var _self = this;
		_self.RecipientPostData = [];
		var $inputList = redListRecipient.$recipientContainer.find('input.j-stu-i:checked');
		$inputList.each(function(){
			_self.RecipientPostData.push($(this).val());
		});

		submitData.personStr = _self.RecipientPostData.join(',');

		var $renderHtml = '';

		for(var i in _self.RecipientCompareData){
			var RecipientCompareDataSingle = _self.RecipientCompareData[i],
				redListRecipientDataSingle = _self.data[i];

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


	/* 传入已有接收人 部分
	 (function(){
	 if(editData && editData.personStr !== '' && editData.personStr.split(',').length > 0){
	 var redListRecipientEditList = editData.personStr.split(',');
	 for(var nr_i in redListRecipientEditList){
	 var nrSingle = redListRecipientEditList[nr_i].split('##'), _id = nrSingle[0], _nrtype = nrSingle[2];
	 if(_nrtype == 'teacher'){
	 redListRecipient.selectRecipientContent.find('input.j-teacher-i[value=' + _id + ']').click();
	 }
	 if(_nrtype == 'student'){
	 redListRecipient.selectRecipientContent.find('input.j-stu-i[value=' + _id + ']').click();
	 }
	 }
	 redListRecipient.addRecipient();
	 }
	 })();
	 */

	/* ****　蛋疼的接收人模块  end *********** */

	/* 表扬内容操作 */
	$('.j-flowersOpater').delegate('li.j-r', 'click', function(){ // 选择vs不选择
		var $this = $(this), _id = $this.attr('data-id');

		$this.toggleClass('has');

		/* 有什么想说的吗？内容添加 */
		var remarkContent = '';
		if($this.hasClass('has')){
			submitTransferData.remarkIdAr.push(_id); // 添加缓存ID
			remarkContent = $this.find('h3').text();
			submitTransferData.remarkContentAr.push(remarkContent);
		}else{
			submitTransferData.remarkIdAr.splice(submitTransferData.remarkIdAr.indexOf(_id), 1); // 删除缓存ID
			remarkContent = $this.find('h3').text();
			submitTransferData.remarkContentAr.splice(submitTransferData.remarkContentAr.indexOf(remarkContent), 1)
		}

		if(submitTransferData.remarkContentAr.length > 0){
			$elements.$redListContent.val(submitTransferData.remarkContentAr.join('； ') + '；');
		}else{
			$elements.$redListContent.val('');
		}
		contentCounter.showFn(contentCounter.$ipt.val().length);

	}).delegate('li.j-radd', 'click', function(){ // 增加新的红花项目
		var _addHtml = '<div style="padding-top:20px;width: 240px;margin: 0 auto;"> <input type="text" class="u-gipt u-gipt-addRedItem j-addreditem" /><p class="f-cr j-addItemError f-fs2 f-tal" style="padding-top:5px;"></p></div>'
		ymPrompt.confirmInfo({
			message: _addHtml,
			title: '添加表扬项目',
			width: 350,
			height: 220,
			autoClose: false,
			handler: function(res){
				if(res == 'ok'){
					var additemName = $('.j-addreditem').val();
					if(additemName.length > 8){
						$('.j-addItemError').html('表扬项目不能大于8个字');
						$('.j-addreditem').on('focus', function(){
							$('.j-addItemError').empty();
						})
					}else{
						$.ajax({
							url: window.globalPath + '/redlist/addremark',
							type: 'POST',
							dataType: 'json',
							data: {content: additemName},
							success: function(res){
								if(res){
									var _html = '<li class="j-r" data-id="' + res + '">' +
										'<span class="ishas"></span>' +
										'<h3>' + additemName + '</h3>' +
										'<img src="/' + window.globalPath.split('/')[1] + '/static/images/reditem/r.jpg">' +
										'<a href="javascript:void(0)" class="delete j-delete"></a>' +
										'</li>';
									$(_html).insertBefore('li.j-radd');
									ymPrompt.close();
								}
							}
						});
					}
				}else{
					ymPrompt.close();
				}
			}
		})
	}).delegate('.j-delete', 'click', function(event){
		var _ev = event || window.event;
		if(_ev.stopPropagation){
			_ev.stopPropagation();
		}else{
			_ev.cancelBubble = true;
		}
		var $this = $(this), $p = $(this).parent(), _id = $p.attr('data-id');
		$.ajax({
			url: window.globalPath + '/redlist/deleteremark',
			type: 'POST',
			dataType: 'json',
			data: {id: _id},
			success: function(res){
				if(res.result == "success"){
					$p.remove();
				}
			}
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
			submitData.remarkId = submitTransferData.remarkIdAr.join(',');
			submitData.tmpContent = $elements.$redListContent.val();
			submitData.imgurl = submitTransferData.imgurl.join(';');
			submitData.isclassring = $('.j-isclassring')[0].checked ? 0 : 1;

			/* 验证 */
			if(submitData.personStr === ''){
				submitTransferData.errorMsg.push('请选择表扬对象');
			}
			if(submitData.remarkId === ''){
				submitTransferData.errorMsg.push('请选择表扬内容');
			}
			if(submitData.tmpContent === ''){
				submitTransferData.errorMsg.push('请填写有什么想说的吗？');
			}else if(submitData.tmpContent.length > 300){
				submitTransferData.errorMsg.push(' "有什么想说的吗？"字数不能超过300个');
			}

			if(submitTransferData.errorMsg.length > 0){
				$('.j-errorMsg').html(submitTransferData.errorMsg.join('; ')).fadeIn();
				submitTransferData.errorMsgTimeer = setTimeout(function(){
					$('.j-errorMsg').fadeOut(1000);
				}, 5000)
			}else{
				var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
					'<h2>确定送花?</h2></div>';
				ymPrompt.confirmInfo({
					message: _html,
					width: 340,
					height: 240,
					titleBar: false,
					handler: function(res){
						if(res == 'ok'){
							$.ajax({
								url: window.globalPath + '/redlist/save',
								type: 'POST',
								dataType: 'json',
								data: submitData,
								success: function(res){
									if(res.result === 'success'){
										submitTransferData.isSubmit = true;
										ymPrompt.succeedInfo({
											message: '<div class="ym-inContent ym-inContent-success oneline"><h2>送花成功</h2></div>',
											titleBar: false,
											width: 300,
											height: 220,
											handler: function(){
												location.href = window.globalPath + '/redlist/list';
											}
										});
									}else{
										ymPrompt.alert({
											message: '<div class="ym-inContent ym-inContent-success"><h2>送花失败!</h2><p>' + res.result + '</p></div>',
											width: 300,
											height: 220,
											titleBar: false
										})
									}
								},
								error: function(){
									ymPrompt.alert({
										message: '<div class="ym-inContent ym-inContent-success"><h2>送花失败!</h2><p>' + res.result + '</p></div>',
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