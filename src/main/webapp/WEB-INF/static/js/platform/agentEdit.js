/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/base',
		'function': '../common/function',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'Pagination': '../plug/simplePagination/jquery.simplePagination',
		'My97DatePicker': '../plug/My97DatePicker/WdatePicker'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'Pagination': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'Pagination', 'ymPrompt', 'base', 'function', 'My97DatePicker'], function(jquery){

	/*  重置单个表单 */
	function resetIpt($ele){
		var $parents = $ele.parents('li'), $tips = $parents.find('.j-tips');
		$ele.removeClass('erro');
		$tips.removeClass('ok erro').empty();
		$('.j-erroAll').empty()
	}

	/* 显示错误 */
	function showErro($ele, msg){
		var $parents = $ele.parents('li'), $tips = $parents.find('.j-tips');
		$ele.addClass('erro');
		$tips.addClass('erro').html(msg);
	}


	var agentEdit = {
		$elements: {
			$agentId: $('.j-agentId'),
			$fullname: $('.j-fullname'),
			$shortname: $('.j-shortname'),
			$lealperson: $('.j-lealperson'),
			$agentTel: $('.j-agenttel'),
			$regdate: $('.j-regdate'),
			$regcapital: $('.j-regcapital'),
			$address: $('.j-address'),
			$businessowner: $('.j-businessowner'),
			$botel: $('.j-botel'),
			$bomobile: $('.j-bomobile'),
			$servicephone: $('.j-servicephone'),
			$servicemail: $('.j-servicemail'),
			$cites: $('.j-cites')
		},
		isEdit: function(){
			return !!this.$elements.$agentId.val();
		},
		isRepeat: {
			IR_fullname: false,
			IR_shortname: false,
			IR_agenttel: false,
			IR_botel: false,
			IR_bomobile: false,
			IR_servicephone: false,
			IR_servicemail: false
		},
		isSubmit: true
	};

	(function(){
		/* 地市接入*/
		if(!agentEdit.isEdit()){
			var areaList = new ChooseIpt($('.j-arealist'));
			areaList.init({
				bindECallback: function(){
					$('.j-arealist').parents('li').find('.j-tips').removeClass('ok erro').empty();
				}
			});
		}
		var typetext = agentEdit.isEdit() ? '修改' : '新增'

		/* 焦点获取与失去 */
		$('.formlist .u-gipt').bind({
			'focus': function(event){
				var $this = $(this);
				resetIpt($this);
				if($this.is('.j-regdate')){
					WdatePicker();
				}
			},
			'blur': function(){
				var $this = $(this), _val = $.trim($this.val()), _defaultVal = $.trim($(this)[0].defaultValue), _isEdit = agentEdit.isEdit();
				/* 代理商上全称检测*/
				if($this.is('.j-fullname')){
					if(_val && (!_isEdit || _val !== _defaultVal)){
						agentEdit.isRepeat.IR_fullname = checkUtil.isRepeatAjax('checkfullName', {fullName: _val});
					}
					if(agentEdit.isRepeat.IR_fullname){
						showErro(agentEdit.$elements.$fullname, '代理商全称已存在');
					}
				}
				/* 代理商简称检测 */
				if($this.is('.j-shortname')){
					if(_val && (!_isEdit || _val !== _defaultVal)){
						agentEdit.isRepeat.IR_shortname = checkUtil.isRepeatAjax('checkRefName', {referredName: _val});
					}
					if(agentEdit.isRepeat.IR_shortname){
						showErro(agentEdit.$elements.$shortname, '代理商简称已存在');
					}
				}
				/*  代理商联系电话 检测 */
				if($this.is('.j-agenttel')){
					if(_val && (!_isEdit || _val !== _defaultVal)){
						agentEdit.isRepeat.IR_agenttel = checkUtil.isRepeatAjax('checktel', {tel: _val});
					}
					if(agentEdit.isRepeat.IR_agenttel){
						showErro(agentEdit.$elements.$agentTel, '代理商联系电话已存在');
					}
				}
				/*  业务人联系电话 检测 */
				if($this.is('.j-botel')){
					if(_val && (!_isEdit || _val !== _defaultVal)){
						agentEdit.isRepeat.IR_botel = checkUtil.isRepeatAjax('checkheadtel', {headtel: _val});
						if(agentEdit.isRepeat.IR_botel){
							showErro(agentEdit.$elements.$botel, '业务负责人联系电话已存在');
						}
					}
				}


				/* 负责人联系手机 检测 */
				if($this.is('.j-bomobile')){
					if(_val && (!_isEdit || _val !== _defaultVal)){
						agentEdit.isRepeat.IR_bomobile = checkUtil.isRepeatAjax('checkMobile', {mobile: _val});
						if(agentEdit.isRepeat.IR_bomobile){
							showErro(agentEdit.$elements.$bomobile, '业务负责人手机号码已存在');
						}
						if(_val && !checkUtil.checkPhoneNumber(_val)){
							showErro(agentEdit.$elements.$bomobile, '请填写正确格式的手机号码');
						}
					}
				}

				/* 客服邮箱 检测 */
				if($this.is('.j-servicemail')){
					if(_val && !checkUtil.checkMailFormat(_val)){
						showErro(agentEdit.$elements.$servicemail, '请填写正确格式的邮箱名称');
					}
					/*   agentEdit.isRepeat.IR_servicemail = checkUtil.isRepeatAjax();
					 if(agentEdit.isRepeat.IR_servicemail){
					 showErro(agentEdit.$elements.$servicemail, '客服邮箱已存在');
					 }*/
				}

				/* if($this.is('.j-servicephone')){
				 agentEdit.isRepeat.IR_servicephone = checkUtil.isRepeatAjax();
				 if(agentEdit.isRepeat.IR_servicephone){
				 showErro(agentEdit.$elements.$servicephone, '客服电话已存在');
				 }
				 }*/

			}
		});

		/*  提交  ajax 需要同步  async:false */
		$('.j-submit').bind('click', function(){
			if(agentEdit.isSubmit){
				agentEdit.isSubmit = false; // 防止二次提交
				/* 代理商简称检测 */
				var _shortname = $.trim(agentEdit.$elements.$shortname.val()),
					_shortnameResult = true,
					_shortnameErroMsg = '';
				switch(true){
				case (_shortname === ''):
					_shortnameErroMsg = '请填写代理商简称';
					_shortnameResult = false;
					break;
				case (_shortname.length > 25 || _shortname.length < 6):
					_shortnameErroMsg = '请勿超过25个字或小于6个字';
					_shortnameResult = false;
					break;
				case checkUtil.checkSpecialChar(_shortname):
					_shortnameErroMsg = '请勿包含特殊字符 ';
					_shortnameResult = false;
					break;
				case agentEdit.isRepeat.IR_shortname:
					_shortnameResult = false;
					_shortnameErroMsg = '代理商简称已存在';
					break;
				}

				if(!_shortnameResult){
					showErro(agentEdit.$elements.$shortname, _shortnameErroMsg);
				}

				/* 代理商全称检测 */
				var _fullname = $.trim(agentEdit.$elements.$fullname.val()),
					_fullnameResult = true,
					_fullnameErroMsg = '';
				switch(true){
				case (_fullname === ''):
					_fullnameErroMsg = '请填写代理商全称';
					_fullnameResult = false;
					break;
				case (_fullname.length > 25):
					_fullnameErroMsg = '请勿超过25个字';
					_fullnameResult = false;
					break;
				case checkUtil.checkSpecialChar(_fullname):
					_fullnameErroMsg = '请勿包含特殊字符 ';
					_fullnameResult = false;
					break;
				case agentEdit.isRepeat.IR_fullname:
					_fullnameResult = false;
					_fullnameErroMsg = '代理商全称已存在 ';
					break;
				}
				if(!_fullnameResult){
					showErro(agentEdit.$elements.$fullname, _fullnameErroMsg);
				}

				/* 法人代表检测 */
				var _lealperson = $.trim(agentEdit.$elements.$lealperson.val()),
					_lealpersonResult = true,
					_lealpersonErroMsg = '';
				if(_lealperson === ''){
					_lealpersonErroMsg = '请填写法人代表';
					_lealpersonResult = false;
				}
				if(checkUtil.checkSpecialChar(_lealperson)){
					_lealpersonErroMsg = '请勿包含特殊字符';
					_lealpersonResult = false;
				}
				if(_lealperson.length > 15){
					_lealpersonErroMsg = '请勿超过15个字';
					_lealpersonResult = false;
				}

				if(!_lealpersonResult){
					showErro(agentEdit.$elements.$lealperson, _lealpersonErroMsg);
				}

				/* 代理商联系电话*/
				var _agentTel = $.trim(agentEdit.$elements.$agentTel.val()),
					_agentTelResult = true,
					_agentTelErroMsg = '';
				switch(true){
				case (_agentTel === ''):
					_agentTelErroMsg = '请填写代理商联系电话';
					_agentTelResult = false;
					break;
				case (_agentTel.length > 25):
					_agentTelErroMsg = '代理商联系电话不能超过25个字';
					_agentTelResult = false;
					break;
				case agentEdit.isRepeat.IR_agenttel:
					_agentTelResult = false;
					_agentTelErroMsg = '代理商联系电话已存在';
					break;
				}
				if(!_agentTelResult){
					showErro(agentEdit.$elements.$agentTel, _agentTelErroMsg);
				}

				/*  公司注册日期 */
				var _regdate = $.trim(agentEdit.$elements.$regdate.val()),
					_regdateResult = true,
					_regdateErroMsg = '',
					_regdateGetTime = 0;
				_regdateGetTime = new Date(_regdate);

				if(isNaN(_regdateGetTime)){ // IE8时间格式不准的bug修复
					var _regdateAr = _regdate.split('-');
					_regdateGetTime = new Date(_regdateAr[0], _regdateAr[1] - 1, _regdateAr[2]);
				}
				switch(true){
				case (_regdate === ''):
					_regdateErroMsg = '请填写公司注册日期';
					_regdateResult = false;
					break;
				case _regdateGetTime > (new Date()):
					_regdateErroMsg = '公司注册日期不能晚于当前时间';
					_regdateResult = false;
					break;
				}

				if(!_regdateResult){
					showErro(agentEdit.$elements.$regdate, _regdateErroMsg);
				}

				/* 注册资金 */
				var _regcapital = $.trim(agentEdit.$elements.$regcapital.val()),
					_regcapitalResult = true,
					_regcapitalErroMsg = '';
				switch(true){
				case (_regcapital === ''):
					_regcapitalErroMsg = '请填写公司注册资金';
					_regcapitalResult = false;
					break;
				case (_regcapital.length > 10):
					_regcapitalErroMsg = '请勿超过10个字';
					_regcapitalResult = false;
					break;
				case checkUtil.checkSpecialChar(_regcapital):
					_regcapitalErroMsg = '请勿包含特殊字符 ';
					_regcapitalResult = false;
					break;
				}
				if(!_regcapitalResult){
					showErro(agentEdit.$elements.$regcapital, _regcapitalErroMsg);
				}

				/* 公司地址 */
				var _address = $.trim(agentEdit.$elements.$address.val()),
					_addressResult = true,
					_addressErroMsg = '';
				switch(true){
				case (_address === ''):
					_addressErroMsg = '请填写公司地址';
					_addressResult = false;
					break;
				case (_address.length > 50):
					_addressErroMsg = '公司地址请勿超过50个字';
					_addressResult = false;
					break
				}
				if(!_addressResult){
					showErro(agentEdit.$elements.$address, _addressErroMsg);
				}

				/*  业务负责人 */
				var _businessowner = $.trim(agentEdit.$elements.$businessowner.val()),
					_businessownerResult = true,
					_businessownerErroMsg = '';
				switch(true){
				case (_businessowner === ''):
					_businessownerErroMsg = '请填写业务负责人';
					_businessownerResult = false;
					break;
				case _businessowner.length > 15:
					_businessownerErroMsg = '业务负责人请勿超过15个字符';
					_businessownerResult = false;
					break;
				case checkUtil.checkSpecialChar(_businessowner):
					_businessownerErroMsg = '业务负责人请勿包含特殊字符串和空格，若有多个负责人，请以逗号隔开';
					_businessownerResult = false;
					break;
				}
				if(!_businessownerResult){
					showErro(agentEdit.$elements.$businessowner, _businessownerErroMsg);
				}

				/* 业务负责人电话 */
				var _botel = $.trim(agentEdit.$elements.$botel.val()),
					_botelResult = true,
					_botelErroMsg = '';
				switch(true){
				case (_botel === ''):
					_botelErroMsg = '请填写业务负责人电话 ';
					_botelResult = false;
					break;
				case (_botel.length > 25):
					_botelErroMsg = ' 业务负责人电话请勿超过25个字 ';
					_botelResult = false;
					break;
				case agentEdit.isRepeat.IR_botel:
					_botelErroMsg = '业务负责人电话已存在 ';
					_botelResult = false;
					break;
				}
				if(!_botelResult){
					showErro(agentEdit.$elements.$botel, _botelErroMsg);
				}

				/* 业务负责人手机号码  */
				var _bomobile = $.trim(agentEdit.$elements.$bomobile.val()),
					_bomobileResult = true,
					_bomobileErroMsg = '';
				switch(true){
				case (_bomobile === ''):
					_bomobileErroMsg = '请填写业务负责人手机号码  ';
					_bomobileResult = false;
					break;
				case !checkUtil.checkPhoneNumber(_bomobile):
					_bomobileErroMsg = '请填写正确格式的手机号码';
					_bomobileResult = false;
					break;
				case agentEdit.isRepeat.IR_bomobile:
					_bomobileErroMsg = '业务人手机号码已存在';
					_bomobileResult = false;
					break;
				}
				if(!_bomobileResult){
					showErro(agentEdit.$elements.$bomobile, _bomobileErroMsg);
				}

				/* 客服电话  */
				var _servicephone = $.trim(agentEdit.$elements.$servicephone.val()),
					_servicephoneResult = true,
					_servicephoneErroMsg = '';
				switch(true){
				case (_servicephone === ''):
					_servicephoneErroMsg = '请填写 客服电话';
					_servicephoneResult = false;
					break;
				case _servicephone.length > 25:
					_servicephoneErroMsg = '客服电话请勿超过25个字';
					_servicephoneResult = false;
					break;
				case agentEdit.isRepeat.IR_servicephone:
					_servicephoneErroMsg = '客服电话已存在';
					_servicephoneResult = false;
					break;
				}
				if(!_servicephoneResult){
					showErro(agentEdit.$elements.$servicephone, _servicephoneErroMsg);
				}

				/* 客服邮箱  */
				var _servicemail = $.trim(agentEdit.$elements.$servicemail.val()),
					_servicemailResult = true,
					_servicemailErroMsg = '';
				switch(true){
				case (_servicemail === ''):
					_servicemailErroMsg = '请填写客服邮箱';
					_servicemailResult = false;
					break;
				case (!checkUtil.checkMailFormat(_servicemail)):
					_servicemailErroMsg = '请填写正确格式的邮箱名称';
					_servicemailResult = false;
					break;
				case agentEdit.isRepeat.IR_servicemail:
					_servicemailResult = false;
					break;
				}
				if(!_servicemailResult){
					showErro(agentEdit.$elements.$servicemail, _servicemailErroMsg);
				}


				/* 接入地市  */
				var _citesResult = true,
					_citesErroMsg = '';
				if(!agentEdit.isEdit()){
					var _cites = areaList.data;
					if(_cites.length == 0){
						_citesErroMsg = '请接入地市';
						_citesResult = false;
					}else{
						_cites = _cites.join(',')
					}
					if(!_citesResult){
						showErro(agentEdit.$elements.$cites, _citesErroMsg);
					}
				}


				/* */
				var addedMsg = '';
				if(_fullnameResult && _shortnameResult && _lealpersonResult && _agentTelResult && _regdateResult && _regcapitalResult && _addressResult && _businessownerResult && _botelResult && _bomobileResult && _servicephoneResult && _servicemailResult && _citesResult){

					var parameter = {};
					parameter['referredName'] = _shortname;
					parameter['fullName'] = _fullname;
					parameter['legal'] = _lealperson;
					parameter['tel'] = _agentTel;
					parameter['dtime'] = _regdate;
					parameter['registeredMoney'] = _regcapital;
					parameter['address'] = _address;
					parameter['id'] = $("#id").val();
					parameter['disableNomal'] = $("#disableNomal").val();
					parameter['head'] = _businessowner;
					parameter['headtel'] = _botel;
					parameter['areaIds'] = _cites;
					parameter['mobile'] = _bomobile;
					parameter['customerTel'] = _servicephone;
					parameter['customerEmail'] = _servicemail;
					//提交请求
					$.ajax({
						url: "save",
						data: parameter,
						dataType: "json",
						type: "post",
						success: function(da){
							if(da.result != 'error'){
								if(da.userMsg != null){
									addedMsg = '设置完成<br /><span style="font-size:12px;">' + da.userMsg + '</span>';
								}else{
									addedMsg = '设置完成<br /><span style="font-size:12px;">' + da.result + '</span>';
								}
								ymPrompt.succeedInfo({
									message: addedMsg, titleBar: false, width: 400, height: 220, maskAlpha: 0.5, handler: function(){
										location.href = 'list';
									}
								});
							}else{
								agentEdit.isSubmit = true; // 释放二次提交
								addedMsg = '设置失败';
								ymPrompt.succeedInfo({
									message: addedMsg, titleBar: false, width: 400, height: 220, maskAlpha: 0.5, handler: function(){
										//location.reload()
									}
								});
							}

						}
					});
				}else{
					var _totalMsg = '<b>表单出现上述错误：</b>';
					_shortnameErroMsg && (_totalMsg += _shortnameErroMsg + '; ');
					_fullnameErroMsg && (_totalMsg += _fullnameErroMsg + '; ');
					_agentTelErroMsg && (_totalMsg += _agentTelErroMsg + '; ');
					_regdateErroMsg && (_totalMsg += _regdateErroMsg + '; ');
					_regcapitalErroMsg && (_totalMsg += _regcapitalErroMsg + '; ');
					_addressErroMsg && (_totalMsg += _addressErroMsg + '; ');
					_businessownerErroMsg && (_totalMsg += _businessownerErroMsg + '; ');
					_botelErroMsg && (_totalMsg += _botelErroMsg + '; ');
					_bomobileErroMsg && (_totalMsg += _bomobileErroMsg + '; ');
					_servicemailErroMsg && (_totalMsg += _servicemailErroMsg + '; ');
					_citesErroMsg && (_totalMsg += _citesErroMsg + '; ');
					$('.j-erroAll').html(_totalMsg);
					agentEdit.isSubmit = true; // 释放二次提交
				}
			}
		});
		$('.j-cancle').bind('click', function(){
			ymPrompt.confirmInfo({
				message: '确定取消' + typetext + '代理商吗？', titleBar: false, handler: function(resmsg){
					if(resmsg == 'ok'){
						location.href = window.globalPath + '/agent/list';
					}
				}
			});
		});
	})();
});