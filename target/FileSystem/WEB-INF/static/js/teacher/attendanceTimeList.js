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
	/* 全选 */

	var $elements = {
		$tab: $('#tab'),
	}

	var PaginationOptions = {
		itemsOnPage: 10,
		pageNumber: 1,
	}

	/* 分页 */
	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/attendancetime/attendancetimeJson',
		render: function(resObj){
			var _self = this, $trlist = '';
			_self.returnPage.empty();

			/* 获取数据失败 */
			if(!resObj || typeof resObj.total === 'undefined' || resObj.total == 0){
				$trlist = '<tr><td colspan="6"><div class="f-cr f-tac">没有当前条件下的考勤记录 或 未获得考勤记录列表数据</div> </td></tr>';
			}else{
				/* 正常获取数据 */
				_self.pageCount = resObj.total;
				var $list = resObj.list;
				for(var i = 0, listlen = $list.length; i < listlen; i++){
					var _attendanceSingle = $list[i];
					var _lunchstartStr = _attendanceSingle.lunchstartStr || '无',
						_lunchendStr = _attendanceSingle.lunchendStr || '无';
					$trlist += ' <tr><td>' + _attendanceSingle.typeName + '</td>' +
						' <td>' + _attendanceSingle.arrivetimeStr + '</td>' +
						' <td>' + _lunchstartStr + '</td>' +
						' <td>' + _lunchendStr + '</td>' +
						' <td>' + _attendanceSingle.leavetimeStr + '</td>' +
						' <td><div class="overflowContent"><p>' + _attendanceSingle.gradeName + '</p></div></td>' +
						' <td><a class="general" href="' + window.globalPath + '/attendancetime/update?id=' + _attendanceSingle.id + '">编辑</a>' +
						'<a class="general j-delete" href="javascript:void(0)" data-id="' + _attendanceSingle.id + '">删除</a></td>' +
						' </tr>'
				}
			}
			_self.returnPage.html($trlist);
		}
	}

	var attendanceList = new Pagination(options);
	attendanceList.init(PaginationOptions);

	options.returnPage.on('click', '.j-delete', function(){
		var $this = $(this),
			_id = $this.attr('data-id'),
			_html = '<div class="ym-inContent ym-inContent-warning oneline">' +
				'<h2>确认移除此考勤设置？</h2></div>';
		ymPrompt.confirmInfo({
			message: _html,
			width: 300,
			height: 280,
			title: '删除考勤设置',
			handler: function(res){
				if(res == 'ok'){
					$.ajax({
						url: window.globalPath + '/attendancetime/batchDelete',
						type: 'POST',
						dataType: 'json',
						data: {ids: _id},
						success: function(resMsg){
							if(resMsg.result == 'success'){
								setTimeout(function(){
									location.reload();
								}, 3000)
								ymPrompt.succeedInfo({
									message: '<div class="ym-inContent ym-inContent-success oneline"><h2> 成功删除' + resMsg.num + '条考勤</h2></div>',
									width: 300,
									height: 220,
									titleBar: false,
									handler: function(){
										location.reload();
									}
								});
							}else{
								alert(resMsg.msg || '删除失败');
							}
						}
					})
				}
			}
		});
	});
});