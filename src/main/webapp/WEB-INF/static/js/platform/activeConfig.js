/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/base',
		'function': '../common/function',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'jqueryForm': '../lib/jquery.form',
		'My97DatePicker': '../plug/My97DatePicker/WdatePicker'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'jqueryForm': {deps: ['jquery']},
		'My97DatePicker': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'ymPrompt', 'base', 'function', 'jqueryForm', 'My97DatePicker'], function(jquery){
	var activeEdit = {
		$elements: {
			$formwrap: $('.j-formwrap'),
			$title: $('.j-actTitle'),
			$titleCouter: $('.j-actitleCounter'),
			$link: $('.j-activeLink'),
			$linkCounter: $('.j-linkCounter'),
			$content: $('.j-actContent'),
			$contentCounter: $('.j-contentCouter'),
			$photoBtn: $('.j-photoUpload'),
			$photoUpload: $('#photoUpload'),
			$uploadForm: $('#fileUpload'),
			$imglist: $('.j-imglist'),
			$activeArea: $('.j-activeArea'),
			$index: $('.j-actIndex'),
			$areaList: $('.j-areaList'),
			$isJoin: function(){
				return $('.j-isjoin:checked')
			},
			$isjoinNot: $('.j-isjoin'),
			$endtime: $('.j-endtime'),
			$deadlinetime: $('.j-deadlinetime'),
			$submit: $('.j-submit'),
		},
		postData: null,
		transformData: {
			imgurl: '',
			areaList: []
		},
		showError: function($ele, msg){
			$ele.parents('li').find('.j-tips').html(msg).show();
		},
		clearError: function($ele){
			$ele.parents('li').find('.j-tips').empty().hide();
		},
		isSubmit: true, //防止二次提交标志
		activeId: window.activeId
	}
	activeEdit.today = function(){
		var today = new Date();
		var _m = (today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : '0' + parseInt(today.getMonth() + 1);
		var _d = today.getDate() >= 10 ? today.getDate() : '0' + parseInt(today.getDate());
		return today.getFullYear() + '-' + _m + '-' + _d
	}
	activeEdit.couterTitle = new CountInput(activeEdit.$elements.$title)
	activeEdit.couterTitle.init({
		callback: function(val){
			var _html = ''
			if(val <= 20){
				_html = '( ' + val + ' / 20 )';
			}else{
				_html = '<span class="f-cr">超出' + (val - 20) + '字</span>';
			}
			activeEdit.$elements.$titleCouter.html(_html);
		}
	});
	activeEdit.couterContent = new CountInput(activeEdit.$elements.$content)
	activeEdit.couterContent.init({
		callback: function(val){
			var _html = ''
			if(val <= 5000){
				_html = '( ' + val + ' / 5000 )';
			}else{
				_html = '<span class="f-cr">超出' + (val - 5000) + '字</span>';
			}
			activeEdit.$elements.$contentCounter.html(_html);
		}
	});
	activeEdit.linkCounter = new CountInput(activeEdit.$elements.$link)
	activeEdit.linkCounter.init({
		callback: function(val){
			var _html = ''
			if(val <= 500){
				_html = '( ' + val + ' / 500 )';
			}else{
				_html = '<span class="f-cr">超出' + (val - 500) + '字</span>';
			}
			activeEdit.$elements.$linkCounter.html(_html);
		}
	});
	var addFilesObj = {
		ajaxFormFn: function($form, url){
			var result = null, _self = this;
			$form.ajaxSubmit({
				url: url,
				type: 'POST',
				async: false,
				success: function(resData){
					activeEdit.$elements.$photoUpload.val('');
					if(typeof resData === 'string'){
						if(resData === 'bigimageError'){
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning"><h2>上传图片不能超过1M</h2><p>请重新选择或压缩后上传</p></div>',
								titleBar: false,
								width: 360,
								height: 240
							});
						}else{
							_self.addImages(JSON.parse(resData)[0].fileurl);
						}
					}else{
						_self.addImages(resData);
					}
				}
			});
		},
		addImages: function(imgUrl){
			var _self = this;
			/* 数据添加 */
			activeEdit.transformData.imgurl = imgUrl;
			// 节点添加
			activeEdit.$elements.$imglist.html('<img src="' + imgUrl + '" alt="活动插图">');
		},
		bindE: function(){
			var _self = this;
			//* 上传 触发
			activeEdit.$elements.$photoBtn.on('click', function(){
				activeEdit.$elements.$photoUpload.click();
			});
			activeEdit.$elements.$photoUpload.on('change', function(){
				var val = $(this).val();
				// 获取
				if(val !== ''){
					/* 判断格式是否正确 */
					var valAr = val.split('.');
					var extension = valAr[valAr.length - 1];
					if(extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'bmp' || extension == 'JPG' || extension == 'PNG' || extension == 'GIF' || extension == 'BMP' || extension == 'JPEG' || extension == 'jpeg'){
						//上传
						_self.ajaxFormFn($('#fileUpload'), window.globalPath + '/activeconfig/upload?imgurl=' + val);
					}else{
						ymPrompt.alert({
							message: '上传图片格式不正确<span class="f-db f-fs1" style="padding-top:9px;" >请上传jpg,gif,png,bmp,jpeg格式的图片</span>',
							titleBar: false,
							widht: 320
						});
						$(this).val('')
					}
				}
			});
		}
	};
	addFilesObj.bindE();
	activeEdit.init = function(){
		/* 地区渲染 */
		var hasAreaCode = activeEdit.$elements.$activeArea.attr('data-value');
		var $checkbox = activeEdit.$elements.$areaList.find('input:checkbox');
		if(activeEdit.activeId !== ''){
			/**/
			$('.textType').html('修改')
			var areaCodeAr = []
			if(hasAreaCode !== ''){
				areaCodeAr = hasAreaCode.split(',');
			}
			$checkbox.each(function(){
				var $this = $(this);
				if(hasAreaCode !== ''){
					for(var i = 0, ilen = areaCodeAr.length; i < ilen; i++){
						if($this.val() === areaCodeAr[i]){
							$this[0].checked = true;
						}
					}
				}else{
					$this[0].checked = true;
				}
			});
			var isAll = true;
			$checkbox.each(function(){
				if($(this)[0].checked == false){
					isAll = false;
				}
			});
			activeEdit.$elements.$activeArea.find('input.all')[0].checked = isAll;
			/* 图片渲染 */
			if(activeEdit.$elements.$imglist.find('img').length > 0){
				activeEdit.transformData.imgurl = activeEdit.$elements.$imglist.find('img')[0].src;
			}
		}else{
			$checkbox.each(function(){
				$(this)[0].checked = true;
			});
			activeEdit.$elements.$activeArea.find('input.all')[0].checked = true;
		}
		//掇取报名时间
		activeEdit.$elements.$endtime.on('focus', WdatePicker);
		activeEdit.$elements.$deadlinetime.on('focus', WdatePicker);
		if(activeEdit.$elements.$endtime.val() === ''){
			activeEdit.$elements.$endtime.val(activeEdit.today());
		}
		if(activeEdit.$elements.$deadlinetime.val() === ''){
			activeEdit.$elements.$deadlinetime.val(activeEdit.today());
		}
	}
	activeEdit.init();
	/* 事件 */
	activeEdit.$elements.$activeArea.delegate('input:checkbox', 'change', function(){
		var $this = $(this), isAllChecked = $this[0].checked, $all = activeEdit.$elements.$activeArea.find('input.all');
		/* 是否全选 */
		if($this.hasClass('all')){
			activeEdit.$elements.$areaList.find('input:checkbox').each(function(){
				$(this)[0].checked = isAllChecked;
			});
		}
		/*  检查是否全选 */
		else{
			if(!isAllChecked){
				$all[0].checked = false;
			}else{
				var isAll = true;
				activeEdit.$elements.$areaList.find('input:checkbox').each(function(){
					if(!$(this)[0].checked){
						isAll = false;
					}
				});
				$all[0].checked = isAll;
			}
		}
	});
	//是否显示报名截止时间
	activeEdit.$elements.$isjoinNot.on('change', function(){
		var _$isshow = $('.isshowtime');
		if($(this).is(':checked') && $(this).val() == '0'){
			_$isshow.show();
		}else{
			_$isshow.hide();
		}
	})
	//解除错误信息
	activeEdit.$elements.$formwrap.delegate('.u-gipt', {
		'focus': function(){
			activeEdit.clearError($(this));
		}
	}).delegate('.j-photoUpload,.j-areaList input:checkbox', 'click', function(){
		activeEdit.clearError($(this));
	});
	/* 提交 */
	activeEdit.$elements.$submit.on('click', function(){
		/* 一旦提交 就不再能提交，除非有表单错误，或数据提交错误*/
		if(activeEdit.isSubmit){
			activeEdit.isSubmit = false
			/* 清空/重置 数据 */
			activeEdit.postData = {};
			activeEdit.errorAr = {};
			activeEdit.transformData.areaList = [];
			var hasError = false; // 是否存在表单错误标志
			/* 获取数据 */
			activeEdit.postData.title = activeEdit.$elements.$title.val();// 标题
			activeEdit.postData.url = activeEdit.$elements.$link.val();// 链接
			// activeEdit.postData.content = activeEdit.$elements.$content.val();// 正文
			// 插图
			activeEdit.postData.image = activeEdit.transformData.imgurl;
			// 权重
			activeEdit.postData.weight = activeEdit.$elements.$index.val();

			// 地区
			activeEdit.$elements.$areaList.find('input:checkbox').each(function(){
				var $this = $(this);
				if($this[0].checked){
					activeEdit.transformData.areaList.push($this.val())
				}
			});
			activeEdit.postData.areaCode = activeEdit.transformData.areaList.join(',');
			/* 验证数据 并 报错 */
			// 标题
			activeEdit.errorAr.titleResult = '';
			if(activeEdit.postData.title === ''){
				activeEdit.errorAr.titleResult = '请填写活动标题';
			}else if(activeEdit.postData.title.length > 20){
				activeEdit.errorAr.titleResult = '活动标题长度不能超过20个字符';
			}else if(checkUtil.checkSpecialChar(activeEdit.postData.title)){
				activeEdit.errorAr.titleResult = '活动标题长度不能含有特殊字符';
			}
			//？显示标题错误
			if(activeEdit.errorAr.titleResult !== ''){
				activeEdit.showError(activeEdit.$elements.$title, activeEdit.errorAr.titleResult);
			}
			// 链接
			activeEdit.errorAr.linkResult = '';
			if(activeEdit.postData.url === ''){
				activeEdit.errorAr.linkResult = '请填写活动链接';
			}else if(activeEdit.postData.url.indexOf(' ') >= 0){
				activeEdit.errorAr.linkResult = '活动链接不能有空格';
			}else if(activeEdit.postData.url.length > 500){
				activeEdit.errorAr.linkResult = '活动链接长度不能超过500个字符';
			}
			//？显示活动链接错误
			if(activeEdit.errorAr.linkResult !== ''){
				activeEdit.showError(activeEdit.$elements.$link, activeEdit.errorAr.linkResult);
			}
			/* // 活动内容
			 activeEdit.errorAr.contentResult = '';
			 if(activeEdit.postData.content.length > 5000){
			 activeEdit.errorAr.contentResult = '活动正文长度不能超过5000个字符';
			 }*/
			//？显示活动链接错误
			if(activeEdit.errorAr.contentResult !== ''){
				activeEdit.showError(activeEdit.$elements.$content, activeEdit.errorAr.contentResult);
			}
			// 活动插图
			activeEdit.errorAr.imgResult = '';
			if(activeEdit.postData.image === ''){
				activeEdit.errorAr.imgResult = '请上传活动插图';
			}
			if(activeEdit.errorAr.imgResult !== ''){
				activeEdit.showError(activeEdit.$elements.$imglist, activeEdit.errorAr.imgResult);
			}
			// 活动权重
			activeEdit.errorAr.indexResult = '';
			if(activeEdit.postData.weight === ''){
				activeEdit.errorAr.indexResult = '请填写活动权重';
			}else if(isNaN(activeEdit.postData.weight)){
				activeEdit.errorAr.indexResult = '活动权重请填写纯数字';
			}else if(activeEdit.postData.weight.indexOf(' ') >= 0){
				activeEdit.errorAr.indexResult = '活动权重不能有空格';
			}else if((activeEdit.postData.weight + '').length > 20){
				activeEdit.errorAr.indexResult = '活动权重请勿超过20个字';
			}
			if(activeEdit.errorAr.indexResult !== ''){
				activeEdit.showError(activeEdit.$elements.$index, activeEdit.errorAr.indexResult);
			}

			// 活动地区
			activeEdit.errorAr.areaResult = '';
			if(activeEdit.postData.areaCode === ''){
				activeEdit.errorAr.areaResult = '请选择活动地区';
			}
			if(activeEdit.errorAr.areaResult !== ''){
				activeEdit.showError(activeEdit.$elements.$areaList, activeEdit.errorAr.areaResult);
			}

			//是否需要报名
			activeEdit.postData.isjoin = activeEdit.$elements.$isJoin().val();
			activeEdit.postData.endTimestr = activeEdit.$elements.$endtime.val();
			activeEdit.errorAr.endTimeResult = '';
			//如果需要报名，验证时间
			if(activeEdit.postData.isjoin === '0'){
				if(timeFunction.getTimes(activeEdit.postData.endTimestr) < timeFunction.getTimes(activeEdit.today())){
					activeEdit.errorAr.endTimeResult = '报名截止时间不能早于当前时间'
				}
				if(activeEdit.errorAr.endTimeResult !== ''){
					activeEdit.showError(activeEdit.$elements.$endtime, activeEdit.errorAr.endTimeResult);
				}
			}

			//活动截止时间
			activeEdit.postData.deadlinestr = activeEdit.$elements.$deadlinetime.val();
			activeEdit.errorAr.deadlinestrResult = '';
			if(activeEdit.postData.deadlinestr === ''){
				activeEdit.errorAr.deadlinestrResult = '活动截止时间不能为空'
			}else if(activeEdit.postData.isjoin === '0' && timeFunction.getTimes(activeEdit.postData.endTimestr) >= timeFunction.getTimes(activeEdit.postData.deadlinestr)){
				activeEdit.errorAr.deadlinestrResult = '活动截止时间不能早于报名时间'
			}

			if(activeEdit.errorAr.deadlinestrResult !== ''){
				activeEdit.showError(activeEdit.$elements.$deadlinetime, activeEdit.errorAr.deadlinestrResult);
			}


			/* 是否提交 */
			for(var i  in activeEdit.errorAr){
				if(activeEdit.errorAr.hasOwnProperty(i) && activeEdit.errorAr[i] !== ''){
					hasError = true;
				}
			}
			if(hasError){
				ymPrompt.alert({
					message: '填写存在错误，请返回修改',
					titleBar: false
				});
				activeEdit.isSubmit = true;
			}else{
				/* 是否是修改 */
				var editTxt = '设置'
				if(activeEdit.activeId !== ''){
					activeEdit.postData.id = activeEdit.activeId;
					editTxt = '修改设置'
				}
				$.ajax({
					url: window.globalPath + '/activeconfig/insertActiceconfig',
					type: 'POST',
					dataType: 'json',
					data: activeEdit.postData,
					success: function(res){
						if(res.result == 'success'){
							setTimeout(function(){
								location.href = window.globalPath + '/activeconfig/list'
							}, 3000);
							ymPrompt.succeedInfo({
								message: editTxt + '成功！',
								titleBar: false,
								handler: function(){
									location.href = window.globalPath + '/activeconfig/list'
								}
							})
						}else{
							ymPrompt.alert({
								message: editTxt + '失败！<br />' + res.result,
								titleBar: false
							});
							activeEdit.isSubmit = true;
						}
					}, error: function(){
						ymPrompt.alert({
							message: editTxt + '失败！',
							titleBar: false
						});
						activeEdit.isSubmit = true;
					}
				});
			}
		}
	});
	$('.j-cancel').bind('click', function(){
		ymPrompt.confirmInfo({
			message: '是否取消编辑活动配置', titleBar: false, handler: function(resmsg){
				if(resmsg == 'ok'){
					location.href = window.globalPath + '/activeconfig/list';
				}
			}
		})
	});
});