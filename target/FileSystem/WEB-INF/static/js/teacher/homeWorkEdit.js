/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'jqueryForm': '../lib/jquery.form',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'mypannel': '../common/teacherSideBar',
		'My97DatePicker': '../plug/My97DatePicker/WdatePicker',
		'ymPrompt': '../plug/ymPrompt/ymPrompt'
	},
	shim: {
		'base': {deps: ['jquery']},
		'jqueryForm': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'My97DatePicker', 'mypannel', 'ymPrompt', 'jqueryForm'], function(jquery){

	var _id = getUrlQuery('id');
	var editData = null, typeText = '新增', returnUrl = '';

	/* 渲染日和月  ** 直接写到页面里太蛋疼了，不如用js渲染吧 ^_^ */
	var h_html = '<li data-value="00">00</li> <li data-value="01">01</li> <li data-value="02">02</li> <li data-value="03">03</li> <li data-value="04">04</li> <li data-value="05">05</li> <li data-value="06">06</li> <li data-value="07">07</li> <li data-value="08">08</li> <li data-value="09">09</li> <li data-value="10">10</li> <li data-value="11">11</li> <li data-value="12">12</li> <li data-value="13">13</li> <li data-value="14">14</li> <li data-value="15">15</li> <li data-value="16">16</li> <li data-value="17">17</li> <li data-value="18">18</li> <li data-value="19">19</li> <li data-value="20">20</li> <li data-value="21">21</li> <li data-value="22">22</li> <li data-value="23">23</li>',
		m_html = '<li data-value="00">00</li><li data-value="01">01</li><li data-value="02">02</li><li data-value="03">03</li><li data-value="04">04</li><li data-value="05">05</li><li data-value="06">06</li><li data-value="07">07</li><li data-value="08">08</li><li data-value="09">09</li><li data-value="10">10</li><li data-value="11">11</li><li data-value="12">12</li><li data-value="13">13</li><li data-value="14">14</li><li data-value="15">15</li><li data-value="16">16</li><li data-value="17">17</li><li data-value="18">18</li><li data-value="19">19</li><li data-value="20">20</li><li data-value="21">21</li><li data-value="22">22</li><li data-value="23">23</li><li data-value="24">24</li><li data-value="25">25</li><li data-value="26">26</li><li data-value="27">27</li><li data-value="28">28</li><li data-value="29">29</li><li data-value="30">30</li><li data-value="31">31</li><li data-value="32">32</li><li data-value="33">33</li><li data-value="34">34</li><li data-value="35">35</li><li data-value="36">36</li><li data-value="37">37</li><li data-value="38">38</li><li data-value="39">39</li><li data-value="40">40</li><li data-value="41">41</li><li data-value="42">42</li><li data-value="43">43</li><li data-value="44">44</li><li data-value="45">45</li><li data-value="46">46</li><li data-value="47">47</li><li data-value="48">48</li><li data-value="49">49</li><li data-value="50">50</li><li data-value="51">51</li><li data-value="52">52</li><li data-value="53">53</li><li data-value="54">54</li><li data-value="55">55</li><li data-value="56">56</li><li data-value="57">57</li><li data-value="58">58</li><li data-value="59">59</li>';

	$('.j-hoursList').append(h_html);
	$('.j-minList').append(m_html);

	var $elements = {
		$homeWorkDate: $('.j-homeWorkDate'),
		$homeWorkDsh: $('.j-exStartHours'),
		$homeWorkDsm: $('.j-exStartMins'),
		$homeWorkDeh: $('.j-exEndHours'),
		$homeWorkDem: $('.j-exEndMins'),
		$selectRecipientBtn: $('.j-selectRecipientBtn'),
		$mask: $('.u-mask'),
		$selectRecipientWrap: $('.g-selectRecipient'),
		$selectRecipientContent: $('.j-RecipientContent'),
		$selectContent: $('.j-selectContent'),
		$closeRecipient: $('.closeRecipient'),
		$hwContent: $('.j-hwContent'),
		$addAccessoryBtn: $('.j-addAccessoryBtn'),
		$photoFile: $('#photoFile'),
		$AccessoryList: $('.j-AccessoryList'),
		$showImgContainer: $('.showImgContainer'),
		$errorMsg: $('.j-errorMsg')

	};

	/* 已有数据的渲染 */
	if(_id){
		$.ajax({
			url: window.globalPath + '/schoolnotice/updatedeaftJson',
			type: 'POST',
			dataType: 'json',
			data: {id: _id},
			async: false,
			success: function(res){
				if(res){
					editData = res;
					if(editData && editData.pubstate && editData.pubstate === '0'){
						location.href = window.globalPath + '/schoolnotice/receiveNotice';
					}
					$elements.$noticeTitle.val(editData.title || '');
					$elements.$noticeContent.val(editData.tmpContent || '');
					typeText = '修改'
				}
			}
		});
	}

	var postData = {};


	/* 作业缓存数据 */
	var submitTransferData = {
		titleLen: 0,
		tmpContentLen: 0,
		imgurl: [],
		imgRealName: [],
		file: [],
		fileRealName: []
	}

	var exStartHours = new SelectUi($elements.$homeWorkDsh),
		exStartMins = new SelectUi($elements.$homeWorkDsm),
		exEndHours = new SelectUi($elements.$homeWorkDeh),
		exEndMins = new SelectUi($elements.$homeWorkDem);

	exStartHours.bindE();
	exStartMins.bindE();
	exEndHours.bindE();
	exEndMins.bindE();


	/* 展开班级选择 */
	var homeWorkRecipient = new SelectRecipient({
		triggerEle: $elements.$selectRecipientBtn,
		mask: $elements.$mask,
		selectRecipientWrap: $elements.$selectRecipientWrap,
		selectRecipientContent: $elements.$selectRecipientContent,
		closeRecipient: $elements.$closeRecipient
	});
	homeWorkRecipient.typeTxt = '发布';
	homeWorkRecipient.classGroupData = [];
	homeWorkRecipient.nameCompareGroup = {};
	homeWorkRecipient.postData = '';
	homeWorkRecipient.init(function(_self){
		/* 获取年级/科目列表 */
		$.ajax({
			url: window.globalPath + '/homeworks/reload ',
			type: 'get',
			dataType: 'json',
			success: function(resObj){
				/*  课程渲染 */
				var couList = resObj.couList, course_html = '';
				for(var c_i = 0, cilen = couList.length; c_i < cilen; c_i++){
					course_html += '<li data-value="' + couList[c_i].id + '">' + couList[c_i].name + '</li>';
				}
				$('.j-courseList').append(course_html);

				/* 班级渲染 */
				var classList = resObj.classList;
				var $recipientContainer = $('<div class="j-recipientClassGroup"></div>');
				for(var i = 0, ilen = classList.length; i < ilen; i++){
					var gradeSingle = classList[i],
						$gradeWrap = $('<div class="selectRecipientWrap"></div>');

					var gradeId = gradeSingle.gradeId,
						gradeName = gradeSingle.gradeName;

					var li_html = '<div class="selectRecipient-grade f-cb"><span class="grade-wd" data-value="' + gradeId + '">' + gradeName + '</span></div><div class="selectRecipient-class"> <ul class="f-cb f-cbli">';
					for(var j = 0, jlen = gradeSingle.claList.length; j < jlen; j++){
						var classSingle = gradeSingle.claList[j];
						li_html += '<li><label class="checkbox-ui f-fl"><input type="checkbox" value="' + classSingle.id + '"/><b></b><span class="wd">' + classSingle.className + '</span></label></li>';
						homeWorkRecipient.nameCompareGroup[classSingle.id] = gradeName + ' ' + classSingle.className;
					}
					li_html += ' </ul></div>'
					$gradeWrap.append(li_html);
					$recipientContainer.append($gradeWrap);
				}
				$elements.$selectContent.append('<div class="selectRecipient-grade f-cb"><label class="checkbox-ui f-fl"><input type="checkbox" class="j-recipientAll"  /><b></b><span class="wd">全部班级</span></label></div>');
				$elements.$selectContent.append($recipientContainer);
			}
		});
		_self.bindE();
	});

	homeWorkRecipient.showRecipient = function(){
		var li_html = '';

		homeWorkRecipient.classGroupData = []
		$elements.$selectContent.find('.j-recipientClassGroup').find('input:checkbox:checked').each(function(){
			homeWorkRecipient.classGroupData.push($(this).val());
		});

		if(homeWorkRecipient.classGroupData.length > 0){
			for(var i = 0, ilen = homeWorkRecipient.classGroupData.length; i < ilen; i++){
				var classIdSingle = homeWorkRecipient.classGroupData[i];
				li_html += '<span class="name-unit">' + homeWorkRecipient.nameCompareGroup[classIdSingle] + '</span>';
			}
		}else{
			li_html += '<div class="enterTips ">请输入接收人</div>'
		}
		$elements.$selectRecipientBtn.html(li_html);
	}

	homeWorkRecipient.bindE(function(_self){
		/* 事件添加 */
		$elements.$selectContent.on('change', 'input:checkbox', function(){
			var $this = $(this), $classGroupChecked = $elements.$selectContent.find('.j-recipientClassGroup');
			if($this.hasClass('j-recipientAll')){
				$classGroupChecked.find('input:checkbox').each(function(){
					$(this)[0].checked = $this[0].checked;
				});
			}else{
				$elements.$selectContent.find('.j-recipientAll')[0].checked = $classGroupChecked.find('input:checkbox:checked').length == $classGroupChecked.find('input:checkbox').length;
			}
		});

		$('.j-addRecipientData').on('click', function(){
			homeWorkRecipient.closeClassGroup();
			homeWorkRecipient.showRecipient();
		});
	});

	homeWorkRecipient.init();


	/* 作业内容字数查询 */
	var contentCounter = new CountInput($elements.$hwContent);
	contentCounter.init({
		callback: function(_vlen){
			if(_vlen <= 5000){
				$('.j-noticeContentCounter').html('<span class="green"> ' + _vlen + ' </span> /5000');
			}else{
				$('.j-noticeContentCounter').html('<span class="f-cr">超出' + (_vlen - 5000 ) + '</span>');
			}
		}
	});

	/* 作业时间选定 */
	var tomorrow = new Date(+new Date() + 86400000);
	$elements.$homeWorkDate.bind('click', WdatePicker).val(tomorrow.getFullYear() + '-' + (tomorrow.getMonth() + 1) + '-' + tomorrow.getDate());


	/* 作业科目选择 */
	var homeWorkCourse = new SelectUi($('.j-selectui-homeWorkCourse'));
	homeWorkCourse.bindE();


	/*  添加图片组件事件 */

	var addFilesObj = {
		ajaxFormFn: function($form, url, data){
			var result = ''
			$form.ajaxSubmit({
				url: url,
				type: 'POST',
				async: false,
				success: function(resData){
					if(typeof resData == 'string'){
						result = JSON.parse(resData)
					}else{
						result = resData;
					}
				}
			});
			return result;
		},
		addImages: function(imgUrl, realName){
			var index_imgurl = submitTransferData.imgurl.length,
				index_realName = submitTransferData.imgRealName.length;
			submitTransferData.imgurl.push(imgUrl);
			submitTransferData.imgRealName.push(realName);
			/* 渲染缩略图 */
			$elements.$AccessoryList.append('<li class="j-fupload showImg"><span class="name">' + realName + '</span><a data-item="imgurl" data-nameItem ="imgRealName"  data-id="' + index_imgurl + '" class="close" href="javascript:void(0)"></a><div class="showImgContainer"><img src="' + imgUrl + '"/></div></li>');
		},
		init: function(){
			if(editData && editData.imgurl && editData.realimgurl){
				var iAr = editData.imgurl.split(';'),
					inameAr = editData.realimgurl.split(';');
				var imgGroup = [], imgNameGroup = [];
				for(var i_i = 0, iilen = iAr.length; i_i < iilen; i_i++){
					if(iAr[i_i] !== '' && inameAr[i_i] !== ''){
						imgGroup.push(iAr[i_i]);
						imgNameGroup.push(inameAr[i_i]);
					}
				}
				for(var if_i = 0, iflen = imgGroup.length; if_i < iflen; if_i++){
					this.addImages(imgGroup[if_i], imgNameGroup[if_i]);
				}
			}
			this.bindE();
		}
	}


	addFilesObj.bindE = function(){
		var _self = this;
		$elements.$addAccessoryBtn.delegate('a', 'click', function(){
			var $this = $(this);
			if($this.hasClass('j-addImg')){
				/* 检验是否传满8张 */
				var imgAr = []
				for(var img_i = 0, imlen = submitTransferData.imgurl.length; img_i < imlen; img_i++){
					if(submitTransferData.imgurl[img_i] !== 0){
						imgAr.push(submitTransferData.imgurl[img_i]);
					}
				}
				if(imgAr.length >= 8){
					ymPrompt.succeedInfo({
						message: ' 最多上传8张图片<br/>您已上传了8张照片',
						width: 420,
						height: 200,
						titleBar: false
					});
				}else{
					$elements.$photoFile.click();
				}
			}
		});

		$elements.$photoFile.bind('change', function(){
			var val = $(this).val();
			if(val !== ''){
				var valAr = val.split('.');
				var extension = valAr[valAr.length - 1];
				if(extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'bmp' || extension == 'JPG' || extension == 'PNG' || extension == 'GIF' || extension == 'BMP' || extension == 'JPEG' || extension == 'jpeg'){
					/* 获取 */
					var imgUrlResult = _self.ajaxFormFn($('#fileUpload'), window.globalPath + '/schoolnotice/uploadimage.html');
					/* 返回的对象如果是数组，表示正确的返回*/
					if(imgUrlResult instanceof  Array){
						var imgUrl = imgUrlResult[0].fileurl,
							_realName = imgUrlResult[0].realName;
						_self.addImages(imgUrl, _realName);
					}else{
						/*  bigimageError 图片过大，其他直接打印 */
						if(imgUrlResult === 'bigimageError'){
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning" ><div class="content"><h2> 上传图片过大<br />上传图片大小应该在2M内</h2></div></div>',
								titleBar: false,
								width: 360,
								height: 240
							});
						}else{
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning" ><div class="content"><h2>' + imgUrlResult + '</h3></div></div>',
								titleBar: false,
								width: 360,
								height: 240
							});
						}
					}
				}else{
					ymPrompt.alert({
						message: '<div class="ym-inContent ym-inContent-warning" ><div class="content"><h2>上传图片格式不正确<span class="f-db f-fs1" style="padding-top:9px;" >请上传jpg,gif,png,bmp,jpeg格式的图片</span></h2></div></div>',
						titleBar: false,
						width: 360,
						height: 240
					});
				}
				/* 暂存 */

			}
		});


		$elements.$AccessoryList.delegate('a.close', 'click', function(){
			var $this = $(this), _index = $this.attr('data-id'), _type = $this.attr('data-item'), _nameType = $this.attr('data-nameItem');
			submitTransferData[_type][_index] = 0;
			submitTransferData[_nameType][_index] = 0;
			$this.parents('li.j-fupload').remove();
		});
	}

	addFilesObj.init();


	var isSubmit = true;
	/*  提交 */
	$('.j-submithomeWork').on('click', function(){
		if(isSubmit){
			isSubmit = false;
			var errorMsgAr = [];
			// 图片附件
			var imgAr = []
			for(var img_i = 0, imlen = submitTransferData.imgurl.length; img_i < imlen; img_i++){
				if(submitTransferData.imgurl[img_i] !== 0){
					imgAr.push(submitTransferData.imgurl[img_i]);
				}
			}
			postData.image = imgAr.join(',');


			/*  作业日期 */
			postData.endtimeStr = $elements.$homeWorkDate.val();
			if(postData.endtimeStr === ''){
				errorMsgAr.push('请填写作业截止日期！');
			}

			/*  作业时间  */
			var _stHour = $('.j-stHour').val(), _stMins = $('.j-stMins').val();
			postData.endHmStr = _stHour + ':' + _stMins;
			/* add PostData*/
			var _sTime = postData.endtimeStr + ' ' + postData.endHmStr;

			if($.trim(_sTime) === ''){
				errorMsgAr.push('请输入截止日期！');
			}

			if(new Date(_sTime) < new Date()){
				errorMsgAr.push('作业截止时间早于当前时间！');
			}

			/* 科目 */
			postData.courseId = +$.trim($('.j-selectCourse').val());
			if(postData.courseId === 0){
				errorMsgAr.push('请填写作业科目！');
			}

			if(homeWorkRecipient.classGroupData.length === 0){
				errorMsgAr.push('请填写作业对象！');
			}else{
				postData.classIds = homeWorkRecipient.classGroupData.join(',');
			}

			/* 作业内容 */
			postData.content = $.trim($('.j-hwContent').val());
			if(postData.content === ''){
				errorMsgAr.push('请填写作业内容！');
			}
			if(postData.content.length > 5000){
				errorMsgAr.push('作业内容字数不能超出5000！');
			}


			postData.sendClient = $('.j-appsend').is(':checked') ? 1 : 0;
			postData.sendFather = $('.j-smstype').is(':checked') ? 1 : 0;

			var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
				'<h2>确认' + homeWorkRecipient.typeTxt + '该作业？</h2></div>';

			if(errorMsgAr.length > 0){
				$('.j-errotips').html(errorMsgAr.join('; ')).fadeIn();
				setTimeout(function(){
					$('.j-errotips').fadeOut(1000);
				}, 3000);
				isSubmit = true;
			}else{
				ymPrompt.confirmInfo({
					message: _html,
					width: 420,
					height: 220,
					titleBar: false,
					handler: function(res){
						if(res === 'ok'){
							$.ajax({
								url: window.globalPath + '/homeworks/save',
								data: postData,
								type: 'POST',
								dataType: 'json',
								success: function(res){
									if(res.result === true){
										setTimeout(function(){
											location.href = window.globalPath + '/homeworks/list'
										}, 3000)
										ymPrompt.succeedInfo({
											message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>' + homeWorkRecipient.typeTxt + '作业成功</h2></div>',
											titleBar: false,
											width: 300,
											height: 220,
											handler: function(){
												location.href = window.globalPath + '/homeworks/list';
											}
										})
									}else{
										isSubmit = true;
									}
								}, error: function(){
									isSubmit = true;
								}
							})
						}else{
							isSubmit = true;
						}
					}
				});
			}
		}
	});

	/*取消*/
	$('.j-submitCancel').on('click', function(){
		ymPrompt.confirmInfo({
			message: '是否取消编辑作业?',
			width: 360,
			height: 200,
			titleBar: false,
			handler: function(res){
				if(res === 'ok'){
					location.href = window.globalPath + '/homeworks/list'
				}
			}
		});
	});


	$('.j-returnList').on('click', function(){
		var _href = $(this).attr('data-href');
		ymPrompt.confirmInfo({
			message: '<div class="ym-inContent ym-inContent-warning " ><h2>确定返回?</h2><p>返回后已填内容将不会保存</p> </div>',
			titleBar: false,
			width: 360,
			height: 220,
			handler: function(res){
				if(res === 'ok'){
					location.href = _href;
				}
			}
		});
	});
});