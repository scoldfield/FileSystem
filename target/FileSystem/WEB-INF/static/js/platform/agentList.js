/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
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
require(['jquery', 'Pagination', 'ymPrompt', 'base', 'function'], function(jquery){


	var couldEdit = typeof window.couldEdit.split('_')[1] !== 'undefined' ? +window.couldEdit.split('_')[1] : 0;

	var options = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/agent/agentList',
		render: function(resObj){
			var _self = this, $trlist = '', _colspan = 0;
			_self.returnPage.empty();
			!_self.pageCount && (_self.pageCount = resObj.total);


			/* 表头 */
			switch(window.userType){
			case '1': //省级代理商
				$trlist += ('<thead><tr>' +
				'<td width="50">状态</td><td>代理商简称</td><td width="100">联系方式</td><td width="120">业务负责人</td><td width="110">手机号码</td><td width="220">地市信息</td><td width="80">代理商编码</td><td width="100">操作</td>' +
				'</thead>');
				_colspan = 8;
				break;
			case '2' : //地市代理商
				$trlist += ('<thead>' +
				'<td width="80">状态</td><td>代理商简称</td><td width="100">联系方式</td><td width="120">业务负责人</td><td width="210">手机号码</td><td width="100">操作</td>' +
				'</thead>');
				_colspan = 6;
				break;
			case '3' : //一级代理商
				$trlist += ('<thead>' +
				'<td width="50">状态</td><td>代理商简称</td><td width="100">联系方式</td><td width="120">业务负责人</td><td width="120">手机号码</td><td width="220">地市信息</td><td width="100">操作</td>' +
				'</thead>');
				_colspan = 7;
				break;
			}

			if(!resObj){
				$trlist += '<tbody><tr><td colspan="' + _colspan + '" align="center">未获取到列表数据</td></tr></tbody> '
			}else{
				var $list = resObj.list, listlen = $list.length;
				if($list.length <= 0){
					$trlist += '<tbody><tr><td colspan="' + _colspan + '" align="center">没有查询到代理商信息</td></tr></tbody> ';
				}else{
					var i, _list, _id, _referredName, _legal, _tel, _head, _mobile, _areaName, _disableName, _disableNomal, _operateName, _class, _fullName, _agentCode;
					var editUrl, editClass = 'general', _operateClass, isPointor = '', _isPointor = '', couldEditStr = '';
					switch(window.userType){
					case '1':
						$trlist += ('<tbody>');
						for(i in $list){
							if($list.hasOwnProperty(i)){
								_list = $list[i];
								_id = _list.id || 0;
								_disableName = _list.disableName || '';
								_referredName = _list.referredName || '';
								_legal = _list.legal || '';
								_tel = _list.tel || '';
								_head = _list.head || '';
								_mobile = _list.mobile || '';
								_areaName = _list.areaName;
								_agentCode = _list.agentCode === '' ? '设置编码' : _list.agentCode;
								editUrl = 'updateAgent?id=' + _id;
								editClass = 'general';
								if(_disableName == '已停用'){
									editUrl = 'javascript:void(0)';
									editClass = 'disabled';
									isPointor = ' style="cursor:default"';
								}else if(_disableName == '不可用'){
									_class = 'disabled';
									_isPointor = ' style="cursor:default"';
								}

								couldEditStr = couldEdit == 1 && '<a class="' + editClass + '" href="' + editUrl + '"' + isPointor + '>修改资料</a>' || ''

								$trlist += ('<tr>' +
								'<td>' + _disableName + '</td>' +
								'<td>' + _referredName + '</td>' +
								'<td>' + _tel + '</td>' +
								'<td>' + _head + '</td>' +
								'<td>' + _mobile + '</td>' +
								'<td><div class="s-showmore"><a style="font-size: 12px;;" href="' + window.globalPath + '/agent/findArea?id=' + _id + '">' + _areaName + '</a></div></td>' +
								'<td><div class="s-showmore"><a href="' + window.globalPath + '/agent/findAgentCode?id=' + _id + '">' + _agentCode + '</a></div></td>' +
								'<td>' + couldEditStr +
								'<a data-item="' + _id + '" class="general j-delete" href="javascript:void(0)">删除</a></td></tr>');
							}
						}
						$trlist += '</tbody>';
						break;
					case '2' :
						$trlist += ('<tbody>');
						for(i in $list){
							if($list.hasOwnProperty(i)){
								_list = $list[i];
								_id = _list.id || 0;
								_disableName = _list.disableName || '';
								_referredName = _list.referredName || '';
								_disableNomal = _list.disableNomal || '';
								_operateName = _list.operateName || '';
								_class = _operateName == '停用' ? 'j-disable' : 'j-enable';
								_legal = _list.legal || '';
								_tel = _list.tel || '';
								_head = _list.head || '';
								_mobile = _list.mobile || '';
								_areaName = _list.areaName;
								editUrl = 'updateAgent?id=' + _id + '&disableStatus=' + _disableNomal;
								editClass = 'general';
								if(_disableName == '已停用'){
									editClass = 'disabled';
									editUrl = 'javascript:void(0)';
									isPointor = ' style="cursor:default"';
								}else if(_disableName == '不可用'){
									_class = 'disabled';
									_isPointor = ' style="cursor:default"';
								}

								couldEditStr = couldEdit == 1 && '<a class="' + editClass + '" href="' + editUrl + '"' + isPointor + '>修改资料</a>' || ''

								$trlist += ('<tr>' +
								'<td>' + _disableName + '</td>' +
								'<td>' + _referredName + '</td>' +
								'<td>' + _tel + '</td>' +
								'<td>' + _head + '</td>' +
								'<td>' + _mobile + '</td>' +
								'<td>' + couldEditStr + '<a ' + _isPointor + ' data-item="' + _id + '" class="' + _class + '" href="javascript:void(0)">' + _operateName + '</a></td></tr>');
							}
						}
						$trlist += '</tbody>';
						break;
					case '3' :
						$trlist += ('<tbody>');
						for(i in $list){
							if($list.hasOwnProperty(i)){
								_list = $list[i];
								_referredName = _list.referredName || '';
								_disableName = _list.disableName || '';
								_id = _list.id || '';
								_legal = _list.legal || '';
								_operateName = _list.operateName || '';
								_disableNomal = _list.disableNomal || '';
								_class = _operateName == '停用' ? 'j-disable' : 'j-enable';
								_tel = _list.tel || '';
								_head = _list.head || '';
								_mobile = _list.mobile || '';
								_areaName = _list.areaName;
								editUrl = 'updateAgent?id=' + _id + '&disableStatus=' + _disableNomal;
								editClass = 'general';
								if(_disableName == '已停用'){
									editUrl = 'javascript:void(0)';
									editClass = 'disabled';
									isPointor = ' style="cursor:default"';
								}
								else if(_disableName == '不可用'){
									_class = 'disabled';
									_isPointor = ' style="cursor:default"';
								}

								couldEditStr = couldEdit && '<a class="' + editClass + '" href="' + editUrl + '"' + isPointor + '>修改资料</a>' || '';

								$trlist += ('<tr>' +
								'<td>' + _disableName + '</td>' +
								'<td>' + _referredName + '</td>' +
								'<td>' + _tel + '</td>' +
								'<td>' + _head + '</td>' +
								'<td>' + _mobile + '</td>' +
								'<td><div class="s-showmore"><a style="font-size:12px;" href="' + window.globalPath + '/agent/findArea?id=' + _id + '">' + _areaName + '</a></div></td>' +
								'<td>' + couldEdit + '<a ' + _isPointor + ' data-item="' + _id + '" class="' + _class + '" href="javascript:void(0)">' + _operateName + '</a></td></tr>');
							}
						}
						$trlist += '</tbody>';
						break;
					}
				}
			}
			_self.returnPage.html($trlist);
		}
	};

	var agentList = new Pagination(options);
	agentList.init({
		itemsOnPage: 10,
		pageNumber: 1,
		'referredName': ''
	});

	/* 搜索 */
	$('.j-queryList').bind('click', function(){
		var _val = $('.j-queryIpt').val();
		agentList.init({
			itemsOnPage: 10,
			pageNumber: 1,
			'referredName': _val
		});
	});


	var transferObj = {
		transferDialog: $('<div class="g-disableWrap"></div>'),
		transferSuccess: false,
		transferAjax: function(parameter, _url, _type){
			var isEnable = parameter.state || '0', _msg = '', _failMsg = '';

			if(_type == '停用' || _type == '启用'){
				if(isEnable == 0){
					_msg = '设置成功<br /><span style="font-size:12px;">该代理商及下属代理商帐号均停用</span>';
					_failMsg = '未设置成功';
				}else{
					_msg = '启用成功！';
					_failMsg = '未启用成功';
				}
			}else if(_type == '删除'){
				_msg = '删除成功<br /><span style="font-size:12px;">该代理商及下属代理商帐号均删除</span>';
				_failMsg = '未删除成功';
			}
			ymPrompt.close();
			ymPrompt.confirmInfo({
				message: '确定' + _type + '该代理商？',
				titleBar: false,
				width: 300,
				height: 180,
				handler: function(res){
					if(res === 'ok'){
						$.ajax({
							url: _url,
							data: parameter,
							dataType: "json",
							type: "post",
							success: function(resMsg){
								if(resMsg && resMsg.result && resMsg.result == 'success'){
									ymPrompt.succeedInfo({
										message: _msg, width: 360, height: 220, titleBar: false, maskAlpha: 0.6, handler: function(){
											location.reload();
										}
									});
								}else{
									ymPrompt.alert({message: _failMsg, width: 320, height: 220, titleBar: false, maskAlpha: 0.6});
								}
							},
							error: function(){
								ymPrompt.alert({message: _failMsg, width: 320, height: 220, titleBar: false, maskAlpha: 0.6});
							}
						});
					}
				}
			})


		},
		transferBindE: function(_id, _url, _type){
			var _self = this;
			var _val = $('.j-schooltransferVal').val();
			if(!_val){
				$('.j-schooltransfertips').text('请选择代理商！');
				return false
			}
			var parameter = {
				id: _id,
				state: 0,
				newAgentId: _val
			};
			_self.transferAjax(parameter, _url, _type);

		},
		enAbleBindE: function(_id, _url, _type){
			var _self = this;
			var parameter = {
				id: _id,
				state: 1
			};
			_self.transferAjax(parameter, _url, _type);
		},
		agentList: []
	};

	options.returnPage.delegate('.j-delete', 'click', function(){
		/* 获取参数 */
		var $this = $(this), _id = $this.attr('data-item');
		$.ajax({
			url: window.globalPath + '/agent/findBelongAgent',
			type: 'POST',
			dataType: 'json',
			data: {id: _id},
			success: function(res){
				if(res){
					if(res.length > 0){
						var name_html = '', idsAr = [];
						for(var i in res){
							if(!res.hasOwnProperty(i)) continue;
							name_html += res[i].areaName + ',';
							idsAr.push(res[i].operataId);
						}
						ymPrompt.confirmInfo({
							message: '该代理商正在代理以下地市：<p class="f-fs2" style="margin:10px 0 5px; color:#5D9CD5;">' + name_html + '</p><p class="f-fs2">通知地市管理员停用该代理商后删除。</p>',
							titleBar: false,
							okTxt: '去通知',
							width: 360,
							height: 240,
							maskAlpha: 0.6,
							handler: function(res){
								if(res == 'ok'){
									location.href = window.globalPath + '/agentnotice/addNotice?ids=' + idsAr.join(',');
								}
							}
						})
					}else{
						// 下面么有地市的情况下
						ymPrompt.confirmInfo({
							message: '确认删除该代理商？',
							titleBar: false,
							width: 320,
							height: 220,
							maskAlpha: 0.6,
							handler: function(res){
								if(res == 'ok'){
									$.ajax({
										url: window.globalPath + '/agent/deleteAgent',
										type: 'POST',
										dataType: 'json',
										data: {id: _id},
										success: function(res){
											if(res.result == 'success'){
												ymPrompt.succeedInfo({
													message: '删除成功',
													width: 320,
													height: 220,
													titleBar: false,
													maskAlpha: 0.6,
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
					}
				}
			}
		});
	});


	options.returnPage.delegate('.j-disable', 'click', function(){
		var $this = $(this);
		var _id = $this.attr('data-item');
		/* 获取参数 */
		var _url = window.globalPath + '/agent/updateStatus',
			_type = '停用';
		transferDialogue(_id, _url, _type);

	}).delegate('.j-enable', 'click', function(){
		var $this = $(this);
		var _id = $this.attr('data-item');
		var _url = window.globalPath + '/agent/updateStatus',
			_type = '启用';
		transferObj.enAbleBindE(_id, _url, _type);
	});


	function transferDialogue(_id, _url, _type){
		if(!transferObj.transferSuccess){
			var _html = '';
			$.ajax({
				url: window.globalPath + '/agent/findAllAgent',
				dataType: "json",
				type: "post",
				async: false,
				success: function(resData){
					if(resData && resData.length > 0){
						/*  渲染窗体节点 */
						_html += '<h2>确认<span class="j-transferdealName">停用</span>该代理商</h2><p class="j-transferdealTitle">请选择将该代理商下的学校转移至</p><div class="m-selectui m-selectui-schooltransfer j-selectui-schooltransfer"><input type="hidden" class="intoval j-schooltransferVal"/><input type="text"   autocomplete="off"   class="intotext" readonly placeholder="请选择代理商" /><ul class="optionwarp">';
						for(var ri = 0, rilen = resData.length; ri < rilen; ri++){
							var _agent = resData[ri];
							_html += '<li data-value="' + _agent.id + '">' + _agent.referredName + '</li>';
							transferObj.agentList.push({id: _agent.id, referredName: _agent.referredName});
						}
						_html += '</ul><b class="trigon"></b></div><p class="transfertips j-schooltransfertips"></p></div>';
						transferObj.transferDialog.html(_html);
						transferObj.transferSuccess = true;
					}else{
						_html += '<h2>确认停用该代理商</h2><p> 代理商列表为空，或不存在代理商</p><p class="transfertips j-schooltransfertips f-cr"></p>';
						transferObj.transferDialog.html(_html);
					}
				},
				error: function(){
					_html += '<h2>确认停用该代理商</h2><p>获取代理商列表失败！请关闭窗口重新获取</p><p class="transfertips j-schooltransfertips f-cr"></p>';
					transferObj.transferDialog.html(_html);
				}
			});
		}

		var transferDialogCopy = transferObj.transferDialog.clone(),
			$transferEle = transferDialogCopy.find('.j-selectui-schooltransfer');

		//下拉框
		var selectUitransferEle = new SelectUi($transferEle);
		selectUitransferEle.bindE();

		transferDialogCopy.find('.j-transferdealName').html(_type);
		// 去重
		for(var i in transferObj.agentList){
			if(_id == transferObj.agentList[i].id){
				transferDialogCopy.find('li[data-value=' + _id + ']').addClass('hide').hide();
			}
		}
		if(transferDialogCopy.find('li:not(.hide)').length == 0){
			transferDialogCopy.find('.m-selectui-schooltransfer,.j-submitTransfer').hide();
			transferDialogCopy.find('.j-transferdealTitle').text('除本代理商外，无其他可以' + _type + '代理商').addClass('f-cr');
		}

		ymPrompt.confirmInfo({
			message: '<div class="ym-dwbody j-transferWrap"></div>',
			titleBar: false,
			width: 420,
			height: 288,
			autoClose: false,
			maskAlpha: 0.6,
			handler: function(res){
				if(res == 'ok'){
					transferObj.transferBindE(_id, _url, _type);
				}else{
					ymPrompt.close();
				}
			}
		});
		$('.j-transferWrap').append(transferDialogCopy);
	}
});