require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'mypannel': '../common/teacherSideBar',
		'ymPrompt': '../plug/ymPrompt/ymPrompt',
		'jqueryForm': '../lib/jquery.form',
		'scrollPagination': '../plug/scrollPagination/jQuery.scrollPagination',
		'emoji': '../common/emoji'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'jqueryForm': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']},
		'scrollPagination': {deps: ['jquery']},
		'emoji': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'scrollPagination', 'jqueryForm', 'emoji'], function(jquery){


	/* **********　班级圈列表　********** */
	var classringConstant = {
		$classList: $('#j-classringList'),
		classIds: [],
		userInf: {
			userType: 0,
			userId: 0,
			avatar: ''
		},
		getClassringListUrl: 'getClassringList',
		paginationOption: {
			pageNumber: 5,//每页数量
			itemsOnPage: 1, //当前页面
			viewType: ''
		},
		fromType: ['班级圈', '班级圈', '班级相册 ', '红花榜 ', '学生评估', '成长相册'],
		renderComment: function(commentData, type){
			var _replyHtml = '',
				delHtml = '',
				senderNameHtml = '',
				dealHtml = '',
				closeHtml = '';

			delHtml = commentData.senderId == classringConstant.userInf.userId && commentData.senderType == classringConstant.userInf.userType ? '<a class="j-delComment" data-id="' + commentData.replyId + '" data-pid="' + commentData.parentId + '" data-mid="' + commentData.messageId + '"href="javascript:void(0)">删除</a>' : '';

			dealHtml = '<a class="j-showReply" href="javascript:void(0)"  data-value="' + commentData.messageId + '##' + commentData.senderId + '##' + commentData.senderName + '##' + commentData.senderType + '##' + commentData.childId + '##' + commentData.replyId + '##' + commentData.parentId + '">回复</a>';

			//时间解析 ：
			var timeSAr = commentData.replyTime.split(' '),
				timeAr = timeSAr[0].split('-').concat(timeSAr[1].split(':'));


			if(commentData.parentId == -1 || commentData.parentId == 0){
				_replyHtml += '<li data-id="' + commentData.replyId + '">';
				_replyHtml += '<div class="comment-clause comment-clause-main f-cb">';
				senderNameHtml = '<a class="name" href="' + window.globalPath + '/classcircle/showOwnClaring?userId=' + commentData.senderId + '&userType=' + commentData.senderType + '&childId=' + commentData.childId + '&classIds=' + classringConstant.userInf.classIds + '"> ' + commentData.senderName + '</a>：';
				closeHtml = '</div><div class="reply f-cb f-dn j-replyCommon" data-id="' + commentData.replyId + '">' +
					'<input type="text" class="u-gipt u-gipt-publish j-replyMsg" placeholder="评论些什么"/> ' +
					'<input type="button" class="u-gbtn u-gbtn-publish j-reply" data-classids="' + commentData.classIds + '" value=" 发 布 "/> ' +
					'</div></li>';
			}else{
				_replyHtml += '<div class="comment-clause  f-cb" data-id="' + commentData.replyId + '">';
				senderNameHtml = '<a class="name j-rname" href="' + window.globalPath + '/classcircle/showOwnClaring?userId=' + commentData.senderId + '&userType=' + commentData.senderType + '&childId=' + commentData.childId + '&classIds=' + classringConstant.userInf.classIds + '"> ' + commentData.senderName + '</a> 回复 ' + '<a class="name" href="' + window.globalPath + '/classcircle/showOwnClaring?userId=' + commentData.receiverId + '&userType=' + commentData.receiverType + '&childId=' + commentData.childId + '&classIds=' + classringConstant.userInf.classIds + '"> ' + commentData.receiverName + '</a> : ';
				closeHtml = '</div>';
			}

			_replyHtml += '<a class="face"  href="' + window.globalPath + '/classcircle/showOwnClaring?userId=' + commentData.senderId + '&userType=' + commentData.senderType + '&childId=' + commentData.childId + '&classIds=' + classringConstant.userInf.classIds + '"><img src="' + commentData.senderAvatar + '" alt="' + commentData.senderName + '"/></a><div class="commentContent"><p class="emoji"> ' + senderNameHtml + commentData.content + '</p><p class="f-cb"><span class="time">' + timeAr[0] + '年' + timeAr[1] + '月' + timeAr[2] + '日 ' + timeAr[3] + ':' + timeAr[4] + '</span><span class="deal">' + dealHtml + delHtml + '</span></p></div>' + closeHtml;

			return {
				html: _replyHtml,
				parentId: commentData.parentId
			}
		},
		renderClassring: function(obj, resData){
			/* 开始渲染 */
			if(resData && resData.result && resData.result.length > 0){
				for(var i = 0, len = resData.result.length; i < len; i++){
					var resDataSingle = resData.result[i],
						_messageId = resDataSingle.messageId,
						_senderId = resDataSingle.senderId,
						_senderName = resDataSingle.senderName,
						_senderType = resDataSingle.senderType,
						_childId = resDataSingle.childId,
						_classIdsAr = resDataSingle.classId.split(',');

					// 单条动态 班级交集
					var _replyClassIds = [], _replyClassIdsStr = '';
					for(var g_cids_i in classringConstant.classIds){
						if(!classringConstant.classIds.hasOwnProperty(g_cids_i)) continue;
						for(var it_cids_i in _classIdsAr){
							if(!_classIdsAr.hasOwnProperty(it_cids_i)) continue;
							if(_classIdsAr[it_cids_i] == classringConstant.classIds[g_cids_i]){
								_replyClassIds.push(_classIdsAr[it_cids_i]);
							}
						}
					}
					_replyClassIdsStr = _replyClassIds.join();

					//建立基础容器
					var $classringSection = $('<div class="g-classringSection u-crpart u-crpart-notop" data-id="' + _messageId + '"></div>'),
						$classring = $('<div class="m-classring cntRight"></div>'),
						$comment = $('<div class="m-comment"></div>');

					// *** 班级圈内容
					// 头像
					var _faceHtml = '<a class="face"  href="' + window.globalPath + '/classcircle/showOwnClaring?userId=' + _senderId + '&userType=' + _senderType + '&childId=' + _childId + '&classIds=' + classringConstant.userInf.classIds + '"> <img src="' + resDataSingle.senderAvatar + '" alt="' + resDataSingle.senderName + '"/> </a>';
					//图片列表
					var _imgList = '';
					if(resDataSingle.imageList.length > 0){
						_imgList = '<ul class="j-imglist f-cb">';
						for(var img_i = 0, img_len = resDataSingle.imageList.length; img_i < img_len; img_i++){
							_imgList += '<li data-id="' + img_i + '"><img src="' + resDataSingle.imageList[img_i] + '"/></li>'
						}
						_imgList += '</ul>';
					}
					//视频
					var _videoHtml = ''
					if(resDataSingle.videoUrl !== ''){
						if(checkVideo()){
							_videoHtml = '<video width="320" height="240" src="' + resDataSingle.videoUrl + '" controls></video>'
						}else{
							_videoHtml = '<object title="dvubb" align="middle" classid="CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95" class="object" id="MediaPlayer" width="320" height="240"><param name="AUTOSTART" value="false"/><param name="ShowStatusBar" value="-1"/><param name="Filename" value="' + resDataSingle.videoUrl + '"/><embed title="dvubb" type="application/x-oleobject" codebase=" http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701 " flename="mp" src="' + resDataSingle.videoUrl + '" width="320" height="240" autoplay="false"></embed></object>'
						}
					}
					//点赞列表
					var praiseNum = resDataSingle.praiseList.length,
						isPraise = 0,
						_praiseHtml = '<div class="praise cntRight j-praiseList"><p class="heart"></p>',
						_praiseBtnHtml = '';
					if(praiseNum > 0){
						for(var praise_i = 0; praise_i < praiseNum; praise_i++){
							var praiseSingle = resDataSingle.praiseList[praise_i];
							_praiseHtml += '<a data-id="' + praiseSingle.id + '" href="' + window.globalPath + '/classcircle/showOwnClaring?userId=' + praiseSingle.praiserId + '&userType=' + praiseSingle.userType + '&childId=' + praiseSingle.childId + '&classIds=' + classringConstant.userInf.classIds + '">' + praiseSingle.praiser + '； </a>';
							if(praiseSingle.praiserId == classringConstant.userInf.userId){
								isPraise = praiseSingle.id;
							}
						}
					}else{
						_praiseHtml += '<span class="no">没有人点赞</span>'
					}
					_praiseHtml += '</div>';

					//点赞按钮
					_praiseBtnHtml = isPraise === 0 ?
					'<a class="praise j-praise" data-classids="' + _replyClassIdsStr + '" data-id="' + _messageId + '" data-value="0" data-num="' + praiseNum + '" href="javascript:void(0)">赞(' + praiseNum + ')</a>' :
					'<a class="praise j-praise" data-classids="' + _replyClassIdsStr + '" data-id="' + _messageId + '" data-value="' + isPraise + '"  data-num="' + praiseNum + '"  href="javascript:void(0)">取消赞(' + praiseNum + ')</a>';

					//删除按钮
					var delMsgHtml = resDataSingle.senderId === classringConstant.userInf.userId && resDataSingle.senderType === classringConstant.userInf.userType ? '| <a class="del j-del" data-id="' + _messageId + '" href="javascript:void(0)">删除</a></p>' : '';

					var timeSAr = resDataSingle.sendTime.split(' '),
						timeAr = timeSAr[0].split('-').concat(timeSAr[1].split(':'));

					var _classringHtml = _faceHtml +
						'<div class="content">' +
						'<h4><a  href="' + window.globalPath + '/classcircle/showOwnClaring?userId=' + _senderId + '&userType=' + _senderType + '&childId=' + _childId + '&classIds=' + classringConstant.userInf.classIds + '">' + resDataSingle.senderName + '</a></h4>' +
						'<p class="emoji">' + resDataSingle.content + '</p>' + _imgList + _videoHtml + '<div class="contentDeal f-cb">' +
						'<p class="f-fl">' + timeAr[0] + '年' + timeAr[1] + '月' + timeAr[2] + '日 ' + timeAr[3] + ':' + timeAr[4] + '  来自：' + classringConstant.fromType[resDataSingle.fromType] + '</p>' +
						'<p class="f-fr">' +
						_praiseBtnHtml + '|<a class="com j-com" href="javascript:void(0)">评论(<span data-id="' + _messageId + '" class="j-comNum">' + resDataSingle.replyList.length + '</span>)</a>' + delMsgHtml;
					'</div>';
					$classring.append(_classringHtml);
					//***  评论内容

					// 发布
					var _sendPublishHtml = '<div class="publish cntRight j-publish">' +
						'<a class="pub-face" href="' + window.globalPath + '/classcircle/showOwnClaring?userId=' + _senderId + '&userType=' + _senderType + '&childId=' + _childId + '&classIds=' + classringConstant.userInf.classIds + '"><img src="' + classringConstant.userInf.avatar + '"/></a>' +
						'<input type="text" class="u-gipt u-gipt-publish j-mainReply" placeholder="评论些什么"/>' +
						'<input type="button" class="u-gbtn u-gbtn-publish j-reply" data-classids="' + _replyClassIdsStr + '" data-value="' + _messageId + '##' + '-1' + '##' + '-1' + '##' + '1' + '##' + '-1' + '##' + '-1' + '##' + '-1' + '" value="发 布 "/></div>';

					// 评论列表
					var $replyHtml = $('<ul class="m-commentContent cntRight" data-id="' + _messageId + '"></ul>');
					if(resDataSingle.replyList && resDataSingle.replyList.length > 0){
						var reply_len = resDataSingle.replyList.length;
						for(var reply_i = 0; reply_i < reply_len; reply_i++){
							var replySingle = resDataSingle.replyList[reply_i];
							/* 渲染单条数据 */
							replySingle.classIds = _replyClassIdsStr;
							var comentObj_m = classringConstant.renderComment(replySingle);
							$replyHtml.append(comentObj_m.html);
							if(replySingle.childList && replySingle.childList.length > 0){
								for(var reply_j = 0, replyChildLen = replySingle.childList.length; reply_j < replyChildLen; reply_j++){
									var comentObj = classringConstant.renderComment(replySingle.childList[reply_j]);
									$(comentObj.html).insertBefore($replyHtml.find('.reply[data-id=' + replySingle.childList[reply_j].parentId + ']'));
								}
							}
						}
					}else{
						$replyHtml.append('<li class="no">没有评论</li> ');
					}

					$classringSection.append($classring);
					$comment.append(_praiseHtml + _sendPublishHtml);
					$comment.append($replyHtml);
					$classringSection.append($comment);
					classringConstant.$classList.append($classringSection);
					classringConstant.$classList.find('.emoji').emoji();
				}
				classringConstant.paginationOption.itemsOnPage++;
				setTimeout(function(){
					$(obj).attr('scrollPagination', 'enabled');
				}, 20);
			}else{
				classringConstant.$classList.stopScrollPagination();
				var loadMsg = $('.g-classringSection').length > 0 ? '班级圈全部加载完毕！' : '还没有班级圈消息';
				$('.loading').html(loadMsg);
			}
		},
		reset: function(parameter){
			if(parameter){
				for(var i in parameter){
					classringConstant.paginationOption[i] = parameter[i];
				}
			}

			classringConstant.$classList.empty();
			$('.loading').html('加载中，请稍候... ... ');
			setTimeout(function(){
				$.ajax({
					url: window.globalPath + '/classcircle/' + classringConstant.getClassringListUrl,
					type: 'POST',
					dataType: 'json',
					data: classringConstant.paginationOption,
					async: false,
					success: function(resData){
						if(resData.result == 'notexist'){
							$('.loading').html('该用户不存在 或 已被删除');
							return;
						}
						classringConstant.renderClassring(classringConstant.$classList, resData);
						classringConstant.bindE();
					}
				});
			}, 100); //延迟 毫秒只为了看加载效果，，好奇葩的需求，瞬间加载不好吗？
		},
		bindE: function(){
			var _self = this;
			if(_self.isBindE){
				return;
			}
			//点赞
			_self.$classList.delegate('.j-praise', 'click', function(){
				var $this = $(this), messageid = $this.attr('data-id'), id = $this.attr('data-value'), num = $this.attr('data-num'), $thisPraiseList = $this.parents('.g-classringSection').find('.j-praiseList'), _classIds = $this.attr('data-classids');
				if(id === '0'){
					$.ajax({
						url: window.globalPath + '/classcircle/pointPraise',
						type: 'POST',
						dataType: 'json',
						data: {messageId: messageid, classId: _classIds},
						success: function(res){
							if(res.result == 'success'){
								$this.attr({
									'data-value': res.praise.id,
									'data-num': (parseInt(num) + 1)
								}).html('取消赞(' + (parseInt(num) + 1) + ')');

								$thisPraiseList.append('<a data-id="' + res.praise.id + '" href="' + window.globalPath + '/classcircle/showOwnClaring?userId=' + res.praise.praiserId + '&userType=' + res.praise.userType + '&childId=' + res.praise.childId + '&classIds=' + classringConstant.userInf.classIds + '">' + res.praise.praiser + '；</a>');
								if($thisPraiseList.find('span.no').length > 0){
									$thisPraiseList.find('span.no').remove();
								}
							}else{
								ymPrompt.alert({
									message: res.result,
									width: 300,
									height: 180,
									titleBar: false
								})
							}
						}
					});
				}else{
					$.ajax({
						url: window.globalPath + '/classcircle/' + id + '/canselPraise',
						type: 'POST',
						dataType: 'json',
						success: function(res){
							if(res.result == 'success'){
								$this.attr({
									'data-value': 0,
									'data-num': (parseInt(num) - 1)
								}).html('赞(' + (parseInt(num) - 1) + ')');
								$thisPraiseList.find('a[data-id=' + id + ']').remove();
								//判断是否是“没有人点赞”;
								if($thisPraiseList.find('a').length == 0){
									$thisPraiseList.append('<span class="no">没有人点赞</span>');
								}
							}
						}
					});
				}
			})
				//显示回复框
				.delegate('.j-showReply', 'click', function(){
					var $this = $(this),
						$thisLi = $this.closest('li'),
						_dataValue = $this.attr('data-value'),
						_dataAr = _dataValue.split('##'),
						_placeHolder = '回复：' + _dataAr[2];

					//回复主评论的时候
					if(_dataAr[6] === '-1' || _dataAr[6] === '0'){
						_dataAr[6] = _dataAr[5];
					}

					$thisLi.siblings().find('.j-replyCommon').hide();//所有输入框隐藏
					$thisLi.find('.j-replyCommon').toggle();
					$thisLi.find('.j-replyMsg').focus().attr('placeholder', _placeHolder);
					$thisLi.find('.j-reply').attr('data-value', _dataAr.join('##'));
				})

				//发送评论/回复
				.delegate('input.j-reply', 'click', function(){
					var $this = $(this), _data = $this.attr('data-value'), _classIds = $this.attr('data-classids');
					var parameter = {}, dataAr = _data.split('##');
					parameter.messageId = dataAr[0];
					var _val = $this.prev().val()
					parameter.msg = _val.length > 300 ? _val.substring(0, 300)+'... ...' : _val;
					parameter.receiverId = dataAr[1];
					parameter.receiverName = dataAr[2] === '0' ? '' : dataAr[2];
					parameter.receiverType = dataAr[3];
					parameter.receiverChildid = dataAr[4];
					parameter.replyId = dataAr[6];
					parameter.classId = _classIds;

					if(parameter.msg !== ''){
						$.ajax({
							url: window.globalPath + '/classcircle/releaseComment',
							type: 'POST',
							dataType: 'json',
							data: parameter,
							success: function(res){
								if(res.result === 'success'){
									if($this.parents('.m-comment').find('li.no').length > 0){
										$this.parents('.m-comment').find('li.no').remove();
									}
									var commentSingle = res.comment;
									var commentObj = classringConstant.renderComment({
										messageId: commentSingle.messageId,
										parentId: commentSingle.parentId,
										senderId: classringConstant.userInf.userId,
										senderName: commentSingle.author,
										senderAvatar: classringConstant.userInf.avatar,
										senderType: commentSingle.userType,
										childId: commentSingle.childId,
										replyId: commentSingle.id,
										receiverName: commentSingle.receiverName,
										content: parameter.msg,
										replyTime: commentSingle.createTime,
										classIds: parameter.classId
									});

									var $replyAera = $this.parent('.j-replyCommon');

									if(commentObj.parentId <= 0){
										classringConstant.$classList.find('ul[data-id=' + commentSingle.messageId + ']').append(commentObj.html);
										var comNum = +classringConstant.$classList.find('.j-comNum[data-id=' + commentSingle.messageId + ']').html() + 1;
										classringConstant.$classList.find('.j-comNum[data-id=' + commentSingle.messageId + ']').html(comNum);
									}else{
										$(commentObj.html).insertBefore($replyAera);
									}
									$replyAera.hide();
								}
								$this.prev().val('');
							}
						});
					}
				})
				// 评论关注
				.delegate('.j-com', 'click', function(){
					$(this).parents('.g-classringSection').find('.j-mainReply').focus();
				}).delegate('.j-imglist li', 'click', function(){
					var $this = $(this), $p = $this.parent(), _t = $this.index();
					$('.j-floatcontent').empty().append($p.find('li').clone());
					imgFloat.options.dataLength = $p.find('li').length;
					imgFloat.init(imgFloat.options);
					imgFloat.showImg(_t);
				})
				/* 删除 */
				.delegate('.j-del', 'click', function(){
					var $this = $(this), _id = $(this).attr('data-id');
					ymPrompt.confirmInfo({
						message: '<div class="ym-inContent ym-inContent-warning"><h2> 删除该状态？ </h2><p class="f-cr">状态删除后将无法恢复</p></div>',
						width: 320,
						height: 220,
						titleBar: false,
						handler: function(res){
							if(res == 'ok'){
								$.ajax({
									url: window.globalPath + '/classcircle/' + _id + '/deleteMessage',
									type: 'POST',
									dataType: 'json',
									success: function(res){
										if(res.result == 'success'){
											ymPrompt.win({
												message: '<div class="ym-inContent ym-inContent-success oneline"><h2> 删除成功！</h2></div>',
												width: 240,
												height: 140,
												titleBar: false
											});
											$('.g-classringSection[data-id=' + _id + ']').remove();
											//个人主页下，状态更新
											$('.j-userinfMsgNum').length > 0 && $('.j-userinfMsgNum').html(+$('.j-userinfMsgNum').html() - 1);

										}else{
											ymPrompt.win({
												message: '<div class="ym-inContent ym-inContent-warning oneline"><h2> 删除失败！<br />' + res.result + '</h2></div>',
												width: 240,
												height: 140,
												titleBar: false
											});
										}
										setTimeout(function(){
											ymPrompt.close();
										}, 2000);
									}
								});
							}
						}
					});
				})
				//删除评论
				.delegate('.j-delComment', 'click', function(){
					var $this = $(this), _id = $this.attr('data-id'), _msid = $this.attr('data-mid'), _pid = $this.attr('data-pid'), _$pul = $this.parents('.m-commentContent');
					ymPrompt.confirmInfo({
						message: '<div class="ym-inContent ym-inContent-warning"><h2> 删除该评论？ </h2><p class="f-cr">评论删除后将无法恢复</p></div>',
						width: 320,
						height: 220,
						titleBar: false,
						handler: function(res){
							if(res == 'ok'){
								$.ajax({
									url: window.globalPath + '/classcircle/' + _id + '/deleteComment',
									type: 'POST',
									dataType: 'json',
									success: function(res){
										if(res.result == 'success'){
											ymPrompt.win({
												message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>删除成功！</h2></div>',
												width: 240,
												height: 140,
												titleBar: false
											});

											if(_pid === '-1' || _pid === '0'){
												$this.parents('li').remove();
												if(_$pul.find('li').length == 0){
													_$pul.append('<li class="no">没有评论</li>');
												}
												var $comnum = $('.j-comNum[data-id=' + _msid + ']');
												$comnum.html(+$comnum.html() - 1);
											}else{
												$this.parents('.comment-clause').remove();
											}
										}else{
											ymPrompt.win({
												message: '<div class="ym-inContent ym-inContent-success oneline"><h2> 删除失败！<br />' + res.result + '</h2></div>',
												width: 240,
												height: 140,
												titleBar: false
											});
										}
										setTimeout(function(){
											ymPrompt.close()
										}, 2000);
									}
								});
							}
						}
					});
				});

			$('.j-category').delegate('a', 'click', function(){
				var $this = $(this), $p = $this.parent(),
					options = {itemsOnPage: 1}
				if(!$p.hasClass('j-refresh')){
					$p.siblings().children().removeClass('current');
					$this.addClass('current');
					var _vdata = $p.attr('data-value')
					var _data = _vdata === '' ? _vdata : +_vdata;
					options.viewType = _data;
				}
				classringConstant.reset(options);
			});

			//滚动事件
			_self.$classList.scrollPagination({
				'contentPage': window.globalPath + '/classcircle/' + classringConstant.getClassringListUrl,
				'contentData': classringConstant.paginationOption,
				'beforeLoad': function(obj){
					$(obj).attr('scrollPagination', 'disabled');
				},
				'afterLoad': classringConstant.renderClassring,
				'scrollTarget': $(window),
				'heightOffset': 0,
				dataType: 'json'
			});
			_self.isBindE = true
		}

	}

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
	}

	/* 是否是个人班级圈 */
	if(window.isOwnClassring === true){
		var ownClassringOption = {};
		ownClassringOption.userId = getUrlQuery('userId');
		ownClassringOption.userType = getUrlQuery('userType');
		ownClassringOption.childId = getUrlQuery('childId');
		ownClassringOption.claIds = getUrlQuery('classIds');
		for(var isOwnClassring_i in ownClassringOption){
			if(ownClassringOption[isOwnClassring_i] === false){
				location.href = window.globalPath + '/classcircle/showClaring';
			}
		}
	}else{
		/* 图片上传微控件 */
		var photoUpload = {
			ajaxFormFn: function($form, url){
				$form.ajaxSubmit({
					url: url,
					type: 'POST',
					async: false,
					success: function(resData){
						classringPublish.$elements.$photoFile.val('');
						if(typeof resData === 'string'){
							var resDataObj = JSON.parse(resData);
							if(resDataObj.result == 'bigImageError'){
								ymPrompt.alert({
									message: '<div class="ym-inContent ym-inContent-warning"><h2>上传图片过大</h2><p>您上传的图片不能超过2M </p></div>',
									titleBar: false,
									width: 360,
									height: 240
								});
							}else{
								photoUpload.addImages(resDataObj.result);
							}
						}else{
							photoUpload.addImages(resData.result);
						}

					}, error: function(){
						classringPublish.$elements.$photoFile.val('');
					}
				});
			},
			addImages: function(imgUrl){
				classringPublish.submitTransferData.imgurl.push(imgUrl);
				/* 渲染缩略图 */
				$('<div class="img"><img src="' + imgUrl + '"/><a href="javascript:void(0)" class="del"></a> </div>').insertBefore($('a.j-add'));

				classringPublish.$elements.$publishPicNum.html(classringPublish.submitTransferData.imgurl.length);
				classringPublish.$elements.$submitPublish.removeClass('u-gbtn-nocontent');
			},
		}
		/* **********发布好友圈 ********** */

		var classringPublish = {
			publishMax: 300,
			submitTransferData: {
				imgurl: []
			},
			$elements: {
				$photoFile: $('#photoFile'),
				$publishPicNum: $('.j-publishPicNum'),
				$submitPublish: $('.j-publishClassring'),
				$publishText: $('.j-publishText')
			}
		}
		/* 班级列表  定义*/
		classringPublish.classList = new SelectUi($('.j-selectClassList'));
		/* 输入计数 定义 */
		classringPublish.counterText = new CountInput(classringPublish.$elements.$publishText);

		classringPublish.reset = function(){
			classringPublish.$elements.$publishText.val('');
			classringPublish.submitTransferData.imgurl = [];
			$('.j-picgroup').hide();
			$('.j-picgroup .img').remove();
			classringPublish.$elements.$publishPicNum.html(0);
		}

		classringPublish.bindE = function(){
			/*  toggle 上传图片的区域 */
			$('.j-slidePic').on('click', function(){
				$('.j-picgroup').toggle();
			});

			/* 单张图片操作 */
			$('.j-picgroup').delegate('a.j-add', 'click', function(){
				/* 检验是否传满8张 */
				var imgAr = []
				for(var img_i in classringPublish.submitTransferData.imgurl){
					if(classringPublish.submitTransferData.imgurl[img_i] !== 0){
						imgAr.push(classringPublish.submitTransferData.imgurl[img_i]);
					}
				}
				if(imgAr.length >= 8){
					ymPrompt.succeedInfo({
						message: ' <div class="ym-inContent ym-inContent-success"><h2> 最多上传8张图片<br/>您已上传了8张照片 </h2></div>  ',
						width: 360,
						height: 240,
						titleBar: false
					});
				}else{
					classringPublish.$elements.$photoFile.click();
				}
			}).delegate('a.del', 'click', function(){
				var $this = $(this), _this = $this[0], _src = _this.src, _name = _this.alt;
				classringPublish.submitTransferData.imgurl.splice(classringPublish.submitTransferData.imgurl.indexOf(_src), 1);
				$this.parent('.img').remove();
				classringPublish.$elements.$publishPicNum.html(classringPublish.submitTransferData.imgurl.length);
				if(classringPublish.submitTransferData.imgurl.length == 0 && classringPublish.$elements.$publishText.val().length == 0){
					classringPublish.$elements.$submitPublish.addClass('u-gbtn-nocontent');
				}
			});

			/* 选择图片 */
			classringPublish.$elements.$photoFile.on('change', function(){
				var val = $(this).val();
				if(val !== ''){
					var valAr = val.split('.');
					var extension = valAr[valAr.length - 1];
					if(extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'bmp' || extension == 'JPG' || extension == 'PNG' || extension == 'GIF' || extension == 'BMP' || extension == 'JPEG' || extension == 'jpeg'){
						photoUpload.ajaxFormFn($('#photoUpload'), window.globalPath + '/classcircle/upload');
					}else{
						ymPrompt.alert({
							message: '<div class="ym-inContent ym-inContent-warning oneline"><h2> 上传图片格式不正确</h2><p class="fs2" >请上传jpg,gif,png,bmp,jpeg格式的图片</p></div>',
							titleBar: false,
							width: 420,
							height: 240
						});
						$(this).val('');
					}
				}
			});

			/* 上传图片 */
			classringPublish.$elements.$submitPublish.on('click', function(){
				if($(this).hasClass('u-gbtn-nocontent')) return;
				var postData = {
					classId: '',
					msg: '',
					url: ''
				}, erroMsgAr = [];
				postData.classId = $('.j-classListval').val();
				postData.msg = classringPublish.$elements.$publishText.val();
				postData.url = classringPublish.submitTransferData.imgurl.join(';');
				postData.messageType = +!!postData.url;

				$.ajax({
					url: window.globalPath + '/classcircle/releaseMessage',
					type: 'POST',
					dataType: 'json',
					data: postData,
					success: function(res){
						if(res.result = 'success'){
							ymPrompt.win({
								message: '<div class="ym-inContent ym-inContent-success oneline"><h2> 发布成功！</h2></div>',
								width: 260,
								height: 140,
								titleBar: false
							});
							setTimeout(function(){
								location.reload();
							}, 2000);
						}else{
							ymPrompt.alert({
								message: '<div class="ym-inContent ym-inContent-warning"><h2>发送失败！<br />' + res.result + '</h2></div>',
								width: 260,
								height: 180,
								titleBar: false
							});
						}
					}
				})
			});


			// 班级列表事件绑定
			classringPublish.classList.bindE(function(val){
				//classringConstant.paginationOption.classId = val;
				//classringConstant.reset();
			});


			/*  输入计数事件绑定 */
			classringPublish.counterText.init({
				callback: function(len){
					if(len <= classringPublish.publishMax){
						$('.j-publishTextCorder').html(len + ' / 300');
					}else{
						classringPublish.$elements.$publishText.val(classringPublish.$elements.$publishText.val().substr(0, 300));
					}
					/* 是否释放发布按钮 */
					if(len == 0 && classringPublish.submitTransferData.imgurl.length == 0){
						classringPublish.$elements.$submitPublish.addClass('u-gbtn-nocontent');
					}else{
						classringPublish.$elements.$submitPublish.removeClass('u-gbtn-nocontent');
					}
				}
			});

		}
		classringPublish.bindE();
	}


	if(window.isOwnClassring){
		for(var isOwnClassring_j in ownClassringOption){
			if(ownClassringOption.hasOwnProperty(isOwnClassring_j)){
				classringConstant.paginationOption[isOwnClassring_j] = ownClassringOption[isOwnClassring_j]
			}
		}
		classringConstant.getClassringListUrl = 'getOwnClassringList';
		$.ajax({
			url: window.globalPath + '/classcircle/getUserInfo',
			type: 'POST',
			dataType: 'json',
			async: false,
			data: {
				userId: ownClassringOption.userId,
				type: ownClassringOption.userType,
				childId: ownClassringOption.childId,
				claIds: ownClassringOption.claIds
			},
			success: function(res){
				if(res){
					var userTypeText = '', introText = '';
					switch(res.personType){
					case 0:
						var birthday = res.birthday || 'TA没有填写哦~';
						userTypeText = '学生';
						introText = ('性别：' + res.sex + '<br/>生日：' + birthday + '<br/>班级：' + res.className);
						break;
					case 2:
						userTypeText = '学校';
						introText = ('在校学生数：' + res.introduction);
						break;
					default :
						userTypeText = '老师';
						introText = ('教学时长：' + res.seniority + '<br/>教学风格：' + res.characteristics);
						break

					}
					$('.j-userInfType').html(userTypeText);
					$('.j-userInfintroduction').html(introText);
					$('.j-userInfName').html(res.name);
					$('.j-userinfSchoolName').html(res.schoolName);
					$('.j-userinfMsgNum').html(res.messageCount);
					$('.j-userinfPhotoNum').html(res.imageCount);


					$('.j-userInfAvatar')[0].src = res.imageUrl;
				}
				classringConstant.userInf.userId = res.userId;
				classringConstant.userInf.userType = res.userType;
				classringConstant.userInf.avatar = res.imageUrl;
				classringConstant.userInf.classIds = ownClassringOption.claIds;
				classringConstant.classIds = classringConstant.userInf.classIds.split(';')
				/* 获得相册列表 */
				var galleryHtml = ''
				for(var k = 0, klen = res.galleryList.length; k < klen; k++){
					var totalNum = 0, gallerySingle = res.galleryList[k];
					for(var s = 0, slen = gallerySingle.galleryList.length; s < slen; s++){
						totalNum += gallerySingle.galleryList[s].photoNumber
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
			}
		});
	}else{
		$.ajax({
			url: window.globalPath + '/classcircle/getTeacherClass',
			type: 'POST',
			dataType: 'json',
			data: {resourceId: window.resourceId},
			async: false,
			success: function(res){
				classringConstant.userInf.userType = res.userType;
				classringConstant.userInf.userId = res.userId;
				classringConstant.userInf.avatar = res.imageUrl;
				//渲染 发布时的班级列表，并默认班级圈的viewType 为所有班级
				var classListLen = res.result.length;
				if(res && res.result && classListLen > 0){
					var lihtml = '', galleryHtml = '';
					for(var i = 0; i < classListLen; i++){
						if(!res.result.hasOwnProperty(i)){// 该判断条件主要是排除IE下面额外加的数组的bug
							continue;
						}
						var classSingle = res.result[i];
						/* 获得年级列表 */
						lihtml += '<li data-value="' + classSingle.classId + '">' + classSingle.gradeName + ' ' + classSingle.className + '</li>';
						classringConstant.classIds.push(classSingle.classId);
						/* 获得班级相册 */
						// { 获得每个相册的照片数量
						var totalNum = 0;
						for(var j = 0, jlen = classSingle.galleryList.length; j < jlen; j++){
							totalNum += classSingle.galleryList[j].photoNumber
						}
						// 获得每个相册的照片数量  }
						// 收集相册列表
						galleryHtml += ('<li>' +
						'<a class="img"  href="' + window.globalPath + '/albums/galleryList?classId=' + classSingle.classId + '"><img src="' + classSingle.galleryList[0].cover + '" alt=""></a>' +
						'<div class="inf">' +
						'<h3><a href="' + window.globalPath + '/albums/galleryList?classId=' + classSingle.classId + '">' + classSingle.gradeName + classSingle.className + '</a></h3>' +
						'<p>共' + totalNum + '张照片</p>' +
						'</div>' +
						'</li>');
					}
					//渲染班级列表
					$('.j-classList').append('<li data-value="' + classringConstant.classIds.join(';') + '">我的全部班级</li>' + lihtml);
					//渲染相册列表
					scrollSideCompone.$elements.$imgsideContainer.html(galleryHtml);
					// 默认"发布"班级圈的viewType 为所有班级
					classringPublish.classList.init(classringConstant.classIds.join(';'), '我的全部班级');
					//默认班级圈的viewType 为所有班级
					classringConstant.paginationOption.classId = classringConstant.classIds.join(';');
					classringConstant.userInf.classIds = classringConstant.classIds.join(';');
				}else{
					$('.j-classList').append('<li data-value="">没有班级</li>');
				}
			}
		});
		//火狐下表单记录问题
		classringPublish.$elements.$publishText.val('');
	}
	//侧栏滚动加载
	scrollSideCompone.init();
	/* 第一次加载 */
	classringConstant.reset();
});
