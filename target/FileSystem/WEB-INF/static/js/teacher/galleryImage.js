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
	};
	scrollSideCompone.totalPage = function(){
		return Math.ceil(this.$elements.$imgsideContainer.find('li').length / scrollSideCompone.itemsOnPage);
	};
	scrollSideCompone.refreshPage = function(){
		this.$elements.$imgsideContainer.css('top', -1 * this.scrollHeigh * (this.pageNumber - 1) + 'px');
		this.$elements.$sideImgNum.html(this.pageNumber + '/' + this.totalPage());
	};
	scrollSideCompone.isgray = function(){
		var _self = this;
		_self.$elements.$imgsideController.find('a').removeClass('gray');
		if(_self.pageNumber === 1){
			_self.$elements.$imgsideController.find('.j-sideImgDown').addClass('gray');
		}
		if(_self.pageNumber === _self.totalPage()){
			_self.$elements.$imgsideController.find('.j-sideImgUp').addClass('gray');
		}
	};

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
	};

	/* 图片浏览  */
	var imgFloat = new ImgFloatCompane();
	imgFloat.options = {
		dataLength: 0,
		container: '.j-floatimg',
		imgwrap: '.j-floatcontent',
		currentIndex: 1,
		leftCtrl: '.aleft',
		rightCtrl: 'aright',
		imgwidth: 720,
		rollSpeed: 500,
		mask: '.u-mask'
	};

	var imagesConstance = {
		imagesListOption: {
			pageNumber: 1,
			itemsOnPage: 12
		},
		classId: 0,
		isGetInfo: false,
		getInfo: function(resObj){
			imagesConstance.classId = resObj.gallery.classId;
			/* 获得相册数据 */
			$('.j-galleryInfo').html(resObj.gallery.remark);
			$('.j-galleryName').html(' / ' + resObj.gallery.galleryName);
			$('.j-className').html(resObj.gradeName + ' ' + resObj.className).attr('href', window.globalPath + '/albums/galleryList?classId=' + imagesConstance.classId);
			/* 上传href */
			$('.j-uploadImg').attr('href', window.globalPath + '/image/uploadImg?classId=' + imagesConstance.classId + '&galleryId=' + imagesConstance.galleryId);

			/* 获取班级相册 */
			$.ajax({
				url: window.globalPath + '/image/getClassGallery',
				type: 'POST',
				dataType: 'json',
				data: {classId: imagesConstance.classId},
				success: function(res){
					if(res && res.result){
						var galleryHtml = '';
						for(var i = 0, ilen = res.result.length; i < ilen; i++){
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
						}
						scrollSideCompone.$elements.$imgsideContainer.html(galleryHtml);
						scrollSideCompone.init();
					}
				}
			});
		}
	};

	/* 分页 */
	imagesConstance.Paginationoptions = {
		returnPage: $('#tab'),
		tabPagination: $('.tab-pagination'),
		ajaxurl: window.globalPath + '/image/getGalleryImageList',
		render: function(resObj){
			var _self = this, $trlist = '', viewHtml = '';
			_self.returnPage.empty();
			/* 获取数据失败 */
			if(!resObj || typeof resObj.pageInfo === 'undefined' || typeof resObj.result === 'undefined' || resObj.pageInfo.total == 0 || resObj.result.length == 0){
				$trlist = '<li class="no">该相册还没有上传照片，<a class="u-gbtn u-gbtn-uplodPhoto j-uploadImg" href="javascript:void(0)">上传图片</a></li>';
			}else{
				var resDataInfo = resObj.pageInfo, listObj = resObj.result;
				/* 正常获取数据 */
				_self.pageCount = resDataInfo.total;
				for(var i = 0, listlen = listObj.length; i < listlen; i++){
					var _gallerySingle = listObj[i];
					$trlist += '<li data-id="' + _gallerySingle.photoId + '">' +
						'<a href="javascript:void(0)" class="img"><img src="' + _gallerySingle.photoUrl + '"/></a>' +
						'<a href="javascript:void(0)" class="deleAlbums j-deleAlbums">删除</a>' +
						'</li>';
					//浏览相册查看列表
					viewHtml += '<li data-id="' + _gallerySingle.photoId + '"><img src="' + _gallerySingle.photoUrl + '"/></li>'
				}
			}
			_self.returnPage.html($trlist);
			imgFloat.options.dataLength = listlen;
			$(imgFloat.options.imgwrap).html(viewHtml);
			imgFloat.init(imgFloat.options);
			if(!imagesConstance.isGetInfo){
				imagesConstance.getInfo(resObj);
			}
		}
	};

	imagesConstance.imagesUnitList = new Pagination(imagesConstance.Paginationoptions);


	imagesConstance.init = function(){
		var _self = this;
		_self.galleryId = getUrlQuery('galleryId');
		_self.imagesListOption.galleryId = _self.galleryId;
		imagesConstance.imagesUnitList.init(imagesConstance.imagesListOption);
	};

	imagesConstance.init();


	imagesConstance.Paginationoptions.returnPage.delegate('.j-deleAlbums', 'click', function(){
		var $this = $(this), $li = $this.parent(), _photoId = $li.attr('data-id');
		var _html = '<div class="ym-inContent ym-inContent-warning oneline">' +
			'<div class="content">' +
			'<h2>确认删除这个照片？</h2></div></div>';
		ymPrompt.confirmInfo({
			message: _html,
			width: 360,
			height: 220,
			titleBar: false,
			handler: function(res){
				if(res === 'ok'){
					$.ajax({
						url: window.globalPath + '/image/deleteImage',
						type: 'POST',
						dataType: 'json',
						data: {photoIds: _photoId},
						success: function(res){
							if(res.result == 'success'){
								$li.remove();
								//更新浮动窗口数据
								$(imgFloat.options.imgwrap).find('li[data-id=' + _photoId + ']').remove();
								imgFloat.options.dataLength = imgFloat.options.dataLength - 1;
								imgFloat.init(imgFloat.options);

								var $paginationTotal = $('.j-paginationTotal');
								//$paginationTotal.html(+$paginationTotal.html() - 1);
								imagesConstance.imagesUnitList.tabPagination.pagination('updateItems', +$paginationTotal.html() - 1);
								if($paginationTotal.html() == '0'){
									imagesConstance.Paginationoptions.returnPage.append('<li class="no">该相册还没有上传照片，<a class="u-gbtn u-gbtn-uplodPhoto j-uploadImg" href="/XiaoXT/teacher/image/uploadImg?classId=' + imagesConstance.classId + '&amp;galleryId=' + imagesConstance.galleryId + '">上传图片</a></li>')
								}



							}else{
								ymPrompt.alert({
									message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>删除失败</h2></div>',
									width: 300,
									height: 220,
									titleBar: false
								});
							}
						}, error: function(){
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning oneline oneline"><h2>删除失败</h2></div>',
								width: 300,
								height: 220,
								titleBar: false
							});
						}
					});
				}
			}
		});
	}).delegate('.img', 'click', function(){
		var $this = $(this), $p = $this.parent(), _t = $p.index();
		imgFloat.showImg(_t);
	});


});
