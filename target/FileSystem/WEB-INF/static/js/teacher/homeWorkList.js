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
		'My97DatePicker': '../plug/My97DatePicker/WdatePicker',
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



require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'My97DatePicker', 'Pagination'], function(jquery){
	/* 全选 */

	var urlQueryClassId = getUrlQuery('classId');

	var $elements = {
		$tab: $('#tab'),
		$keywords: $('.j-Keyword'),//关键字
		$queryKeywords: $('.j-queryKeyword'), // 关键字搜索按钮
	}

	var PaginationOptions = {
		itemsOnPage: 10,
		pageNumber: 1,
	}

	if(urlQueryClassId){
		PaginationOptions.classId = urlQueryClassId;
	}

	/* 分页 */
	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/homeworks/homework',
		render: function(resObj){
			var _self = this, $trlist = '';
			_self.returnPage.empty();

			var resData = resObj.pageInfo; //获取列表数据

			/* 获取数据失败 */
			if(!resObj || typeof resData.total === 'undefined' || resData.total == 0){
				$trlist = '<tr><td colspan="7"><div class="f-cr f-tac">没有当前条件下的作业记录 或 未获得作业记录列表数据</div> </td></tr>';
			}else{

				/* ****正常获取数据*** */
				/* 获取班级列表 */
				var classList = resObj.classList, class_html = '<li data-value="0">全部班级</li>';
				for(var c_i = 0, cilen = classList.length; c_i < cilen; c_i++){
					var classSingle = classList[c_i];
					class_html += '<li data-value="' + classSingle.id + '">' + classSingle.gradeName + ' ' + classSingle.className + '</li>'
				}
				$('.j-classListWrap').html(class_html);
				/* 页面数据 */

				_self.pageCount = resData.total;

				var $list = resData.list;
				for(var i = 0, listlen = $list.length; i < listlen; i++){
					var _attendanceSingle = $list[i];


					/* 发布时间 */
					var createTime = new Date(_attendanceSingle.createTime),
						_y = createTime.getFullYear(), _m = createTime.getMonth() + 1, _d = createTime.getDate(), _h = createTime.getHours(), _min = createTime.getMinutes();
					if(_h < 10){
						_h = '0' + _h
					}
					if(_min < 10){
						_min = '0' + _min
					}

					/* 通过截止时间判断是否显示勾选 */
					var createTimeCompare = timeFunction.getTimes(_attendanceSingle.time);

					var isChecked = createTimeCompare < new Date() ? '' : '<label class="checkbox-ui"><input type="checkbox" value="' + _attendanceSingle.id + '"/><b></b></label>';


					$trlist += ' <tr>' +
						'<td>' + isChecked + '</td>' +
						' <td>' + _y + '-' + _m + '-' + _d + ' ' + _h + ':' + _min + '</td>' +
						' <td>' + _attendanceSingle.time + '</td>' +
						' <td>' + _attendanceSingle.courseName + '</td>';
					if(_attendanceSingle.content != null){
						$trlist += ' <td><a href="' + window.globalPath + '/homeworks/detail?homeworkId=' + _attendanceSingle.id + '" class="simpleOverContent f-tac"> ' + _attendanceSingle.content + '</a></td>';
					}else{
						$trlist += ' <td><a href="' + window.globalPath + '/homeworks/detail?homeworkId=' + _attendanceSingle.id + '" class="simpleOverContent f-tac"></a></td>';
					}
					$trlist += ' <td>' + _attendanceSingle.className + '</td>';
					$trlist += ' <td>' + ( _attendanceSingle.teacherName || '') + '</td></tr>';
				}
			}
			_self.returnPage.html($trlist);
		}
	}


	var homeworkList = new Pagination(options);
	homeworkList.init(PaginationOptions);


	/* 搜索 */
	$elements.$keywords.on('blur', function(){
		PaginationOptions.keyword = $(this).val();
	})
	$elements.$queryKeywords.on('click', function(){
		PaginationOptions.keyword = $elements.$keywords.val();
		PaginationOptions.pageNumber = 1;
		homeworkList.init(PaginationOptions);
	});

	/* 切换班级 */
	var selectClass = new SelectUi($('.j-selectui-class'));
	selectClass.bindE(function(val, text){
		PaginationOptions.classId = val;
		PaginationOptions.pageNumber = 1;
		homeworkList.init(PaginationOptions);
	});

	/* 发布时间与截止时间顺序*/
	$('.j-tabHead').on('click', 'a.j-sort', function(){
		var $this = $(this), type = $this.attr('data-type'), val = +$this.attr('data-value');
		/* 先重置 */
		PaginationOptions.startNum = 99;
		PaginationOptions.endNum = 99;
		$('a.j-sort').removeClass('active');
		if(!$this.hasClass('active')){
			PaginationOptions[type] = val;
			$this.addClass('active');
			PaginationOptions.pageNumber = 1;
			homeworkList.init(PaginationOptions);
		}
	})


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
		var deleteAr = [], deleteStr = ''
		options.returnPage.find('input[type=checkbox]').each(function(){
			var _$this = $(this);
			if(_$this.is(':checked')){
				deleteAr.push(_$this.val());
			}
		});
		if(deleteAr.length > 0){
			var html = '<div class="ym-inContent ym-inContent-warning">' +
				'<div class="content">' +
				'<h2>确认删除作业？</h2>' +
				'</div></div>';
			ymPrompt.confirmInfo({
				message: html, width: 450, height: 300, handler: function(res){
					if(res === 'ok'){
						var idsAr = [];
						$elements.$tab.find('input[type=checkbox]:checked').each(function(){
							idsAr.push($(this).val())
						})
						$.ajax({
							url: window.globalPath + '/homeworks/delete',
							type: 'POST',
							dataType: 'json',
							data: {ids: idsAr.join()},
							success: function(res){
								if(res.result === true){
									setTimeout(function(){
										location.reload();
									}, 3000);
									ymPrompt.succeedInfo({
										message: '成功删除作业!',
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
				message: '未勾选任何作业',
				width: 260,
				height: 200,
				titleBar: false
			})
		}
	});

});