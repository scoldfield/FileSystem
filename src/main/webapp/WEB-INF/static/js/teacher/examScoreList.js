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
		'Pagination': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'Pagination'], function(jquery){

	/* 获取考试ID */
	var scoreExamId = getUrlQuery('examId');

	if(window.isSendSelf === 'false'){
		$('.j-importList,.j-sendScore,.j-clearScore').hide();
	}
	//发送成绩链接修整
	document.querySelector('.j-importList').href = window.globalPath + '/exam/import?examid=' + scoreExamId;

	/* 获取班级列表 */
	(function(){
		$.ajax({
			url: window.globalPath + '/score/findClass',
			type: 'POST',
			dataType: 'json',
			data: {id: scoreExamId},
			success: function(resData){
				var classList_html = ''
				if(resData){
					for(var i in resData){
						var classSingle = resData[i];
						classList_html += '<li data-value="' + classSingle.id + '">' + classSingle.gradeName + ' ' + classSingle.className + '</li>'
					}
					$('.j-classList').append(classList_html);
				}
			}
		})
	})();

	var $elements = {}

	var templateData = {}

	/* 分页 */
	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/score/scorelistjson',
		render: function(resObj){
			var _self = this, $trlist = '';
			_self.returnPage.empty();

			/* 获取数据失败 */
			if(!resObj || typeof resObj.total === 'undefined' || resObj.total == 0){
				$trlist = '<tr><td colspan="4"><div class="f-cr f-tac">没有当前条件下的考试 或 未获得考试列表数据</div> </td></tr>';
			}else{
				/* 正常获取数据 */
				_self.pageCount = resObj.total;
				var $list = resObj.list;
				for(var i = 0, listlen = $list.length; i < listlen; i++){
					var examSingle = $list[i];
					var _score = examSingle.score === -1 ? '' : examSingle.score;
					var isDisabled = window.isSendSelf === 'true' ? '' : 'disabled = "disabled"'
					$trlist += ' <tr>' +
						'<td>' + examSingle.className + '</td>' +
						' <td>' + examSingle.stuno + '</td>' +
						' <td>' + examSingle.stuname + '</td>' +
						' <td><input type="text"   autocomplete="off"   data-item="' + i + '" data-stuid="' + examSingle.stuId + '" data-id="' + examSingle.id + '" class="u-gipt u-gipt-transparent f-tac" value="' + _score + '" ' + isDisabled + '/></td>' +
						' </tr>';
					templateData[i] = '' + examSingle.score;
				}
			}
			_self.returnPage.html($trlist);
		}
	}


	var PaginationOptions = {
		itemsOnPage: 10,
		pageNumber: 1,
		examId: scoreExamId,
		stuname: '',
		classId: '',
		ordername: ''
	}

	var scoreList = new Pagination(options);
	scoreList.init(PaginationOptions);


	var selectCourse = new SelectUi($('.j-selectui-transcript'));
	selectCourse.bindE(function(val){
		PaginationOptions.classId = val;
		PaginationOptions.pageNumber = 1;
		scoreList.init(PaginationOptions);
	});

	/* 搜索 */
	$('.j-queryKeyword').bind('click', function(){
		PaginationOptions.stuname = $('.j-Keyword').val();
		PaginationOptions.pageNumber = 1;
		scoreList.init(PaginationOptions);
	});

	/* 发布时间与截止时间顺序*/
	$('.j-tabHead').on('click', 'a.j-sort', function(){
		var $this = $(this), val = +$this.attr('data-value');
		/* 先重置 */
		$('a.j-sort').removeClass('active');
		if(!$this.hasClass('active')){
			PaginationOptions.ordername = val;
			$this.addClass('active');
			PaginationOptions.pageNumber = 1;
			scoreList.init(PaginationOptions);
		}
	})


	/* 成绩修改与保存 */
	options.returnPage.delegate('input.u-gipt', {
		'focus': function(){
			var $this = $(this), _scoreId = $this.attr('data-id'), _val = $this.val();
		}, 'blur': function(){
			var $this = $(this), _scoreId = $this.attr('data-id'), _stuId = $this.attr('data-stuid'), _score = +$this.val(), _item = $this.attr('data-item');
			if(_stuId === '0'){
				_stuId = null;
			}
			if(_scoreId === '0'){
				_scoreId = null;
			}
			if(_score === '' || isNaN(+_score) || +_score < 0){
				ymPrompt.alert({
					message: '<div class="ym-inContent ym-inContent-warning oneline">成绩不能为空，只能为数字，且必须大于等于0</div>',
					width: 420,
					height: 240,
					titleBar: false
				});
				$this.val('');
			}else{
				if(_score !== templateData[_item]){
					$.ajax({
						url: window.globalPath + '/score/saveScore',
						type: 'POST',
						dataType: 'json',
						data: {ids: scoreExamId + '##' + _stuId + '##' + _score + '##' + _scoreId},
						success: function(res){
						}
					})
				}
			}
		}
	});


	function ajaxFunction(url, data, type, isReload){
		var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
			'<h2>是否' + type + '成绩</h2></div>';
		ymPrompt.confirmInfo({
			message: _html,
			title: '发送成绩',
			width: 360,
			height: 260,
			handler: function(res){
				if(res == 'ok'){
					$.ajax({
						url: window.globalPath + url,
						type: 'POST',
						dataType: 'json',
						data: data,
						success: function(resMsg){
							if(resMsg.result == 'success'){
								if(isReload){
									setTimeout(function(){
										location.reload();
									}, 3000)
								}
								var ym_option = {
									message: type + '成功!',
									width: 240,
									height: 220
								}
								if(isReload){
									ym_option.handler = function(){
										location.reload();
									}
								}
								ymPrompt.succeedInfo(ym_option);
							}else{
								ymPrompt.alert(type + '失败')
							}
						},
						error: function(){
							ymPrompt.alert(type + '失败')
						}
					});
				}
			}
		});
	}

	/* 发送成绩 */
	$('.j-sendScore').on('click', function(){
		ajaxFunction('/score/sendScore', {examId: scoreExamId}, '发送');
	});

	/* 清空 */
	$('.j-clearScore').on('click', function(){
		ajaxFunction('/score/batchDeleteScore', {ids: scoreExamId}, '清空', true)
	});


});