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
		'Pagination': '../plug/simplePagination/jquery.simplePagination'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'Pagination': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'Pagination'], function(jquery){
	/* 全选 */
	var $elements = {
		$tab: $('#tab')
	};
	$.ajax({
		url: window.globalPath + '/exam/courseJson',
		type: 'POST',
		dataType: 'json',
		success: function(res){
			var courseList = '';
			for(var c_i = 0, cilen = res.couseList.length; c_i < cilen; c_i++){
				var courseSingle = res.couseList[c_i];
				courseList += '  <li data-value="' + courseSingle.id + '">' + courseSingle.name + '</li>'
			}
			$('.j-courseList').append(courseList);
		}
	});
	/* 分页 */
	var options = {
		returnPage: $elements.$tab,
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/exam/examlistjson',
		render: function(resObj){
			var _self = this, $trlist = '';
			_self.returnPage.empty();
			/* 获取数据失败 */
			if(!resObj || typeof resObj.total === 'undefined' || resObj.total == 0){
				$trlist = '<tr><td colspan="7"><div class="f-cr f-tac">没有当前条件下的考试 或 未获得考试列表数据</div> </td></tr>';
			}else{
				/* 正常获取数据 */
				_self.pageCount = resObj.total;
				var $list = resObj.list;
				for(var i = 0, listlen = $list.length; i < listlen; i++){
					var examSingle = $list[i],
						_examTime = examSingle.examTime.split(' -')[0];
					var oprate = '';
					switch(examSingle.entername){
					case '未考':
						oprate = '<span class="f-cgray">  ' + examSingle.entername + '</span>';
						break;
					case '上传':
						oprate = examSingle.isSendSelf === 'true' ? '<a href="' + window.globalPath + '/exam/import?examid=' + examSingle.id + '"> ' + examSingle.entername + '</a>' : '<span class="f-cgray">  ' + examSingle.entername + '</span>';
						break;
					case '查看':
						oprate = '<a href="' + window.globalPath + '/score/list?examId=' + examSingle.id + '"> ' + examSingle.entername + '</a>';
						break;
					}
					var isGray = examSingle.entername === '上传' && !examSingle.isSendSelf ? 'gray' : '';
					$trlist += ' <tr><td><label class="checkbox-ui checkbox-ui-choseAll"><input type="checkbox" value="' + examSingle.id + '"><b></b></label></td>' +
						' <td>' + _examTime + '</td>' +
						' <td>' + examSingle.couseName + '</td>' +
						' <td><a class="general"  href="' + window.globalPath + '/exam/examDetail?id=' + examSingle.id + '">' + examSingle.title + '</a></td>' +
						' <td><div class="simpleOverContent"> ' + examSingle.tmpContent + '</div></td>' +
						' <td><div class="overflowContent"><p>' + examSingle.className + '</p></a></td>' +
						' <td>' + oprate + '</td>' +
						' </tr>';
				}
			}
			_self.returnPage.html($trlist);
		}
	};
	var PaginationOptions = {
		itemsOnPage: 10,
		pageNumber: 1
	};
	var examList = new Pagination(options);
	examList.init(PaginationOptions);
	/* 搜索 */
	$('.j-queryKeyword').bind('click', function(){
		PaginationOptions.tmpContent = $('.j-Keyword').val();
		PaginationOptions.pageNumber = 1;
		examList.init(PaginationOptions);
	});
	/* 全选 */
	$('.j-selectAll').bind('change', function(){
		var $this = $(this);
		var isAllCheck = $this.attr('checked');
		$elements.$tab.find('input[type=checkbox]').each(function(){
			var _$this = $(this);
			if(_$this.is(':checked')){
				if(!isAllCheck){
					_$this.removeAttr('checked');
				}
			}else{
				if(isAllCheck){
					_$this.attr('checked', 'checked');
				}
			}
		});
	});
	options.returnPage.on('click', 'input[type=checkbox]', function(){
		if(options.returnPage.find('input[type=checkbox]').length === options.returnPage.find('input[type=checkbox]:checked').length){
			$('.j-selectAll').attr('checked', 'checked');
		}else{
			$('.j-selectAll').removeAttr('checked');
		}
	});
	/* 批量删除*/
	$('.j-batchDelete').bind('click', function(){
		var deleteAr = [], deleteStr = '';
		options.returnPage.find('input[type=checkbox]').each(function(){
			var _$this = $(this);
			if(_$this.is(':checked')){
				deleteAr.push(_$this.val());
			}
		});
		if(deleteAr.length > 0){
			var html = '<div class="ym-inContent ym-inContent-warning">' +
				'<h2>确认删除？</h2>' +
				'<p>删除信息后将无法回复</p></div>';
			ymPrompt.confirmInfo({
				message: html, width: 450, height: 300, handler: function(res){
					if(res === 'ok'){
						var idsAr = [];
						$elements.$tab.find('input[type=checkbox]:checked').each(function(){
							idsAr.push($(this).val())
						});
						$.ajax({
							url: window.globalPath + '/exam/batchDelete',
							type: 'POST',
							dataType: 'json',
							data: {ids: idsAr.join()},
							success: function(res){
								if(res.result == 'success'){
									setTimeout(function(){
										location.reload();
									}, 3000);
									ymPrompt.succeedInfo({
										message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>成功删除 ' + res.num + '条数据!</h2></div>',
										width: 300,
										height: 220,
										handler: function(){
											location.reload();
										}
									});
								}
							}
						});
					}
				}
			});
		}else{
			ymPrompt.succeedInfo({
				message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>未勾选任何考试</h2></div>',
				width: 260,
				height: 200,
				titleBar: false
			})
		}
	});
	/* 选择科目 */
	var selectCourse = new SelectUi($('.j-selectui-exam'));
	selectCourse.bindE(function(val){
		PaginationOptions.courseId = val === '0' ? null : val;
		PaginationOptions.pageNumber = 1;
		PaginationOptions.tmpContent = $('.j-Keyword').val();
		examList.init(PaginationOptions);
	});
});