/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'mypannel': '../common/teacherSideBar',
		'Pagination': '../plug/simplePagination/jquery.simplePagination',
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']},
		'Pagination': {deps: ['jquery']},
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'mypannel', 'Pagination'], function(jquery){


	var detailTime = getUrlQuery('time'),
		attCode = getUrlQuery('attcode');

	var $elements = {
		$tab: $('#tab'),
	}

	var PaginationOptions = {
		itemsOnPage: 10,
		pageNumber: 1,
		time: detailTime,
		attcode: attCode
	}

	/* 分页 */
	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/attendanceRecord/detail',
		render: function(resObj){
			var _self = this;
			_self.returnPage.empty();
			var $trlist = '';

			if(resObj.result == true){
				if(resObj.msg == '成功' && resObj.pageInfo){
					var resData = resObj.pageInfo; //获取列表数据
					_self.pageCount = resData.total;

					var $list = resData.list;
					for(var i = 0, listlen = $list.length; i < listlen; i++){
						var _attendanceSingle = $list[i];
						$trlist += '<tr><td>' + _attendanceSingle.studentName + '</td><td>' + _attendanceSingle.studentCard + '</td><td>' + _attendanceSingle.time + '</td><td>' + _attendanceSingle.state + '</td></tr>';
					}
				}else{
					$trlist += '<tr><td colspan="4"><div class="f-cr f-tac">' + resObj.msg + '</div> </td></tr>';
				}
			}else{
				$trlist += '<tr><td colspan="4"><div class="f-cr f-tac">暂无数据</div> </td></tr>';
			}
			_self.returnPage.html($trlist);
		}
	}

	var attendanceList = new Pagination(options);
	attendanceList.init(PaginationOptions);
});