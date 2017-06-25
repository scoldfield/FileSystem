/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'mypannel': '../common/teacherSideBar',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'emoji': '../common/emoji'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']},
		'emoji': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'emoji'], function(jquery){

	var noticeId = getUrlQuery('id'),
		personid = getUrlQuery('pId');

	/* 页面来源及其返回 */
	var fromUrl = document.referrer;
	if(fromUrl !== ''){
		var _referrer = '';
		var _navList = document.querySelectorAll('.m-teacherNav li');
		if(fromUrl.indexOf('receiveNotice') >= 0){
			_referrer = '收信箱';
			document.querySelector('.mark-reveive') && (document.querySelector('.mark-reveive').className = 'active');
		}
		if(fromUrl.indexOf('sendNotice') >= 0){
			_referrer = '发信箱';
			document.querySelector('.mark-send') && (document.querySelector('.mark-send').className = 'active');
		}
		if(fromUrl.indexOf('draft') >= 0){
			_referrer = '草稿箱';
			document.querySelector('.mark-draft') && (document.querySelector('.mark-draft').className = 'active');
		}
		document.querySelector('.j-from').innerHTML = _referrer;
		document.querySelector('.j-referrer').href = fromUrl;
		/*    $('.j-referrer').attr()('click', function(){
		 ymPrompt.confirmInfo({
		 message: '<div class="ym-inContent ym-inContent-success oneline" ><h2>返回' + _referrer + '</h2></div>',
		 width: 300,
		 height: 200,
		 titleBar: false,
		 handler: function(res){
		 if(res === 'ok'){
		 location.href = fromUrl;
		 }
		 }
		 });
		 });*/
	}else{
		$('.j-referrer').empty();
	}

	var dataReturn = {};
	/* 获取数据 并渲染*/
	function dataReturnFn(){
		$.ajax({
			url: window.globalPath + '/schoolnotice/readDetail',
			type: 'POST',
			dataType: 'json',
			data: {id: noticeId, personid: personid},
			async: false,
			success: function(resData){
				if(resData){
					var _title = resData.title || '无标题消息',
						_author = resData.sendName || '校讯通',
						_publishtime = resData.publishtime ? resData.publishtime.split('.')[0] : '' + new Date().getFullYear() + new Date().getMonth() + new Date().getDate(),
						_receive = resData.personName || '',
						_temcontent = resData.content || '';

					if(resData.imgurl /*&& resData.realimgurl*/ && resData.imgurl !== '' /*&& resData.realimgurl !== ''*/){
						var imagesGroupArCom = resData.imgurl.split(';'),
							imagesGroupAr = [],
						//imagesNameGroupCom = resData.realimgurl.split(';'),
						// imagesNameGroupAr = [],
							img_list = '',
							img_showlist = '';
						for(var img_i in imagesGroupArCom){
							if(imagesGroupArCom[img_i] !== '' && imagesGroupArCom.hasOwnProperty(img_i)){
								imagesGroupAr.push(imagesGroupArCom[img_i]);
								//imagesNameGroupAr.push(imagesNameGroupCom[img_i]);
							}
						}
						if(imagesGroupAr.length === 0){
							dataReturn.isImgRoll = false;
						}else{
							dataReturn.isImgRoll = true;
							dataReturn.dateLength = imagesGroupAr.length;
							for(var i = 0, ilen = imagesGroupAr.length; i < ilen; i++){
								if(typeof imagesGroupAr[i] === 'string' && imagesGroupAr.hasOwnProperty(i)){
									img_list += '<div class="img"><img  src="' + imagesGroupAr[i] + '"/></div>';
									img_showlist += '<li><img  src="' + imagesGroupAr[i] + '"/></li>';
								}
							}
							$('.j-imagesGroup').append(img_list);
							$('.j-imagesOpenList').append(img_showlist);
						}
					}
					if(resData.file && resData.realfile && resData.file !== '' && resData.realfile !== ''){
						var _fileArCom = resData.file.split(';'),
							_fileAr = [],
							_fileNameArCom = resData.realfile.split(';'),
							_fileNameAr = [],
							file_html = '';
						for(var fi in _fileArCom){
							if(_fileArCom[fi] !== '' && _fileNameArCom[fi] !== '' && _fileArCom.hasOwnProperty(fi)){
								_fileAr.push(_fileArCom[fi]);
								_fileNameAr.push(_fileNameArCom[fi]);
							}
						}
						if(_fileAr.length == 0){
							$('.accessory').hide();
						}else{
							$('.j-fileNum').html('附件（ ' + _fileAr.length + ' 个）');
							for(var j in _fileAr){
								if(_fileAr.hasOwnProperty(j)){
									file_html += ' <li><a href="' + window.globalPath + '/schoolnotice/noticedown?url=' + encodeURI(encodeURI(_fileAr[j])) + '&name=' + encodeURI(encodeURI(_fileNameAr[j])) + '" target="_blank">' + _fileNameAr[j] + '</a></li>';
								}
							}

							$('.j-attList').append(file_html);
						}
					}

					$('.j-title').html(_title);
					$('.j-author').html(_author);
					$('.j-time').html(_publishtime);
					$('.j-receive').html(_receive);
					$('.j-temcontent').html(_temcontent);
					$('.emoji').emoji();
				}
			}
		});
	};
	dataReturnFn();

	if(dataReturn.isImgRoll){
		var imgFloat = new ImgFloatCompane();
		imgFloat.init({
			dataLength: dataReturn.dateLength,
			container: '.j-floatimg',
			imgwrap: '.floatcontent',
			currentIndex: 1,
			leftCtrl: '.aleft',
			rightCtrl: 'aright',
			imgwidth: 720,
			rollSpeed: 500,
			mask: '.u-mask'
		});

		$('.imgwrap').delegate('.img', 'click', function(){
			var t = $(this).index();
			imgFloat.showImg(t);
		});
	}


});