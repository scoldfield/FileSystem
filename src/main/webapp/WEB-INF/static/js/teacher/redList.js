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
		'mypannel': '../common/teacherSideBar',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'My97DatePicker': '../plug/My97DatePicker/WdatePicker',
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
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'Pagination', 'My97DatePicker'], function(jquery){

	(function(){
		/* 获取班级 */
		$.ajax({
			url: window.globalPath + '/redlist/findClass',
			type: 'POST',
			dataType: 'json',
			success: function(res){
				var html = ''
				if(res && res.length > 0){
					for(var i in res){
						html += '<li data-value="' + res[i].id + '">' + res[i].gradeName + ' ' + res[i].className + '</li>'
					}
				}
				$('.j-classList').append(html);
			}
		});

		/* 今天 */
		var today = new Date();
		var _pm = parseInt(today.getMonth() + 1)
		var _m = _pm < 10 ? '0' + _pm : _pm;
		var stimeStr = today.getMonth() >= 2 && today.getMonth() < 9 ? today.getFullYear() + '-03-01' : ( today.getMonth() < 2 ? ( today.getFullYear() - 1) + '-09-01' : today.getFullYear() + '-09-01');
		$('.j-stime').val(stimeStr);
		$('.j-etime').val(today.getFullYear() + '-' + _m + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()));
	})();

	/* 分页 */
	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/redlist/redlisttotal',
		render: function(resObj){
			var _self = this, $trlist = '';
			_self.returnPage.empty();

			/* 获取数据失败 */
			if(!resObj || typeof resObj.total === 'undefined' || resObj.total == 0){
				$trlist = ' <li class="f-cr f-tac" style="padding:20px; width:100%;">没有当前条件下的学生红花 或 未获得学生红花列表数据</li>';
				$('.j-getDriverNum').text(0);
			}else{
				/* 正常获取数据 */
				_self.pageCount = resObj.total;
				$('.j-getDriverNum').text(_self.pageCount);
				var $list = resObj.list;
				for(var i = 0, listlen = $list.length; i < listlen; i++){
					var _redSingle = $list[i],
						_faceimg = _redSingle.imageUrl || '/' + window.globalPath.split('/')[1] + '/static/images/face.png',
						_name = _redSingle.stuName || '无名氏',
						_total = _redSingle.total;

					$trlist += ' <li>' +
						' <div class="face"> <div class="img"><img src="' + _faceimg + '"> </div></div>' +
						' <div class="inf"> <p class="name">' + _name + '</p><p class="num">' + _total + '</p>' +
						' </div>' +
						' </li>';

				}
			}
			_self.returnPage.html($trlist);
		}
	}

	var PaginationOptions = {
		itemsOnPage: 10,
		pageNumber: 1,
		sTime: '',
		etime: ''
	}

	var redList = new Pagination(options);
	redList.init(PaginationOptions);

	/* 班级切换 */
	var classType = new SelectUi($('.j-selectui-class'));
	classType.bindE(function(val, text){
		PaginationOptions.pageNumber = 1;
		PaginationOptions.classId = +val || '';
		$('.j-classTitle').html(text);
		redList.init(PaginationOptions);
	});

	/* 时间选择 */
	$('.WdatePicker').on('click', WdatePicker);
	/* 搜索 */
	$('.j-queryKeyword').bind('click', function(){
		PaginationOptions.stuName = $('.j-Keyword').val();
		PaginationOptions.pageNumber = 1;
		redList.init(PaginationOptions);
	});

	$('.j-queryTimer').on('click', function(){
		PaginationOptions.pageNumber = 1;
		PaginationOptions.sTime = $('.j-stime').val() + ' 00:00:00';
		PaginationOptions.etime = $('.j-etime').val() + ' 23:59:59';
		if(timeFunction.getTimes(PaginationOptions.sTime) > timeFunction.getTimes(PaginationOptions.etime)){
			ymPrompt.alert({
				message: '<div class="ym-inContent ym-inContent-warning oneline" ><h2>起始日期不能大于结束日期</h2></div>',
				titleBar: false,
				width: 420,
				height: 240
			});
			return false;
		}
		redList.init(PaginationOptions);
	});

});