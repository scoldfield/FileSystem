/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/base',
		'function': '../common/function',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'jqueryForm': '../lib/jquery.form'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'jqueryForm': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'ymPrompt', 'base', 'function', 'jqueryForm'], function(jquery){

	var idsAr = getUrlQuery('ids');

	var noticeEdit = {
		$elements: {
			$formwrap: $('.j-formwrap'),
			$title: $('.j-noticeTitle'),
			$titleCouter: $('.j-noticeTitleCounter'),
			/* 接收人节点 */
			$mask: $('.u-mask'),
			$selectRecipientBtn: $('.j-selectRecipientBtn'),
			$selectRecipientWrap: $('.g-selectRecipient'),
			$selectRecipientContent: $('.j-RecipientContent'),
			$closeRecipient: $('.closeRecipient'),

			$content: $('.j-noticeContent'),
			$contentCounter: $('.j-contentCouter'),

			$submit: $('.j-submit'),
		},
		postData: {
			personStr: '',
			title: '',
			content: ''
		},
		showError: function($ele, msg){
			$ele.parents('li').find('.j-tips').html(msg).show();
		},
		clearError: function($ele){
			$ele.parents('li').find('.j-tips').empty().hide();
		},
		isSubmit: true //防止二次提交标志
	}

	/* 公告标题技术 */
	noticeEdit.couterTitle = new CountInput(noticeEdit.$elements.$title)
	noticeEdit.couterTitle.init({
		callback: function(val){
			var _html = ''
			if(val <= 50){
				_html = '( ' + val + ' / 50 )';
			}else{
				_html = '<span class="f-cr">超出' + (val - 50) + '字</span>';
			}
			noticeEdit.$elements.$titleCouter.html(_html);
		}
	});
	/* 公告内容技术 */
	noticeEdit.couterContent = new CountInput(noticeEdit.$elements.$content)
	noticeEdit.couterContent.init({
		callback: function(val){
			var _html = ''
			if(val <= 500){
				_html = '( ' + val + ' / 500 )';
			}else{
				_html = '<span class="f-cr"> 超出' + (val - 500) + '字</span>';
			}
			noticeEdit.$elements.$contentCounter.html(_html);
		}
	});

	/* 事件 */

	//解除错误信息
	noticeEdit.$elements.$formwrap.delegate('.u-gipt', {
		'focus': function(){
			noticeEdit.clearError($(this));
		}
	}).delegate('.j-photoUpload,.j-areaList input:checkbox', 'click', function(){
		noticeEdit.clearError($(this));
	});

	/*  接收人 */
	/* ****　蛋疼的接收人模块   *********** */

	/* SelectRecipient 构造类 只负责弹窗，不负责业务逻辑 */
	var redListRecipient = new SelectRecipient({
		triggerEle: noticeEdit.$elements.$selectRecipientBtn,  // 触发弹窗弹出的按钮
		mask: noticeEdit.$elements.$mask,  // 蒙层
		selectRecipientWrap: noticeEdit.$elements.$selectRecipientWrap,  // 弹窗最外层外壳
		selectRecipientContent: noticeEdit.$elements.$selectRecipientContent,  //弹窗内容外壳
		closeRecipient: noticeEdit.$elements.$closeRecipient  //关闭弹窗
	});

	redListRecipient.$recipientContainer = $('.g-recipientContainer');

	redListRecipient.data = {};      //已经在构造函数中创建 ====== 存储所有接收人数据
	/* 接收人数据组 */
	redListRecipient.RecipientCompareData = {};  // 对比数据组，用于显示数据，====== 主要存储已经选择的部分
	redListRecipient.nameGroup = {}; // 数据对应的名字
	redListRecipient.RecipientPostData = []; // 发送数据组;

	redListRecipient.nameType = {
		'account': ['username', '本级人员', ''],
		'city': ['fullName', '地市移动', '地市管理员及下属人员均可收到通知'],
		'agent': ['referredName', '代理商', '一级代理商管理员及下属人员均可收到通知']
	}

	redListRecipient.addRecipient = function(){
		var _self = this;
		/* 数据填入 */
		_self.RecipientPostData = [];
		var $inputList = redListRecipient.$recipientContainer.find('input.j-user-i:checked');
		$inputList.each(function(){
			var $this = $(this), _id = $this.val(), _type = $this.attr('data-id')
			_self.RecipientPostData.push(_type + '##' + _id);
		});
		noticeEdit.postData.personStr = _self.RecipientPostData.join(',');
		if(noticeEdit.postData.personStr !== ''){
			noticeEdit.clearError(noticeEdit.$elements.$selectRecipientBtn);
		}

		/* 显示 */
		var $renderHtml = '';
		for(var i in _self.RecipientCompareData){
			var RecipientCompareDataSingle = _self.RecipientCompareData[i],
				redListRecipientDataSingle = _self.data[i];

			if(RecipientCompareDataSingle.length == redListRecipientDataSingle.length){
				$renderHtml += '<span class="name-unit">' + redListRecipient.nameType[_self.nameGroup[i]][1] + '</span>';
			}else{
				for(var j  in  RecipientCompareDataSingle){
					$renderHtml += '<span class="name-unit">' + _self.nameGroup['u_' + i.split('_')[1] + '_' + RecipientCompareDataSingle[j]] + '</span>';
				}
			}
		}
		if($renderHtml == ''){
			$renderHtml = '<div class="enterTips">请输入接收人</div>'
		}
		noticeEdit.$elements.$selectRecipientBtn.html($renderHtml);
	}

	//  init 渲染页面内容
	redListRecipient.init(function(_self){
		// 获取数据
		$.ajax({
			url: window.globalPath + '/agentnotice/addreceive',
			type: 'POST',
			dataType: 'json',
			async: false,
			success: function(resData){
				//  建立容器
				var $sectionStHtml = $('<ul class="selectContent j-selectContent"></ul>');
				// 循环数据
				for(var i in resData){
					var resDataSingle = resData[i],
						strName = resDataSingle.strName,
						resList = resDataSingle.strlist;
					var resListLen = resList.length;
					//建立容器数据
					_self.data['c_' + strName] = [];
					_self.RecipientCompareData['c_' + strName] = [];
					_self.nameGroup['c_' + strName] = strName;
					// 建立单元容器
					var _selectRecipientHtml = '';
					_selectRecipientHtml += '<li class="selectRecipient-classSingle">' +
						'<div class="selectRecipient-classTitle f-cb"><label class="checkbox-ui"><input type="checkbox" class="j-class-i"  value="' + strName + '"><b></b><span class="wd">' + redListRecipient.nameType[strName][1] + '</span></label><a href="javascript:void(0);" class="j-toggleRecipient"></a><p class="info-title f-fl">' + redListRecipient.nameType[strName][2] + '</p></div>';
					if(resListLen > 0){
						_selectRecipientHtml += '<div class="selectRecipient-student  j-userGroup"><ul data-classid="' + strName + '" class="f-cb f-cbli"> ';
						for(var si = 0; si < resListLen; si++){
							var resListSingle = resList[si],
								_userName = resListSingle[redListRecipient.nameType[strName][0]];

							_selectRecipientHtml += '<li><label class="checkbox-ui"><input type="checkbox" value="' + resListSingle.id + '" data-id="' + strName + '"  class="j-user-i"><b></b><span class="wd">' + _userName + '</span></label></li>';
							_self.data['c_' + strName].push(resListSingle.id);
							_self.nameGroup['u_' + strName + '_' + resListSingle.id] = _userName;
						}
						_selectRecipientHtml += '</ul></div>';
					}else{
						_selectRecipientHtml = '<div>无对应代理商</div>';
					}
					_selectRecipientHtml += '</li>';
					$sectionStHtml.append(_selectRecipientHtml);
				}
				redListRecipient.selectRecipientContent.append($sectionStHtml);
			}
		});
	});

	/* 传入已选接收人 */
	(function(){
		var checkList = null;
		if(idsAr && idsAr.length > 0){
			checkList = idsAr.split(',');
		}

		if(checkList && checkList.length > 0){
			for(var i in checkList){
				if(!checkList.hasOwnProperty(i)) continue;
				$('.j-user-i[value=' + checkList[i] + ']').get(0).checked = true;
				var _data = $('.j-user-i[value=' + checkList[i] + ']').attr('data-id');
				redListRecipient.RecipientCompareData['c_' + _data].push(checkList[i]);
			}
		}

		redListRecipient.addRecipient();
	})();

	//bindE 绑定数据  传递的参数函数，是业务逻辑，
	redListRecipient.bindE(function(_self){
		/* 全体事件 */
		_self.$recipientContainer.delegate('a.j-toggleRecipient', 'click', function(){
			var $this = $(this), $studentGroup = $this.parents('li').find('.j-userGroup');
			$studentGroup.toggle();
			$this.toggleClass('active');
		}).delegate('input.j-user-i', 'change', function(){
			var $this = $(this),
				_data = $this.attr('data-id'),
				_dataGroup = 'c_' + _data,
				_id = +$this.val(),
				_$ul = $this.closest('ul');

			if($this.is(':checked')){
				_self.RecipientCompareData[_dataGroup].push(_id);
			}else{
				_self.RecipientCompareData[_dataGroup].splice(_self.RecipientCompareData[_dataGroup].indexOf(_id), 1);
			}
			/* 如果班级全部人员都全选，则班级名称全选 */
			var $classAllcheck = $('input[value=' + _data + ']'),
				$allChecked = _$ul.find('input:checked');
			if($allChecked.length == _self.data[_dataGroup].length){
				$classAllcheck.attr('checked', 'checked');
			}else{
				$classAllcheck.removeAttr('checked');
			}
		}).delegate('input.j-class-i', 'change', function(){
			var $this = $(this), _data = $this.val();
			if($this.is(':checked')){
				$('input.j-user-i[data-id=' + _data + ']').each(function(){
					var _$this = $(this), _id = _$this.val();
					if(!_$this.is(':checked')){
						_$this.attr('checked', 'checked');
						_self.RecipientCompareData['c_' + _data].push(_id);
					}
				});
			}else{
				$('input.j-user-i[data-id=' + _data + ']').each(function(){
					$(this).removeAttr('checked');
					_self.RecipientCompareData['c_' + _data] = [];
				});
			}
		});

		/* 添加 接收人 */
		$('.j-addRecipientData').bind('click', function(){
			_self.addRecipient();
			_self.closeClassGroup();
		});

		$('.j-cancelRecipientData').bind('click', function(){
			_self.closeClassGroup();
		});
	});


	/* 提交 */
	noticeEdit.$elements.$submit.on('click', function(){
		/* 一旦提交 就不再能提交，除非有表单错误，或数据提交错误*/
		if(noticeEdit.isSubmit){
			noticeEdit.isSubmit = false
			/* 清空/重置 数据 */
			noticeEdit.errorAr = {};
			var hasError = false; // 是否存在表单错误标志
			/* 获取数据 */
			noticeEdit.postData.title = noticeEdit.$elements.$title.val();// 标题
			noticeEdit.postData.content = noticeEdit.$elements.$content.val();// 正文

			/* 验证数据 并 报错 */
			// 标题
			noticeEdit.errorAr.titleResult = '';
			if(noticeEdit.postData.title === ''){
				noticeEdit.errorAr.titleResult = '请填写公告标题';
			}else if(noticeEdit.postData.title.length > 50){
				noticeEdit.errorAr.titleResult = '公告标题长度不能超过50个字符';
			}else if(checkUtil.checkSpecialChar(noticeEdit.postData.title)){
				noticeEdit.errorAr.titleResult = '公告标题长度不能含有特殊字符';
			}
			//？显示标题错误
			if(noticeEdit.errorAr.titleResult !== ''){
				noticeEdit.showError(noticeEdit.$elements.$title, noticeEdit.errorAr.titleResult);
			}

			/* 接收人员 */
			noticeEdit.errorAr.personStrResult = '';
			if(noticeEdit.postData.personStr === ''){
				noticeEdit.errorAr.personStrResult = '请填写公告接收人';
			}
			//？显示公告接收人错误
			if(noticeEdit.errorAr.personStrResult !== ''){
				noticeEdit.showError(noticeEdit.$elements.$selectRecipientBtn, noticeEdit.errorAr.personStrResult);
			}

			// 公告内容
			noticeEdit.errorAr.contentResult = '';
			if(noticeEdit.postData.content === ''){
				noticeEdit.errorAr.contentResult = '请填写公告内容';
			}else if(noticeEdit.postData.content.length > 500){
				noticeEdit.errorAr.contentResult = '公告内容长度不能超过500个字符';
			}
			//？显示公告内容错误
			if(noticeEdit.errorAr.contentResult !== ''){
				noticeEdit.showError(noticeEdit.$elements.$content, noticeEdit.errorAr.contentResult);
			}

			/* 是否提交 */
			for(var i  in noticeEdit.errorAr){
				if(noticeEdit.errorAr.hasOwnProperty(i) && noticeEdit.errorAr[i] !== ''){
					hasError = true;
				}
			}

			if(hasError){
				ymPrompt.alert({
					message: '填写存在错误，请返回修改',
					titleBar: false
				});
				noticeEdit.isSubmit = true;
			}else{

				$.ajax({
					url: window.globalPath + '/agentnotice/save',
					type: 'POST',
					dataType: 'json',
					data: noticeEdit.postData,
					success: function(res){
						if(res.result == 'success'){
							setTimeout(function(){
								location.href = window.globalPath + '/agentnotice/receiveNotice'
							}, 3000);

							ymPrompt.succeedInfo({
								message: '公告发布成功！',
								titleBar: false,
								handler: function(){
									location.href = window.globalPath + '/agentnotice/receiveNotice'
								}
							})
						}else{
							ymPrompt.alert({
								message: '公告发布失败！<br />' + res.result,
								titleBar: false
							});
							noticeEdit.isSubmit = true;
						}
					}, error: function(){
						ymPrompt.alert({
							message: '公告发布失败！',
							titleBar: false
						});
						noticeEdit.isSubmit = true;
					}
				});
			}
		}
	});

	$('.j-cancel').on('click', function(){
		ymPrompt.confirmInfo({
			message: '是否取消编辑公告',
			titleBar: false,
			width: 300,
			height: 220,
			handler: function(res){
				if(res == 'ok'){
					location.href = window.globalPath + '/agentnotice/receiveNotice';
				}
			}
		})
	});
});