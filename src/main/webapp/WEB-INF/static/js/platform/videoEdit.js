/**
 * Document by wangshuyan@chinamobile.com on 2015/11/16 0016.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/base',
		'function': '../common/function',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'ymPrompt', 'base', 'function'], function(jquery){

	var videoCreat = {
		$elements: {
			$city: $('.j-selectui-city'),
			$country: $('.j-selectui-country'),
			$schools: $('.j-selectui-schools'),
			$classes: $('.j-selectui-classes'),
			$submitAdd: $('.j-submit'),
			$cancelAdd: $('.j-submitCancel')
		},
		schoolId: '',
		renderCounty: function(id){
			if(id){
				$.ajax({
					url: window.globalPath + '/MonitorSetController/getArea',
					type: 'POST',
					dataType: 'json',
					data: {code: id},
					async: false,
					success: function(resData){
						var li_html = '';
						if(resData.areaList && resData.areaList.length > 0){
							for(var i in resData.areaList){
								var areaSingle = resData.areaList[i]
								li_html += '<li data-value="' + areaSingle.code + '">' + areaSingle.areaName + '</li>';
							}
						}else{
							li_html += '<li data-value="">未获得任何区县</li>'
						}
						$('.j-areaList').html(li_html);
					}
				})
			}
		},
		renderSchools: function(code){
			$.ajax({
				url: window.globalPath + '/MonitorSetController/getSchool',
				type: 'POST',
				dataType: 'json',
				data: {districtId: code},
				async: false,
				success: function(resData){
					var li_html = '';
					if(resData && resData.length > 0){
						for(var i in resData){
							var schoolSingle = resData[i]
							li_html += '<li data-value="' + schoolSingle.id + '">' + schoolSingle.referredName + '</li>';
						}
					}else{
						li_html += '<li data-value="">未获得任何学校</li>'
					}
					$('.j-schoolsList').html(li_html);
				}
			});
		},
		renderClasses: function(id){
			$.ajax({
				url: window.globalPath + '/MonitorSetController/getClazz',
				type: 'POST',
				dataType: 'json',
				data: {schoolId: id},
				async: false,
				success: function(resData){
					var li_html = '';
					if(resData && !!checkUtil.hasProperty(resData)){
						for(var i in resData){
							var classGroupSingle = resData[i]
							if(typeof  classGroupSingle === 'object' && classGroupSingle instanceof Array){
								for(var j in classGroupSingle){
									var classSingle = classGroupSingle[j]
									li_html += '<li data-value="班级##' + classSingle.gradeId + '##' + classSingle.id + '">' + classSingle.gradeName + ' ' + classSingle.className + '</li>';
								}
							}else if(typeof classGroupSingle === 'string'){
								li_html += '<li data-value="' + classGroupSingle + '">' + classGroupSingle + '</li>';
							}
						}
					}else{
						li_html += '<li data-value="">未获得任何地区</li>'
					}
					$('.j-classesList').html(li_html);
				}
			});
		},
		isSubmit: true
	}

	/* 城市事件 && 获取区县列表*/
	videoCreat.cityInstance = new SelectUi(videoCreat.$elements.$city);
	videoCreat.countyInstance = new SelectUi(videoCreat.$elements.$country);
	videoCreat.schoolInstance = new SelectUi(videoCreat.$elements.$schools);
	videoCreat.classInstance = new SelectUi(videoCreat.$elements.$classes);


	videoCreat.cityInstance.bindE(function(resVal){
		/*重新选择后，清空所有下属其他单位*/
		videoCreat.countyInstance.reset();
		videoCreat.schoolInstance.reset();
		videoCreat.classInstance.reset();
		videoCreat.renderCounty(resVal);
	});

	/* 区县事件 && 获取学校列表*/

	videoCreat.countyInstance.bindE(function(resVal){
		/*重新选择后，清空所有下属其他单位*/
		videoCreat.schoolInstance.reset();
		videoCreat.classInstance.reset();
		videoCreat.renderSchools(resVal);
	});

	/* 学校事件 && 获取班级列表*/

	videoCreat.schoolInstance.bindE(function(resVal){
		/*重新选择后，清空所有下属其他单位*/
		videoCreat.classInstance.reset();
		videoCreat.renderClasses(resVal);
		videoCreat.schoolId = resVal;
	});

	/* 班级事件 */
	videoCreat.classInstance.bindE();

	videoCreat.getVal = function(ele){
		return $.trim($(ele).val());
	}


	videoCreat.$elements.$submitAdd.on('click', function(){
			var $this = $(this);
			var postData = {}, errorMsg = [], _addressGroup = '';
			postData.cityCode = videoCreat.getVal('.j-dataCity');
			postData.areaId = videoCreat.getVal('.j-dataCountry');
			postData.schoolId = videoCreat.getVal('.j-dataSchool');

			postData.name = videoCreat.getVal('.j-dataName');
			postData.rtsp = videoCreat.getVal('.j-dataUrl');

			_addressGroup = videoCreat.getVal('.j-dataClass');

			if(_addressGroup.indexOf('#')){
				var _addressGroupAr = _addressGroup.split('##');
				postData.type = _addressGroupAr[0];
				postData.gradeId = _addressGroupAr[1];
				postData.classId = _addressGroupAr[2];
			}else{
				postData.type = _addressGroup
				postData.gradeId = 0
				postData.classId = 0
			}


			if(postData.cityCode === ''){
				errorMsg.push('请选择城市！!');
			}
			if(postData.areaId === ''){
				errorMsg.push('请选择区县！!');
			}
			if(postData.schoolId === ''){
				errorMsg.push('请选择学校！!');
			}
			if(postData.type === ''){
				errorMsg.push('请选择视频地点！!');
			}
			if(postData.name === ''){
				errorMsg.push('请填写视频名称!');
			}
			if(postData.name.length > 50){
				errorMsg.push('视频名称字数不能超过50个字!');
			}
			if(postData.rtsp === ''){
				errorMsg.push('请填写视频地址!');
			}


			if(errorMsg.length > 0){
				$('.j-tips').html(errorMsg.join('; ')).show();
				setTimeout(function(){
					$('.j-tips').fadeOut(1000);
				}, 5000)
			}else{
				var ajaxUrl = 'create', editText = '添加';
				if(window.videoEditInf.id){
					postData.id = window.videoEditInf.id;
					ajaxUrl = 'edit';
					editText = '修改';
					var isEdit = false;
					for(var ei in postData){
						if(postData.hasOwnProperty(ei) && window.videoEditInf.hasOwnProperty(ei) && postData[ei] != window.videoEditInf[ei]){
							isEdit = true;
						}
					}
					if(!isEdit){
						location.href = window.globalPath + '/MonitorSetController/getList';
						return;
					}
				}

				if(videoCreat.isSubmit){
					ymPrompt.confirmInfo({
						message: '确定' + editText + '视频？',
						width: 320,
						height: 200,
						titleBar: false,
						handler: function(resMsg){
							if(resMsg == 'ok'){
								videoCreat.isSubmit = false;
								$this.val('提交中...')
								$.ajax({
									url: window.globalPath + '/MonitorSetController/' + ajaxUrl,
									type: 'POST',
									dataType: 'json',
									data: postData,
									success: function(res){
										if(res.msg == 'ok'){
											setTimeout(function(){
												location.href = window.globalPath + '/MonitorSetController/getList';
											}, 3000)
											ymPrompt.succeedInfo({
												message: editText + '成功',
												width: 300,
												height: 180,
												titleBar: false,
												handler: function(){
													location.href = window.globalPath + '/MonitorSetController/getList';
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
	);

	$('.j-submitCancle').bind('click', function(){
		ymPrompt.confirmInfo({
			message: '确定取消编辑视频设备？', titleBar: false, handler: function(resmsg){
				if(resmsg == 'ok'){
					location.href = window.globalPath + '/MonitorSetController/getList';
				}
			}
		});
	});

	/* 修改时渲染页面 */
	if(window.videoEditInf.id !== ''){
		/* 获取当前区县 的学校  */
		videoCreat.renderSchools(window.videoEditInf.areaId);
		/* 获取当前市下的区县 */
		videoCreat.renderCounty(window.videoEditInf.cityCode);
		/* 获取当前区县 的学校  */
		videoCreat.renderClasses(window.videoEditInf.schoolId);

		/* 市 */
		videoCreat.cityInstance.init(window.videoEditInf.cityCode);
		/* 区县 */
		videoCreat.countyInstance.init(window.videoEditInf.areaId);
		/* 学校 */
		videoCreat.schoolInstance.init(window.videoEditInf.schoolId);

		if(window.videoEditInf.type === '班级'){
			videoCreat.classInstance.init(window.videoEditInf.type + '##' + window.videoEditInf.gradeId + '##' + window.videoEditInf.classId)
		}else{
			videoCreat.classInstance.init(window.videoEditInf.type);
		}
	}
});