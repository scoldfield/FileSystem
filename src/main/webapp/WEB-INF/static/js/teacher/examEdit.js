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
		'ymPrompt': '../plug/ymPrompt/ymPrompt'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'My97DatePicker', 'mypannel', 'ymPrompt'], function(jquery){

	/* 渲染日和月  ** 直接写到页面里太蛋疼了，不如用js渲染吧 ^_^ */
	var h_html = '<li data-value="00">00</li> <li data-value="01">01</li> <li data-value="02">02</li> <li data-value="03">03</li> <li data-value="04">04</li> <li data-value="05">05</li> <li data-value="06">06</li> <li data-value="07">07</li> <li data-value="08">08</li> <li data-value="09">09</li> <li data-value="10">10</li> <li data-value="11">11</li> <li data-value="12">12</li> <li data-value="13">13</li> <li data-value="14">14</li> <li data-value="15">15</li> <li data-value="16">16</li> <li data-value="17">17</li> <li data-value="18">18</li> <li data-value="19">19</li> <li data-value="20">20</li> <li data-value="21">21</li> <li data-value="22">22</li> <li data-value="23">23</li>',
		m_html = '<li data-value="00">00</li><li data-value="01">01</li><li data-value="02">02</li><li data-value="03">03</li><li data-value="04">04</li><li data-value="05">05</li><li data-value="06">06</li><li data-value="07">07</li><li data-value="08">08</li><li data-value="09">09</li><li data-value="10">10</li><li data-value="11">11</li><li data-value="12">12</li><li data-value="13">13</li><li data-value="14">14</li><li data-value="15">15</li><li data-value="16">16</li><li data-value="17">17</li><li data-value="18">18</li><li data-value="19">19</li><li data-value="20">20</li><li data-value="21">21</li><li data-value="22">22</li><li data-value="23">23</li><li data-value="24">24</li><li data-value="25">25</li><li data-value="26">26</li><li data-value="27">27</li><li data-value="28">28</li><li data-value="29">29</li><li data-value="30">30</li><li data-value="31">31</li><li data-value="32">32</li><li data-value="33">33</li><li data-value="34">34</li><li data-value="35">35</li><li data-value="36">36</li><li data-value="37">37</li><li data-value="38">38</li><li data-value="39">39</li><li data-value="40">40</li><li data-value="41">41</li><li data-value="42">42</li><li data-value="43">43</li><li data-value="44">44</li><li data-value="45">45</li><li data-value="46">46</li><li data-value="47">47</li><li data-value="48">48</li><li data-value="49">49</li><li data-value="50">50</li><li data-value="51">51</li><li data-value="52">52</li><li data-value="53">53</li><li data-value="54">54</li><li data-value="55">55</li><li data-value="56">56</li><li data-value="57">57</li><li data-value="58">58</li><li data-value="59">59</li>';

	$('.j-hoursList').append(h_html);
	$('.j-minList').append(m_html);

	var $elements = {
		$examTitle: $('.j-examTitle'),
		$examDate: $('.j-examDate'),
		$examDsh: $('.j-exStartHours'),
		$examDsm: $('.j-exStartMins'),
		$examDeh: $('.j-exEndHours'),
		$examDem: $('.j-exEndMins'),
		$examDetailContent: $('.j-examDetailContent'),
		$examGuide: $('.j-examGuide'),
		$selectRecipientBtn: $('.j-selectRecipientBtn'),
		$mask: $('.u-mask'),
		$selectRecipientWrap: $('.g-selectRecipient'),
		$selectRecipientContent: $('.j-RecipientContent'),
		$selectContent: $('.j-selectContent'),
		$closeRecipient: $('.closeRecipient')
	};
	var postData = {}

	var exStartHours = new SelectUi($elements.$examDsh),
		exStartMins = new SelectUi($elements.$examDsm),
		exEndHours = new SelectUi($elements.$examDeh),
		exEndMins = new SelectUi($elements.$examDem);

	exStartHours.bindE();
	exStartMins.bindE();
	exEndHours.bindE();
	exEndMins.bindE();


	/* 展开班级选择 */
	var examRecipient = new SelectRecipient({
		triggerEle: $elements.$selectRecipientBtn,
		mask: $elements.$mask,
		selectRecipientWrap: $elements.$selectRecipientWrap,
		selectRecipientContent: $elements.$selectRecipientContent,
		closeRecipient: $elements.$closeRecipient
	});
	examRecipient.typeTxt = '发布';
	examRecipient.classGroupData = [];
	examRecipient.nameCompareGroup = {};
	examRecipient.postData = '';


	examRecipient.init(function(_self){
		/* 获取年级列表 */
		$.ajax({
			url: window.globalPath + '/exam/addreceive',
			type: 'get',
			success: function(res){
				var gradeList = JSON.parse(res);
				var $recipientContainer = $('<div class="j-recipientClassGroup"></div>');
				for(var i in gradeList){
					if(gradeList.hasOwnProperty(i)){
						var gradeSingle = gradeList[i],
							$gradeWrap = $('<div class="selectRecipientWrap"></div>');
						var gradeInfAr = gradeSingle.strName.split('##'),
							gradeId = gradeInfAr[0],
							gradeName = gradeInfAr[1]

						var li_html = '<div class="selectRecipient-grade f-cb"><span class="grade-wd" data-value="' + gradeId + '">' + gradeName + '</span></div><div class="selectRecipient-class"> <ul class="f-cb f-cbli">';
						for(var j in gradeSingle.strlist){
							if(gradeSingle.strlist.hasOwnProperty(j)){
								var classSingle = gradeSingle.strlist[j];
								li_html += '<li><label class="checkbox-ui f-fl"><input type="checkbox" value="' + classSingle.id + '"/><b></b><span class="wd">' + classSingle.className + '</span></label></li>';
								examRecipient.nameCompareGroup[classSingle.id] = gradeName + ' ' + classSingle.className;
							}
						}
						li_html += ' </ul></div>';
						$gradeWrap.append(li_html);
						$recipientContainer.append($gradeWrap);
					}
				}
				$elements.$selectContent.append('<div class="selectRecipient-grade f-cb"><label class="checkbox-ui f-fl"><input type="checkbox" class="j-recipientAll"  /><b></b><span class="wd">全部班级</span></label></div>');
				$elements.$selectContent.append($recipientContainer);
			}
		});
	});

	examRecipient.showRecipient = function(){
		var li_html = '';
		examRecipient.classGroupData = []
		$elements.$selectContent.find('.j-recipientClassGroup').find('input:checkbox:checked').each(function(){
			examRecipient.classGroupData.push($(this).val());
		});

		if(examRecipient.classGroupData.length > 0){
			for(var i in examRecipient.classGroupData){
				if(examRecipient.classGroupData.hasOwnProperty(i)){
					var classIdSingle = examRecipient.classGroupData[i];
					li_html += '<span class="name-unit">' + examRecipient.nameCompareGroup[classIdSingle] + '</span>';
				}
			}
		}else{
			li_html += '<div class="enterTips ">请输入接收人</div>';
		}
		$elements.$selectRecipientBtn.html(li_html);
	}

	examRecipient.bindE(function(_self){

		/* 事件添加 */
		$elements.$selectContent.on('change', 'input:checkbox', function(){
			var $this = $(this), $classGroupChecked = $elements.$selectContent.find('.j-recipientClassGroup');
			if($this.hasClass('j-recipientAll')){
				$classGroupChecked.find('input:checkbox').each(function(){
					$(this)[0].checked = $this[0].checked;
				});
			}else{
				$elements.$selectContent.find('.j-recipientAll')[0].checked = $classGroupChecked.find('input:checkbox:checked').length == $classGroupChecked.find('input:checkbox').length;
			}
		});


		$('.j-addRecipientData').on('click', function(){
			examRecipient.closeClassGroup();
			examRecipient.showRecipient();
		});

	});


	/* 标题字数查询 */
	var titleCounter = new CountInput($elements.$examTitle);
	titleCounter.init({
		callback: function(_vlen){
			if(_vlen <= 50){
				$('.j-noticeContentCounter').html('<span class="green"> ' + _vlen + ' </span> /50');
			}else{
				$('.j-noticeContentCounter').html('<span class="f-cr">超出' + (_vlen - 50 ) + '</span>');
			}
		}
	});

	/* 考试内容数字计算*/
	var contentCounter = new CountInput($elements.$examDetailContent);
	contentCounter.init({
		callback: function(_vlen){
			if(_vlen <= 5000){
				$('.j-examDetailContentCounter').html('<span class="green"> ' + _vlen + ' </span> /5000');
			}else{
				$('.j-examDetailContentCounter').html('<span class="f-cr">超出' + (_vlen - 5000 ) + '</span>');
			}
		}
	});


	/* 详细信息字数查询 */
	var guideCounter = new CountInput($elements.$examGuide);
	guideCounter.init({
		callback: function(_vlen){
			if(_vlen <= 1000){
				$('.j-examGuideCounter').html('<span class="green"> ' + _vlen + ' </span> /1000');
			}else{
				$('.j-examGuideCounter').html('<span class="f-cr">超出' + (_vlen - 1000 ) + '</span>');
			}
		}
	});

	/* 考试时间选定 */
	$elements.$examDate.bind('click', WdatePicker);
	var TODAY = new Date();
	$elements.$examDate.val(TODAY.getFullYear() + '-' + (TODAY.getMonth() < 9 ? '0' + (TODAY.getMonth() + 1) : TODAY.getMonth() + 1) + '-' + (TODAY.getDate() < 10 ? '0' + TODAY.getDate() : TODAY.getDate()));
	/* 考试科目选择 */
	var examCourse = new SelectUi($('.j-selectui-examCourse'));
	examCourse.bindE();

	/* 考试类型选择 */
	var examType = new SelectUi($('.j-selectui-examType'));
	examType.bindE();


	var isSubmit = true;

	$('.j-submitExam').on('click', function(){
		if(isSubmit){
			isSubmit = false;
		}
		var errorMsgAr = [];
		/*  考试日期 */
		var _examDate = $elements.$examDate.val();
		if(_examDate === ''){
			errorMsgAr.push('请填写考试时间！');
		}
		/*  考试时间  */
		var _stHour = $('.j-stHour').val(), _stMins = $('.j-stMins').val(), _endHours = $('.j-endHours').val(), _endMins = $('.j-endMins').val();
		if(parseInt(_stHour + _stMins) >= parseInt(_endHours + _endMins)){
			errorMsgAr.push('考试开始时间不能晚于结束时间！');
		}

		/* add PostData*/
		postData.sTime = _examDate + ' ' + _stHour + ':' + _stMins + ':00';
		postData.etime = _examDate + ' ' + _endHours + ':' + _endMins + ':00';

		if(timeFunction.getTimes(postData.etime) < new Date()){
			errorMsgAr.push('考试结束时间不能早于当前时间！');
		}

		/* 标题 */
		postData.title = $.trim($('.j-examTitle').val());
		if(postData.title === ''){
			errorMsgAr.push('请填写考试名称！');
		}
		if(postData.title.length > 15){
			errorMsgAr.push('名称不能超过15个字符！！');
		}

		/* 科目 */
		postData.courseId = $('.j-selectCourse').val();
		if(postData.courseId === ''){
			errorMsgAr.push('请填写考试科目！');
		}

		/* 类型 */
		postData.examtypeId = $('.j-selectType').val();
		if(postData.examtypeId === ''){
			errorMsgAr.push('请填写考试类型！');
		}

		//接收人

		if(examRecipient.classGroupData.length === 0){
			errorMsgAr.push('请填写考试对象！');
		}else{
			postData.classid = examRecipient.classGroupData.join(',');
		}

		/* 考试内容 */
		postData.tmpContent = $.trim($('.j-examDetailContent').val());
		/*if(postData.tmpContent === ''){
		 errorMsgAr.push('请填写考试内容！');
		 }*/
		if(postData.tmpContent.length > 5000){
			errorMsgAr.push('考试内容请勿超过5000字。');
		}
		/* 考试内容 */
		postData.reference = $.trim($('.j-examGuide').val());
		if(postData.reference.length > 1000){
			errorMsgAr.push('考试指南请勿超过1000字！');
		}
		postData.appsend = $('.j-appsend').is(':checked') ? 0 : 1;
		postData.smstype = $('.j-smstype').is(':checked') ? 0 : 1;

		var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
			'<h2>确认' + examRecipient.typeTxt + '该考试？</h2></div>';

		if(errorMsgAr.length > 0){
			$('.j-errotips').html(errorMsgAr.join('; ')).fadeIn();
			setTimeout(function(){
				$('.j-errotips').fadeOut(1000);
			}, 3000);
			isSubmit = true;
		}else{
			ymPrompt.confirmInfo({
				message: _html,
				width: 420,
				height: 240,
				titleBar: false,
				handler: function(res){
					if(res === 'ok'){
						$.ajax({
							url: window.globalPath + '/exam/save',
							data: postData,
							type: 'POST',
							dataType: 'json',
							success: function(res){
								if(res.result === 'success'){
									setTimeout(function(){
										location.href = window.globalPath + '/exam/examlist'
									}, 3000)
									ymPrompt.succeedInfo({
										message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>' + examRecipient.typeTxt + '考试成功' + '</h2></div>',
										titleBar: false,
										width: 300,
										height: 220,
										handler: function(){
											location.href = window.globalPath + '/exam/examlist';
										}
									});
								}else{
									isSubmit = true;
								}
							}, error: function(){
								isSubmit = true;
							}
						});
					}else{
						isSubmit = true;
					}
				}
			});
		}
	});

	/*取消*/
	$('.j-submitCancel').on('click', function(){
		ymPrompt.confirmInfo({
			message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>    是否取消编辑考试?</h2></div>',
			width: 360,
			height: 200,
			titleBar: false,
			handler: function(res){
				if(res === 'ok'){
					location.href = window.globalPath + '/exam/examlist'
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