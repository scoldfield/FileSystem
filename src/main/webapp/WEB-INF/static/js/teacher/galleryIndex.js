require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'mypannel': '../common/teacherSideBar',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'jqueryForm': '../lib/jquery.form',
		'Pagination': '../plug/simplePagination/jquery.simplePagination'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'jqueryForm': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']},
		'Pagination': {deps: ['jquery']}

	},
	waitSeconds: 0
});



require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'jqueryForm', 'Pagination'], function(jquery){

	/* 侧边栏 事件*/
	var scrollSideCompone = {
		scrollHeigh: 414,
		pageNumber: 1,
		itemsOnPage: 3,
		$elements: {
			$wrap: $('.m-imgsideContainer'),
			$sideImgNum: $('.j-sideImgNum'),
			$imgsideContainer: $('.j-imgsidecontainer'),
			$imgsideController: $('.j-imgsideController')
		}
	}
	scrollSideCompone.totalPage = function(){
		return Math.ceil(this.$elements.$imgsideContainer.find('li').length / scrollSideCompone.itemsOnPage);
	}
	scrollSideCompone.refreshPage = function(){
		this.$elements.$imgsideContainer.css('top', -1 * this.scrollHeigh * (this.pageNumber - 1) + 'px');
		this.$elements.$sideImgNum.html(this.pageNumber + '/' + this.totalPage());
	}
	scrollSideCompone.isgray = function(){
		var _self = this;
		_self.$elements.$imgsideController.find('a').removeClass('gray');
		if(_self.pageNumber === 1){
			_self.$elements.$imgsideController.find('.j-sideImgDown').addClass('gray');
		}
		if(_self.pageNumber === _self.totalPage()){
			_self.$elements.$imgsideController.find('.j-sideImgUp').addClass('gray');
		}
	}

	scrollSideCompone.init = function(){
		var _self = this;
		_self.$elements.$imgsideController.delegate('a', 'click', function(){
			var $this = $(this);
			if($this.hasClass('j-sideImgUp') && _self.pageNumber < _self.totalPage()){
				++_self.pageNumber;
			}

			if($this.hasClass('j-sideImgDown') && _self.pageNumber > 1){
				--_self.pageNumber;
			}
			_self.refreshPage();
			_self.isgray()
		});
		_self.refreshPage();
		_self.isgray();

		if(_self.totalPage() < _self.itemsOnPage){
			_self.$elements.$wrap.css('height', ((120 + 18) * _self.$elements.$imgsideContainer.find('li').length + 18) + 'px');
		}else{
			_self.$elements.$wrap.css('height', '432px');
		}
	}


	var galleryConstance = {
		galleryListOption: {
			pageNumber: 1,
			itemsOnPage: 12
		},
		createNewGallery: 0
	}

	/* 分页 */
	galleryConstance.Paginationoptions = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/albums/getGalleryList',
		render: function(resObj){
			var _self = this, $trlist = '';
			_self.returnPage.empty();
			/* 获取数据失败 */
			if(!resObj || typeof resObj.pageInfo === 'undefined' || typeof resObj.result === 'undefined' || resObj.pageInfo.total == 0 || resObj.result.length == 0){
				$trlist = '<li class="no">没有相册</li>';
			}else{
				var resDataInfo = resObj.pageInfo, listObj = resObj.result;
				/* 正常获取数据 */
				_self.pageCount = resDataInfo.total;
				for(var i = 0, listlen = listObj.length; i < listlen; i++){
					var _gallerySingle = listObj[i];
					var img = _gallerySingle.cover ? '<img src="' + _gallerySingle.cover + '"/>' : '还没有上传图片'
					var delHtml = (_gallerySingle.type === 2 || _gallerySingle.photoNumber !== 0) ? '' : '<a href="javascript:void(0)" class="del j-del f-fr" data-id="' + _gallerySingle.galleryId + '">删除</a>';
					$trlist += ' <li>' +
						'<a href="' + window.globalPath + '/image/showImageList?galleryId=' + _gallerySingle.galleryId + '" class="img">' + img + '</a>' +
						'<p class="albumsNum">' + _gallerySingle.photoNumber + '</p><div class="inf f-cb"><p class="name f-fl">' + _gallerySingle.galleryName + '</p>' + delHtml + '</div>' +
						'</li>'
				}
			}
			_self.returnPage.html($trlist);
		}
	}
	galleryConstance.galleryUnitList = new Pagination(galleryConstance.Paginationoptions);
	galleryConstance.init = function(){
		var _self = this;
		_self.classId = getUrlQuery('classId');
		_self.galleryListOption.classId = _self.classId;
		galleryConstance.galleryUnitList.init(galleryConstance.galleryListOption);
		/* 上传图片地址 */
		$('.j-uploadImg').attr('href', window.globalPath + '/image/uploadImg?classId=' + _self.galleryListOption.classId);

		$.ajax({
			url: window.globalPath + '/image/getClassGallery',
			type: 'POST',
			dataType: 'json',
			data: {classId: _self.classId},
			success: function(res){
				if(res && res.result){
					var galleryHtml = '';
					for(var i = 0, ilen = res.result.length; i < ilen; i++){
						if(!res.result.hasOwnProperty(i)) continue;
						var gallerySingle = res.result[i];
						var totalNum = 0;
						for(var j = 0, jlen = gallerySingle.galleryList.length; j < jlen; j++){
							totalNum += gallerySingle.galleryList[j].photoNumber
						}
						galleryHtml += ('<li>' +
						'<a class="img"  href="' + window.globalPath + '/albums/galleryList?classId=' + gallerySingle.classId + '"><img src="' + gallerySingle.galleryList[0].cover + '" alt=""></a>' +
						'<div class="inf">' +
						'<h3><a href="' + window.globalPath + '/albums/galleryList?classId=' + gallerySingle.classId + '">' + gallerySingle.gradeName + gallerySingle.className + '</a></h3>' +
						'<p>共' + totalNum + '张照片</p>' +
						'</div>' +
						'</li>');

						/* 当前班级 */
						if(_self.classId == gallerySingle.classId){
							$('.j-titleClassName').html(gallerySingle.gradeName + ' ' + gallerySingle.className);
						}
					}
					scrollSideCompone.$elements.$imgsideContainer.html(galleryHtml);
					scrollSideCompone.init();
				}
			}
		});
	}
	galleryConstance.init();
	/* 新增相册 */
	$('.j-addAlbums').on('click', function(){
		var _html = '<div class="m-createAlbums f-cbli">' +
			'<ul>' +
			'<li><p class="labelName">相册名称</p><div class="iptwrap"><input type="text" class="ipt j-createTitle"/><p class="counter j-titleCounter">(0/15)</p></div></li>' +
			'<li><p class="labelName">相册描述</p><div class="iptwrap"><textarea class="ipt j-createRemark"></textarea><p class="counter j-remarkCounter">(0/100)</p></div></li>' +
			'</ul>' +
			'<p class="f-cr createError"></p>' +
			'</div>';

		ymPrompt.confirmInfo({
			message: _html,
			width: 520,
			height: 345,
			title: '新建相册',
			autoClose: false,
			handler: function(res){
				if(res === 'ok'){
					var postData = {}
					postData.galleryName = $('.j-createTitle').val();
					postData.remark = $('.j-createRemark').val();
					postData.classId = galleryConstance.classId;
					var erroAr = [];

					if(postData.galleryName === ''){
						erroAr.push('相册名称不能为空');
					}else if(postData.galleryName.length > 15){
						erroAr.push('相册名称长度不能大于15个字符');
					}else if(checkUtil.checkSpecialChar(postData.galleryName) || postData.galleryName.indexOf(' ') >= 0){
						erroAr.push('相册名称不能含有空格或特殊字符');
					}

					if(postData.remark !== '' && postData.remark.length > 100){
						erroAr.push('相册详述字数不能超过100个字符');
					}else if(checkUtil.checkSpecialChar(postData.remark)){
						erroAr.push('相册详述不能含有特殊字符');
					}

					var $error = $('.createError')
					if(erroAr.length > 0){
						$error.html(erroAr.join('； '))
					}else{
						/*检测数据 */
						$.ajax({
							url: window.globalPath + '/albums/createClassGallery',
							type: 'POST',
							dataType: 'json',
							data: postData,
							success: function(res){
								if(res && res.result == 'success'){
									galleryConstance.createNewGalleryId = res.gallery.id;
									galleryConstance.createNewGalleryClassId = res.gallery.classId
									var askhtml = '<div style="padding:52px 20px; text-align: center;">创建相册成功,是否上传照片？</div>';
									ymPrompt.close();
									ymPrompt.confirmInfo({
										message: askhtml,
										width: 360,
										height: 220,
										titleBar: false,
										handler: function(res){
											if(res === 'ok'){
												location.href = window.globalPath + '/image/uploadImg?galleryId=' + galleryConstance.createNewGalleryId + '&classId=' + galleryConstance.createNewGalleryClassId
											}else{
												location.reload();
											}
										}
									})

								}else{
									$error.html('新建失败，错误：' + res.result);
								}
							},
							error: function(){
								$error.html('新建失败，错误：' + res.result);
							}
						});
					}
				}else{
					ymPrompt.close();
				}
			}
		});

		/* 设置字数查询 */
		var $titleCounter = $('.j-titleCounter'), $remarkCounter = $('.j-remarkCounter'), $title = $('.j-createTitle'), $remark = $('.j-createRemark');
		var createTitleCounter = new CountInput($title);
		createTitleCounter.init({
			callback: function(val){
				if(val <= 15){
					$titleCounter.html('(' + val + '/15)').removeClass('f-cr');
				}else{
					$titleCounter.html('超出' + (val - 15)).addClass('f-cr');
				}
			}
		});
		var createRemarkCounter = new CountInput($remark);
		createRemarkCounter.init({
			callback: function(val){
				if(val <= 100){
					$remarkCounter.html('(' + val + '/100)').removeClass('f-cr');
				}else{
					$remarkCounter.html('超出' + (val - 100)).addClass('f-cr')
				}

			}
		});
	});



	/* 删除相册 */
	galleryConstance.Paginationoptions.returnPage.delegate('.j-del', 'click', function(){
		var $this = $(this), $li = $this.parents('li'), _galleryId = $this.attr('data-id');
		var _html = '<div class="ym-inContent ym-inContent-warning">' +
			'<div class="content">' +
			'<h2>确认删除这个相册？</h2></div></div>';
		ymPrompt.confirmInfo({
			message: _html,
			width: 360,
			height: 240,
			titleBar: false,
			handler: function(res){
				if(res === 'ok'){
					$.ajax({
						url: window.globalPath + '/albums/deleteGallery',
						type: 'POST',
						dataType: 'json',
						data: {galleryId: _galleryId},
						success: function(res){
							if(res.result == 'success'){
								$li.remove();
								var $paginationTotal = $('.j-paginationTotal')
								$paginationTotal.html(parseInt($paginationTotal.html()) - 1);
							}else{
								ymPrompt.alert({
									message: '删除失败',
									titleBar: false
								});
							}
						}, error: function(){
							ymPrompt.alert({
								message: '删除失败',
								titleBar: false
							});
						}
					});
				}
			}
		});
	});
});
