/**
 * Document by wangshuyan@chinamobile.com on 2016/1/4 0004.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		//  'jqueryForm': '../lib/jquery.form',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'mypannel': '../common/teacherSideBar',
		'My97DatePicker': '../plug/My97DatePicker/WdatePicker',
		'ymPrompt': '../plug/ymPrompt/ymPrompt'
	},
	shim: {
		'base': {deps: ['jquery']},
		//   'jqueryForm': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'mypannel', 'My97DatePicker', 'ymPrompt'], function(jquery){


	/* 渲染日和月  ** 直接写到页面里太蛋疼了，不如用js渲染吧 ^_^ */
	var h_html = '<li data-value="00">00</li> <li data-value="01">01</li> <li data-value="02">02</li> <li data-value="03">03</li> <li data-value="04">04</li> <li data-value="05">05</li> <li data-value="06">06</li> <li data-value="07">07</li> <li data-value="08">08</li> <li data-value="09">09</li> <li data-value="10">10</li> <li data-value="11">11</li> <li data-value="12">12</li> <li data-value="13">13</li> <li data-value="14">14</li> <li data-value="15">15</li> <li data-value="16">16</li> <li data-value="17">17</li> <li data-value="18">18</li> <li data-value="19">19</li> <li data-value="20">20</li> <li data-value="21">21</li> <li data-value="22">22</li> <li data-value="23">23</li>',
		m_html = '<li data-value="00">00</li><li data-value="01">01</li><li data-value="02">02</li><li data-value="03">03</li><li data-value="04">04</li><li data-value="05">05</li><li data-value="06">06</li><li data-value="07">07</li><li data-value="08">08</li><li data-value="09">09</li><li data-value="10">10</li><li data-value="11">11</li><li data-value="12">12</li><li data-value="13">13</li><li data-value="14">14</li><li data-value="15">15</li><li data-value="16">16</li><li data-value="17">17</li><li data-value="18">18</li><li data-value="19">19</li><li data-value="20">20</li><li data-value="21">21</li><li data-value="22">22</li><li data-value="23">23</li><li data-value="24">24</li><li data-value="25">25</li><li data-value="26">26</li><li data-value="27">27</li><li data-value="28">28</li><li data-value="29">29</li><li data-value="30">30</li><li data-value="31">31</li><li data-value="32">32</li><li data-value="33">33</li><li data-value="34">34</li><li data-value="35">35</li><li data-value="36">36</li><li data-value="37">37</li><li data-value="38">38</li><li data-value="39">39</li><li data-value="40">40</li><li data-value="41">41</li><li data-value="42">42</li><li data-value="43">43</li><li data-value="44">44</li><li data-value="45">45</li><li data-value="46">46</li><li data-value="47">47</li><li data-value="48">48</li><li data-value="49">49</li><li data-value="50">50</li><li data-value="51">51</li><li data-value="52">52</li><li data-value="53">53</li><li data-value="54">54</li><li data-value="55">55</li><li data-value="56">56</li><li data-value="57">57</li><li data-value="58">58</li><li data-value="59">59</li>';

	$('.j-hoursList').append(h_html);
	$('.j-minList').append(m_html);

	/* 获取年级列表 */
	$.ajax({
		url: window.globalPath + '/attendancetime/addreceive',
		type: 'get',
		success: function(res){
			var gradeList = JSON.parse(res);
			var li_html = '';
			for(var i in gradeList){
				var gradeSingle = gradeList[i];
				li_html += '<label class="checkbox-ui f-fl"><input type="checkbox" value="' + gradeSingle.id + '"/><b></b>' + gradeSingle.gradeName + '</label>'
			}
			$('.j-addreceiveList').append(li_html);
		}
	});


	var attendanceEdit = {
		typeTxt: '添加',
		/* 缓存数据*/
		dataTransfer: {
			type: '',
			othertimeStr: '',
			atHours: '',
			atMin: '',
			ltHours: '',
			ltMin: '',
			neHours: '',
			neMin: '',
			ntHours: '',
			ntMin: '',
			gradeIds: []
		},
		/* 对比数据 */
		dataCompare: {
			type: '',
			othertimeStr: '',
			atHours: '',
			atMin: '',
			ltHours: '',
			ltMin: '',
			neHours: '',
			neMin: '',
			ntHours: '',
			ntMin: '',
			gradeIds: []
		},
		$elements: {
			$noticeDate: $('.j-attendanceDate'),
			$getArrivetimeHours: $('.j-entryHours'),
			$getArrivetimeMin: $('.j-entryMin'),
			$getlunchstartHours: $('.j-nbreakbh'),
			$getlunchstartMin: $('.j-nbreakbm'),
			$getlunchendHours: $('.j-nbreakoh'),
			$getlunchendMin: $('.j-nbreakom'),
			$getleavetimeHours: $('.j-leaveHours'),
			$getleavetimeMin: $('.j-leaveMin'),
			$addreceiveList: $('.j-addreceiveList')
		},
		/* 检测入校时间 */
		getArrivetime: function(isAtHours){
			var atHours = $.trim(attendanceEdit.$elements.$getArrivetimeHours.find('.intoval').val()),
				atMin = $.trim(attendanceEdit.$elements.$getArrivetimeMin.find('.intoval').val());
			/* 如果选择的时间则默认填写分为00 */
			if(isAtHours && atMin === ''){
				entryMin.init('00', '00');
				atMin = '00'
			}
			if(atHours){
				$('.j-arriveTimeTips').html('学生将会在<b class="timeblue">' + atHours + '时' + atMin + '分</b>到达学校');
			}
			this.dataTransfer.atHours = atHours
			this.dataTransfer.atMin = atMin
		},
		/* 检测离校时间 */
		getLeavetime: function(isLtHours){
			var ltHours = $.trim(attendanceEdit.$elements.$getleavetimeHours.find('.intoval').val()),
				ltMin = $.trim(attendanceEdit.$elements.$getleavetimeMin.find('.intoval').val());
			/* 如果选择的时间则默认填写分为00 */
			if(isLtHours && ltMin === ''){
				leaveMin.init('00', '00');
				ltMin = '00'
			}
			if(ltHours){
				$('.j-leaveTimeTips').html('学生将会在<b class="timeblue">' + ltHours + '时' + ltMin + '分</b>离开学校');
			}
			this.dataTransfer.ltHours = ltHours;
			this.dataTransfer.ltMin = ltMin;
		},
		/* 检测午休开始时间 */
		getLunchtimeStart: function(isNtHours){
			var ntHours = $.trim(attendanceEdit.$elements.$getlunchstartHours.find('.intoval').val()),
				ntMin = $.trim(attendanceEdit.$elements.$getlunchstartMin.find('.intoval').val());
			/* 如果选择的时间则默认填写分为00 */
			if(isNtHours && ntMin === ''){
				nbreakbm.init('00', '00');
				ntMin = '00'
			}
			this.dataTransfer.ntHours = ntHours;
			this.dataTransfer.ntMin = ntMin;
		},
		/* 检测午休结束时间 */
		getLunchtimeEnd: function(isNeHours){
			var neHours = $.trim(attendanceEdit.$elements.$getlunchendHours.find('.intoval').val()),
				neMin = $.trim(attendanceEdit.$elements.$getlunchendMin.find('.intoval').val());
			/* 如果选择的时间则默认填写分为00 */
			if(isNeHours && neMin === ''){
				nbreakom.init('00', '00');
				neMin = '00'
			}
			this.dataTransfer.neHours = neHours;
			this.dataTransfer.neMin = neMin;
		},
		getRenderHourMin: function(dataStr, setHours, setMins, comHours, comMins){
			var ar = dataStr.split(':');
			if(ar.length > 0){
				setHours.init(ar[0]);
				setMins.init(ar[1])
				attendanceEdit.dataCompare[comHours] = ar[0];
				attendanceEdit.dataCompare[comMins] = ar[1];
				attendanceEdit.dataTransfer[comHours] = ar[0];
				attendanceEdit.dataTransfer[comMins] = ar[1];
			}
		}
	}


	/* 选择日期 select */
	var entryHours = new SelectUi(attendanceEdit.$elements.$getArrivetimeHours),
		entryMin = new SelectUi(attendanceEdit.$elements.$getArrivetimeMin),
		nbreakbh = new SelectUi(attendanceEdit.$elements.$getlunchstartHours),
		nbreakbm = new SelectUi(attendanceEdit.$elements.$getlunchstartMin),
		nbreakoh = new SelectUi(attendanceEdit.$elements.$getlunchendHours),
		nbreakom = new SelectUi(attendanceEdit.$elements.$getlunchendMin),
		leaveHours = new SelectUi(attendanceEdit.$elements.$getleavetimeHours),
		leaveMin = new SelectUi(attendanceEdit.$elements.$getleavetimeMin);

	entryHours.bindE(function(){
		attendanceEdit.getArrivetime(true);
	});
	entryMin.bindE(function(){
		attendanceEdit.getArrivetime(false);
	});
	nbreakbh.bindE(function(){
		attendanceEdit.getLunchtimeStart(true);
	});
	nbreakbm.bindE(function(){
		attendanceEdit.getLunchtimeStart(false);
	});
	nbreakoh.bindE(function(){
		attendanceEdit.getLunchtimeEnd(true);
	});
	nbreakom.bindE(function(){
		attendanceEdit.getLunchtimeEnd(false);
	});
	leaveHours.bindE(function(){
		attendanceEdit.getLeavetime(true);
	});
	leaveMin.bindE(function(){
		attendanceEdit.getLeavetime(false);
	});


	/* 如果是修改 ，渲染数据 */
	var queryId = getUrlQuery('id');


	if(queryId){

		attendanceEdit.typeTxt = '修改';

		$.ajax({
			url: window.globalPath + '/attendancetime/updateAttendancetime',
			type: 'POST',
			dataType: 'json',
			data: {id: queryId},
			success: function(resData){
				if(resData){
					/* 考勤日期*/
					if(resData.type === '1'){
						$('input[name=actimeType][value=' + resData.type + ']').click();
						attendanceEdit.$elements.$noticeDate.val(resData.othertimeStr);

						attendanceEdit.dataCompare.type = resData.type;
						attendanceEdit.dataCompare.othertimeStr = resData.othertimeStr + ' 00:00:00'
					}
					/* 获取入校时间 */
					attendanceEdit.getRenderHourMin(resData.arrivetimeStr, entryHours, entryMin, 'atHours', 'atMin');
					$('.j-arriveTimeTips').html('学生将会在<b class="timeblue">' + attendanceEdit.dataTransfer.atHours + '时' + attendanceEdit.dataTransfer.atMin + '分</b>到达学校');

					/* 获取午休开始时间 */
					if(resData.lunchstartStr){
						attendanceEdit.getRenderHourMin(resData.lunchstartStr, nbreakbh, nbreakbm, 'ntHours', 'ntMin');
					}

					/* 获取午休结束时间 */
					if(resData.lunchendStr){
						attendanceEdit.getRenderHourMin(resData.lunchendStr, nbreakoh, nbreakom, 'neHours', 'neMin');
					}

					/* 获取离校时间 */
					attendanceEdit.getRenderHourMin(resData.leavetimeStr, leaveHours, leaveMin, 'ltHours', 'ltMin');
					$('.j-leaveTimeTips').html('学生将会在<b class="timeblue">' + attendanceEdit.dataTransfer.ltHours + '时' + attendanceEdit.dataTransfer.ltMin + '分</b>离开学校');
					/* 获取考勤对象*/
					var gradeAr = resData.gradeid.split(','), comar = [];
					for(var j in gradeAr){
						var gradeSinle = gradeAr[j];
						$('.j-addreceiveList  input[value=' + gradeSinle + ']').attr('checked', 'checked');
						comar.push(gradeSinle);
					}
					attendanceEdit.dataCompare.gradeIds = comar.sort().join(',');
				}
			}
		});
	}


	/* 掇选日期 */
	attendanceEdit.$elements.$noticeDate.on('click', WdatePicker);

	/* 提交变量 */


	/* 提交 */
	$('.j-submitACtime').on('click', function(){
		var parameter = {}


		// 错误信息集合
		var errorMsgAr = [], errorMsgStr = '';

		/* 获取考勤日期 */
		var actimeType = $('input[name=actimeType]:checked').val();
		attendanceEdit.dataTransfer.type = actimeType;
		parameter.type = actimeType;


		if(actimeType === '1'){
			var othertime = $.trim(attendanceEdit.$elements.$noticeDate.val());
			if(othertime === ''){
				errorMsgAr.push('请选择其他时间的具体日期')
			}else{
				attendanceEdit.dataTransfer.othertimeStr = othertime + ' 00:00:00';
				parameter.othertimeStr = othertime + ' 00:00:00';
			}
		}

		/* 获取时间对比常数 */
		var compareTimeAt = parseInt('' + attendanceEdit.dataTransfer.atHours + attendanceEdit.dataTransfer.atMin),
			compareTimeNst = parseInt('' + attendanceEdit.dataTransfer.ntHours + attendanceEdit.dataTransfer.ntMin),
			compareTimeNet = parseInt('' + attendanceEdit.dataTransfer.neHours + attendanceEdit.dataTransfer.neMin),
			compareTimeLt = parseInt('' + attendanceEdit.dataTransfer.ltHours + attendanceEdit.dataTransfer.ltMin);


		/* 获取入校时间 */
		if(attendanceEdit.dataTransfer.atHours === ''){
			errorMsgAr.push('请选择入校时间')
		}else{
			parameter.arrivetimeStr = attendanceEdit.dataTransfer.atHours + ':' + attendanceEdit.dataTransfer.atMin + ':00';
		}

		/* 获取离校 */
		if(attendanceEdit.dataTransfer.ltHours === ''){
			errorMsgAr.push('请选择离校时间')
		}else{
			parameter.leavetimeStr = attendanceEdit.dataTransfer.ltHours + ':' + attendanceEdit.dataTransfer.ltMin + ':00';
		}

		/* 获取检验午休时间 */
		if(attendanceEdit.dataTransfer.ntHours){
			if(attendanceEdit.dataTransfer.neHours === ''){
				errorMsgAr.push('请午休结束时间');
			}
		}
		if(attendanceEdit.dataTransfer.neHours){
			if(attendanceEdit.dataTransfer.ntHours === ''){
				errorMsgAr.push('请午休开始时间')
			}
		}
		if(compareTimeAt >= compareTimeLt){
			errorMsgAr.push('离校开始时间不能早于入校时间')
		}

		if(attendanceEdit.dataTransfer.ntHours && attendanceEdit.dataTransfer.neHours){
			if(compareTimeNst < compareTimeAt){
				errorMsgAr.push('午休开始时间不能早于入校时间');
			}else if(compareTimeNet > compareTimeLt){
				errorMsgAr.push('午休结束时间不能晚于离校时间');
			}else if(compareTimeNst >= compareTimeNet){
				errorMsgAr.push('午休开始时间不能晚于午休结束时间');
			}else{
				parameter.lunchstartStr = attendanceEdit.dataTransfer.ntHours + ':' + attendanceEdit.dataTransfer.ntMin + ':00';
				parameter.lunchendStr = attendanceEdit.dataTransfer.neHours + ':' + attendanceEdit.dataTransfer.neMin + ':00';
			}
		}

		/* 获取接受对象 */
		var translateAr = []
		attendanceEdit.$elements.$addreceiveList.find('input[type=checkbox]:checked').each(function(){
			translateAr.push($(this).val())
		});
		if(translateAr.length == 0){
			errorMsgAr.push('请选择考勤对象')
		}else{
			attendanceEdit.dataTransfer.gradeIds = parameter.gradeid = translateAr.sort().join(',');
		}

		if(errorMsgAr.length > 0){
			$('.errorTips').html(errorMsgAr.join(';  ')).fadeIn(100);
			setTimeout(function(){
				$('.errorTips').fadeOut(2000);
			}, 3000);
		}else{
			/* 提交 */

			/* 对比是否修改 */
			if(queryId){
				parameter.id = queryId;
				var isEdit = false;
				for(var i in attendanceEdit.dataTransfer){
					if(attendanceEdit.dataTransfer.hasOwnProperty(i) && attendanceEdit.dataCompare.hasOwnProperty(i) && attendanceEdit.dataTransfer[i] !== attendanceEdit.dataCompare[i]){
						isEdit = true;
						break;
					}
				}
			}
			if(queryId && !isEdit){
				location.href = window.globalPath + '/attendancetime/list';
			}else{
				var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
					'<h2>确认' + attendanceEdit.typeTxt + '该考勤设置？</h2></div>';

				ymPrompt.confirmInfo({
					message: _html,
					title: attendanceEdit.typeTxt + '考勤设置',
					width: 420,
					height: 280,
					handler: function(res){
						if(res == 'ok'){
							$.ajax({
								url: window.globalPath + '/attendancetime/save',
								type: 'POST',
								dataType: 'json',
								data: parameter,
								success: function(resMsg){
									if(resMsg.result == 'success'){
										ymPrompt.succeedInfo({
											message: '<div class="ym-inContent ym-inContent-success oneline"><h2> 成功' + attendanceEdit.typeTxt + '考勤</h2></div> ',
											width: 300,
											height: 200,
											titleBar: false,
											handler: function(){
												location.href = window.globalPath + '/attendancetime/list';
											}
										});
										setTimeout(function(){
											location.href = window.globalPath + '/attendancetime/list';
										}, 3000);
									}
								}
							});
						}
					}
				});
			}
		}
	});

	/*取消*/
	$('.j-cancelACtime').on('click', function(){
		ymPrompt.confirmInfo({
			message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>  是否取消编辑考勤设置?</h2></div>  ',
			width: 360,
			height: 200,
			titleBar: false,
			handler: function(res){
				if(res === 'ok'){
					location.href = window.globalPath + '/attendancetime/list'
				}
			}
		});
	});
});

