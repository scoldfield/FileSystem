/**
 * Document by wangshuyan@chinamobile.com on 2015/11/20 0020.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/base',
		'function': '../common/function',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'Pagination': '../plug/simplePagination/jquery.simplePagination'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'Pagination': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']}
	},
	waitSeconds: 0
});

require(['jquery', 'base', 'function', 'ymPrompt', 'Pagination'], function(jquery){

	var queryShoolId = getUrlQuery('schoolId') || '';

	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/teacher/getTeacherList',
		render: function(resObj){
			var _self = this, $trlist = '';
			_self.returnPage.empty();
			!_self.pageCount && (_self.pageCount = resObj.pageInfo.total);
			if(!resObj){
				$trlist = ' <tr><td colspan="6" align="center">未获取到列表数据</td></tr>';
			}else{
				var $list = resObj.teacherList, listlen = $list.length;
				if($list.length <= 0){
					$trlist = ' <tr><td colspan="6" align="center">未搜索到符合条件的老师</td></tr>';
				}else{
					for(var i in $list){
						if($list.hasOwnProperty(i)){
							var _list = $list[i],
								_id = _list.id || 0,
								_schoolId = _list.schoolId || 0,
								_schoolName = _list.schoolName || '',
								_workNumber = _list.workNumber || '', // 工号
								_name = _list.name || '', // 教师姓名
								_mobile = _list.mobile || '', // 手机号码
								_positionName = _list.positionName || '';// 职务
							//_imid = _list.attendanceCard || '';
							// 考勤卡号

							$trlist += ('<tr>' +
							'<td>' + _schoolName + '</td>' +
							'<td>' + _workNumber + '</td>' +
							'<td>' + _name + '</td>' +
							'<td>' + _mobile + '</td>' +
							'<td>' + _positionName + '</td>' +
								//   '<td>' + _imid + '</td>' +
							'<td><a class="general" href="' + window.globalPath + '/schoolAffairs/setPosition?schoolId=' + _schoolId + '&teacherId=' + _id + '&returnSchoolId=' + queryShoolId + '">职务</a><a class="general" href="' + window.globalPath + '/teacher/' + _id + '/toUpd?schoolId=' + _schoolId + '&returnSchoolId=' + queryShoolId + '">修改</a><a href="javascript:void(0)" data-id="' + _id + '" class="general j-delete">删除</a></td></tr>');
						}
					}
				}
			}
			_self.returnPage.html($trlist);
		}
	};

	var paginationOptions = {
		itemsOnPage: 10,
		pageNumber: 1
	};

	if(queryShoolId){
		paginationOptions.schoolId = queryShoolId
	}

	var teachersList = new Pagination(options);
	teachersList.init(paginationOptions);

	(function(){
		$.ajax({
			url: window.globalPath + '/schoolAffairs/getAllSchool',
			type: 'POST',
			dataType: 'json',
			async: false,
			success: function(resObj){
				if(resObj && resObj.schoolList && resObj.schoolList.length > 0){
					var schoolList = '';
					var schoolData = resObj.schoolList;
					for(var i = 0, ilen = schoolData.length; i < ilen; i++){
						schoolList += '<li data-value="' + schoolData[i].id + '">' + schoolData[i].referredName + '</li>';
						if(schoolData[i].id == queryShoolId){
							$('.j-currentshoolName').text(schoolData[i].referredName)
						}
					}
					$('.j-schoolList').append(schoolList);
				}else{
					//$('.j-selectui-school').hide()
				}
			}, error: function(){
				//$('.j-selectui-school').hide()
			}
		});
	})();

	var schoolSelect = new SelectUi($('.j-selectui-school'));
	schoolSelect.bindE(function(val, text){
		queryShoolId = val;
		paginationOptions.schoolId = queryShoolId;
		paginationOptions.tempstr = $('.j-keyword').val();
		teachersList.init(paginationOptions);
		$('.j-currentshoolName').text(text);
	});
//	schoolSelect.init(queryShoolId);

	/* 搜索 */
	$('.j-queryByWord').bind('click', function(){
		paginationOptions.tempstr = $('.j-keyword').val();
		paginationOptions.pageNumber = 1;
		teachersList.init(paginationOptions);
	});

	/* 删除 */
	options.returnPage.delegate('.j-delete', 'click', function(){
		var $this = $(this);
		var _id = $this.attr('data-id');
		/* 获取参数 */
		/**/
		ymPrompt.confirmInfo({
			message: '是否确认删除该教师？ ', width: 360, height: 200, titleBar: false, maskAlpha: 0.6, handler: function(msg){
				if(msg == 'ok'){
					$.ajax({
						url: window.globalPath + '/teacher/' + _id + '/delete',
						type: 'GET',
						success: function(resStr){
							var resMsg = JSON.parse(resStr)
							if(resMsg && resMsg.msg && resMsg.msg == 'success'){
								location.reload();
							}else{
								ymPrompt.alert({message: '删除失败', titleBar: false});
							}
						}
					});
				}else{
					//alert('取消删除')
				}
			}
		});
	});
});