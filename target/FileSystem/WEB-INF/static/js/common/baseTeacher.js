/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
/* 侧边 */


$(function(){
	var sideController = {
		$elements: {
			$pannelWrap: $('.g-pannelwrap'),
			$controller: $('.j-controller')
		},
		isDataGet: false,
		getData: function(){
			$.ajax({
				url: window.globalPath + '/my',
				type: 'GET',
				dataType: 'json',
				asycn: false,
				success: function(resData){
					if(resData){
						var _applicationNum = resData.askforleaveNum || '0', //申请请假
							_askforleaveNum = resData.applicationNum || '0', //0申请加入班级
							_receiveNoticeNum = resData.receiveNoticeNum || '0', //0新通知
							_attendanceNum = resData.attendanceNum || '0', //0迟到早退
							_leaveNum = resData.leaveNum || '0',//请假
							_classMap = resData.map || '0'; //请假
						$('.j-applicationNum').html(_applicationNum);
						$('.j-askforleaveNum').html(_askforleaveNum);
						$('.j-receiveNoticeNum').html(_receiveNoticeNum);
						$('.j-attendanceNum').html(_attendanceNum);
						$('.j-leaveNum').html(_leaveNum);
						var _html = '';
						for(var i in _classMap){
							if(_classMap.hasOwnProperty(i)){
								var classSetAr = _classMap[i].split('##'), isSet = '', isSetUrl = '';
								if(classSetAr[0] === 'true'){
									isSet = '已设置';
									isSetUrl = window.globalPath + '/homeworks/list?classId=' + classSetAr[1];
								}else{
									isSet = '未设置';
									isSetUrl = window.globalPath + '/homeworks/insert';
								}
								_html += '<li>' + i + '<a class="hw-set" href="' + isSetUrl + '">' + isSet + '</a></li>';
							}
						}
						if(_html === ''){
							$('.j-hwList').html('<li>今天无作业</li>');
						}else{
							$('.j-hwList').html(_html);
						}
						sideController.isDataGet = true;
					}
				}
			});
		}
	};

	sideController.$elements.$controller.bind('click', function(){
		var $this = $(this);
		if(sideController.$elements.$pannelWrap.hasClass('active')){
			sideController.$elements.$pannelWrap.removeClass('active');
			$this.text('展开');
		}else{
			sideController.$elements.$pannelWrap.addClass('active');
			$this.text('收起');
			if(!sideController.isDataGet){
				sideController.getData()
			}
		}
	});

	/* 导航 */
	// 当前项对应索引
	function isNavActiveSp(navSingle){
		var result = ''
		for(var i = 1, ilen = arguments.length; i < ilen; i++){
			if(navSingle.url.indexOf(arguments[i]) >= 0 && location.pathname.indexOf(arguments[i]) >= 0){
				window.resourceId = navSingle.id;
				result = 'active';
				break;
			}
		}
		return result;
	}

	var globalMenuSubNavGroup = {
		readSchoolNotice: ['/schoolnotice/receiveNotice', '/schoolnotice/sendNotice', '/schoolnotice/draft', '/schoolnotice/addNotice'],
		manageStudent: ['/student/applylist'],
		attendanceManage: ['/askforleaves/list'],
		classNotice: ['/classnotice/receiveNotice', '/classnotice/sendNotice', '/classnotice/draft', '/classnotice/addNotice'],
		homework: ['homeworks/insert', 'homeworks/detail'],
		exam: ['/exam/examDetail', '/exam/examadd'],
		schedule: [],
		redlist: ['/redlist/list', '/redlist/sendlist'],
		studentAssessment: [],
		schoolAttendance: ['/attendancetime/addAttendancetime', '/attendancetime/update']
	}

	$.ajax({
		url: window.globalPath + '/menu',
		type: 'GET',
		dataType: 'json',
		async: false,
		success: function(resData){
			var $headNav = $('<div class="g-headwrap j-headNavWrap"> </div>');
			if(resData && resData.children){
				for(var i = 0, ilen = resData.children.length; i < ilen; i++){
					var isActive = '', subActive = ''
					if(!resData.children.hasOwnProperty(i)) continue;
					var navSingle = resData.children[i];
					var $nav = $('<div class="navSingle j-navcate-' + navSingle.icon + '"></div>'),
						$navWrap = $('<div class="nav"></div>'),
						$navSingle = '<a href="' + window.globalPath + navSingle.url + '" class="nav_a"><b class="icon icon-' + navSingle.icon + '"></b>' + navSingle.name + '</a>';

					/* 几个特例 */
					isActive = isNavActiveSp(navSingle, 'classcircle', 'download', 'schoolType');

					$nav.append($navSingle);
					if(navSingle.children && navSingle.children.length > 0){
						var $subnav = $('<ul class="subnav"></ul>'), li_html = '';
						for(var j in navSingle.children){
							subActive = '';
							var subnavSingle = navSingle.children[j];
							if(location.pathname.indexOf(subnavSingle.url) >= 0){
								isActive = 'active'
								subActive = 'active';
								window.resourceId = subnavSingle.id
							}else{
								var subChild = globalMenuSubNavGroup[subnavSingle.icon] || []
								for(var k = 0, jlen = subChild.length; k < jlen; k++){
									if(location.pathname.indexOf(subChild[k]) >= 0){
										isActive = 'active'
										subActive = 'active';
										window.resourceId = subnavSingle.id;
										break;
									}
								}
							}
							if(subnavSingle.url && subnavSingle.name){
								li_html += '<li><a class="' + subActive + '" href="' + window.globalPath + subnavSingle.url + '">' + subnavSingle.name + '</a></li>';
							}
						}
						$subnav.append(li_html);
						$nav.append($subnav);

					}
					$navWrap.append($nav);
					$headNav.append($navWrap);
					$nav.addClass(isActive);
				}
				$('.g-head').append($headNav);
			}
		}
	});


	/* 用户信息 */
	$.ajax({
		url: window.globalPath + '/indexUser',
		type: 'POST',
		dataType: 'json',
		success: function(res){
			var $roleSwitch = $('.j-userLoginSwitch');
			var _name = res.username || '',
				_roleType = res.pos || '',
				_points = res.points || 0;

			var _dataval = $('.j-userInforoletype').attr('data-value');
			_dataval = (_dataval == '任课老师' || _dataval == '班主任') ? '老师' : _dataval;

			$('.j-userInfoName').html(_name);
			$('.j-userInfoswitchrole,.j-userInforoletype').html(_dataval);
			$('.j-userInfoPoints').html(_points);

			var roleAr = $roleSwitch.attr('data-value').split(','), roleObjAr = [], roleRenderAr = [];


			//合并
			for(var k = 0, klen = roleAr.length; k < klen; k++){
				if(roleAr[k].indexOf('##') < 0) continue;
				var roleSingle = roleAr[k].split('##');
				
				/*if(roleSingle[1]===_roleType){
					window.userTypeRoleId=roleSingle[0];
				}*/
				if(roleSingle[1] == '任课老师' || roleSingle[1] == '班主任'){
					roleSingle[0] = '老师';
					roleSingle[1] = '老师';
				}
				roleObjAr.push({id: roleSingle[0], name: roleSingle[1]});
			}

			//去重
			for(var i = 0, ilen = roleObjAr.length; i < ilen; i++){
				var isHas = false;
				for(var j = 0, jlen = roleRenderAr.length; j < jlen; j++){
					if(roleObjAr[i].name === roleRenderAr[j].name){
						isHas = true;
						break;
					}
				}

				if(!isHas){
					roleRenderAr.push(roleObjAr[i])
				}
			}

			
			
			if(roleRenderAr.length <= 1 || _roleType == ''){
				$('.j-rolestab').hide();
			}else{
				$('.j-userInforoletype').hide();

				var lihtml = ''
				for(var x = 0, xlen = roleRenderAr.length; x < xlen; x++){
					lihtml += '<li><a href="javascript:void(0)" data-id="' + roleRenderAr[x].id + '">' + roleRenderAr[x].name + '</a></li> ';
				}

				$roleSwitch.append(lihtml);

				$roleSwitch.delegate('a', 'click', function(){
					var _id = $(this).attr('data-id');


					$.ajax({
						url: window.globalPath + '/switch',
						type: 'POST',
						dataType: 'json',
						data: {roleId: _id, type: 'switch'},
						success: function(res){
							if(res.msg == 'OK, refresh'){
								location.href = window.globalPath + res.url
							}
						}
					});
				});
			}
		}
	});
});
