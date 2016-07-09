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

	var querySchoolId = getUrlQuery('schoolId') || '',
		gradeId = getUrlQuery('gradeId') || '',
		gradeQueryItem = getUrlQuery('gradeItem') || 0,
		classId = getUrlQuery('classId') || '',
		schoolName = '',
		gradeName = '',
		className = '';

	var studentState = {
			'0': {text: '未订购', cssclass: 'unuse'},
			'1': {text: '已订购', cssclass: 'ok'},
		};
	/* 如果 没有学校参数，不显示返回*/
	if(querySchoolId){
		$('.j-returnSchool').attr('href', window.globalPath + '/class/getClassInfo?schoolId=' + querySchoolId + '&gradeItem=' + gradeQueryItem);
	}else{
		$('.j-returnSchool').hide();
	}

	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/student/getAllStudent',
		render: function(resData){
			var resObj = resData.pageInfo;
			var _self = this, $trlist = '';
			_self.returnPage.empty();
			!_self.pageCount && (_self.pageCount = resObj.total);
			if(!resObj){
				$trlist = '<tr><td colspan="7" align="center">该班还没有学生</td></tr>';
			}else{
				var $list = resData.stuList, listlen = $list.length;
				if($list.length <= 0){
					$trlist = '<tr><td colspan="7" align="center">该班还没有学生</td></tr>';
				}else{
					schoolName = '';
					gradeName = '';
					className = '';
					for(var i in $list){
						if($list.hasOwnProperty(i)){
							var _list = $list[i],
							    _orderType = (_list.isfee == 1?'1':'0'),
								_schoolName = _list.schoolName || '',
								_stNumber = _list.stuNum || '',
								_studentId = _list.studentId || '',
								_stuname = _list.stuName || '',
								_sex = _list.sex || '',
								_attendanceCard = _list.attendanceCard || '',
								_mobile = _list.mobile || '';

							schoolName = schoolName || optionQuery.schoolId && _list.schoolName;
							gradeName = gradeName || optionQuery.gradeId && _list.gradeName;
							className = className || optionQuery.classId && _list.className;
							$trlist += ('<tr>' +
							'<td>' + '<span class="tdstatus '+studentState[_orderType].cssclass +'"> ' + studentState[_orderType].text + '</span>' + '</td>' +
							'<td>' + _schoolName + '</td>' +
							'<td>' + _stNumber + '</td>' +
							'<td>' + _stuname + '</td>' +
							'<td>' + _sex + '</td>' +
							'<td>' + _mobile + '</td>' +
							'<td>' + _attendanceCard + '</td>' +
							'<td><a class="general" href="' + window.globalPath + '/student/' + _studentId + '/toUpd">修改</a><a data-id="' + _studentId + '" class="general j-delete" href="javascript:void(0)">删除</a></td></tr>');
							/*' +  '<a data-id="' + _studentId + '" class="general j-transfer" href="javascript:void(0)">转移</a>' + '*/
						}
					}
					$('.j-classTitle').html((schoolName || '') + '  ' + ( gradeName || '') + '  ' + (className || ''));
				}
			}
			_self.returnPage.html($trlist);
		}
	};

	var optionQuery = {
		itemsOnPage: 10,
		pageNumber: 1
	};

	if(querySchoolId){
		optionQuery.schoolId = querySchoolId
	}
	if(gradeId){
		optionQuery.gradeId = gradeId
	}
	if(classId){
		optionQuery.classId = classId
	}

	var studentsList = new Pagination(options);
	studentsList.init(optionQuery);

	/* 搜索*/
	$('.j-queryByWord').bind('click', function(){
		optionQuery.tempstr = $('.j-keyword').val();
		optionQuery.pageNumber = 1;
		studentsList.init(optionQuery);
	});



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
					if(schoolData[i].id == querySchoolId){
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

	var schoolSelect = new SelectUi($('.j-selectui-school'));
	schoolSelect.bindE(function(val, text){
		if(val === '') return;
		optionQuery.schoolId = val;
		optionQuery.tempstr = $('.j-keyword').val();
		delete  optionQuery.gradeId;
		delete  optionQuery.classId;
		studentsList.init(optionQuery);
	});
//	schoolSelect.init(querySchoolId);



	/* 转移  */
	var transferObj = {
		transferDialog: null,
		isGetTransferList: false,
		schoolData: null, /* 贮存所有学校信息 */
		bindE: function($submit, $cancle, _id){
			/* 用于提交 */
			var studentData = {
				schoolId: '',
				gradeId: '',
				classId: '',
				studentId: _id
			};
			/* 年级临时组*/
			var gradeGroup = [];
			/* 班级临时组 */
			var classGroup = [];
			/* 转移学校位置文本 */
			var moveText = '';

			var schoolFous = new SelectUi(transferObj.transferDialog.find('.j-selectui-school'));
			var gradeFous = new SelectUi(transferObj.transferDialog.find('.j-selectui-grade'));
			var classFocus = new SelectUi(transferObj.transferDialog.find('.j-selectui-class'));

			/* 学校选区实例 */
			schoolFous.bindE(function(val){
				gradeGroup = transferObj.schoolData[val].gradeList;
				/* 获取学校id */
				studentData.schoolId = transferObj.schoolData[val].schoolId;
				moveText += transferObj.schoolData[val].schoolName;
				/* 通过学校选取 确定年级 */
				var gradeList = '';
				for(var j = 0, jlen = gradeGroup.length; j < jlen; j++){
					gradeList += '<li data-value="' + j + '">' + gradeGroup[j].gradeName + '</li>'
				}
				transferObj.transferDialog.find('.j-gradeList').empty().append(gradeList);
				gradeFous.reset();
				classFocus.reset();
				studentData.gradeId = '';
			});

			/*  年级选取实例 */
			gradeFous.bindE(function(val){
				classGroup = gradeGroup[val].classList;
				/* 获取年级班级 */
				studentData.gradeId = gradeGroup[val].gradeId;
				moveText += gradeGroup[val].gradeName;
				var classList_html = '';
				for(var k = 0, klen = classGroup.length; k < klen; k++){
					classList_html += '<li data-value="' + k + '">' + classGroup[k].className + '</li>'
				}
				transferObj.transferDialog.find('.j-classList').empty().append(classList_html);
				classFocus.reset();
				studentData.classId = '';
			});

			/* 班级选取 */
			classFocus.bindE(function(val){
				studentData.classId = classGroup[val].id;
				moveText += classGroup[val].className;
			});

			/* 提交函数 */
			function _submit(){
				var _val = $('.j-schooltransferVal').val();
				if(!(studentData.schoolId && studentData.gradeId && studentData.classId)){
					$('.j-schooltransfertips').text('请选择学校、年级、班级！');
					return false
				}
				$.ajax({
					url: window.globalPath + '/student/move',
					data: studentData,
					type: 'POST',
					dataType: 'json',
					async: false,
					success: function(resMsg){
						if(resMsg && resMsg.msg && resMsg.msg == 'success'){
							ymPrompt.close();
							ymPrompt.succeedInfo({
								message: '转移成功<br /><span style="font-size:12px;">该学生已转移至：<br/>' + moveText + '</span>', width: 360, height: 200, titleBar: false, maskAlpha: 0.6, handler: function(){
									location.reload();
								}
							});
						}else{
							ymPrompt.alert({message: '未转移成功', width: 280, height: 200, titleBar: false, maskAlpha: 0.6});
						}
					},
					error: function(){
						ymPrompt.alert({message: '未转移成功', width: 280, height: 200, titleBar: false, maskAlpha: 0.6});
					}
				});
			}

			$submit.bind('click', _submit);
			$cancle.bind('click', function(){
				ymPrompt.close();
			})
		}
	};

	options.returnPage.delegate('.j-transfer', 'click', function(){
		var $this = $(this);
		var _id = $this.attr('data-id');
		/*
		 * transferObj.isGetTransferList  作为是否获取代理商标识
		 *  在获取并绑定事件后改为true
		 * */
		if(!transferObj.isGetTransferList){
			transferObj.transferDialog = $('<div class="g-disableWrap"></div>');
			var _html = '';
			$.ajax({
				url: window.globalPath + '/student/getAll',
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function(resObj){
					if(resObj && resObj.schoolList){
						transferObj.schoolData = resObj.schoolList;
						/*  渲染窗体节点 */
						_html += '<div class="ym-dwbody">' +
							'<h2>确认转移该同学</h2>' +
							'<p>请选择将该学生转移至</p>' +
								/* 学校 下拉列表 */
							'<div class="m-selectui m-selectui-schooltransfer j-selectui-school">' +
							'<input type="hidden" class="intoval j-schooltransferVal"/>' +
							'<input type="text"   autocomplete="off"   class="intotext" readonly placeholder="请选择学校" />' +
							'<ul class="optionwarp j-schoolList">';
						for(var ri = 0, rilen = transferObj.schoolData.length; ri < rilen; ri++){
							var _school = transferObj.schoolData[ri];
							_html += '<li data-value="' + ri + '">' + _school.schoolName + '</li>';
						}
						_html += '</ul><b class="trigon"></b></div>' +
								/* 年级下拉列表 */
							'<div class="m-selectui m-selectui-schooltransfer j-selectui-grade">' +
							'<input type="hidden" class="intoval j-gradetransferVal"/>' +
							'<input type="text"   autocomplete="off"   class="intotext" readonly placeholder="请选择年级" />' +
							'<ul class="optionwarp j-gradeList"></ul><b class="trigon"></b></div>' +
								/* 班级下拉列表 */
							'<div class="m-selectui m-selectui-schooltransfer j-selectui-class">' +
							'<input type="hidden" class="intoval j-classtransferVal"/>' +
							'<input type="text"   autocomplete="off"   class="intotext" readonly placeholder="请选择年级" />' +
							'<ul class="optionwarp j-classList"></ul><b class="trigon"></b></div>' +
							'<p class="transfertips j-schooltransfertips"></p>' +
							'</div><div class="ym-btn"><input type="button" style="cursor:pointer" class="btnStyle handler j-submitTransfer" value=" 确 定 "><input type="button" style="cursor:pointer" class="btnStyle handler j-cancelTransfer "   value=" 取 消 "></div></div>';
						transferObj.transferDialog.append(_html);
						transferObj.bindE(transferObj.transferDialog.find('.j-submitTransfer'), transferObj.transferDialog.find('.j-cancelTransfer'), _id);
						transferObj.isGetTransferList = true;
					}else{
						_html += '<div class="ym-dwbody"><h2>确认转移该同学</h2><p>获取学校、年级、班级列表失败！请关闭窗口重新获取</p><div class="ym-btn"><input type="button" style="cursor:pointer" class="btnStyle" onclick="ymPrompt.close();"   value=" 取 消 "></div></div>';
						transferObj.transferDialog.append(_html);
					}

				},
				error: function(){
					_html += '<div class="ym-dwbody"><h2>确认转移该同学</h2><p>获取学校、年级、班级列表失败！请关闭窗口重新获取</p><div class="ym-btn"><input type="button" style="cursor:pointer" class="btnStyle" onclick="ymPrompt.close();"   value=" 取 消 "></div></div>';
					transferObj.transferDialog.append(_html);
				}
			});
		}
		ymPrompt.win({message: '<div class="j-transferWrap"></div>', titleBar: false, width: 420, height: 320, maskAlpha: 0.6});
		$('.j-transferWrap').append(transferObj.transferDialog);
	}).delegate('.j-delete', 'click', function(){
		var $this = $(this);
		var _id = $this.attr('data-id');
		ymPrompt.confirmInfo({
			message: '是否确认删除该学生 ', width: 360, height: 200, titleBar: false, maskAlpha: 0.6, handler: function(msg){
				if(msg == 'ok'){
					$.ajax({
						url: window.globalPath + '/student/' + _id + '/delete',
						dataType: "json",
						type: "POST",
						success: function(da){
							if(da.msg == 'success'){
								location.reload();
							}else{
								alert('删除失败！')
							}
						}
					});
				}else{
					// alert('取消删除')
				}
			}
		});
	});
});