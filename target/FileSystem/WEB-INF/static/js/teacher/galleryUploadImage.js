require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'mypannel': '../common/teacherSideBar',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'jqueryForm': '../lib/jquery.form'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'jqueryForm': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'jqueryForm'], function(jquery){

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

	var imageConstant = {}
	imageConstant.classId = getUrlQuery('classId') || 0;
	imageConstant.galleryId = getUrlQuery('galleryId') || 0;
	imageConstant.init = function(){
		$.ajax({
			url: window.globalPath + '/image/getGalleryList',
			type: 'POST',
			dataType: 'json',
			data: {classId: imageConstant.classId},
			success: function(res){
				if(res.result){
					$('.j-className').html(res.gradeName + ' ' + res.className).attr('href', window.globalPath + '/albums/galleryList?classId=' + imageConstant.classId);
					var galleryListHtml = '';
					for(var i = 0, ilen = res.result.length; i < ilen; i++){
						var gallerySingle = res.result[i];
						if(gallerySingle.galleryId){
							var isSelected = gallerySingle.galleryId == imageConstant.galleryId ? ' selected = "selected" ' : ''
							galleryListHtml += '<option ' + isSelected + ' value="' + gallerySingle.galleryId + '">' + gallerySingle.galleryName + '</option>';
						}
					}
					$('.j-galleryList').html(galleryListHtml);
				}
			},
			error: function(){
			}
		});

		/* 获取班级相册 */
		$.ajax({
			url: window.globalPath + '/image/getClassGallery',
			type: 'POST',
			dataType: 'json',
			data: {classId: imageConstant.classId},
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

	imageConstant.init();


	var addFilesObj = {
		imgurlAr: [],
		$elements: {
			$uploadBtn: $('.j-addimg'),
			$photoFile: $('#photoFile'),
			$addImgLi: $('.j-addImgLi'),
			$imgList: $('.j-addImgList'),
			$submit: $('.j-submit')
		},
		total: 8,
		ajaxFormFn: function($form, url){
			var result = null, _self = this;
			$form.ajaxSubmit({
				url: url,
				type: 'POST',
				async: false,
				success: function(resData){
					_self.$elements.$photoFile.val('');
					if(resData){
						if(typeof resData === 'string'){
							result = JSON.parse(resData);
						}else{
							result = resData;
						}
						if(result.result == 'bigimageError'){
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning"><h2>上传图片不能超过2M</h2><p>请重新选择或压缩后上传</p></div>',
								titleBar: false,
								width: 360,
								height: 240
							});
						}else{
							_self.addImages(result.result);
						}
					}else{
						alert('上传失败');
					}
				}, error: function(){
					alert('上传失败');
				}
			});
		},
		addImages: function(imgUrl){
			var _self = this;
			var index_imgurl = _self.imgurlAr.length;
			/* 数据添加 */
			_self.imgurlAr.push(imgUrl);
			// 节点添加
			_self.$elements.$addImgLi.before('<li><span class="img"><img src="' + imgUrl + '"/></span> <a data-item="' + index_imgurl + '" href="javascript:void(0)" class="deleAlbums j-del">删除</a></li>');
			if(!_self.checkImagesNumber(_self.total)){
				_self.$elements.$addImgLi.hide()
			}
		},
		checkImagesNumber: function(total){
			var _self = this;
			var imagesAr = [];
			for(var i = 0, ilen = _self.imgurlAr.length; i < ilen; i++){
				var image = _self.imgurlAr[i];
				if(image === 0) continue;
				imagesAr.push(image)
			}
			return imagesAr.length < total;
		},
		bindE: function(){
			var _self = this;
			//* 上传 触发
			_self.$elements.$uploadBtn.on('click', function(){
				_self.$elements.$photoFile.click();
			});

			//上传附件
			_self.$elements.$photoFile.on('change', function(){
				var $this = $(this), val = $this.val();
				// 获取
				if(val !== ''){
					/* 判断格式是否正确 */
					var valAr = val.split('.');
					var extension = valAr[valAr.length - 1];
					if(extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'bmp' || extension == 'JPG' || extension == 'PNG' || extension == 'GIF' || extension == 'BMP' || extension == 'JPEG' || extension == 'jpeg'){
						//上传
						_self.ajaxFormFn($('#photoUpload'), window.globalPath + '/image/upload');
					}else{
						ymPrompt.alert({
							message: '<div class="ym-inContent ym-inContent-warning"><h2>上传图片格式不正确</h2><p>请上传jpg,gif,png,bmp,jpeg格式的图片</p></div>',
							titleBar: false,
							width: 360,
							height: 200
						});
						$this.val('');
					}
				}

			});
			//删除图片
			_self.$elements.$imgList.delegate('a.j-del', 'click', function(){
				var $this = $(this), $li = $this.parent(), item = $this.attr('data-item');
				_self.imgurlAr[item] = '0';
				$li.remove();
				!_self.$elements.$addImgLi.is(':visible') && _self.$elements.$addImgLi.show()
			});
			//上传图片
			_self.$elements.$submit.on('click', function(){
				if($(this).hasClass('disabled')) return;
				var postData = {}
				postData.galleryId = $('.j-galleryList').val();
				postData.classId = imageConstant.classId;
				postData.url = '';
				var ilen = addFilesObj.imgurlAr.length
				if(ilen > 0){
					for(var i = 0; i < ilen - 1; i++){
						if(addFilesObj.imgurlAr[i] !== '0'){
							postData.url += addFilesObj.imgurlAr[i] + ';';
						}
					}
					addFilesObj.imgurlAr[ilen - 1] !== '0' && (postData.url += addFilesObj.imgurlAr[ilen - 1]);
				}
				if(postData.url === ''){
					ymPrompt.confirmInfo({
						message: '<div class="ym-inContent ym-inContent-warning"><h2>您未上传任何照片 </h2><p>是否取消上传，返回相册？</p></div>',
						width: 360,
						height: 200,
						titleBar: false,
						handler: function(res){
							if(res === 'ok'){
								location.href = window.globalPath + '/image/showImageList?galleryId=' + postData.galleryId;
							}
						}
					});
				}else{
					$(this).addClass('disabled').html('上传中... ... ');
					$.ajax({
						url: window.globalPath + '/image/uploadImage',
						type: 'POST',
						dataType: 'json',
						data: postData,
						success: function(res){
							if(res.result == 'success'){
								setTimeout(function(){
									location.href = window.globalPath + '/image/showImageList?galleryId=' + postData.galleryId;
								}, 3000);
								ymPrompt.succeedInfo({
									message: '<div class="ym-inContent ym-inContent-success oneline"><h2>上传成功！</h2></div>',
									titleBar: false,
									width: 300,
									height: 220,
									handler: function(){
										location.href = window.globalPath + '/image/showImageList?galleryId=' + postData.galleryId;
									}
								});
							}else{
								ymPrompt.alert({
									message: '<div class="ym-inContent ym-inContent-warning"><h2>上传失败</h2><p>' + res.result + '</p></div>',
									titleBar: false,
									width: 300,
									height: 220
								});
								$(this).removeClass('disabled');
							}
						}
					});
				}
			});
		}
	};

	addFilesObj.bindE();

});
