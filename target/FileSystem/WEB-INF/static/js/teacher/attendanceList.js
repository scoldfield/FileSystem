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
require(['jquery', 'function', 'base', 'mypannel', 'My97DatePicker', 'Pagination'], function(jquery){

	/* 更多选择默认时间 */
	var today = new Date(),
		_moreMonth = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1),
		_moreDate = today.getDate() < 10 ? '0' + today.getDate() : today.getDate(),
		todayStr = today.getFullYear() + '-' + _moreMonth + '-' + _moreDate;

	var $elements = {
		$tab: $('#tab'),
		$openBtn: $('.j-openMoreBtn'), //选择更多触发按钮
		$openContent: $('.j-openContent'), //选择更多内容
		$moreChoseDateIpt: $('.j-getChoseDate'), // 选择更多 ： 时间选择
		$queryMore: $('.j-queryMoreCondition'),
		$keywords: $('.j-Keyword'),//关键字
		$queryKeywords: $('.j-queryKeyword'), // 关键字搜索按钮
		$queryCondition: $('.j-queryConditionText'),
		$timefilter: $('.j-timefilter')
	}

	var PaginationOptions = {
		itemsOnPage: 10,
		pageNumber: 1,
		time: todayStr
	}

	/* 分页 */
	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/attendances/list',
		render: function(resObj){


			var _self = this, $trlist = '';
			_self.returnPage.empty();
			$elements.$queryCondition.empty();

			if(resObj.ask && resObj.ask !== '0'){
				$('.j-applyCount').append('<span class="num">' + resObj.ask + '</span>')
			}

			/* 班级名称 */
			$('.j-getClassName').html(resObj.Name);
			$('.j-getAttendanceNum').html(resObj.num);

			var resData = resObj.pageInfo; //获取列表数据
			/* 获取班级列表 */
			var classList = resObj.middleList, class_html = '';
			for(var c_i = 0, cilen = classList.length; c_i < cilen; c_i++){
				var classSingle = classList[c_i];
				//if(classSingle.positionName==""){
				class_html += '<li data-value="' + classSingle.classId + '">' + classSingle.gradeName + classSingle.className + '</li>';
				//}
			}
			$('.j-classListWrap').html(class_html);

			/* 获取数据失败 */

			if(typeof resObj.result !== 'undefined' && resObj.result == false){
				$trlist = '<tr><td colspan="6"><div class="f-cr f-tac">' + (resObj.msg || '没有当前条件下的考勤记录 或 未获得考勤记录列表数据') + '</div> </td></tr>';
			}else if(typeof resData.total === 'undefined' || resData.total == 0){
				$trlist = '<tr><td colspan="6"><div class="f-cr f-tac">没有当前条件下的考勤记录 或 未获得考勤记录列表数据</div> </td></tr>';
				// $('.j-getAttendanceNum').text(0);
			}else{
				/* ****正常获取数据*** */
				/* 页面数据 */

				_self.pageCount = resData.total;
				//$('.j-getAttendanceNum').text(_self.pageCount);
				var $list = resData.list;
				for(var i = 0, listlen = $list.length; i < listlen; i++){
					var _attendanceSingle = $list[i],
						_mobile = _attendanceSingle.mobile || '';
					$trlist += ' <tr><td>' + _attendanceSingle.name + '</td>' +
						' <td>' + _mobile + '</td>';
					if(_attendanceSingle.starttime != null){
						$trlist += ' <td>' + _attendanceSingle.starttime + '</td>';
					}else{
						$trlist += ' <td></td>';
					}
					$trlist += ' <td>' + _attendanceSingle.startType + '</td>';
					if(_attendanceSingle.endtime != null){
						$trlist += ' <td>' + _attendanceSingle.endtime + '</td>';
					}else{
						$trlist += ' <td></td>';
					}

					$trlist += ' <td>' + _attendanceSingle.endType + '</td><td><a href="' + window.globalPath + '/attendanceRecord/list?attcode=' + _attendanceSingle.attendanceCard + '&&time=' + PaginationOptions.time + '">查看详情</a></td></tr>';
				}
			}
			_self.returnPage.html($trlist);
			/* 显示搜索条件 */
			if(PaginationOptions.keyword){
				$elements.$queryCondition.append('筛选条件：' + PaginationOptions.keyword);
			}
			if(PaginationOptions.stratDate || PaginationOptions.endDate){
				$elements.$queryCondition.append(' 日期：' + PaginationOptions.stratDate + '至' + PaginationOptions.endDate)
			}
		}
	}


	var attendanceList = new Pagination(options);
	attendanceList.init(PaginationOptions);


	/* 搜索 */
	$elements.$keywords.on('blur', function(){
		PaginationOptions.keyword = $(this).val();
	})
	$elements.$queryKeywords.on('click', function(){
		PaginationOptions.keyword = $elements.$keywords.val();
		PaginationOptions.pageNumber = 1;
		attendanceList.init(PaginationOptions);
	});

	/* 切换班级 */
	var selectClass = new SelectUi($('.j-selectui-class'));
	selectClass.bindE(function(val, text){
		PaginationOptions.id = val;
		$('.j-getClassName').html(text);
		PaginationOptions.pageNumber = 1;
		attendanceList.init(PaginationOptions);
	});

	$elements.$timefilter.val(todayStr).on(
		'click', function(){
			WdatePicker({
				onpicked: function(){
					PaginationOptions.time = $(this).val();
					PaginationOptions.pageNumber = 1;
					options.returnPage.html('<tr> <td colspan="7"> <div class="f-tac">数据加载中 ...</div> </td> </tr>');
					attendanceList.init(PaginationOptions);
				}
			});
		});


	/*	 更多选择 业务取消
	 $('.j-getChoseDate-start,.j-getChoseDate-end').val(todayStr);
	 /!* 更多选择  触发 *!/
	 $elements.$openBtn.bind('click', function(){
	 $elements.$openContent.toggle();
	 });
	 /!* 更多选择日期选择 *!/
	 $elements.$moreChoseDateIpt.bind('click', WdatePicker);
	 $elements.$queryMore.on('click', function(){
	 var errorMsgAr = [], errorMsg = '';
	 /!*获取开始时间与结束时间*!/
	 var _startTime = $.trim($('.j-getChoseDate-start').val()), _endTime = $.trim($('.j-getChoseDate-end').val());
	 if(_startTime === '' || _endTime === ''){
	 errorMsgAr.push('开始时间和结束时间不能为空！')
	 }else if(new Date(_startTime) > new Date(_endTime)){
	 errorMsgAr.push('开始时间不能晚于或者等于结束时间！')
	 }

	 if(errorMsgAr.length > 0){
	 $('.more-errotips').html(errorMsgAr.join('; '));
	 }else{
	 PaginationOptions.stratDate = _startTime;
	 PaginationOptions.endDate = _endTime;
	 var $states = $('.j-queryMoreState input[type=checkbox]'), stateAr = [];
	 $states.each(function(){
	 var $this = $(this);
	 if($this.is(':checked')){
	 stateAr.push($this.val());
	 }
	 });
	 PaginationOptions.states = stateAr.join(',');
	 $('.more-errotips').empty();
	 $elements.$openContent.hide();
	 PaginationOptions.pageNumber = 1;
	 attendanceList.init(PaginationOptions);
	 }
	 });
	 $('.j-cancelMoreCondition').on('click', function(){
	 $('.j-queryMoreState input').attr('checked', 'checked');
	 $('.j-getChoseDate-start,.j-getChoseDate-end').val(todayStr);
	 });
	 */

});