/**
 * Document by wangshuyan@chinamobile.com on 2015/12/4 0004.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/base',
		'function': '../common/function',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'Pagination': '../plug/simplePagination/jquery.simplePagination'
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


	/* 教师数据模型 */
	var TeacherData = {
		schoolId: '',
		workNumber: '',
		name: '',
		mobile: '',
		seniority: '',
		characteristics: '',
		attendanceCard: '',
		audit: '',
		smsType: '',
		familyCard: ''
	};

	var TeacherIsSubmit = true, submitText = '';

	var submitUrl = '', _postData = null;
	if(+window.userInfo.id){
		submitUrl = '/teacher/' + window.userInfo.id + '/update';
		submitText = '修改';
		_postData = TeacherData;
	}else{
		submitUrl = '/teacher/create';
		submitText = '新增';
		_postData = TeacherData;
	}

	/* dom 节点模型 */
	var $elements = {
		$ipt: $('.u-gipt'),
		$schoolList: $('.j-schoolList'),
		$submit: $('.j-submit'),
		$teacherNumber: $('.j-tcNumber'),
		$teacherName: $('.j-tcName'),
		$teacherMobile: $('.j-tcMobile'),
		$teacherDuration: $('.j-tcduration'),
		$teacherStyle: $('.j-tcStyle'),
		$teacherAttendance: $('.j-tcAttendance'),
		$teacherKinship: $('.j-kinship1')
	};

	function showError($ele, mes){
		$ele.parents('li').find('.j-tips').addClass('erro').html(mes);
	}

	function clearErrorTips($ele){
		$ele.parents('li').find('.j-tips').removeClass('erro').empty();
	}


	var schoolIdQuery = getUrlQuery('schoolId');

	/*  获取学校列表 */
	$.ajax({
		url: window.globalPath + '/schoolAffairs/getAllSchool',
		type: 'POST',
		dataType: 'json',
		async: false,
		success: function(resObj){
			if(resObj && resObj.schoolList && resObj.schoolList.length > 0){
				var schoolData = resObj.schoolList;
				var schoolList = '';
				for(var i = 0, ilen = schoolData.length; i < ilen; i++){
					schoolList += '<li data-value="' + schoolData[i].id + '">' + schoolData[i].referredName + '</li>'
				}
				$elements.$schoolList.append(schoolList);
			}else{
				alert('没有可以选择的学习');
			}
		}, error: function(){
			alert('获取学校数据失败');
		}
	});

	/* 学校选择下拉选择 */
	var schoolFous = new SelectUi($('.j-selectui-school'));
	if(schoolIdQuery){
		schoolFous.init(schoolIdQuery);
		TeacherData.schoolId = schoolIdQuery;
	}
	schoolFous.bindE(function(val){
		clearErrorTips($elements.$schoolList);
		TeacherData.schoolId = val
	});

	/* 发送是否需要审核单选实例 */
	var tcMsgCheck = new ChooseIpt($('.j-sltMsgCheck'));
	tcMsgCheck.init({
		hasChosed: '是',
		choseType: 'radio',
		initCallback: function(){
			TeacherData.audit = tcMsgCheck.data;
		},
		bindECallback: function(){
			TeacherData.audit = tcMsgCheck.data;
		}
	});

	/* 接收短信类型 多选 */
	var tcMsgType = new ChooseIpt($('.j-sltMsgType'));
	tcMsgType.init({
		hasChosed: '办公短信',
		choseType: 'checkbox',
		initCallback: function(){
			TeacherData.smsType = tcMsgType.data.join(',');
		},
		bindECallback: function(){
			TeacherData.smsType = tcMsgType.data.join(',');
		}
	});

	/* 获取修改数据 */
	if($.trim(window.userInfo.id) !== ''){
		$.ajax({
			url: window.globalPath + '/teacher/' + window.userInfo.id + '/view',
			type: 'POST',
			data: {id: window.userInfo.id},
			dataType: 'json',
			async: false,
			success: function(resData){
				var resObj = resData.teacher;
				/* 获取教师学校 */
				schoolFous.reset(resObj.schoolId);
				TeacherData.schoolId = resObj.schoolId;
				/*  获取教师工号 */
				$elements.$teacherNumber.val(resObj.workNumber);
				TeacherData.workNumber = resObj.workNumber;
				/* 获取教师姓名 */
				$elements.$teacherName.val(resObj.name);
				TeacherData.name = resObj.name;
				/* mobile  */
				$elements.$teacherMobile.val(resObj.mobile);
				TeacherData.mobile = resObj.mobile;
				//seniority: '',
				$elements.$teacherDuration.val(resObj.seniority);
				TeacherData.seniority = resObj.seniority;
				//characteristics: '',
				$elements.$teacherStyle.val(resObj.characteristics);
				TeacherData.characteristics = resObj.characteristics;
				//attendanceCard: '',
				$elements.$teacherAttendance.val(resObj.attendanceCard);
				TeacherData.attendanceCard = resObj.attendanceCard;
				//audit: '',
				var _audit = resObj.audit || '是';
				tcMsgCheck.init({hasChosed: _audit});
				TeacherData.audit = _audit;
				//smsType: '',
				var _smsType = resObj.smsType || '办公短信';
				tcMsgType.init({hasChosed: _smsType});
				TeacherData.smsType = _smsType;
				//familyCard: ''
				TeacherData.familyCard = resObj.familyCard;
				var familyCardArray = resObj.familyCard.split(';');
				for(var fi = 0, filen = familyCardArray.length; fi < filen; fi++){
					var ffar = familyCardArray[fi].split(',');
					$('.j-kinship' + (+fi + 1)).val(ffar[0]);
					$('.j-relations' + (+fi + 1)).val(ffar[1]);
				}

			},
			error: function(){
				ymPrompt.alert({
					message: '未能获取到用户数据，将返回列表', titleBar: false, handler: function(){
						location.href = window.globalPath + '/teacher/teacherList?schoolId=' + TeacherData.schoolId;
					}
				});
				setTimeout(function(){
					location.href = window.globalPath + '/teacher/teacherList?schoolId=' + TeacherData.schoolId;
				}, 3000)
			}
		});
	}


	var formCheckUtil = {
		teacherNumber: function(val){
			var returnResult = {result: true, msg: ''};
			switch(true){
			case val === '':
				returnResult.result = false;
				returnResult.msg = '请填写教师工号';
				break;
			case isNaN(val):
				returnResult.result = false;
				returnResult.msg = '教师工号必须为数字';
				break;
			case val.length > 15:
				returnResult.result = false;
				returnResult.msg = '教师工号长度不能超过15个字符';
				break;
			}
			return returnResult
		},
		teacherName: function(val){
			var returnResult = {result: true, msg: ''};
			switch(true){
			case val === '':
				returnResult.result = false;
				returnResult.msg = '请填写教师姓名';
				break;
			case checkUtil.checkSpecialChar(val):
				returnResult.result = false;
				returnResult.msg = '教师姓名不能含有特殊字符';
				break;
			case !checkUtil.checkCharSize(val, 0, 15):
				returnResult.result = false;
				returnResult.msg = '教师姓名长度过长';
				break;
			}
			return returnResult
		},
		teacherMobile: function(val){
			var returnResult = {result: true, msg: ''};
			switch(true){
			case val === '':
				returnResult.result = false;
				returnResult.msg = '请填写教师电话号码';
				break;
			case !checkUtil.checkPhoneNumber(val):
				returnResult.result = false;
				returnResult.msg = '教师电话号码格式不正确';
				break;
			}
			return returnResult
		},
		teacherAuration: function(val){
			var returnResult = {result: true, msg: ''};
			switch(true){
			case val !== '' && checkUtil.checkSpecialChar(val):
				returnResult.result = false;
				returnResult.msg = '教师教学时长不能含有特殊字符';
				break;
			case !checkUtil.checkCharSize(val, 0, 15):
				returnResult.result = false;
				returnResult.msg = '教师教学时长不能超过15个字符';
				break;
			}

			return returnResult
		},
		teacherStyle: function(val){
			var returnResult = {result: true, msg: ''};
			switch(true){
			case val !== '' && !checkUtil.checkCharSize(val, 0, 100):
				returnResult.result = false;
				returnResult.msg = '教师教学风格不能超过100个字';
				break;
			}
			return returnResult
		},
		teacherAttendance: function(val){
			var returnResult = {result: true, msg: ''};
			/* switch(true){
			 case val === '':
			 returnResult.result = false;
			 returnResult.msg = '请填写教师考勤卡号';
			 break;
			 }*/
			return returnResult
		},
		teacherKinShip: function(val, relation){
			var returnResult = {result: true, msg: ''};
			if(val){
				switch(true){
				case !checkUtil.checkPhoneNumber(val):
					returnResult.result = false;
					returnResult.msg = '亲情号码格式错误';
					break;
				case  !relation:
					returnResult.result = false;
					returnResult.msg = '请填写亲情号码添加的关系';
				}
			}
			return returnResult
		}
	};

	$elements.$ipt.bind({
		'focus': function(){
			clearErrorTips($(this));
		}
	});


	/*****  提交表单  ******/
	$elements.$submit.bind('click', function(){
		/* 获取学校名称 */
		if(TeacherData.schoolId == ''){
			showError($elements.$schoolList, '请选择学校！')
		}

		/* 工号 */
		var _teacherNumber = $.trim($elements.$teacherNumber.val()),
			_teacherNumberResultObj = formCheckUtil.teacherNumber(_teacherNumber),
			_teacherNumberResult = _teacherNumberResultObj.result;

		if(_teacherNumberResult){
			TeacherData.workNumber = _teacherNumber;
		}else{
			showError($elements.$teacherNumber, _teacherNumberResultObj.msg);
		}

		/* 教师姓名 */
		var _teacherName = $.trim($elements.$teacherName.val()),
			_teacherNameResultObj = formCheckUtil.teacherName(_teacherName),
			_teacherNameResult = _teacherNameResultObj.result;

		if(_teacherNameResult){
			TeacherData.name = _teacherName;
		}else{
			showError($elements.$teacherName, _teacherNameResultObj.msg);
		}

		/* 手机号码 */
		var _teacherMobile = $.trim($elements.$teacherMobile.val()),
			_teacherMobileResultObj = formCheckUtil.teacherMobile(_teacherMobile),
			_teacherMobileResult = _teacherMobileResultObj.result;
		if(_teacherMobileResult){
			TeacherData.mobile = _teacherMobile;
		}else{
			showError($elements.$teacherMobile, _teacherMobileResultObj.msg);
		}

		/* 教学时长 */
		var _teacherDuration = $.trim($elements.$teacherDuration.val()),
			_teacherDurationResultObj = formCheckUtil.teacherAuration(_teacherDuration),
			_teacherDurationResult = _teacherDurationResultObj.result;
		if(_teacherDurationResult){
			TeacherData.seniority = _teacherDuration;
		}else{
			showError($elements.$teacherDuration, _teacherDurationResultObj.msg);
		}

		/* 教学风格 */
		var _teacherStyle = $.trim($elements.$teacherStyle.val()),
			_teacherStyleResultObj = formCheckUtil.teacherStyle(_teacherStyle),
			_teacherStyleResult = _teacherStyleResultObj.result;
		if(_teacherStyleResult){
			TeacherData.characteristics = _teacherStyle;
		}else{
			showError($elements.$teacherStyle, _teacherStyleResultObj.msg);
		}

		/* 考勤卡号 */
		var _teacherAttendance = $.trim($elements.$teacherAttendance.val()),
			_teacherAttendanceResultObj = formCheckUtil.teacherAttendance(_teacherAttendance),
			_teacherAttendanceResult = _teacherAttendanceResultObj.result;
		if(_teacherAttendanceResult){
			TeacherData.attendanceCard = _teacherAttendance;
		}else{
			showError($elements.$teacherAttendance, _teacherAttendanceResultObj.msg)
		}

		/* 发送是否需要审核 */
		TeacherData.audit = tcMsgCheck.data;
		/* 接受短信类型*/
		TeacherData.smsType = tcMsgType.data.join(',');
		/* 亲情号码 */
		var familyCard = '';
		var kpgroup = [
			{k: $.trim($('.j-kinship1').val()), kp: $.trim($('.j-relations1').val())},
			{k: $.trim($('.j-kinship2').val()), kp: $.trim($('.j-relations2').val())},
			{k: $.trim($('.j-kinship3').val()), kp: $.trim($('.j-relations3').val())},
			{k: $.trim($('.j-kinship4').val()), kp: $.trim($('.j-relations4').val())},
			{k: $.trim($('.j-kinship5').val()), kp: $.trim($('.j-relations5').val())},
		];

		var _kpresult = true, _kperroMsg = '';

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
		for(var kpi = 0; kpi < 5; kpi++){
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
			TeacherData.familyCard = familyCard;
		}else{
			showError($('.j-kinship5'), _kperroMsg);
		}

		if(TeacherData.schoolId && _teacherAttendanceResult && _teacherDurationResult && _teacherMobileResult && _teacherNameResult && _teacherNumberResult && _teacherStyleResult && _kpresult && TeacherIsSubmit){
			ymPrompt.confirmInfo({
				message: '确定' + submitText + '教师信息！', titleBar: false, handler: function(resMsg){
					if(resMsg == 'ok'){
						$.ajax({
							url: window.globalPath + submitUrl,
							data: _postData,
							dataType: 'json',
							type: 'POST',
							async: false,
							success: function(resmsg){
								var fail_html;
								if(resmsg && resmsg.msg == 'success'){
									$('.j-alltips').hide();
									ymPrompt.succeedInfo({
										message: '该教师' + submitText + '成功', titleBar: false, handler: function(){
											location.href = window.globalPath + '/teacher/teacherList?schoolId=' + TeacherData.schoolId;

											setTimeout(function(){
												location.href = window.globalPath + '/teacher/teacherList?schoolId=' + TeacherData.schoolId;
											}, 2000)
										}
									})
								}else if(resmsg && resmsg.msg == 'fail'){
									for(var i in resmsg.errorList){
										fail_html += resmsg.errorList[i]['error' + i] + '<br />'
									}
									$('.j-alltips').html(fail_html).show();
								}else if(resmsg && resmsg.msg == 'error'){
									alert('添加失败！');
								}else{
									fail_html = resmsg.msg
									$('.j-alltips').html(fail_html).show();
								}
							}, error: function(){
								alert('添加失败！');
							}
						});
					}
				}
			});
		}
	});

	$('.j-submitCancle').click(function(){
		ymPrompt.confirmInfo({
			message: '是否取消' + submitText + '该教师?', titleBar: false, handler: function(res){
				if(res == 'ok'){
					location.href = window.globalPath + '/teacher/teacherList';
				}
			}
		});
	})
});