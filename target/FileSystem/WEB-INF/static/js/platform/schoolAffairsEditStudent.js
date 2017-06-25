/**
 * Document by wangshuyan@chinamobile.com on 2015/12/3 0003.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/base',
		'function': '../common/function',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'My97DatePicker': '../plug/My97DatePicker/WdatePicker',
		'Pagination': '../plug/simplePagination/jquery.simplePagination'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'Pagination': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'My97DatePicker': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'base', 'function', 'ymPrompt', 'Pagination', 'My97DatePicker'], function(jquery){

	var schoolQueryId = getUrlQuery('schoolId') || '',
		gradeQueryId = getUrlQuery('gradeId') || '',
		gradeQueryItem = getUrlQuery('gradeItem') || 0,
		classQueryId = getUrlQuery('classId') || '';

	/* 学校数据模型 */
	var schoolData = null;
	var gradeGroup = null;
	var classGroup = null;
	var isSubmit = true;
	/* 数据模型 */
	var StudentData = {
		schoolId: '',
		gradeId: '',
		classId: '',
		stuNum: '',
		sname: '',
		sex: '男',
		birthday: '',
		cardnumber: '',
		attribute: 1,
		fid1: '',
		fid2: '',
		fname1: '',
		fname2: '',
		frelationship1: '',
		frelationship2: '',
		fmobile1: '',
		fmobile2: '',
		fprofessional1: '',
		fprofessional2: '',
		faddress1: '',
		faddress2: '',
		attendanceCard: '',
		familyCard: ''
	};
	/* dom 节点模型 */
	var $elements = {
		$selectSchool: $('.j-selectui-school'),
		$schoolList: $('.j-schoolList'),
		$selectGradeClass: $('.j-selectui-grade'),
		$selectClass: $('.j-selectui-class'),
		$stNumber: $('.j-stNumber'),
		$stName: $('.j-stName'),
		$stSexy: $('.j-sltSexy'),
		$stBirthday: $('.j-birthday'),
		$stCardNumber: $('.j-stcardnumber'),
		$stStyle: $('.j-stStyle'),
		$fid1: $('.j-fid1'),
		$fid2: $('.j-fid2'),
		$ff1Name: $('.j-ff1Name'),
		$ff1relation: $('.j-ff1relation'),
		$ff1Mobile: $('.j-ff1Mobile'),
		$ff1job: $('.j-ff1job'),
		$ff1Address: $('.j-ff1Address'),
		$ff2Name: $('.j-ff2Name'),
		$ff2relation: $('.j-ff2relation'),
		$ff2Mobile: $('.j-ff2Mobile'),
		$ff2job: $('.j-ff2job'),
		$ff2Address: $('.j-ff2Address'),
		$checkCard: $('.j-checkCard'),
		$intelligences: $('.j-intelligences'),
		$kinship1: $('.j-kinship1'),
		$relations1: $('.j-relations1'),
		$kinship2: $('.j-kinship2'),
		$relations2: $('.j-relations2'),
		$kinship3: $('.j-kinship3'),
		$relations3: $('.j-relations3'),
		$kinship4: $('.j-kinship4'),
		$relations4: $('.j-relations4'),
		$kinship5: $('.j-kinship5'),
		$relations5: $('.j-relations5'),
		$submit: $('.j-submit'),
		$ipt: $('.u-gipt'),
		$alltips: $('.j-alltips')
	};

	function showError($ele, mes){
		$ele.parents('li').find('.j-tips').addClass('erro').html(mes);
	}

	function clearErrorTips($ele){
		$ele.parents('li').find('.j-tips').removeClass('erro').empty();
	}

	/*  获取学校列表 */
	$.ajax({
		url: window.globalPath + '/student/getAll',
		type: 'POST',
		dataType: 'json',
		async: false,
		success: function(resObj){
			if(resObj && resObj.schoolList && resObj.schoolList.length > 0){
				schoolData = resObj.schoolList;
				var schoolList = '';
				for(var i = 0, ilen = schoolData.length; i < ilen; i++){
					schoolList += '<li data-value="' + i + '">' + schoolData[i].schoolName + '</li>'
				}
				$elements.$schoolList.append(schoolList);
			}else{
				alert('没有可以选择的学习');
			}
		}
		,
		error: function(){
			alert('获取学校数据失败');
		}
	});

	var schoolFous = new SelectUi($elements.$selectSchool);
	var gradeFous = new SelectUi($elements.$selectGradeClass);
	var classFocus = new SelectUi($elements.$selectClass);

	var relation1 = new SelectUi($('.j-selectUi-i1'));
	var relation2 = new SelectUi($('.j-selectUi-i2'));
	relation1.bindE();
	relation2.bindE();

	/* 学校选区实例 */
	schoolFous.bindE(function(val){
		gradeGroup = schoolData[val].gradeList;
		/* 获取学校id */
		StudentData.schoolId = schoolData[val].schoolId;
		/* 通过学校选取 确定年级 */
		var gradeList = '';
		for(var j = 0, jlen = gradeGroup.length; j < jlen; j++){
			gradeList += '<li data-value="' + j + '">' + gradeGroup[j].gradeName + '</li>'
		}
		$('.j-gradeList').empty().append(gradeList);
		$('.j-classList').empty();
		gradeFous.reset();
		classFocus.reset();
		StudentData.gradeId = '';
		clearErrorTips($elements.$selectSchool);
	});

	/*  年级选取实例 */
	gradeFous.bindE(function(val){
		classGroup = gradeGroup[val].classList;
		/* 获取年级班级 */
		StudentData.gradeId = gradeGroup[val].gradeId;
		var classList_html = '';
		for(var k = 0, klen = classGroup.length; k < klen; k++){
			classList_html += '<li data-value="' + k + '">' + classGroup[k].className + '</li>'
		}
		$('.j-classList').empty().append(classList_html);
		classFocus.reset();
		StudentData.classId = '';
		clearErrorTips($elements.$selectGradeClass);
	});

	/* 班级选取 */
	classFocus.bindE(function(val){
		StudentData.classId = classGroup[val].id;
		clearErrorTips($elements.$selectGradeClass);
	});

	/* 单选实例 */
	var sexSelect = new ChooseIpt($elements.$stSexy);
	sexSelect.init({
		hasChosed: '男',
		choseType: 'radio',
		bindECallback: function(){
			StudentData.sex = sexSelect.data;
		}
	});

	/* 学生生日 掇取时间 */
	$elements.$stBirthday.on('click', WdatePicker);


	var stType = new ChooseIpt($elements.$stStyle);
	stType.init({
		hasChosed: '1',
		choseType: 'radio',
		bindECallback: function(){
			StudentData.attribute = stType.data;
		}
	});


	/* 修改 */
	if(window.userInfo.id){
		$.ajax({
			url: window.globalPath + '/student/' + window.userInfo.id + '/view',
			type: 'POST',
			data: {id: window.userInfo.id},
			dataType: 'json',
			async: false,
			success: function(resObj){
				var schooindex = 0, gradeIndex = 0, classIndex = 0;
				for(var sci = 0, sclen = schoolData.length; sci < sclen; sci++){
					if(schoolData[sci].schoolId == resObj.schoolId){
						schooindex = sci;
						$elements.$schoolList.find('li[data-value=' + sci + ']').click();
						//gradeGroup = schoolData[sci].gradeList
					}
				}
				schoolFous.init(schooindex);
				//StudentData.schoolId = resObj.schoolId;
				for(var gri = 0, grilen = gradeGroup.length; gri < grilen; gri++){
					if(gradeGroup[gri].gradeId == resObj.gradeId){
						gradeIndex = gri;
						$('.j-gradeList').find('li[data-value=' + gri + ']').click();
						//classGroup = gradeGroup[gri].classList;
					}
				}
				gradeFous.init(gradeIndex);
				//StudentData.gradeId = resObj.gradeId;
				for(var cli = 0, clilen = classGroup.length; cli < clilen; cli++){
					if(classGroup[cli].id == resObj.classId){
						classIndex = cli;
						$('.j-classList').find('li[data-value=' + cli + ']').click();
					}
				}
				classFocus.init(classIndex);

				/* 学号 */
				$elements.$stNumber.val(resObj.stuNum);
				StudentData.stuNum = resObj.stuNum;
				/* 姓名 */
				$elements.$stName.val(resObj.sname);
				StudentData.sname = resObj.sname;
				/* 性别 */
				if(resObj.sex){
					sexSelect.init({hasChosed: resObj.sex});
					StudentData.sex = resObj.sex;
				}else{
					sexSelect.init({hasChosed: '男'});
					StudentData.sex = '男';
				}

				/*  生日 */
				$elements.$stBirthday.val(resObj.birthday);
				StudentData.birthday = resObj.birthday;

				/* 身份证号码 */
				$elements.$stCardNumber.val(resObj.cardnumber);
				StudentData.cardnumber = resObj.cardnumber;


				/* 学生类型 */
				if(resObj.attribute){
					stType.init({hasChosed: resObj.attribute});
					StudentData.attribute = resObj.attribute;
				}else{
					stType.init({hasChosed: '1'});
					StudentData.attribute = '1';
				}

				/* 家长类型1 */
				var _fid1 = resObj.fid1 || '';
				var _fid2 = resObj.fid2 || '';
				$elements.$fid1.attr('data-id', _fid1);
				$elements.$fid2.attr('data-id', _fid2);
				$elements.$ff1Name.val(resObj.fname1 || '');
				$elements.$ff1relation.val(resObj.frelationship1 || '');
				$elements.$ff1relation.prev('input.intotext').val(resObj.frelationship1 || '');
				$elements.$ff1Mobile.val(resObj.fmobile1 || '');
				$elements.$ff1job.val(resObj.fprofessional1 || '');
				$elements.$ff1Address.val(resObj.faddress1 || '');
				/*2*/
				$elements.$ff2Name.val(resObj.fname2 || '');
				$elements.$ff2relation.val(resObj.frelationship2 || '');
				$elements.$ff2relation.prev('input.intotext').val(resObj.frelationship2 || '');
				$elements.$ff2Mobile.val(resObj.fmobile2 || '');
				$elements.$ff2job.val(resObj.fprofessional2 || '');
				$elements.$ff2Address.val(resObj.faddress2 || '');
				StudentData.fname1 = resObj.fname1 || '';
				StudentData.fname2 = resObj.fname2 || '';
				StudentData.frelationship1 = resObj.frelationship1 || '';
				StudentData.frelationship2 = resObj.frelationship2 || '';
				StudentData.fmobile1 = resObj.fmobile1 || '';
				StudentData.fmobile2 = resObj.fmobile2 || '';
				StudentData.fprofessional1 = resObj.fprofessional1 || '';
				StudentData.fprofessional2 = resObj.fprofessional2 || '';
				StudentData.faddress1 = resObj.faddress1 || '';
				StudentData.faddress2 = resObj.faddress2 || '';
				StudentData.familyCard = resObj.familyCard;
				StudentData.attendanceCard = resObj.attendanceCard || '';
				$elements.$checkCard.val(resObj.attendanceCard || '');
				/* $elements.$intelligences */
				if(resObj.familyCard){
					var familyCardArray = resObj.familyCard.split(';');
					for(var fi = 0, filen = familyCardArray.length; fi < filen; fi++){
						var ffar = familyCardArray[fi].split(',');
						$('.j-kinship' + (+fi + 1)).val(ffar[0]);
						$('.j-relations' + (+fi + 1)).val(ffar[1]);
					}
				}
			},
			error: function(){
				ymPrompt.alert({
					message: '未能获取到用户数据，将返回列表', titleBar: false, handler: function(){
						location.href = window.globalPath + '/student/stuList';
					}
				});
				setTimeout(function(){
					location.href = window.globalPath + '/student/stuList';
				}, 3000)
			}
		});
	}


	/*  事件绑定与业务逻辑 */
	(function(){

		var _ajaxUrl, typeText;
		if(window.userInfo.id){
			_ajaxUrl = window.globalPath + '/student/' + window.userInfo.id + '/update';
			typeText = '修改'
		}else{
			_ajaxUrl = window.globalPath + '/student/create';
			typeText = '添加'
		}

		/* 学号查重 */
		function ajaxRresult(val){
			var result = false;
			$.ajax({
				url: window.globalPath + '/student/checkStunum',
				data: val,
				dataType: 'json',
				type: 'POST',
				async: false,
				success: function(resmsg){
					if(resmsg){
						if(resmsg.msg && resmsg.msg == 'exists'){
							result = true
						}else if(resmsg.msg && resmsg.msg == 'success'){
							result = false
						}
					}else{
						alert('数据获取失败');
					}
				},
				error: function(){
					alert('数据获取失败');
				}
			});
			return result;
		}

		var formCheckUtil = {
			/* 学号验证 */
			studentNumber: function(val){
				var returnResult = {result: true, msg: ''};
				switch(true){
				case  val == '':
					returnResult.result = false;
					returnResult.msg = '请填写学生学号';
					break;
				case checkUtil.checkSpecialChar(val):
					returnResult.result = false;
					returnResult.msg = '学生学号不能含有特殊字符';
					break;
				case isNaN(val):
					returnResult.result = false;
					returnResult.msg = '学生学号必须是纯数字';
					break;
				case val.length > 15:
					returnResult.result = false;
					returnResult.msg = '学生学号长度不能大于15个字符';
					break;
					/*case ajaxRresult(val):
					 returnResult.result = false;
					 returnResult.msg = '学生学号已存在';
					 break;*/
				}
				return returnResult;
			},
			/* 学生姓名验证 */
			studentName: function(val){
				var returnResult = {result: true, msg: ''};
				switch(true){
				case  val == '':
					returnResult.result = false;
					returnResult.msg = '请填写学生姓名！';
					break;
				case checkUtil.checkSpecialChar(val):
					returnResult.result = false;
					returnResult.msg = '学生姓名不能含有特殊字符！';
					break;
				case !checkUtil.checkCharSize(val, 0, 15):
					returnResult.result = false;
					returnResult.msg = '学生姓名请勿超过15个字！';
					break;
				}
				return returnResult;
			}
		};


		$elements.$ipt.bind({
			'focus': function(){
				clearErrorTips($(this))
			}
		});

		$elements.$submit.bind(
			'click', function(){
				//重置说有错误提示
				$('.j-tips').removeClass('erro').empty();
				$elements.$alltips.empty().hide();
				/* 检查 学校 、年级、班级*/
				var _schoolResult = true;
				if(!StudentData.schoolId){
					showError($elements.$selectSchool, '请选择学校');
					_schoolResult = false;
				}else if(!(StudentData.gradeId)){
					showError($elements.$selectGradeClass, '请选择年级');
					_schoolResult = false;
				}else if(!(StudentData.classId)){
					showError($elements.$selectGradeClass, '请选择班级');
					_schoolResult = false;
				}


				/* 学号验证 */
				var _stNumber = $.trim($elements.$stNumber.val()),
					_stNumberResultObj = formCheckUtil.studentNumber(_stNumber),
					_stNumberResult = _stNumberResultObj.result;
				if(_stNumberResult){
					StudentData.stuNum = _stNumber;
				}else{
					showError($elements.$stNumber, _stNumberResultObj.msg);
				}

				/* 学生姓名验证 */
				var _stName = $.trim($elements.$stName.val()),
					_stNameResultObj = formCheckUtil.studentName(_stName),
					_stNameResult = _stNameResultObj.result;
				if(_stNameResult){
					StudentData.sname = _stName;
				}else{
					showError($elements.$stName, _stNameResultObj.msg);
				}
				/* 学生生日 */
				var _stBirthday = $.trim($elements.$stBirthday.val()),
					_stBirthdayResult = true;
				if(_stBirthday == ''){
					showError($elements.$stBirthday, '请填写学生生日');
					_stBirthdayResult = false;
				}else{
					var _stBirthdayGetTime = new Date(_stBirthday)
					if(isNaN(_stBirthdayGetTime)){ // IE8时间格式不准的bug修复
						var _stBirthdayAr = _stBirthday.split('-');
						_stBirthdayGetTime = new Date(_stBirthdayAr[0], _stBirthdayAr[1] - 1, _stBirthdayAr[2]);
					}
				}

				if(_stBirthdayGetTime > new Date()){
					showError($elements.$stBirthday, '学生生日不能超过今天');
					_stBirthdayResult = false;
				}

				if(_stBirthdayResult){
					StudentData.birthday = _stBirthday;
				}

				/* 学生身份证号码的提交 */
				var _stCardNumber = $.trim($elements.$stCardNumber.val()),
					_stCardNumberResult = true;
				if(_stCardNumber == ''){
					showError($elements.$stCardNumber, '请填写学生身份证号码！');
					_stCardNumberResult = false;
				}else if(!checkUtil.checkCardNumber(_stCardNumber)){
					showError($elements.$stCardNumber, '请填写正确格式的身份证号码！');
					_stCardNumberResult = false;
				}

				if(_stCardNumberResult){
					StudentData.cardnumber = _stCardNumber;
				}

				/* 男女性别 */
				/*学生类型*/
				/*家长姓名*/
				var _ff1Name = $.trim($elements.$ff1Name.val()),
					_ff1NameResult = true;
				if(_ff1Name){
					if(checkUtil.checkCharSize(_ff1Name, 0, 15) && !checkUtil.checkSpecialChar(_ff1Name)){
						StudentData.fname1 = _ff1Name;
					}else{
						showError($elements.$ff1Name, '家长姓名请勿包含特殊字符，并且勿超过15个字');
						_ff1NameResult = false;
					}
				}


				var _ff2Name = $.trim($elements.$ff2Name.val()), _ff2NameResult = true;
				if(_ff2Name){
					if(checkUtil.checkCharSize(_ff2Name, 0, 15) && !checkUtil.checkSpecialChar(_ff2Name)){
						StudentData.fname2 = _ff2Name;
					}else{
						showError($elements.$ff2Name, '家长姓名请勿包含特殊字符，并且勿超过15个字');
						_ff2NameResult = false;
					}
				}

				var _ff1Relation = $.trim($elements.$ff1relation.val());
				if(_ff1Relation){
					StudentData.frelationship1 = _ff1Relation;
				}

				var _ff2Relation = $.trim($elements.$ff2relation.val());
				if(_ff2Relation){
					StudentData.frelationship2 = _ff2Relation;
				}



				var _ff1job = $.trim($elements.$ff1job.val()),
					_ff1jobResult = true;
				if(_ff1job){
					if(checkUtil.checkCharSize(_ff1job, 0, 15)){
						StudentData.fprofessional1 = _ff1job
					}else{
						showError($elements.$ff1job, '请勿超过15个字；');
						_ff1jobResult = false;
					}
				}

				var _ff2job = $.trim($elements.$ff2job.val()), _ff2jobResult = true;
				if(_ff2job){
					if(checkUtil.checkCharSize(_ff2job, 0, 15)){
						StudentData.fprofessional2 = _ff2job;
					}else{
						showError($elements.$ff2job, '请勿超过15个字；');
						_ff2jobResult = false;
					}
				}


				var _ff1addr = $.trim($elements.$ff1Address.val()), _ff1addrResult = true;
				if(_ff1addr){
					if(checkUtil.checkCharSize(_ff1addr, 0, 50)){
						StudentData.faddress1 = _ff1addr
					}else{
						showError($elements.$ff1Address, '请勿超过50个字；');
						_ff1addrResult = false;
					}
				}


				var _ff2addr = $.trim($elements.$ff2Address.val()), _ff2addrResult = true;
				if(_ff2addr){
					if(checkUtil.checkCharSize(_ff2addr, 0, 50)){
						StudentData.faddress2 = _ff2addr
					}else{
						showError($elements.$ff2Address, '请勿超过50个字；');
						_ff2addrResult = false;
					}
				}



				var _ff1mobile = $.trim($elements.$ff1Mobile.val()), _ff1mobileResult = true;
				if(_ff1mobile){
					if(checkUtil.checkPhoneNumber(_ff1mobile)){
						StudentData.fmobile1 = _ff1mobile + '';
					}else{
						showError($elements.$ff1Mobile, '家长手机号码格式不正确');
						_ff1mobileResult = false;
					}
				}else{
					showError($elements.$ff1Mobile, '家长手机号码不能为空');
					_ff1mobileResult = false;
				}

				var _ff2mobile = $.trim($elements.$ff2Mobile.val()),
					_ff2mobileResult = true;
				StudentData.fmobile2 = _ff2mobile + '';
				if(_ff2Name !== '' || _ff2Relation !== '' || _ff2job !== '' || _ff2addr !== ''){
					if(_ff2mobile !== ''){
						if(!checkUtil.checkPhoneNumber(_ff2mobile)){
							showError($elements.$ff2Mobile, '家长手机号码格式不正确');
							_ff2mobileResult = false;
						}
					}else{
						showError($elements.$ff2Mobile, '家长手机号码不能为空');
						_ff2mobileResult = false;
					}
				}

				if(_ff1mobile !== '' && _ff2mobile !== '' && _ff1mobile == _ff2mobile){
					showError($elements.$ff2Mobile, '请勿与家长手机号码1重复');
					_ff2mobileResult = false;
				}


				/* 考勤卡号 */
				var _attendance_card = $.trim($elements.$checkCard.val()),
					_attendance_cardResult = true;
				StudentData.attendanceCard = _attendance_card;
				if(_attendance_card && checkUtil.checkSpecialChar(_attendance_card)){
					_attendance_cardResult = false;
					showError($elements.$checkCard, '考勤卡号请勿包含特殊字符！');
				}
				if(_attendance_card && _attendance_card.length > 15){
					showError($elements.$checkCard, '考勤卡号不能超过15个字符！');
				}

				/* 亲情号码 */
				var familyCard = '';
				var kpgroup = [
					{k: $.trim($('.j-kinship1').val()), kp: $.trim($('.j-relations1').val())},
					{k: $.trim($('.j-kinship2').val()), kp: $.trim($('.j-relations2').val())},
					{k: $.trim($('.j-kinship3').val()), kp: $.trim($('.j-relations3').val())},
					{k: $.trim($('.j-kinship4').val()), kp: $.trim($('.j-relations4').val())},
					{k: $.trim($('.j-kinship5').val()), kp: $.trim($('.j-relations5').val())},
					{k: 0, kp: 0}
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
					StudentData.familyCard = familyCard;
				}else{
					showError($('.j-kinship5'), _kperroMsg);
				}

				if($elements.$fid1.attr('data-id')){
					StudentData.fid1 = $elements.$fid1.attr('data-id');
				}
				if($elements.$fid2.attr('data-id')){
					StudentData.fid2 = $elements.$fid2.attr('data-id');
				}


				if(_schoolResult && _stNameResult && _stBirthdayResult && _stCardNumberResult && _stNumberResult && _attendance_cardResult && _ff2addrResult && _ff1addrResult && _ff2jobResult && _ff1jobResult && _ff2mobileResult && _ff1mobileResult && _ff2NameResult && _ff1NameResult && isSubmit){
					ymPrompt.confirmInfo({
						message: '确定' + typeText + '学生信息！', titleBar: false, handler: function(resMsg){
							if(resMsg == 'ok'){
								$.ajax({
									url: _ajaxUrl,
									data: StudentData,
									dataType: 'json',
									type: 'POST',
									async: false,
									success: function(resmsg){
										var fail_html = '';
										$elements.$alltips.empty();
										if(resmsg && resmsg.msg == 'success'){
											$elements.$alltips.hide();
											ymPrompt.succeedInfo({
												message: '该学生' + typeText + '成功', titleBar: false, handler: function(){
													location.href = window.globalPath + '/student/stuList';
												}
											});
											setTimeout(function(){
												location.href = window.globalPath + '/student/stuList';
											}, 2000);
										}else if(resmsg && resmsg.msg == 'fail'){
											for(var i in resmsg.errorList){
												fail_html += resmsg.errorList[i]['error' + i] + '；'
											}
											$elements.$alltips.append(fail_html).show();
										}else if(resmsg && resmsg.msg == 'error'){
											alert(typeText + '失败！');
										}else{
											fail_html = resmsg.msg
											$elements.$alltips.append(fail_html).show();
										}
									}, error: function(){
										alert(typeText + '失败！');
									}
								})
							}
						}
					})
				}else{
					ymPrompt.alert({message: '存在错误的填写，请返回修改', width: 380, titleBar: false});
				}
			});

		$('.j-submitCancle').click(function(){
			ymPrompt.confirmInfo({
				message: '是否取消' + typeText + '该学生?', titleBar: false, handler: function(res){
					if(res == 'ok'){
						location.href = window.globalPath + '/student/stuList';
					}
				}
			});
		})
	})();
});