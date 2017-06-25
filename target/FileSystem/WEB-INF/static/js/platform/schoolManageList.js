/**
 * Document by wangshuyan@chinamobile.com on 2015/11/18 0018.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min', /* 基础库 */
		'base': '../common/base', /*  全局函数、方法、对象*/
		'function': '../common/function', /* 常用工具类方法 */
		'ymPrompt': '../plug/ymPrompt/ymPrompt', /* 弹窗工具 */
		'Pagination': '../plug/simplePagination/jquery.simplePagination'/* 分页插件 */
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'Pagination': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'base', 'function', 'Pagination', 'ymPrompt'], function(jquery){


	var tableHeadModule = {
		typeList: null,
		areaList: null
	};

	/* 状态常量 */
	var schoolState = {
		'0': {text: '停用', cssclass: 'stoping'},
		'1': {text: '使用中', cssclass: 'ok'},
		'-1': {text: '不可用', cssclass: 'unuse'},
		'2': {text: '待审核', cssclass: 'pending'},
		'-2': {text: '删除', cssclass: 'unuse'}
	};

	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/school/schoolList',
		render: function(resObj){
			var _self = this, $trlist = '';
			_self.returnPage.empty();
			if(!resObj || !checkUtil.hasProperty(resObj)){
				$trlist += '<tr><td colspan="8" align="center" ><span class="f-cr">未返回正确的数据，或数据为空</span></td></tr>';
				_self.returnPage.html($trlist);
				return false;
			}
			/* 是否渲染 所在区县*/
			if(!tableHeadModule.areaList && resObj.areaList && resObj.areaList.length > 0){
				tableHeadModule.areaList = resObj.areaList;
				var $arealist = '<li class="optionHead" data-value="">所有地区</li>';
				for(var j = 0, alen = tableHeadModule.areaList.length; j < alen; j++){
					var _areaunit = tableHeadModule.areaList[j];
					$arealist += '<li data-value="' + _areaunit.code + '">' + _areaunit.areaName + '</li>'
				}
				$('.j-arealist').append($arealist);
			}

			var _hasRemove = (resObj.type === 3);

			_self.pageCount === 0 && (_self.pageCount = resObj.pageInfo.total);

			var $list = resObj.pageInfo.list, listlen = $list.length;
			if(listlen == 0){
				$trlist += '<tr><td colspan="8" align="center">未获取到列表数据</td></tr>';
			}else{
				for(var i in $list){
					if($list.hasOwnProperty(i)){
						var _list = $list[i];
						var _id = _list.id || 0,
							_state = _list.disable, /* 状态 */
							_referredName = _list.referredName || '', /* 简称 */
							_headmaster = _list.headmaster || '',
							_areaname = _list.areaname || '',
							_schooltype = _list.schoolType || '',
							_phone = _list.mobile || '',
							_studentCount = isNaN(_list.studentNum) ? 0 : _list.studentNum,
							_disable = _list.disable + '';

						var oprateHtml = ''
						switch(_disable){
						case '0':
							oprateHtml = '<a data-id="' + _id + '" class="general  j-changeAble" href="javascript:void(0)">启用</a>';
							break;
						case '1':

							oprateHtml = '<a class="general" href="' + window.globalPath + '/school/update?id=' + _id + '">修改</a>';
							if(!_hasRemove){
								oprateHtml += '<a data-id="' + _id + '" class="general j-transfer" href="javascript:void(0)">转移</a>';
							}
							oprateHtml += '<a data-id="' + _id + '" class="general  j-changeAble" href="javascript:void(0)">停用</a>';
							break;
						case '2':
							oprateHtml = ' <a class="general" href="' + window.globalPath + '/school/update?id=' + _id + '">修改</a>';
							if(!_hasRemove){
								oprateHtml += '<a data-id="' + _id + '" class="general j-transfer" href="javascript:void(0)">转移</a>';
							}
							break;
						case '-1':
							oprateHtml = ' <a class="general" href="' + window.globalPath + '/school/update?id=' + _id + '">修改</a>';
							break;
						case '-2':
							oprateHtml = '';
							break;
						}

						$trlist += ('<tr><td><span class="tdstatus ' + schoolState[_state].cssclass + '"> ' + schoolState[_state].text + '</span></td>' +
						'<td>' + _areaname + '</td>' +
						'<td>' + _schooltype + '</td>' +
						'<td>' + _referredName + '</td>' +
						'<td>' + _headmaster + '</td>' +
						'<td>' + _phone + '</td>' +
						'<td>' + _studentCount + '</td>' +
						'<td data-type="' + _disable + '">' + oprateHtml + '</td></tr>');

					}
				}
			}
			_self.returnPage.html($trlist);
		}
	};

	var queryOptions = {
		itemsOnPage: 10,
		pageNumber: 1,
		code: '',
		schoolType: '',
		keyword: ''
	};
	var schoolList = new Pagination(options);
	schoolList.init(queryOptions);


	/* 学校类型数据 渲染 */
	var shoolType_html = '';
	var shoolTypeGrade = ['幼儿园', '6年制小学', '初级中学(3年)', '高级中学(3年)', '完全中学(3+3)'];
	for(var schooltype_i = 0, ilen = shoolTypeGrade.length; schooltype_i < ilen; schooltype_i++){
		for(var schooltype_j = 0, jlen = gradeCategory.length; schooltype_j < jlen; schooltype_j++){
			if(gradeCategory[schooltype_j].schoolType === shoolTypeGrade[schooltype_i]){
				var gradeCategoryItem = gradeCategory[schooltype_j];
				shoolType_html += '<li data-value="' + gradeCategoryItem.schoolType + '">' + gradeCategoryItem.schoolType + '</li>'
			}
		}
	}
	$('.j-shoolTypeList').append(shoolType_html);


	/* 选择器插件 */
	var areaType = new SelectUi($('.j-selectui-county'));
	var schoolTyle = new SelectUi($('.j-selectui-schoolType'));

	areaType.bindE(function(val){
		queryOptions.code = +val;
		queryOptions.keyword = $('.j-Keyword').val();
		schoolList.init(queryOptions);
	});

	schoolTyle.bindE(function(val){
		queryOptions.schoolType = val;
		queryOptions.keyword = $('.j-Keyword').val();
		schoolList.init(queryOptions);
	});

	$('.j-queryKeyword').bind('click', function(){
		queryOptions.keyword = $('.j-Keyword').val();
		queryOptions.pageNumber = 1;
		schoolList.init(queryOptions);
	});

	/* 停用 */
	var transferObj = {
		transferDialog: null,
		isGetTransferList: false,
		bindE: function($submit, $cancle, _id){
			function _submit(){
				var _val = $('.j-schooltransferVal').val();
				if(!_val){
					$('.j-schooltransfertips').text('请选择代理商！');
					return false
				}
				$.ajax({
					url: window.globalPath + '/school/transferUpdate?id=' + _val + '&schoolId=' + _id,
					success: function(resMsg){
						if(resMsg){
							ymPrompt.close();
							ymPrompt.succeedInfo({
								message: '转移成功', width: 360, height: 200, titleBar: false, maskAlpha: 0.6, handler: function(){
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

	options.returnPage.delegate('.j-changeAble', 'click', function(){
		var $this = $(this),
			_msg = '',
			_stateTo = 0,
			_id = $this.attr('data-id'),
			_disabled = $this.parent('td').attr('data-type');

		if(_disabled == '0'){
			_msg = '启用';
			_stateTo = 1;
		}else if(_disabled == '1'){
			_msg = '停用';
			_stateTo = 0;
		}
		ymPrompt.confirmInfo({
			message: '是否' + _msg + '该学校', width: 360, height: 200, titleBar: false, maskAlpha: 0.6, handler: function(msg){
				if(msg == 'ok'){
					$.ajax({
						url: window.globalPath + '/school/disable.html?state=' + _stateTo + '&id=' + _id,
						type: 'POST',
						dataType:'json',
						success: function(resMsg){
							if(typeof  resMsg === 'string') resMsg = JSON.parse(resMsg);
							if(resMsg){
								if(resMsg.result === true){
									ymPrompt.succeedInfo({
										message: _msg + '成功',
										width: 280,
										height: 200,
										titleBar: false,
										maskAlpha: 0.6,
										handler: function(){
											location.reload();
										}
									});
									setTimeout(function(){
										location.reload();
									}, 4000)
								}
								if(resMsg.result === false){
									ymPrompt.alert({
										message: _msg + '失败:' + (resMsg.msg || ''),
										width: 280,
										height: 200,
										titleBar: false,
										maskAlpha: 0.6
									});
								}
							}else{
								ymPrompt.alert({
									message: _msg + '失败',
									width: 280,
									height: 200,
									titleBar: false,
									maskAlpha: 0.6
								});
							}
						},
						error: function(){
							ymPrompt.alert({
								message: _msg + '失败',
								width: 280,
								height: 200,
								titleBar: false,
								maskAlpha: 0.6
							});
						}
					})

				}else{
					//  alert('s')
				}
			}
		});
	}).delegate('.j-transfer', 'click', function(){
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
				url: window.globalPath + '/school/transfer',
				type: 'POST',
				data: {schoolId: _id},
				dataType: 'json',
				async: false,
				success: function(resObj){
					if(resObj && resObj.list){
						/*  渲染窗体节点 */
						_html += '<div class="ym-dwbody"><h2>确认转移该学校？</h2><p>请选择将学校转移至XX代理商</p><div class="m-selectui m-selectui-schooltransfer j-selectui-schooltransfer"><input type="hidden" class="intoval j-schooltransferVal"/><input type="text"   autocomplete="off"   class="intotext" readonly placeholder="请选择代理商" /><ul class="optionwarp">';
						for(var ri = 0, rilen = resObj.list.length; ri < rilen; ri++){
							var _agent = resObj.list[ri];
							_html += '<li data-value="' + _agent.id + '">' + _agent.fullName + '</li>';
						}
						_html += '</ul><b class="trigon"></b></div><p class="transfertips j-schooltransfertips"></p></div><div class="ym-btn"><input type="button" style="cursor:pointer" class="btnStyle handler j-submitTransfer" value=" 确 定 "><input type="button" style="cursor:pointer" class="btnStyle handler j-cancelTransfer "   value=" 取 消 "></div></div>';
						transferObj.transferDialog.append(_html);
						(new SelectUi(transferObj.transferDialog.find('.j-selectui-schooltransfer'))).bindE();
						transferObj.bindE(transferObj.transferDialog.find('.j-submitTransfer'), transferObj.transferDialog.find('.j-cancelTransfer'), _id);
						transferObj.isGetTransferList = true;
					}else{
						_html += '<div class="ym-dwbody"><h2>暂无可转移的代理商</h2><p></p><div class="ym-btn"><input type="button" style="cursor:pointer" class="btnStyle" onclick="ymPrompt.close();"   value=" 确  定 "></div></div>';
						transferObj.transferDialog.append(_html);
					}

				},
				error: function(){
					_html += '<div class="ym-dwbody"><h2>获取列表失败</h2><p>请关闭窗口重新获取</p><div class="ym-btn"><input type="button" style="cursor:pointer" class="btnStyle" onclick="ymPrompt.close();"   value=" 取 消 "></div></div>';
					transferObj.transferDialog.append(_html);
				}
			});
		}
		ymPrompt.win({message: '<div class="j-transferWrap"></div>', titleBar: false, width: 420, height: 288, maskAlpha: 0.6});
		$('.j-transferWrap').append(transferObj.transferDialog);
	});

});