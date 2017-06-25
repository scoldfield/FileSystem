/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'mypannel': '../common/teacherSideBar',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'Pagination': '../plug/simplePagination/jquery.simplePagination',
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']},
		'Pagination': {deps: ['jquery']},
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'Pagination'], function(jquery){


	var $elements = {
		$courseWrap: $('.m-courseWrap'),
		$classSchedule: $('.j-classSchedule'),
		$tableSchedule: $('#tableSchedule'),
		$scheduleEdit: $('.j-scheduleEdit')
	}

	var scheduleModule = {},
		postData = [],
		currentClassId = 0,
		currentSemesterId = 0,
		currentSemesterStr = '',
		currentType = 0;
	editDone = true;

	var indexArray = {
		firstLesson: 1,
		eighthLesson: 8,
		fifthLesson: 5,
		fourthLesson: 4,
		ninthLesson: 9,
		secondLesson: 2,
		seventhLesson: 7,
		sixthLesson: 6,
		tenthLesson: 10,
		thirdLesson: 3,
	};
	var indexArrayName = [0, 'firstLesson', 'secondLesson', 'thirdLesson', 'fourthLesson', 'fifthLesson', 'sixthLesson', 'seventhLesson', 'eighthLesson', 'ninthLesson', 'tenthLesson',]

	function currentSemester(val, text){
		var _semesterAr = val.split('##');
		$('.j-sem').html(text);
		currentSemesterId = +_semesterAr[0];
		currentSemesterStr = _semesterAr;
		getSemestersetList(currentSemesterId, currentClassId);
	}

	function currentClass(val, text){
		$('.j-className').html(text);
		var valAr = val.split('##');
		currentClassId = +valAr[0];
		currentType = valAr[1];
		/* 是否可编辑 */
		if(currentType === '1'){
			$elements.$scheduleEdit.show();
		}else{
			$elements.$scheduleEdit.hide();
		}
		getSemestersetList(currentSemesterId, currentClassId);
	}

	var selectui_semester = new SelectUi($('.j-selectui-semester'));
	selectui_semester.bindE(currentSemester);

	var selectui_class = new SelectUi($('.j-selectui-class'));
	selectui_class.bindE(currentClass);


	/* 启动编辑 */
	$elements.$scheduleEdit.on('click', function(){
		var $this = $(this);
		if($this.hasClass('edit')){
			$elements.$classSchedule.find('input').removeAttr('disabled');
			$this.removeClass('edit').text('编辑完成')
		}else if($this.hasClass('create')){
			rendBlank();
			$elements.$scheduleEdit.removeClass('create edit').text('编辑完成');
		}else{
			var postDataHtml = '[', postAr = [];
			for(var i = 0, len = postData.length; i < len; i++){
				postAr = [];
				for(var j in postData[i]){
					postAr.push(j + ':"' + postData[i][j] + '"');
				}
				if(postAr.length > 0){
					postDataHtml += '{' + postAr.join(',') + '},';
				}
			}
			if(postDataHtml.length > 1){
				postDataHtml = postDataHtml.substring(0, postDataHtml.length - 1)
			}else{
				$this.addClass('edit').text('编辑');
				renderScheduleList(false);
				return;
			}
			postDataHtml += ']';
			var semesterHtml = '[{semestersetId:' + currentSemesterStr[0] + ',semester:"' + currentSemesterStr[2] + '",schoolId:' + currentSemesterStr[1] + ',starttime:"' + currentSemesterStr[3] + '",endtime:"' + currentSemesterStr[4] + '"}]';
			if(editDone === true){
				editDone = false;
				$.ajax({
					url: window.globalPath + '/schedule/saveSchedule',
					type: 'POST',
					dataType: 'json',
					data: {scheduleList: postDataHtml, semestersetList: semesterHtml},
					success: function(res){
						editDone = true;
						if(res.result == 'success' && res.scheduleList){
							$elements.$classSchedule.find('input').attr('disabled', 'disabled');
							$this.addClass('edit').text('编辑');
							renderScheduleList(res.scheduleList);
						}else{
							alert('未编辑成功！');
						}
					}
				});
			}else{
				ymPrompt.alert({
					message: '数据提交中，请稍后....',
					titleBar: false
				});
			}
		}
	});

	/* 编辑课程单体 */
	$elements.$tableSchedule.delegate('input', {
		'click': function(e){
			e.stopPropagation();
		},
		'focus': function(e){
			var $this = $(this),
				_top = $this.offset().top,
				_left = $this.offset().left;
			$elements.$courseWrap.css({'top': _top + 30 + 'px', 'left': _left + 'px'}).show();
			$elements.$tableSchedule.find('input').removeClass('active');
			$this.addClass('active');
		},
		'blur': function(){
			var $this = $(this), _val = $this.val(), dataId = $this.attr('data-id').split('##');
			postData[dataId[0]] = postData[dataId[0]] || {classId: currentClassId, semesterId: currentSemesterId, week: dataId[0]};
			postData[dataId[0]][dataId[1]] = _val.length > 6 ? _val.substring(0, 6) : _val;
			$this.val(postData[dataId[0]][dataId[1]])
		}
	}).delegate('.j-create', 'click', function(){
		rendBlank();
		$elements.$scheduleEdit.removeClass('create edit').text('编辑完成');
	});

	/* 显示课程列表 */
	$elements.$courseWrap.on('click', 'li', function(e){
		e.stopPropagation();
		var $this = $(this), _val = $this.text(), $thisIip = $('input.active'), dataId = $thisIip.attr('data-id').split('##');
		$thisIip.val(_val).removeClass('active');
		$elements.$courseWrap.hide();
		postData[dataId[0]] = postData[dataId[0]] || {classId: currentClassId, semesterId: currentSemesterId, week: dataId[0]};
		postData[dataId[0]][dataId[1]] = _val;
	});

	/* 关闭窗口 */
	$(document).on('click', function(){
		$elements.$courseWrap.hide();
		$('input.active').removeClass('active');
	});

	function rendBlank(){
		var _html = '';
		for(var i = 1; i <= 8; i++){
			_html += '<tr>' +
				'<td>' + i + '</td>';
			for(var j = 1; j <= 7; j++){
				_html += '<td><input type="text" data-id="' + j + '##' + indexArrayName[i] + '" class="u-gipt"></td>'
			}
			_html += '</tr>';
		}
		$elements.$tableSchedule.html(_html);
	}

	//渲染课程表
	function renderScheduleList(res){
		var table_html = '';
		if(res && res.length > 0){
			$elements.$scheduleEdit.html('编辑').removeClass('create').addClass('edit');
			for(var i = 0; i < res.length; i++){
				var scheduleSingle = res[i];
				/* 构建基础模型 */
				postData[+scheduleSingle.week] = scheduleSingle;
				/* scheduleModule 创建*/
				for(var j in scheduleSingle){
					if(scheduleSingle.hasOwnProperty(j)){
						if(j == 'tenthLesson' || j == 'ninthLesson') continue;
						scheduleModule[j] = scheduleModule[j] || [];
						scheduleModule[j][scheduleSingle.week] = scheduleSingle[j];
					}
				}
			}
			var htmlGroup = {}
			for(var k in scheduleModule){
				if(scheduleModule.hasOwnProperty(k)){
					var _index = indexArray[k] || 999;
					htmlGroup[k + 'Html'] = '<tr><th>' + _index + '</th>'
					for(var g = 1; g <= 7; g++){
						htmlGroup[k + 'Html'] += typeof scheduleModule[k][g] === 'undefined' ? '<td><input type="text" data-id="' + g + '##' + k + '" class="u-gipt" disabled="disabled"></td>' : '<td><input type="text" data-id="' + g + '##' + k + '"  class="u-gipt" value="' + scheduleModule[k][g] + '" disabled="disabled"></td>';
					}
					htmlGroup[k + 'Html'] += '</tr>'
				}
			}
			table_html = htmlGroup.firstLessonHtml + htmlGroup.secondLessonHtml + htmlGroup.thirdLessonHtml + htmlGroup.fourthLessonHtml + htmlGroup.fifthLessonHtml + htmlGroup.sixthLessonHtml + htmlGroup.seventhLessonHtml + htmlGroup.eighthLessonHtml + htmlGroup.ninthLessonHtml + htmlGroup.tenthLessonHtml;
		}else{
			var isCreate = currentType === '1' ? '<a href="javascript:void(0)" class="u-gbtn u-gbtn-add j-create">创建课表</a>' : '';
			table_html = '<tr><td colspan="8"><div class="m-create">尚未创建本学期课表 ' + isCreate + '</div></td></tr>';
			if(currentType === '1'){
				$elements.$scheduleEdit.html('创建课表').removeClass('edit').addClass('create');
			}else{
				$elements.$scheduleEdit.hide();
			}

		}
		$elements.$tableSchedule.html(table_html);
	}

	/* 获取数据列表 */
	function getSemestersetList(semesterId, classId){
		$elements.$tableSchedule.empty();
		var table_html = '';
		postData = [];
		scheduleModule = {};
		if(classId && semesterId){
			$.ajax({
				url: window.globalPath + '/schedule/getScheduleList',
				type: 'POST',
				dataType: 'json',
				data: {classId: classId, semesterId: semesterId},
				async: false,
				success: function(res){
					renderScheduleList(res);
				}
			});
		}else{
			var isCreate = currentType === '1' ? '<a href="javascript:void(0)" class="u-gbtn u-gbtn-add j-create">创建课表</a>' : '';
			table_html = '<tr><td colspan="8"><div class="m-create">尚未创建本学期课表 ' + isCreate + '</div></td></tr>';
			if(currentType === '1'){
				$elements.$scheduleEdit.html('创建课表').removeClass('edit').addClass('create');
			}else{
				$elements.$scheduleEdit.hide();
			}
			$elements.$tableSchedule.html(table_html);
		}
	}

	/* 初始化 渲染 */
	(function(){
		$.ajax({
			url: window.globalPath + '/schedule/getAllClassAndCourse',
			type: 'POST',
			dataType: 'json',
			data: {resourceId: window.resourceId},
			success: function(res){
				if(res){
					if(res.courseList && res.courseList.length > 0){
						var _courseListHtml = '';
						for(var i = 0, ilen = res.courseList.length; i < ilen; i++){
							_courseListHtml += '  <li data-id="' + res.courseList[i].id + '">' + res.courseList[i].name + '</li>'
						}
						$elements.$courseWrap.html(_courseListHtml);
					}
				}
				/* 获取班级 */
				if(res.result && res.result.length > 0){
					var _classListHtml = '', _classNowId = 0;
					for(var j = 0, jlen = res.result.length; j < jlen; j++){
						if(j == 0){
							_classNowId = res.result[j].classId + '##' + res.result[j].type;

						}
						_classListHtml += '  <li data-value="' + res.result[j].classId + '##' + res.result[j].type + '">' + res.result[j].gradeName + res.result[j].className + '</li>'
					}
					$('.j-classList').html(_classListHtml);
				}
				/* 获取学期 */
				if(res.semesterList && res.semesterList.length > 0){
					var _semesterListHtml = '', _seAr = [], _semNow = '';
					for(var k = 0, klen = res.semesterList.length; k < klen; k++){
						var semesterSingle = res.semesterList[k],
							_semesterId = semesterSingle.semesterId || 0,
							dataValue = _semesterId + '##' + semesterSingle.schoolId + '##' + semesterSingle.semesterset + '##' + semesterSingle.starttime + '##' + semesterSingle.endtime;
						if(semesterSingle.state === '1'){
							_semNow = dataValue;
						}
						_semesterListHtml += '<li data-value="' + dataValue + '">' + semesterSingle.semesterset + '</li>';
					}
					$('.j-semesterList').html(_semesterListHtml);
				}


				selectui_semester.init(_semNow, null, function(val, text){
					var _semesterAr = val.split('##');
					$('.j-sem').html(text);
					currentSemesterId = +_semesterAr[0];
					currentSemesterStr = _semesterAr;
				});
				selectui_class.init(_classNowId, null, function(val, text){
					$('.j-className').html(text);
					var valAr = val.split('##');
					currentClassId = +valAr[0];
					currentType = valAr[1];
					/* 是否可编辑 */
					if(currentType === '1'){
						$elements.$scheduleEdit.show();
					}else{
						$elements.$scheduleEdit.hide();
					}
				});
				/* 渲染后获取 课程列表  */
				getSemestersetList(currentSemesterId, currentClassId);
			}
		});
	})();
});