/**
 * Document by wangshuyan@chinamobile.com on 2015/12/3 0003.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/baseTeacher',
		'mypannel': '../common/teacherSideBar',
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
		'My97DatePicker': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'base', 'function', 'ymPrompt', 'Pagination', 'My97DatePicker', 'mypannel'], function(jquery){


	var schoolQueryId = getUrlQuery('schoolId') || '',
		gradeQueryId = getUrlQuery('gradeId') || '',
		gradeQueryItem = getUrlQuery('gradeItem') || 0,
		classQueryId = getUrlQuery('classId') || '';

	/* 学校数据模型 */
	var gradeGroup = {};

	var isSubmit = true;
	/* 数据模型 */
	var StudentData = {
		schoolId: '',
		gradeId: '',
		classId: '',
		stuNum: '',
		sname: '',
		sex: '',
		birthday: '',
		cardnumber: '',
		attribute: '',
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
	};

	var compareData = {}
	/* dom 节点模型 */
	var $elements = {
		$schoolName: $('.j-schoolName'),
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
		$submit: $('.j-submit'),
		$ipt: $('.u-gipt'),
		$radio: $('input:radio'),
		$alltips: $('.j-alltips')
	};

	function showError($ele, mes){
		$ele.parents('tr').find('.j-tips').addClass('erro').html(mes);
	}

	function clearErrorTips($ele){
		$ele.parents('tr').find('.j-tips').removeClass('erro').empty();
	}


	//下拉框实例
	var gradeFous = new SelectUi($elements.$selectGradeClass);
	var classFocus = new SelectUi($elements.$selectClass);
	var relation1 = new SelectUi($('.j-selectUi-i1'));
	var relation2 = new SelectUi($('.j-selectUi-i2'));

	var userType;

	/* 获取学生Id */
	var urlAr = location.pathname.split('\/'), _id;
	for(var url_i in urlAr){
		if(!isNaN(+urlAr[url_i])){
			_id = +urlAr[url_i];
		}
	}


	/* 获取并渲染 */
	$.ajax({
		url: window.globalPath + '/student/' + _id + '/view',
		type: 'POST',
		data: {id: _id},
		dataType: 'json',
		async: false,
		success: function(resObj){
			/* 学校 */
			$elements.$schoolName.html(resObj.schoolName);
			StudentData.schoolId = resObj.schoolId;
			userType = resObj.type;

			var classGroup = {}; // 当前年级组
			/* 渲染年级列表 获取 学校班级数据组 */
			var gradeList_html = ''
			for(var gi = 0, gilen = resObj.gradeList.length; gi < gilen; gi++){
				var gradeSingle = resObj.gradeList[gi];
				gradeGroup[gradeSingle.gradeId] = gradeSingle;
				gradeList_html += '<li data-value="' + gradeSingle.gradeId + '">' + gradeSingle.gradeName + '</li>';
				/* 选取当前年级组 */
				if(gradeSingle.gradeId === resObj.gradeId){
					classGroup = gradeSingle.classList;
				}
			}
			$('.j-gradeList').empty().append(gradeList_html);
			/* 当前年级初始化 */
			gradeFous.init(resObj.gradeId);
			StudentData.gradeId = resObj.gradeId;


			/* 渲染当前年级下的班级列表 */
			var classList_html = ''
			for(var ci = 0, cilen = classGroup.length; ci < cilen; ci++){
				var classSingle = classGroup[ci];
				classList_html += '<li data-value="' + classSingle.id + '">' + classSingle.className + '</li>';
			}
			$('.j-classList').html(classList_html);
			classFocus.init(resObj.classId);
			StudentData.classId = resObj.classId;


			if(userType === 0){
				$elements.$selectGradeClass.addClass('disabled');
				$elements.$selectClass.addClass('disabled');
			}

			/* 学号 */
			$elements.$stNumber.val(resObj.stuNum);
			StudentData.stuNum = resObj.stuNum;
			/* 姓名 */
			$elements.$stName.val(resObj.sname);
			StudentData.sname = resObj.sname;
			/* 性别 */
			$('.j-sltSexy[value=' + (resObj.sex || '男') + ']')[0].checked = true;
			StudentData.sex = resObj.sex;

			/*  生日 */
			$elements.$stBirthday.val(resObj.birthday);
			StudentData.birthday = resObj.birthday;
			/*  身份证号码 */
			$elements.$stCardNumber.val(resObj.cardnumber);
			StudentData.cardnumber = resObj.cardnumber;

			/* 学生类型 */
			$('.j-stStyle[value=' + ( resObj.attribute || '1' ) + ']')[0].checked = true;
			StudentData.attribute = resObj.attribute;

			/* 家长类型1 */
			var _fid1 = resObj.fid1 || '';
			$elements.$fid1.attr('data-id', _fid1);
			$elements.$ff1Name.val(resObj.fname1 || '');
			$elements.$ff1relation.val(resObj.frelationship1 || '');
			$elements.$ff1relation.prev('input.intotext').val(resObj.frelationship1 || '');
			$elements.$ff1Mobile.val(resObj.fmobile1 || '');
			$elements.$ff1job.val(resObj.fprofessional1 || '');
			$elements.$ff1Address.val(resObj.faddress1 || '');

			StudentData.fid1 = _fid1
			StudentData.fname1 = resObj.fname1 || '';
			StudentData.frelationship1 = resObj.frelationship1 || '';
			StudentData.fmobile1 = resObj.fmobile1 || '';
			StudentData.fprofessional1 = resObj.fprofessional1 || '';
			StudentData.faddress1 = resObj.faddress1 || '';
			/*2*/
			var _fid2 = resObj.fid2 || '';
			$elements.$fid2.attr('data-id', _fid2);
			$elements.$ff2Name.val(resObj.fname2 || '');
			$elements.$ff2relation.val(resObj.frelationship2 || '');
			$elements.$ff2relation.prev('input.intotext').val(resObj.frelationship2 || '');
			$elements.$ff2Mobile.val(resObj.fmobile2 || '');
			$elements.$ff2job.val(resObj.fprofessional2 || '');
			$elements.$ff2Address.val(resObj.faddress2 || '');

			StudentData.fid2 = _fid2
			StudentData.fname2 = resObj.fname2 || '';
			StudentData.frelationship2 = resObj.frelationship2 || '';
			StudentData.fmobile2 = resObj.fmobile2 || '';
			StudentData.fprofessional2 = resObj.fprofessional2 || '';
			StudentData.faddress2 = resObj.faddress2 || '';

			StudentData.attendanceCard = resObj.attendanceCard || '';
			$elements.$checkCard.val(resObj.attendanceCard || '');

			/* 获取对比数据 */
			for(var prop in StudentData){
				if(StudentData.hasOwnProperty(prop)){
					compareData[prop] = StudentData[prop];
				}
			}
		},
		error: function(){
			ymPrompt.alert({
				message: '未能获取到用户数据，点击确定返回列表',
				width: 360,
				height: 180,
				titleBar: false,
				handler: function(){
					location.href = window.globalPath + '/student/list';
				}
			});
		}
	});


	if(userType !== 0){
		/*  年级选取实例 */
		gradeFous.bindE(function(val){
			var classGroup = gradeGroup[val].classList;
			/* 获取年级班级 */
			StudentData.gradeId = gradeGroup[val].gradeId;
			var classList_html = '';
			for(var k = 0, klen = classGroup.length; k < klen; k++){
				classList_html += '<li data-value="' + classGroup[k].id + '">' + classGroup[k].className + '</li>'
			}
			$('.j-classList').empty().append(classList_html);
			classFocus.reset();
			StudentData.classId = '';
			clearErrorTips($elements.$selectGradeClass);
		});

		/* 班级选取 */
		classFocus.bindE(function(val){
			StudentData.classId = val;
			clearErrorTips($elements.$selectGradeClass);
		});
	}
	/* 关系选取 */
	relation1.bindE();
	relation2.bindE();

	/* 学生生日 掇取时间 */
	$elements.$stBirthday.on('click', WdatePicker);

	/*  事件绑定与业务逻辑 */
	(function(){

		$elements.$ipt.bind({
			'focus': function(){
				clearErrorTips($(this));
			}
		});

		$elements.$radio.bind({
			'click': function(){
				clearErrorTips($(this));
			}
		});

		$elements.$submit.on('click', function(){

			if(isSubmit){
				isSubmit = false;

				/* 对比数据，如果没有修改，直接返回 */
				//重置所有错误提示
				$('.j-tips').removeClass('erro').empty();
				$elements.$alltips.empty().hide();

				var errorList = [];

				if(StudentData.schoolId === ''){
					showError($elements.$schoolName, '请选择学校');
					errorList.push('请选择学校')
				}

				if(StudentData.gradeId === ''){
					showError($elements.$selectGradeClass, '请选择年级');
					errorList.push('请选择年级')
				}

				if(StudentData.classId === ''){
					showError($elements.$selectGradeClass, '请选择班级');
					errorList.push('请选择班级');
				}

				/* 学号验证 */
				StudentData.stuNum = $.trim($elements.$stNumber.val());
				var stNumber_msg = '';
				switch(true){
				case  StudentData.stuNum == '':
					errorList.push('请填写学生学号');
					stNumber_msg = '请填写学生学号';
					break;
				case checkUtil.checkSpecialChar(StudentData.stuNum):
					errorList.push('学生学号不能含有特殊字符');
					stNumber_msg = '学生学号不能含有特殊字符';
					break;
				case isNaN(StudentData.stuNum):
					errorList.push('学生学号必须是纯数字');
					stNumber_msg = '学生学号必须是纯数字';
					break;
				}
				if(stNumber_msg !== ''){
					showError($elements.$stNumber, stNumber_msg);
				}

				/* 学生姓名验证 */
				StudentData.sname = $.trim($elements.$stName.val());
				var stName_msg = '';
				switch(true){
				case  StudentData.sname == '':
					stName_msg = '请填写学生姓名！';
					errorList.push('请填写学生姓名');
					break;
				case checkUtil.checkSpecialChar(StudentData.sname):
					stName_msg = '学生姓名不能含有特殊字符！';
					errorList.push('学生姓名不能含有特殊字符');
					break;
				case !checkUtil.checkCharSize(StudentData.sname, 0, 15):
					stName_msg = '学生姓名请勿超过15个字！';
					errorList.push('学生姓名请勿超过15个字');
					break;
				}
				if(stName_msg !== ''){
					showError($elements.$stName, stName_msg);
				}


				/* 学生生日 */
				StudentData.birthday = $.trim($elements.$stBirthday.val());
				var stBirthday_msg = '';
				var _stBirthdayGetTime = timeFunction.getTimes(StudentData.birthday);

				switch(true){
				case StudentData.birthday == '':
					stBirthday_msg = '请填写学生生日';
					errorList.push('请填写学生生日');
					break;
				case _stBirthdayGetTime > new Date():
					stBirthday_msg = '学生生日不能超过今天';
					errorList.push('学生生日不能超过今天');
					break;
				}

				if(stBirthday_msg !== ''){
					showError($elements.$stBirthday, stBirthday_msg);
				}


				/* 学生身份证号码的提交 */
				StudentData.cardnumber = $.trim($elements.$stCardNumber.val());
				var _stCardNumberResult = '';
				if(StudentData.cardnumber == ''){
					_stCardNumberResult = '请填写学生身份证号码！';
					errorList.push('请填写学生身份证号码');
				}else if(!checkUtil.checkCardNumber(StudentData.cardnumber)){
					_stCardNumberResult = '请填写正确格式的身份证号码！';
					errorList.push('请填写正确格式的身份证号码');
				}

				if(_stCardNumberResult){
					showError($elements.$stCardNumber, _stCardNumberResult);
				}


				/* 男女性别 */
				StudentData.sex = $('.j-sltSexy:checked').val();
				/*学生类型*/
				StudentData.attribute = $('.j-stStyle:checked').val();


				if($elements.$fid1.attr('data-id')){
					StudentData.fid1 = $elements.$fid1.attr('data-id');
				}
				if($elements.$fid2.attr('data-id')){
					StudentData.fid2 = $elements.$fid2.attr('data-id');
				}
				/*家长姓名*/
				StudentData.fname1 = $.trim($elements.$ff1Name.val());
				if(StudentData.fname1 !== '' && (!checkUtil.checkCharSize(StudentData.fname1, 0, 15) || checkUtil.checkSpecialChar(StudentData.fname1))){
					showError($elements.$ff1Name, '家长姓名1请勿包含特殊字符，并且勿超过15个字');
					errorList.push('家长姓名1请勿包含特殊字符，并且勿超过15个字');
				}

				StudentData.frelationship1 = $elements.$ff1relation.val();

				StudentData.fmobile1 = $.trim($elements.$ff1Mobile.val());
				var _ff1mobileResult = '';
				switch(true){
				case  StudentData.fmobile1 === '':
					_ff1mobileResult = '家长手机号码不能为空';
					errorList.push('家长手机号码不能为空');
					break;
				case !checkUtil.checkPhoneNumber(StudentData.fmobile1):
					_ff1mobileResult = '家长手机号码格式不正确';
					errorList.push('家长手机号码格式不正确');
					break;
				}
				showError($elements.$ff1Mobile, _ff1mobileResult);

				StudentData.fprofessional1 = $.trim($elements.$ff1job.val());
				if(StudentData.fprofessional1 !== '' && !checkUtil.checkCharSize(StudentData.fprofessional1, 0, 15)){
					showError($elements.$ff1job, '请勿超过15个字；');
					errorList.push('家长1职业请勿超过15个字');
				}

				StudentData.faddress1 = $.trim($elements.$ff1Address.val());
				if(StudentData.faddress1 !== '' && !checkUtil.checkCharSize(StudentData.faddress1, 0, 50)){
					showError($elements.$ff1Address, '请勿超过50个字；');
					errorList.push('家长1地址请勿超过50个字');
				}

				/*  家长2 */
				StudentData.fname2 = $.trim($elements.$ff2Name.val());

				if(StudentData.fname2 !== '' && (!checkUtil.checkCharSize(StudentData.fname2, 0, 15) || checkUtil.checkSpecialChar(StudentData.fname2))){
					showError($elements.$ff2Name, '家长姓名2请勿包含特殊字符，并且勿超过15个字');
					errorList.push('家长姓名2请勿包含特殊字符，并且勿超过15个字');
				}

				StudentData.frelationship2 = $elements.$ff2relation.val();

				StudentData.fmobile2 = $.trim($elements.$ff2Mobile.val());

				StudentData.fprofessional2 = $.trim($elements.$ff2job.val());
				if(StudentData.fprofessional2 !== '' && !checkUtil.checkCharSize(StudentData.fprofessional2, 0, 15)){
					showError($elements.$ff2job, '请勿超过15个字；');
					errorList.push('家长1职业请勿超过15个字');
				}
				StudentData.faddress2 = $.trim($elements.$ff2Address.val());
				if(StudentData.faddress2 !== '' && !checkUtil.checkCharSize(StudentData.faddress2, 0, 50)){
					showError($elements.$ff2Address, '请勿超过50个字；');
					errorList.push('家长1地址请勿超过50个字');
				}


				var _ff2mobileResult = '';
				if(StudentData.fmobile2 !== '' && !checkUtil.checkPhoneNumber(StudentData.fmobile2)){
					showError($elements.$ff2Mobile, '家长手机号码格式不正确');
					errorList.push('家长手机号码格式不正确');
				}

				if(StudentData.fname2 !== '' || StudentData.frelationship2 !== '' || StudentData.fprofessional2 !== '' || StudentData.faddress2 !== ''){
					if(StudentData.fmobile2 !== ''){
						if(!checkUtil.checkPhoneNumber(StudentData.fmobile2)){
							showError($elements.$ff2Mobile, '家长手机号码格式不正确');
							errorList.push('家长手机号码格式不正确');
						}
					}else{
						showError($elements.$ff2Mobile, '家长手机号码不能为空');
						errorList.push('家长手机号码不能为空');
					}
				}

				if(StudentData.fmobile1 !== '' && StudentData.fmobile2 !== '' && StudentData.fmobile1 == StudentData.fmobile2){
					showError($elements.$ff2Mobile, '请勿与家长手机号码1重复');
					errorList.push('家长手机号码1与家长手机号码2重复');
				}


				/* 考勤卡号 */
				StudentData.attendanceCard = $.trim($elements.$checkCard.val());
				if(StudentData.attendanceCard !== '' && checkUtil.checkSpecialChar(StudentData.attendanceCard)){
					showError($elements.$checkCard, '考勤卡号请勿包含特殊字符！');
					errorList.push('考勤卡号请勿包含特殊字符');
				}

				var returnUrl = true;
				for(var ci in StudentData){
					if(StudentData.hasOwnProperty(ci) && compareData.hasOwnProperty(ci) && StudentData[ci] !== compareData[ci]){
						returnUrl = false;
					}
				}

				if(errorList.length <= 0){
					if(returnUrl){
						location.href = window.globalPath + '/student/list';
					}else{
						ymPrompt.confirmInfo({
							message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>确定修改学生？</h2></div>',
							titleBar: false,
							width: 300,
							height: 200,
							handler: function(resMsg){
								if(resMsg == 'ok'){
									$.ajax({
										url: window.globalPath + '/student/' + _id + '/update',
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
													message: '<div class="ym-inContent ym-inContent-success oneline"><h2>成功修改学生？</h2></div>',
													titleBar: false,
													width: 300,
													height: 200,
													handler: function(){
														location.href = window.globalPath + '/student/list';
													}
												});
												setTimeout(function(){
													location.href = window.globalPath + '/student/list';
												}, 2000);
											}else if(resmsg && resmsg.msg == 'fail'){
												isSubmit = true;
												for(var i in resmsg.errorList){
													fail_html += resmsg.errorList[i]['error' + i] + '；'
												}
												$elements.$alltips.append(fail_html).show();
											}else if(resmsg && resmsg.msg == 'error'){
												isSubmit = true;
												alert('修改失败！');
											}else{
												isSubmit = true;
												fail_html = resmsg.msg
												$elements.$alltips.append(fail_html).show();
											}
										}, error: function(){
											isSubmit = true;
											alert('修改失败！');
										}
									})
								}else{
									isSubmit = true;
								}
							}
						});
					}
				}else{
					isSubmit = true;
					$elements.$alltips.html(errorList.join(';')).fadeIn();
					setTimeout(function(){
						$elements.$alltips.fadeOut(1000);
					}, 5000);
				}
			}
		});

		$('.j-submitCancle').click(function(){
			ymPrompt.confirmInfo({
				message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>取消修改学生？</h2></div>',
				titleBar: false,
				width: 300,
				height: 200,
				handler: function(res){
					if(res == 'ok'){
						location.href = window.globalPath + '/student/list';
					}
				}
			});
		})
	})();
});
