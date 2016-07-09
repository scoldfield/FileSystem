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
		'ymPrompt': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'My97DatePicker', 'mypannel', 'ymPrompt', 'jqueryForm'], function(jquery){
	/* ***** 定义本页面全局常量 ***** */
	var noticeId = getUrlQuery('id'),
		editData = null,
		typeText = '新增',
		returnUrl = '',
		globalNoticeTypeStr = window.noticeType === 1 ? 'classnotice' : 'schoolnotice',
		TODAY = new Date();

	/* 节点渲染 */
	var $elements = {
		$noticeTitle: $('.j-noticeTitle'),
		$noticeContent: $('.j-noticeContent'),
		$selectRecipientBtn: $('.j-selectRecipientBtn'),
		$mask: $('.u-mask'),
		$selectRecipientWrap: $('.g-selectRecipient'),
		$selectRecipientContent: $('.j-RecipientContent'),
		$closeRecipient: $('.closeRecipient'),
		$selectRecipientType: $('.j-selectRecipientType'),
		$noticeDate: $('.j-noticeDate'),
		$addAccessoryBtn: $('.j-addAccessoryBtn'),
		$photoFile: $('#photoFile'),
		$attachmentFile: $('#attachmentFile'),
		$AccessoryList: $('.j-AccessoryList'),
		$showImgContainer: $('.showImgContainer'),
		$errorMsg: $('.j-errorMsg'),
		$smstype: $('.j-smstype'),
		$dingshiwrap: $('.j-dingshiwrap')
	};
	/* 公告的提交数据 */
	var submitData = {
		title: '',
		content: '',
		personStr: '',
		imgurl: '',
		file: '',
		dtime: '',
		noticetype: window.noticeType /* 学校公告还是班级公告 */
	};
	/* 公告缓存数据 */
	var submitTransferData = {
		titleLen: 0,
		contentLen: 0,
		imgurl: [],
		imgRealName: [],
		file: [],
		fileRealName: []
	};
	/* 获取渲染 +  已有（修改）数据 */
	if(noticeId){
		$.ajax({
			url: window.globalPath + '/schoolnotice/updatedeaftJson',
			type: 'POST',
			dataType: 'json',
			data: {id: noticeId},
			async: false,
			success: function(res){
				if(res){
					editData = res;
					(editData && editData.pubstate && editData.pubstate === '0') && (location.href = window.globalPath + '/' + globalNoticeTypeStr + '/receiveNotice');
					$elements.$noticeTitle.val(editData.title || '');
					$elements.$noticeContent.val(editData.content || '');
					typeText = '修改';

					/* *******是否短信通知于发送类型***** */
					/* 类型 */
					if(editData.pubstate){
						$('input[name=sendType][data-item=' + editData.pubstate + ']').get(0).checked = true;
						if(editData.pubstate == 2 && editData.sendtime){
							var _dateAr = editData.sendtime.split(' '),
								_date = _dateAr[0],
								_h = _dateAr[1].split(':')[0],
								_m = _dateAr[1].split(':')[1];
							$elements.$noticeDate.val(_date);
							$('.j-noticeHours').val(_h);
							$('.j-noticeMin').val(_m);
							$elements.$dingshiwrap.show();
						}
						if(editData.pubstate == 1){
							$elements.$smstype.removeAttr('checked').attr('disabled', 'disabled');
							/* 默认时间是今天 */
							$elements.$noticeDate.val(TODAY.getFullYear() + '-' + (TODAY.getMonth() > 9 ? TODAY.getMonth() + 1 : '0' + (TODAY.getMonth() + 1)) + '-' + (TODAY.getDate() > 10 ? TODAY.getDate() : '0' + TODAY.getDate()));
							var hour = TODAY.getHours()>9?TODAY.getHours():'0'+TODAY.getHours();
							var minite =  TODAY.getMinutes()>9?TODAY.getMinutes():'0'+TODAY.getMinutes();
							$('.j-noticeHours').val(hour);
							$('.j-noticeMin').val(minite);

						}
					}
				}
			}
		});
	}else{
		/* 默认时间是今天 */
		$elements.$noticeDate.val(TODAY.getFullYear() + '-' + (TODAY.getMonth() > 9 ? TODAY.getMonth() + 1 : '0' + (TODAY.getMonth() + 1)) + '-' + (TODAY.getDate() > 10 ? TODAY.getDate() : '0' + TODAY.getDate()));
		var hour = TODAY.getHours()>9?TODAY.getHours():'0'+TODAY.getHours();
		var minite =  TODAY.getMinutes()>9?TODAY.getMinutes():'0'+TODAY.getMinutes();
		$('.j-noticeHours').val(hour);
		$('.j-noticeMin').val(minite);
	}
	/* 标题字数查询 */
	var titleCounter = new CountInput($elements.$noticeTitle);
	titleCounter.init({
		callback: function(_vlen){
			if(_vlen <= 50){
				$('.j-noticeTitleCounter').html('<span class="green"> ' + _vlen + ' </span> /50');
			}else{
				$('.j-noticeTitleCounter').html('<span class="f-cr">超出' + (_vlen - 50 ) + '</span>');
			}
			submitTransferData.titleLen = _vlen;
		}
	});
	/* 详细信息字数查询 */
	var contentCounter = new CountInput($elements.$noticeContent);
	contentCounter.init({
		callback: function(_vlen){
			if(_vlen <= 5000){
				$('.j-noticeContentCounter').html('<span class="green"> ' + _vlen + ' </span> /5000');
			}else{
				$('.j-noticeContentCounter').html('<span class="f-cr">超出' + (_vlen - 5000 ) + '</span>');
			}
			submitTransferData.contentLen = _vlen;
		}
	});



	/* ****　蛋疼的接收人模块   *********** */
	/* SelectRecipient 构造类 只负责弹窗，不负责业务逻辑 */
	var noticeRecipient = new SelectRecipient({
		triggerEle: $elements.$selectRecipientBtn,  // 触发弹窗弹出的按钮
		mask: $elements.$mask,  // 蒙层
		selectRecipientWrap: $elements.$selectRecipientWrap,  // 弹窗最外层外壳
		selectRecipientContent: $elements.$selectRecipientContent,  //弹窗内容外壳
		closeRecipient: $elements.$closeRecipient  //关闭弹窗
	});
	noticeRecipient.$recipientContainer = $('.g-recipientContainer');
	noticeRecipient.data = {};      //已经在构造函数中创建 ====== 存储所有接收人数据
	noticeRecipient.data.teacher = [];
	/* 接收人数据组 */
	var RecipientCompareData = {},   // 对比数据组，用于显示数据，====== 主要存储已经选择的部分
		nameGroup = {}, // 数据对应的名字
		RecipientPostData = []; // 发送数据组;
	//添加接收人
	noticeRecipient.addRecipient = function(){
		var _self = this;
		RecipientPostData = [];
		var $inputList = noticeRecipient.$recipientContainer.find('input[type=checkbox]');
		$inputList.each(function(){
			var $this = $(this), _id = $this.val();
			if($this.is(':checked')){
				if($this.hasClass('j-teacher-i')){
					RecipientPostData.push(_id + '##0##teacher##8');
				}
				if($this.hasClass('j-stu-i')){
					RecipientPostData.push(_id + '##1##student##16');
				}
			}
		});
		submitData.personStr = RecipientPostData.join(',');
		var $renderHtml = '';
		for(var i in RecipientCompareData){
			if(RecipientCompareData.hasOwnProperty(i)){
				var RecipientCompareDataSingle = RecipientCompareData[i],
					noticeRecipientDataSingle = noticeRecipient.data[i];
				/* 教师显示 */
				if(i == 'teacher'){
					if(noticeRecipientDataSingle.length > 0 && RecipientCompareDataSingle.length == noticeRecipientDataSingle.length){
						$renderHtml += '<span class="name-unit">全体教师</span>';
					}else{
						for(var ti in RecipientCompareDataSingle){
							if(RecipientCompareDataSingle.hasOwnProperty(ti)){
								$renderHtml = '<span class="name-unit">' + nameGroup['t' + RecipientCompareDataSingle[ti]] + '</span>' + $renderHtml;
							}
						}
					}
				}else{
					/* 学生显示 */
					for(var j in RecipientCompareDataSingle){
						if(RecipientCompareDataSingle.hasOwnProperty(j)){
							var RecipientCompareDataSingleClass = RecipientCompareDataSingle[j],
								noticeRecipientDataClass = noticeRecipientDataSingle[j];
							if(noticeRecipientDataClass.length > 0 && RecipientCompareDataSingleClass.length == noticeRecipientDataClass.length){
								$renderHtml += '<span class="name-unit">' + nameGroup[j] + '</span>';
							}else{
								for(var si  in  RecipientCompareDataSingleClass){
									if(RecipientCompareDataSingleClass.hasOwnProperty(si)){
										$renderHtml += '<span class="name-unit">' + nameGroup['s' + RecipientCompareDataSingleClass[si]] + '</span>';
									}
								}
							}
						}
					}
				}
			}
		}
		$elements.$selectRecipientBtn.empty();
		if($renderHtml == ''){
			$renderHtml = '<div class="enterTips">请输入接收人</div>'
		}
		$elements.$selectRecipientBtn.append($renderHtml);
	}
	//判断是否所有教师全选
	noticeRecipient.isAllTeacher = function(){
		var _self = this;
		if($('input.j-teacher-i:checked').length == $('input.j-teacher-i').length){
			$('input.j-allteacher').attr('checked', 'checked');
		}else{
			$('input.j-allteacher').removeAttr('checked');
		}
	}
	/* 判断是否所有学生全选 */
	noticeRecipient.isAllStudents = function(){
		if($('input.j-stu-i').length == $('input.j-stu-i:checked').length){
			$('input.j-allStudents').attr('checked', 'checked');
		}else{
			$('input.j-allStudents').removeAttr('checked');
		}
	}
	//判断是否全体班级全选
	noticeRecipient.isAllClassStudents = function(_gradeId, _classId){
		var _self = this;
		/* 如果班级全部人员都全选，则班级名称全选 */
		if($('input.j-stu-i[data-id=' + _gradeId + '_' + _classId + ']:checked').length == _self.data['g' + _gradeId]['c' + _classId].length){
			$('input[value=' + _gradeId + '_' + _classId + ']').attr('checked', 'checked');
		}else{
			$('input[value=' + _gradeId + '_' + _classId + ']').removeAttr('checked');
		}
	}
	//  init 渲染页面内容+获取vs渲染所有接收人
	noticeRecipient.init(function(_self){
		// 获取数据
		var getAjaxUrl = window.noticeType == 1 ? '/classnotice/addreceive' : '/schoolnotice/addreceive';
		$.ajax({
			url: window.globalPath + getAjaxUrl,
			type: 'POST',
			dataType: 'json',
			async: false,
			success: function(resData){
				/* 建立容器 */
				var $sectionStHtml = $('<div class="selectContent j-selectContent" style="display:none"></div>'),    // 学生容器
					$sectionTeHtml = $('<div class="selectContent j-selectContent"></div>');   // 教师容器
				/* 建立年级信息 */
				for(var i = 0, ilen = resData.length; i < ilen; i++){
					if(!resData.hasOwnProperty(i)) continue;
					var resDataSingle = resData[i];
					var resAr = resDataSingle.strName.split('##'),
						resList = resDataSingle.strlist;
					// 年级数据模型建立 并 渲染页面
					if(i == 0 && resAr[0] == 'grade'){
						$sectionStHtml.append('<label class="checkbox-ui"><input type="checkbox" class="j-allStudents"><b></b><span class="wd">全部学生</span></label>');
						for(var gradeGroup_i = 0, glen = resList.length; gradeGroup_i < glen; gradeGroup_i++){
							if(!resList.hasOwnProperty(gradeGroup_i)) continue;
							/* 建立数据模型 */
							_self.data['g' + resList[gradeGroup_i].id] = {}; //创建总数据 年级容器
							RecipientCompareData['g' + resList[gradeGroup_i].id] = {}; // 创建对比数据年级容器
							/* 渲染页面  a阶段 */
							var $selectRecipientWrap = $('<div data-gradeId="' + resList[gradeGroup_i].id + '" class="selectRecipientWrap"><div class="selectRecipient-grade f-cb">' + resList[gradeGroup_i].gradeName + '</div>' +
									// 班级容器
								'<div class="selectRecipient-class"><ul data-gradeId="' + resList[gradeGroup_i].id + '"  class="j-classesGroup f-cb f-cbli"></ul></div> ' +
									//班级下的学生容器
								'<div class="selectRecipient-student j-studentsGroup"></div></div>');
							$sectionStHtml.append($selectRecipientWrap);
						}
					}
					/* 教师 */
					if(i == 1 && resAr[0] == 'teacher'){
						var $teacherHtml = '<div class="selectRecipientWrap"><div class="selectRecipient-grade f-cb"><label class="checkbox-ui"><input type="checkbox" class="j-allteacher"><b></b><span class="wd">全部老师</span></label> </div><div class="selectRecipient-class j-teachersGroup"><ul class="f-cb f-cbli">';
						var $li = '';
						for(var teacher_i in resList){
							if(resList.hasOwnProperty(teacher_i)){
								var _teacherSingle = resList[teacher_i];
								$li += '<li><label class="checkbox-ui"><input type="checkbox" class="j-teacher-i" value="' + _teacherSingle.id + '" /><b></b><span class="wd">' + _teacherSingle.name + '</span></label></li>';
								_self.data.teacher.push(_teacherSingle.id); // 创建教师总数据
								nameGroup['t' + _teacherSingle.id] = _teacherSingle.name; // 数据对应的名字--教师
							}
						}
						$teacherHtml += $li
						$teacherHtml += '</ul></div> '
						$sectionTeHtml.append($teacherHtml);
						RecipientCompareData.teacher = []; // 创建教师对比数据
					}
					// 班级，学生建立
					if(i > 1 && resAr[0] == 'student'){
						var className = resAr[1], classForGradeId = resAr[2], classId = resAr[3];
						/* 向年级中，添加班级数据组 */
						_self.data['g' + classForGradeId]['c' + classId] = [];   //创建总数据 班级容器
						nameGroup['c' + classId] = className;  // 数据对应的名字--班级
						RecipientCompareData['g' + classForGradeId]['c' + classId] = [];   // 创建对比数据 班级容器
						/* 渲染年级列表 */
						var $classSingleHtml = '<li><label class="checkbox-ui"><input type="checkbox" class="j-class-i" value="' + classForGradeId + '_' + classId + '" /><b></b><span class="wd">' + className + '</span></label><a href="javascript:void(0);" class="j-toggleStudents" data-classId="' + classForGradeId + '_' + classId + '"></a> </li>';
						$sectionStHtml.find('.j-classesGroup[data-gradeId=' + classForGradeId + ']').append($classSingleHtml);
						// 处理学生组合
						var $studentsList = $('<ul data-classId="' + classForGradeId + '_' + classId + '" class="f-cb f-cbli"></ul>');
						for(var student_i = 0, student_ilen = resList.length; student_i < student_ilen; student_i++){

							var studentSingle = resList[student_i],
								_studentId = studentSingle.studentId,
								_studentName = studentSingle.studentName,
								_mobile = studentSingle.mobile,
								isStuClass = '',
								isDisabled = ''

							/* 向班级中添加学生数据组 */
							if(studentSingle.isfee){
								_self.data['g' + classForGradeId]['c' + classId].push(_studentId); // 创建学生总数据
								nameGroup['s' + _studentId] = _studentName;  // 数据对应的名字--学生
								isStuClass = 'j-stu-i'
							}else{
								isDisabled = 'disabled="disabled"';
							}

							/* 渲染学生容器列表  */
							$studentsList.append('<li><label class="checkbox-ui"><input type="checkbox" value="' + _studentId + '"  data-id="' + classForGradeId + '_' + classId + '" data-type="' + 1 + '" class="' + isStuClass + '" ' + isDisabled + ' ><b></b><span class="wd">' + _studentName + '</span></label><div class="tips-hover">' + _mobile + '</div></li>');

						}
						$sectionStHtml.find('.selectRecipientWrap[data-gradeId=' + classForGradeId + ']').find('.j-studentsGroup').append($studentsList);
					}
					noticeRecipient.$recipientContainer.append($sectionTeHtml);
					noticeRecipient.$recipientContainer.append($sectionStHtml);
					$elements.$selectContentTab = noticeRecipient.$recipientContainer.children('.j-selectContent');
				}
				noticeRecipient.$recipientContainer.find('.j-classesGroup').each(function(){
					if($(this).children('li').length == 0){
						noticeRecipient.$recipientContainer.find('.selectRecipientWrap[data-gradeid=' + $(this).attr('data-gradeid') + ']').hide();
					}
				});
			}
		});
	});
	/* 传入已有接收人 部分  */
	(function(){
		if(editData && editData.personStr && editData.personStr.split(',').length > 0){
			var noticeRecipientEditList = editData.personStr.split(',');
			for(var nr_i in noticeRecipientEditList){
				if(!noticeRecipientEditList.hasOwnProperty(nr_i)){
					continue;
				}
				var nrSingle = noticeRecipientEditList[nr_i].split('##'), _id = nrSingle[0], _nrtype = nrSingle[2];
				if(_nrtype == 'teacher'){
					noticeRecipient.selectRecipientContent.find('input.j-teacher-i[value=' + _id + ']')[0].checked = true;
					RecipientCompareData.teacher.push(_id);
				}
				if(_nrtype == 'student'){
					noticeRecipient.selectRecipientContent.find('input.j-stu-i[value=' + _id + ']')[0].checked = true;
					var _data = noticeRecipient.selectRecipientContent.find('input.j-stu-i[value=' + _id + ']').attr('data-id').split('_')
					RecipientCompareData['g' + _data[0]]['c' + _data[1]].push(_id);
					noticeRecipient.isAllClassStudents(_data[0], _data[1]);
				}
			}
			noticeRecipient.isAllStudents();
			noticeRecipient.isAllTeacher();
			noticeRecipient.addRecipient();
		}
	})();
	//bindE 绑定数据  传递的参数函数，是业务逻辑，
	noticeRecipient.bindE(function(_self){
		/* 内容切换 */
		_self.selectRecipientContent.find('ul.j-selectRecipientType').delegate('li', 'click', function(){
			var $this = $(this);
			if(!$this.hasClass('active')){
				var _val = $this.index();
				$elements.$selectContentTab.hide().eq(_val).show();
				$this.addClass('active').siblings().removeClass('active');
			}
		});
		/* 全体事件 */
		_self.$recipientContainer.delegate('a.j-toggleStudents', 'click', function(){
			var $this = $(this), $li = $this.parents('li'), _classId = $this.attr('data-classId');
			_self.$recipientContainer.find('.j-studentsGroup ul').hide();
			if($li.hasClass('active')){
				$li.removeClass('active');
			}else{
				_self.$recipientContainer.find('.j-studentsGroup ul[data-classId=' + _classId + ']').show();
				$li.addClass('active');
			}
		}).delegate('input.j-stu-i', 'change', function(){
			var $this = $(this), _dataGroup = $this.attr('data-id').split('_'), _gradeId = _dataGroup[0], _classId = _dataGroup[1], _id = $this.val(),
				$allChecked = $this.parents('ul').find('input:checked');
			if($this.is(':checked')){
				RecipientCompareData['g' + _gradeId]['c' + _classId].push(_id);
			}else{
				RecipientCompareData['g' + _gradeId]['c' + _classId].splice(RecipientCompareData['g' + _gradeId]['c' + _classId].indexOf(_id), 1);
			}
			noticeRecipient.isAllClassStudents(_gradeId, _classId);
			/* 是否所有学生全选 */
			noticeRecipient.isAllStudents();
		}).delegate('input.j-class-i', 'change', function(){
			var $this = $(this), _dataGroup = $this.val().split('_'), _gradeId = _dataGroup[0], _classId = _dataGroup[1];
			if($this.is(':checked')){
				$('input.j-stu-i[data-id=' + _gradeId + '_' + _classId + ']').each(function(){
					var _$this = $(this), _id = _$this.val();
					if(!_$this.is(':checked')){
						_$this.attr('checked', 'checked');
						RecipientCompareData['g' + _gradeId]['c' + _classId].push(_id);
					}
				});
			}else{
				$('input.j-stu-i[data-id=' + _gradeId + '_' + _classId + ']').each(function(){
					$(this).removeAttr('checked');
					RecipientCompareData['g' + _gradeId]['c' + _classId] = [];
				});
			}
		}).delegate('input.j-teacher-i', 'change', function(){
			var $this = $(this), _id = $this.val(),
				$allChecked = $this.parents('ul').find('input:checked');
			if($this.is(':checked')){
				RecipientCompareData.teacher.push(_id);
			}else{
				RecipientCompareData.teacher.splice(RecipientCompareData.teacher.indexOf(_id), 1);
			}
			/* 如果班级全部人员都全选，则班级名称全选 */
			noticeRecipient.isAllTeacher();
		}).delegate('input.j-allteacher', 'click', function(){
			var $this = $(this);
			if($this.is(':checked')){
				$('input.j-teacher-i').each(function(){
					var _$this = $(this), _id = _$this.val();
					if(!_$this.is(':checked')){
						_$this.attr('checked', 'checked');
						RecipientCompareData.teacher.push(_id);
					}
				});
			}else{
				$('input.j-teacher-i').each(function(){
					var _$this = $(this), _id = _$this.val();
					_$this.removeAttr('checked');
				});
				RecipientCompareData.teacher = [];
			}
		}).delegate('input.j-allStudents', 'click', function(){
			var $this = $(this);
			if($this.is(':checked')){
				$('input.j-stu-i').each(function(){
					var _$this = $(this), _id = _$this.val(), _data = _$this.attr('data-id'), dataAr = _data.split('_'),
						_gradeId = dataAr[0], _classId = dataAr[1];
					if(!_$this.is(':checked')){
						_$this.attr('checked', 'checked');
						RecipientCompareData['g' + _gradeId]['c' + _classId].push(_id);
					}
				});
				$('input.j-class-i').each(function(){
					$(this).attr('checked', 'checked');
				})
			}else{
				$('input.j-stu-i').each(function(){
					var _$this = $(this), _id = _$this.val();
					_$this.removeAttr('checked');
				});
				$('input.j-class-i').each(function(){
					$(this).removeAttr('checked');
				})
				for(var i in RecipientCompareData){
					if(RecipientCompareData.hasOwnProperty(i) && i !== 'teacher'){
						for(var j in RecipientCompareData[i]){
							if(RecipientCompareData[i].hasOwnProperty(j)){
								RecipientCompareData[i][j] = [];
							}
						}
					}
				}
			}
		});
		/* 添加 接收人 */
		$('.j-addRecipientData').bind('click', function(){
			_self.addRecipient();
			_self.closeClassGroup();
		});
		/* 取消添加接收人*/
		$('.j-cancelRecipientData').bind('click', function(){
			_self.closeClassGroup();
		});
	});




	/* 触发图片添加事件 */
	var addFilesObj = {
		ajaxFnType: {
			image: {
				name: '图片',
				addMethod: function(imgUrl, realName){
					var index_imgurl = submitTransferData.imgurl.length,
						index_realName = submitTransferData.imgRealName.length;
					submitTransferData.imgurl.push(imgUrl);
					submitTransferData.imgRealName.push(realName);
					/* 渲染缩略图 */
					$elements.$AccessoryList.append('<li class="j-fupload showImg"><span class="name">' + realName + '</span><a data-item="imgurl" data-nameItem ="imgRealName"  data-id="' + index_imgurl + '" class="close" href="javascript:void(0)"></a><div class="showImgContainer"><img src="' + imgUrl + '"/></div></li>');
				},
				bigResult: 'bigimageError',
				bigResultSize: '2M'
			},
			file: {
				name: '附件',
				addMethod: function(fileUrl, realName){
					var index_file = submitTransferData.file.length,
						index_fileRealName = submitTransferData.fileRealName.length;
					submitTransferData.file.push(fileUrl);
					submitTransferData.fileRealName.push(realName);
					/* 渲染 */
					$elements.$AccessoryList.append('<li class="j-fupload attachment"><span class="name">' + realName + '</span><a data-item="file"  data-nameItem ="fileRealName" data-id="' + index_file + '" class="close" href="javascript:void(0)"></a></li>');
				},
				bigResult: 'bigFilesError',
				bigResultSize: '30M'
			}
		},
		ajaxFormFn: function($form, url, type){
			var result = null, _self = this;
			$form.ajaxSubmit({
				url: url,
				type: 'POST',
				async: false,
				success: function(resData){
					if(typeof resData === 'string'){
						if(resData === 'bigimageError' || resData === 'bigFilesError'){
							result = resData;
						}else{
							result = JSON.parse(resData)
						}
					}else{
						result = resData;
					}
					/* 返回的对象如果是数组，表示正确的返回*/
					if(result instanceof  Array){
						/* 暂存 */
						var fileurl = result[0].fileurl,
							_realName = result[0].realName;
						_self.ajaxFnType[type].addMethod(fileurl, _realName);
					}else{
						/*  bigimageError 图片过大，其他直接打印 */
						if(result === _self.ajaxFnType[type].bigResult){
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning" ><h2> 上传' + _self.ajaxFnType[type].name + '过大<h2><p>上传' + _self.ajaxFnType[type].name + '大小应该在' + _self.ajaxFnType[type].bigResultSize + '内</p></div>',
								titleBar: false,
								width: 360,
								height: 240
							});
						}else{
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning" ><div class="content"><h2>' + result + '</h3></div></div>',
								titleBar: false,
								width: 360,
								height: 240
							});
						}
						$elements.$photoFile.val('')
					}
				}
			});
		},
		init: function(){
			if(editData && editData.imgurl && editData.realimgurl){
				var iAr = editData.imgurl.split(';'),
					inameAr = editData.realimgurl.split(';');
				var imgGroup = [], imgNameGroup = [];
				for(var i_i in iAr){
					if(!iAr.hasOwnProperty(i_i)) continue;
					if(iAr[i_i] !== '' && inameAr[i_i] !== ''){
						imgGroup.push(iAr[i_i]);
						imgNameGroup.push(inameAr[i_i]);
					}
				}
				for(var if_i in imgGroup){
					if(!imgGroup.hasOwnProperty(if_i)) continue;
					this.ajaxFnType.image.addMethod(imgGroup[if_i], imgNameGroup[if_i]);
				}
			}
			if(editData && editData.file && editData.realfile){
				var fAr = editData.file.split(';'),
					fnameAr = editData.realfile.split(';');
				var FilesGroup = [], FilesNameGroup = [];
				for(var f_i in fAr){
					if(!fAr.hasOwnProperty(f_i)) continue;
					if(fAr[f_i] !== '' && fnameAr[f_i] !== ''){
						FilesGroup.push(fAr[f_i]);
						FilesNameGroup.push(fnameAr[f_i]);
					}
				}
				for(var ff_i in FilesGroup){
					if(!FilesGroup.hasOwnProperty(ff_i)) continue;
					this.ajaxFnType.file.addMethod(FilesGroup[ff_i], FilesNameGroup[ff_i]);
				}
			}
			this.bindE();
		}
	};
	addFilesObj.bindE = function(){
		var _self = this;
		$elements.$addAccessoryBtn.delegate('a', 'click', function(){
			var $this = $(this);
			//上传图片
			if($this.hasClass('j-addImg')){
				/* 检验是否传满8张 */
				var imgAr = [];
				for(var img_i = 0, imgline = submitTransferData.imgurl.length; img_i < imgline; img_i++){
					if(submitTransferData.imgurl[img_i] !== 0){
						imgAr.push(submitTransferData.imgurl[img_i]);
					}
				}
				if(imgAr.length >= 8){
					ymPrompt.alert({
						message: ' <div class="ym-inContent ym-inContent-warning" ><h2>最多上传8张图片<br/>您已上传了8张照片</h2></div> </div>',
						width: 360,
						height: 240,
						titleBar: false
					});
				}else{
					$elements.$photoFile.click();
				}
				//上传附件
			}else if($this.hasClass('j-addOther')){
				var FileAr = []
				for(var file_i in submitTransferData.file){
					if(submitTransferData.file[file_i] !== 0){
						FileAr.push(submitTransferData.file[file_i]);
					}
				}
				if(FileAr.length >= 2){
					ymPrompt.alert({
						message: '<div class="ym-inContent ym-inContent-warning" ><h2>最多上传2个附件 <br/>您已上传了2个附件</h2></div>',
						width: 360,
						height: 240,
						titleBar: false
					});
				}else{
					$elements.$attachmentFile.click();
				}
			}
		});
		$elements.$photoFile.bind('change', function(){
			var val = $(this).val();
			/* 获取 */
			if(val !== ''){
				var valAr = val.split('.');
				var extension = valAr[valAr.length - 1];
				if(extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'bmp' || extension == 'JPG' || extension == 'PNG' || extension == 'GIF' || extension == 'BMP' || extension == 'JPEG' || extension == 'jpeg'){
					_self.ajaxFormFn($('#fileUpload'), window.globalPath + '/schoolnotice/uploadimage.html', 'image');
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

		$elements.$attachmentFile.bind('change', function(){
			var val = $(this).val();
			/* 获取 */
			if(val !== ''){
				var valAr = val.split('.');
				var extension = valAr[valAr.length - 1];
				if(extension == 'xls' || extension == 'xlsx' || extension == 'docx' || extension == 'doc'){
					_self.ajaxFormFn($('#fileUpload'), window.globalPath + '/schoolnotice/upload.html', 'file');
				}else{
					ymPrompt.alert({
						message: '<div class="ym-inContent ym-inContent-warning" ><h2>上传附件格式不正确</h2><p>请上传doc，docx，xls，xlsx格式的office文件</p></div>',
						titleBar: false,
						width: 420,
						height: 240
					});
					$(this).val('');
				}
			}
		});
		//删除附件
		$elements.$AccessoryList.delegate('a.close', 'click', function(){
			var $this = $(this), _index = $this.attr('data-id'), _type = $this.attr('data-item'), _nameType = $this.attr('data-nameItem');
			submitTransferData[_type][_index] = 0;
			submitTransferData[_nameType][_index] = 0;
			$elements.$photoFile.val('');
			$elements.$attachmentFile.val('');
			$this.parents('li.j-fupload').remove();
		});
	}
	addFilesObj.init();


	$('input[name=sendType]').on('change', function(){
		var $checked = $('input[name=sendType]:checked'), _val = $checked.val(), _items = $checked.attr('data-item');
		//定时显示vs隐藏时间选框
		_val === '1' && _items === '2' ? $elements.$dingshiwrap.show() : $elements.$dingshiwrap.hide();
		//存草稿时短信通知失效
		_val === '0' && _items === '1' ? $elements.$smstype.removeAttr('checked').attr('disabled', 'disabled') : $elements.$smstype.removeAttr('disabled').attr('checked', 'checked')
	});

	/* 掇取时间 */
	$elements.$noticeDate.bind('click', WdatePicker);


	/*  提交 */
	$('.j-submitNotice').bind('click', function(){
		/*  ********数据转化 与 取值 ********* */
		if(editData && editData.id){
			submitData.id = editData.id;
		}

		//获得标题
		submitData.title = $.trim($elements.$noticeTitle.val());
		//接收人（略）
		//******************
		// 发送内容
		submitData.content = $elements.$noticeContent.val();


		// 图片附件
		var imgAr = [], imgNameAr = [];
		for(var img_i in submitTransferData.imgurl){
			if(submitTransferData.imgurl.hasOwnProperty(img_i) && submitTransferData.imgRealName.hasOwnProperty(img_i) && submitTransferData.imgurl[img_i] !== 0 && submitTransferData.imgRealName[img_i] !== 0){
				imgAr.push(submitTransferData.imgurl[img_i]);
				imgNameAr.push(submitTransferData.imgRealName[img_i]);
			}
		}
		submitData.imgurl = imgAr.join(';');
		submitData.realimgurl = imgNameAr.join(';');
		/* 附件文件转化 */
		var FileAr = [], fileNameAr = [];
		for(var file_i in submitTransferData.file){
			if(submitTransferData.file.hasOwnProperty(file_i) && submitTransferData.fileRealName.hasOwnProperty(file_i) && submitTransferData.file[file_i] !== 0 && submitTransferData.fileRealName[file_i] !== 0){
				FileAr.push(submitTransferData.file[file_i]);
				fileNameAr.push(submitTransferData.fileRealName[file_i]);
			}
		}
		submitData.file = FileAr.join(';');
		submitData.realfile = fileNameAr.join(';');

		//sms获取
		submitData.smstype = $elements.$smstype.is(":checked") ? 0 : 1;

		/* 发送类型 */
		var $sendtype = $('input[name=sendType]:checked');
		submitData.sendtype = +$sendtype.val();
		submitData.pubstate = +$sendtype.attr('data-item');


		/*  ********  验证判断 ********* */
		// 错误信息聚合
		var erroMsg = [];

		if(submitData.pubstate != 1){
			// 标题 验证
			if(submitData.title === ''){
				erroMsg.push('标题不能为空');
			}
			if(submitTransferData.titleLen > 50){
				erroMsg.push('标题长度不能大于50个字');
			}

			//接收人
			if(submitData.personStr === ''){
				erroMsg.push('接收人不能为空');
			}

			// 发送内容

			if(submitData.content === '' && submitData.imgurl === '' && submitData.file === ''){
				erroMsg.push('发送内容不能为空');
			}
			if(submitTransferData.contentLen > 5000){
				erroMsg.push('公告内容请勿超过5000字。');
			}

			//定时发送的时间选择
			if(submitData.pubstate == 2){
				
				var _d = $('.j-noticeDate').val(), _h = $('.j-noticeHours').val(), _m = $('.j-noticeMin').val();
				var _dateAr = _d.split('-');
				var sendDate = new Date(_dateAr[0] , _dateAr[1]-1 , _dateAr[2] , _h ,_m ,'00');
				
				if(_d == '' || _h == '' || _m == ''){
					erroMsg.push('请填写发送日期/时/分');
				}else if(sendDate < new Date()){
					erroMsg.push('定时发送日期不能早于现在');
				}else{
					submitData.dtime = _d + ' ' + _h + ':' + _m + ':00.000';
				}
			}
		}else if(submitData.pubstate == 1){
			if(submitData.title !== '' || submitData.content !== '' || submitData.personStr !== '' || submitData.imgurl !== '' || submitData.file !== ''){
				if(submitData.title !== '' && submitTransferData.titleLen > 50){
					erroMsg.push('标题长度不能大于50个字');
				}
				if(submitData.content !== '' && submitTransferData.contentLen > 5000){
					erroMsg.push('公告内容请勿超过5000字。');
				}
			}else{
				erroMsg.push('存草稿的公告，至少有一项不能为空');
			}
		}

		//是否有错误
		if(erroMsg.length > 0){
			$elements.$errorMsg.html(erroMsg.join(';')).fadeIn();
			setTimeout(function(){
				$elements.$errorMsg.fadeOut()
			}, 3000)
		}else{
			$elements.$errorMsg.empty();
			switch(submitData.pubstate){
			case 0:
				returnUrl = 'sendNotice';
				typeText = '确定发送本消息';
				break;
			case 1:
				returnUrl = 'draft';
				typeText = '确定保存为草稿？';
				break;
			case 2:
				returnUrl = 'draft';
				typeText = '确定保存定时发送消息';
				break;
			}
			var ajaxPathUrl = '';
			switch(submitData.noticetype){
			case 0:
				ajaxPathUrl = '/schoolnotice/';
				break;
			case 1:
				ajaxPathUrl = '/classnotice/';
				break;
			}
			var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
				'<h2>' + typeText + '</h2></div>';
			ymPrompt.confirmInfo({
				message: _html,
				width: 360,
				height: 220,
				titleBar: false,
				handler: function(res){
					if(res == 'ok'){
						/*  ymPrompt.close();
						 ymPrompt.win({
						 message: '<div style="height:200px;width:300px;line-height:240px; font-size:24px; text-align: center;">数据提交中... ...</div>',
						 width: 330,
						 height: 250,
						 titleBar: false
						 });*/
						$.ajax({
							url: window.globalPath + '/schoolnotice/save',
							data: submitData,
							type: 'POST',
							dataType: 'json',
							success: function(resMsg){
								ymPrompt.close();
								if(resMsg && resMsg.result == 'success'){
									ymPrompt.succeedInfo({
										width: 360,
										height: 220,
										message: '<div class="ym-inContent ym-inContent-success oneline" > <h2>提交成功！</h2> </div>', titleBar: false, handler: function(){
											location.href = window.globalPath + ajaxPathUrl + returnUrl;
											setTimeout(function(){
												location.href = window.globalPath + ajaxPathUrl + returnUrl;
											}, 3000);
										}
									});
								}else{
									ymPrompt.alert({
										message: '<div class="ym-inContent ym-inContent-warning oneline" > <h2>提交失败</h2></div>', width: 360,
										height: 240, titleBar: false
									})
								}
							}
						});
					}
				}
			});
		}
	});
	/*取消*/
	$('.j-submitCancel').on('click', function(){
		ymPrompt.confirmInfo({
			message: '<div class="ym-inContent ym-inContent-warning oneline" ><h2>是否取消编辑公告?</h2> </div>',
			width: 360,
			height: 220,
			titleBar: false,
			handler: function(res){
				if(res === 'ok'){
					location.href = window.globalPath + '/' + globalNoticeTypeStr + '/sendNotice'
				}
			}
		});
	});
	$('.j-returnList').on('click', function(){
		var _href = $(this).attr('data-href');
		ymPrompt.confirmInfo({
			message: '<div class="ym-inContent ym-inContent-warning " ><h2>确定返回?</h2><p>返回后已填内容将不会保存</p> </div>',
			titleBar: false,
			width: 360,
			height: 220,
			handler: function(res){
				if(res === 'ok'){
					location.href = _href;
				}
			}
		});
	});
});