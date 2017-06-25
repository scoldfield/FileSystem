/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'Pagination': '../plug/simplePagination/jquery.simplePagination',
		'mypannel': '../common/teacherSideBar'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'Pagination': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'mypannel', 'Pagination'], function(jquery){


	/* 分页 */
	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/redlist/redSend',
		render: function(resObj){
			var _self = this, $trlist = '';
			_self.returnPage.empty();

			/* 获取数据失败 */
			if(!resObj || typeof resObj.total === 'undefined' || resObj.total == 0){
				$trlist = '<tr><td colspan="4"><div class="f-cr">没有送出的红花 或 未取得数据</div></td></tr> ';
			}else{
				/* 正常获取数据 */
				_self.pageCount = resObj.total;
				var $list = resObj.list;
				for(var i = 0, listlen = $list.length; i < listlen; i++){
					var _sendSingle = $list[i];
					var isClassring = _sendSingle.isclassring == 0 ? 'has' : 'nothas';
					$trlist += (' <tr>' +
					' <td><span class="' + isClassring + '" ><b>已发班级圈</b></span></td>' +
					' <td><div class="simpleOverContent"> ' + _sendSingle.tmpContent + '</div></td>' +
					' <td><div class="overflowContent"><p>' + _sendSingle.stuName + '</p></div> </td>' +
					' <td>' + _sendSingle.time + '</td>' +
					' </tr>');

				}
			}
			_self.returnPage.html($trlist);
		}
	}
	var PaginationOptions = {
		itemsOnPage: 10,
		pageNumber: 1
	}
	var redList = new Pagination(options);
	redList.init(PaginationOptions);
});