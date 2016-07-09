/**
 * Document by wangshuyan@chinamobile.com on 2015/11/23 0023.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/base',
		'function': '../common/function',
		'ymPrompt': '../plug/ymPrompt/ymPrompt'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt'], function(jquery){
	var setPostion = {
		removeArray: function(item, ar){
			var _index = ar.indexOf(item);
			if(_index >= 0)
				ar.splice(_index, 1);
		},
		constantData: {
			teacherId: 0, // 教师id
			schoolId: 0, //学校id
			returnSchoolId: '0' //返回按钮的学校ID
		},
		$elements: {
			$otherDudy: $('.j-otherDutyList'),
			$dutysection: $('.j-dutysection'),
			$selectClassesWrap: $('.j-setclass'),
			$selectClasses: $('.j-selectClass'),
			$selectGradeWrap: $('.j-setgrade'),
			$selectGrades: $('.j-selectgrade'),
			$selectCourseWrap: $('.j-setCourse'),
			$setOthers: $('.j-setOthers'),
			$selectCourse: $('.j-selectCourse'),
			$courseWrap: $('.j-dutysetWrap'),
			$chooseDutyType: $('.j-chooseDutyType'),
			$noClassTips: $('.j-noclasstTips'),
			$headTeacher: $('.j-headTeacher'),
			$addCourse: $('.j-addCourse')
		},
		courseData: [],//课程本地数据库
		localData: {},
		cacheData: null, // 当前数据指针
		cacheCourse: {},
		/*  获取数据模型，渲染页面 */
		init: function(){
			var _self = this;
			/* 获取url信息  定义常量*/
			_self.constantData.teacherId = getUrlQuery('teacherId');
			_self.constantData.schoolId = getUrlQuery('schoolId');
			_self.constantData.returnSchoolId = getUrlQuery('returnSchoolId') || '0';
			/* 获取职务 positionList ，与 课程 courseList  */
			$.ajax({
				url: window.globalPath + '/course/getCourseList',
				data: {schoolId: _self.constantData.schoolId},
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function(resData){
					var course_html = '', postion_html = '';
					if(resData){
						/* 获取*课程*列表并渲染 */
						if(resData.courseList && resData.courseList.length > 0){
							for(var i = 0, ilen = resData.courseList.length; i < ilen; i++){
								if(resData.courseList.hasOwnProperty(i) && typeof resData.courseList[i] == 'function') continue; // 过滤为了纠正IE8的bug而添加的自定义属性
								var courseSingle = {},
									resUnit = resData.courseList[i];
								courseSingle.id = resUnit.id;
								courseSingle.name = resUnit.name;
								course_html += '<label class="checkbox-ui radio f-fl"><input type="radio" name="setcourse" value="' + courseSingle.id + '" /><b></b>' + courseSingle.name + '</label>';
								_self.courseData.push(courseSingle); //推入课程本地数据库
							}
						}else{
							course_html += '<p class="f-cr">获取课程失败！</p>';
						}
						_self.$elements.$selectCourse.append(course_html);

						/* 获取*职务*列表并渲染*/
						if(resData.positionList && resData.positionList.length > 0){
							for(var j = 0, jlen = resData.positionList.length; j < jlen; j++){
								if(resData.positionList.hasOwnProperty(j) && typeof resData.positionList[j] == 'function') continue; // 过滤为了纠正IE8的bug而添加的自定义属性
								var positionSingle = resData.positionList[j];
								var localData_item = {}; //创建单个职务数据组容器，并设置共有属性
								localData_item.positionName = positionSingle.positionName;
								localData_item.positionId = positionSingle.id;
								localData_item.classGroup = [];
								localData_item.hasPosition = false; //该教师是否存在这个职务，默认false
								if(positionSingle.positionName === '任课老师'){ //特殊的任课老师的ID
									//特殊数据组
									localData_item.courseGroup = [
										{coursenum: 1, courseId: 0, classGroup: [], positionId: positionSingle.id, positionName: '任课老师'},
										{coursenum: 2, courseId: 0, classGroup: [], positionId: positionSingle.id, positionName: '任课老师'},
										{coursenum: 3, courseId: 0, classGroup: [], positionId: positionSingle.id, positionName: '任课老师'}
									];
									postion_html += '<div class="dutymenu-part dutymenu-part-teach j-dutysetWrap">' +
										'<span>' + positionSingle.positionName + '</span>' +
										'<a data-item="1" class="j-dutyset tab" data-id="' + positionSingle.id + '" href="javascript:void(0)">科目1</a>' +
										'<a data-item="2" class="j-dutyset tab" data-id="' + positionSingle.id + '" href="javascript:void(0)">科目2</a>' +
										'<a data-item="3" class="j-dutyset tab" data-id="' + positionSingle.id + '" href="javascript:void(0)">科目3</a>' +
										'</div>';
								}else{
									var istabCss = '', _dutyPartTab = '';
									if(positionSingle.positionName === '班主任' || positionSingle.positionName === '年级组长'){
										istabCss = 'tab';
										_dutyPartTab = 'tab';
									}
									var isActive = positionSingle.positionName === '班主任' ? ' active' : '';
									postion_html += '<div class="dutymenu-part ' + _dutyPartTab + '"> <a class="j-dutyset  ' + istabCss + isActive + '" href="javascript:void(0)" data-id="' + positionSingle.id + '">' + positionSingle.positionName + '</a> </div>';
								}

								//推入整个本地数据组
								_self.localData['id_' + positionSingle.id] = localData_item;

							}
						}else{
							postion_html = '<p class="f-cr">未获取职务！</p>';
						}
						_self.$elements.$chooseDutyType.append(postion_html);
					}else{
						alert('职务与课程数据获取失败，请联系管理员')
					}
				}
			});

			/* 渲染班级 */
			$.ajax({
				url: window.globalPath + '/class/getClassInfo',
				data: {schoolId: _self.constantData.schoolId},
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function(resData){
					var class_html = '', grade_html = '';
					if(resData && resData.gradeList){
						if(resData.gradeList.length > 0){
							for(var i = 0, ilen = resData.gradeList.length; i < ilen; i++){
								if(resData.gradeList.hasOwnProperty(i) && typeof resData.gradeList[i] == 'function') continue; // 过滤为了纠正IE8的bug而添加的自定义属性
								var gradeSingle = resData.gradeList[i];
								class_html += '<p class="s-gradeName">' + gradeSingle.gradeName + '</p><div class="f-cb m-classList">'
								grade_html += ' <label class="checkbox-ui f-fl"><input class="j-gradeTitle" type="checkbox" value="' + gradeSingle.gradeId + '_0' + '" /><b></b>' + gradeSingle.gradeName + '</label> ';
								var jlen = gradeSingle.classList.length;
								if(jlen > 0){
									for(var j = 0; j < jlen; j++){
										if(gradeSingle.classList.hasOwnProperty(j) && typeof gradeSingle.classList[j] == 'function') continue; // 过滤为了纠正IE8的bug而添加的自定义属性
										var classSingle = gradeSingle.classList[j];
										class_html += '<label class="checkbox-ui f-fl"><input type="checkbox" data-classid="' + classSingle.id + '" value="' + gradeSingle.gradeId + '_' + classSingle.id + '"   /><b></b>' + classSingle.className + '</label>';
									}
								}else{
									class_html += '<span class="s-noclass f-cgray">该年级下没有班级</span>';
								}
								class_html += '</div>';
							}
							_self.$elements.$selectGrades.append(grade_html);
							_self.$elements.$selectClasses.append(class_html);
						}else{
							class_html += '<p class="f-cgray">该学校没有年级！</p></div>';
							grade_html += '<p class="f-cgray">该学校没有年级！</p>';
							_self.$elements.$selectGrades.append(grade_html);
							_self.$elements.$selectClasses.append(class_html);
						}
					}else{
						class_html += '<p class="f-cr">获取班级失败！</p></div>';
						grade_html += '<p class="f-cgray">获取年级级失败！</p>';
						_self.$elements.$selectGrades.append(grade_html);
						_self.$elements.$selectClasses.append(class_html);
					}
				}
			});

			/* 整理本地数据 */
			$.ajax({
				url: window.globalPath + '/middle/getMiddleList',
				data: {teacherId: _self.constantData.teacherId},
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function(resData){
					if(resData){

						/* 静态标题与链接渲染 */
						var returnSchoolUrl = _self.constantData.returnSchoolId !== '0' ? '/teacher/teacherList?schoolId=' + _self.constantData.returnSchoolId : '/teacher/teacherList';
						$('.j-return').attr('href', window.globalPath + returnSchoolUrl);
						$('.j-shoolName').text(resData.schoolName + ' ' + resData.teacherName);
						/* end 静态标题与链接渲染 */

						for(var i = 0, ilen = resData.middleList.length; i < ilen; i++){

							if(resData.middleList.hasOwnProperty(i) && typeof resData.middleList[i] == 'function') continue; // 过滤为了纠正IE8的bug而添加的自定义属性

							var middleSingle = resData.middleList[i];
							/* 将角色拆分成两次 角色职务 */
							var MiddlepositionIds = null
							if(middleSingle.positionId){
								if(middleSingle.positionId.indexOf(',') > 0){
									MiddlepositionIds = middleSingle.positionId.split(',');
								}else{
									MiddlepositionIds = [middleSingle.positionId];
								}

								for(var j = 0, jlen = MiddlepositionIds.length; j < jlen; j++){
									if(!MiddlepositionIds.hasOwnProperty(j)) continue;
									var _positionId = MiddlepositionIds[j];
									if(_self.localData['id_' + _positionId].positionName == '任课老师'){
										for(var k = 0, kLength = resData.courseList.length; k < kLength; k++){
											if(!resData.courseList.hasOwnProperty(k)) continue;
											var courseSingle = resData.courseList[k];
											if(courseSingle.classId == middleSingle.classId){
												var _num = courseSingle.coursenum,
													_localData = _self.localData['id_' + _positionId].courseGroup[_num - 1];
												_localData.courseId = courseSingle.courseId;
												_localData.positionName = '任课老师';
												_localData.classGroup.push(middleSingle.gradeId + '_' + (middleSingle.classId || 0));
											}
										}
									}else{
										_self.localData['id_' + _positionId].classGroup.push(middleSingle.gradeId + '_' + (middleSingle.classId || 0));
										/* 如果是其他 */
										_self.localData['id_' + _positionId].hasPosition = true;
									}
								}
							}
						}
					}else{
						alert('数据获取失败！')
					}
				}
			});


			_self.bindE();
			_self.selectDuty.setHeaderTeaher(21);//默认打开班主任的
			_self.isHasClass();

		},
		renderSelectClass: function(classGroup){
			for(var i = 0; i < classGroup.length; i++){
				this.$elements.$selectClasses.find('input[value=' + classGroup[i] + ']').get(0).checked = true;
			}
		},
		renderSelectGrade: function(classGroup){
			for(var i = 0; i < classGroup.length; i++){
				this.$elements.$selectGrades.find('input[value=' + classGroup[i] + ']').get(0).checked = true;
			}
		},
		setPosition: function(postData, $this, callback){
			var _self = this;
			$.ajax({
				url: window.globalPath + '/middle/setPositionCourse',
				type: 'POST',
				data: postData,
				dataType: 'json',
				aysnc: false,
				success: function(resMsg){
					if(resMsg && resMsg.msg && resMsg.msg == 'success'){
						if(callback){
							callback($this);
						}

						// 推入本地数据库
						if(postData.positionName == '班主任'){
							_self.localData['id_' + postData.positionId].classGroup.push(postData.gradeId + '_' + postData.classId);
						}else if(postData.positionName == '任课老师'){
							_self.localData['id_' + postData.positionId].courseGroup[+postData.coursenum - 1].classGroup.push(postData.gradeId + '_' + postData.classId);
						}else if(postData.positionName == '年级组长'){
							_self.localData['id_' + postData.positionId].classGroup.push(postData.gradeId);
						}else{
							_self.localData['id_' + postData.positionId].hasPosition = true;
						}
						//检查是否有值
						_self.isHasClass();

					}else{
						alert('设置失败')
						$this[0].checked && ( $this[0].checked = false);
					}
				},
				error: function(res){
					alert('设置失败');
					$this[0].checked && ( $this[0].checked = false);
				}
			});
		},
		deletePosition: function(postData, $this, callback){
			var _self = this;
			$.ajax({
				url: window.globalPath + '/middle/deletePosition',
				data: postData,
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function(resMsg){
					if(resMsg && resMsg.msg && resMsg.msg == 'success'){
						if(callback){
							callback($this);
						}

						var deleteList = typeof postData.middleList !== 'object' ? eval(postData.middleList) : postData.middleList;

						for(var i in deleteList){
							if(!deleteList.hasOwnProperty(i)) continue;
							var postSingle = deleteList[i];
							var _gradeIdClassid = _self.$elements.$selectClasses.find('input[data-classid=' + postSingle.classId + ']').val();
							//删除本地数据
							if(postSingle.positionName == '班主任'){
								_self.removeArray(_gradeIdClassid, _self.cacheData.classGroup)
							}else if(postSingle.positionName == '任课老师'){
								_self.removeArray(_gradeIdClassid, _self.cacheCourse.classGroup)
							}else if(postSingle.positionName == '年级组长'){
								_self.removeArray(postSingle.gradeId, _self.cacheData.classGroup);
							}else{
								_self.localData['id_' + postSingle.positionId].hasPosition = false;
							}
						}
						//检查是否有值
						_self.isHasClass();
					}else{
						alert('删除失败');
						$this[0].checked && ( $this[0].checked = false);
					}
				}, error: function(){
					alert('删除失败');
					$this[0].checked && ( $this[0].checked = false);
				}
			});
		},
		isHasClass: function(){
			var _self = this;
			for(var i in _self.localData){
				if(!_self.localData.hasOwnProperty(i)) continue;
				var _localData = _self.localData[i]
				switch(_localData.positionName){
				case '班主任':
					if(_localData.classGroup.length > 0){
						_self.$elements.$chooseDutyType.find('a.j-dutyset[data-id=' + _localData.positionId + ']').addClass('has');
					}else{
						_self.$elements.$chooseDutyType.find('a.j-dutyset[data-id=' + _localData.positionId + ']').removeClass('has');
					}
					break;
				case '任课老师':
					for(var j in _localData.courseGroup){
						if(!_localData.courseGroup.hasOwnProperty(j)) continue;
						if(_localData.courseGroup[j].classGroup.length > 0){
							_self.$elements.$chooseDutyType.find('a.j-dutyset[data-id=' + _localData.positionId + ']').eq(j).addClass('has');
						}else{
							_self.$elements.$chooseDutyType.find('a.j-dutyset[data-id=' + _localData.positionId + ']').eq(j).removeClass('has');
						}
					}
					break;
				case '年级组长':
					if(_localData.classGroup.length > 0){
						_self.$elements.$chooseDutyType.find('a.j-dutyset[data-id=' + _localData.positionId + ']').addClass('has');
					}else{
						_self.$elements.$chooseDutyType.find('a.j-dutyset[data-id=' + _localData.positionId + ']').removeClass('has');
					}
					break;
				default :
					if(_localData.hasPosition){
						_self.$elements.$chooseDutyType.find('a.j-dutyset[data-id=' + _localData.positionId + ']').addClass('selected');
					}
					break;
				}
			}
		},
		bindE: function(){
			var _self = this;

			//切换角色
			_self.$elements.$chooseDutyType.delegate('a.j-dutyset', 'click', function(){
				var $this = $(this), _positionId = $this.attr('data-id'), _courseNum = $this.attr('data-item') || 0;

				// 设置按钮自我样式
				_self.$elements.$chooseDutyType.find('a.j-dutyset').removeClass('active');
				$this.addClass('active');
				//班级&课程input重置
				_self.resetClasses();
				_self.resetCourse();

				switch(_self.localData['id_' + _positionId].positionName){
				case '班主任':
					_self.selectDuty.setHeaderTeaher(_positionId);
					break;
				case '任课老师':
					_self.selectDuty.setTeachTeaher(_positionId, _courseNum);
					break;
				case '年级组长':
					_self.selectDuty.setGradeMaster(_positionId);
					break;
				default :
					_self.selectDuty.setOthers(_positionId, $this);
					break;
				}
			});


			// 设置班级
			_self.$elements.$selectClasses.delegate('input', 'change', function(){
				var $this = $(this), _valAr = $this.val().split('_');
				var _gradeId = _valAr[0],
					_classId = _valAr[1],
					_teacherId = _self.constantData.teacherId,
					_positionId = _self.cacheData.positionId,
					_positionName = _self.cacheData.positionName,
					_courseId = _self.cacheCourse && _self.cacheCourse.courseId || 0,
					_coursenum = _self.cacheCourse && _self.cacheCourse.coursenum || 0;

				var _postData = {gradeId: _gradeId, classId: _classId, teacherId: _teacherId, positionId: _positionId, courseId: _courseId, coursenum: _coursenum, positionName: _positionName};
				if($this[0].checked){
					_self.setPosition(_postData, $this);
				}else{
					_self.deletePosition({'middleList': '[{positionId: ' + _positionId + ',positionName:"' + _positionName + '", coursenum: ' + _coursenum + ', teacherId: ' + _teacherId + ',classId:' + _classId + '}]'}, $this);
				}
			});

			//设置年级组长
			_self.$elements.$selectGrades.delegate('input.j-gradeTitle', 'change', function(){
				var $this = $(this), _gradeId = $this.val().split('_')[0];
				var _postData = {
					gradeId: _gradeId,
					teacherId: _self.constantData.teacherId,
					positionId: _self.cacheData.positionId,
					positionName: _self.cacheData.positionName
				};
				if($this[0].checked){
					_self.setPosition(_postData, $this);
				}else{
					_self.deletePosition({'middleList': '[{positionId: ' + _postData.positionId + ',positionName:"' + _postData.positionName + '", teacherId: ' + _postData.teacherId + ',gradeId:' + _gradeId + '}]'}, $this);
				}
			});

			//选择课程
			_self.$elements.$selectCourse.delegate('input', 'change', function(){
				var $this = $(this), _courseId = $this.val();
				//检查当前科目下是否存在班级，如果存在，则要给提示，并批量删除，
				if(_self.cacheCourse.classGroup.length > 0){
					ymPrompt.confirmInfo({
						message: '<span class="f-cr" style="font-size:18px; line-height: 2.5em;">注意：更换科目会将现有科目的班级删除，<br/>是否确定更换科目？</span>',
						titleBar: false,
						width: 430,
						height: 240,
						handler: function(resMsg){
							if(resMsg == 'ok'){
								var _postData = {'middleList': []};
								var _teacherId = _self.constantData.teacherId,
									_positionId = _self.cacheData.positionId,
									_positionName = _self.cacheData.positionName,
									_coursenum = _self.cacheCourse.coursenum || 0;

								var ar = '[', ilen = _self.cacheCourse.classGroup.length;
								for(var i = 0; i < ilen - 1; i++){
									ar += '{positionId:' + _positionId + ',positionName:"' + _positionName + '",coursenum:' + _coursenum + ', teacherId: ' + _teacherId + ',classId:' + _self.cacheCourse.classGroup[i].split('_')[1] + '},';
								}
								ar += '{positionId:' + _positionId + ',positionName:"' + _positionName + '",coursenum:' + _coursenum + ', teacherId: ' + _teacherId + ',classId:' + _self.cacheCourse.classGroup[ilen - 1].split('_')[1] + '}]';
								_postData['middleList'] = ar;
								_self.deletePosition(_postData, $this, function(){
									_self.courseData.courseId = _courseId;
									_self.resetClasses();
								});
							}else{
								$this[0].checked = false;
								_self.$elements.$selectCourse.find('input[value=' + _self.cacheData.courseId + ']')[0].checked = true;
							}

						}
					});
				}else{
					_self.cacheCourse.courseId = _courseId;
					_self.$elements.$selectClasses.show();
					_self.$elements.$noClassTips.hide();
				}
				_self.isHasClass();
			});

			/* 增加课程  */
			$('.j-addCourse').delegate('a.add', 'click', function(event){
				var $this = $(this), $parents = _self.$elements.$addCourse;
				var $val = $parents.find('.addcourseipt');
				if($this.is('.active')){
					var _val = $.trim($val.val());
					if(_val !== ''){
						if(_val.length > 6){
							ymPrompt.alert({
								message: '课程名称不能超过6个字',
								titleBar: false
							});
							return false
						}

						$.ajax({
							url: window.globalPath + '/course/create',
							data: {name: _val, schoolId: _self.constantData.schoolId},
							dataType: 'json',
							type: 'POST',
							success: function(resMsg){
								if(resMsg){
									if(resMsg.msg && resMsg.msg == 'success'){
										_self.courseData.push({id: resMsg.courseId, name: _val});
										_self.$elements.$selectCourse.append('<label class="checkbox-ui radio f-fl"><input type="radio" name="setcourse" value="' + resMsg.courseId + '"><b></b>' + _val + '</label>');
									}else{
										alert('未添加成功!')
									}
									$parents.removeClass('enter');
									$this.removeClass('active');
								}
							}
						});
					}else{
						$parents.removeClass('enter');
						$this.removeClass('active');
					}
				}else{
					$val.val('');
					$this.addClass('active');
					$parents.addClass('enter');
				}
			});


		},
		resetCourse: function(){
			this.$elements.$selectCourse.find('input').each(function(){
				$(this)[0].checked = false;
				$(this)[0].disabled = false;
			})
		},
		resetClasses: function(){
			this.$elements.$selectClasses.find('input').each(function(){
				$(this)[0].checked = false;
			})
		},
		selectDuty: {
			setHeaderTeaher: function(_positionId){
				var _self = setPostion;
				//当前数据指针指向当前数据
				_self.cacheData = _self.localData['id_' + _positionId];
				_self.cacheCourse = {};
				var classGroup_i = []

				/* 渲染当前数据 */
				for(var i = 0, ilen = _self.cacheData.classGroup.length; i < ilen; i++){
					classGroup_i.push(_self.cacheData.classGroup[i]);
				}
				_self.renderSelectClass(classGroup_i);
				//显示对应模块
				//隐藏所有区域
				_self.$elements.$dutysection.hide();
				_self.$elements.$selectClassesWrap.show();
				_self.$elements.$selectClasses.show();
				_self.$elements.$noClassTips.hide();
			},
			setTeachTeaher: function(_positionId, courseNum){   // 更新当前数据
				var _self = setPostion;
				_self.cacheData = _self.localData['id_' + _positionId];
				_self.cacheCourse = _self.cacheData.courseGroup[courseNum - 1];

				//渲染当前数据
				//--  班级


				//显示对应模块
				//隐藏所有区域
				_self.$elements.$dutysection.hide();
				_self.$elements.$selectClassesWrap.show();
				_self.$elements.$selectCourseWrap.show();

				//重新检查courseId 不为空下是否classGroup的长度是否为0，如果为0，则courseId设为空；
				for(var i in _self.cacheData.courseGroup){
					if(!_self.cacheData.courseGroup.hasOwnProperty(i)) continue;
					if(_self.cacheData.courseGroup[i].classGroup.length == 0){
						_self.cacheData.courseGroup[i].courseId = 0;
					}
				}

				var jlen = _self.cacheCourse.classGroup.length;
				if(jlen > 0 || _self.cacheCourse.courseId !== 0){
					_self.$elements.$selectClasses.show();
					_self.$elements.$noClassTips.hide();
				}else{
					_self.$elements.$selectClasses.hide();
					_self.$elements.$noClassTips.show();
				}

				_self.renderSelectClass(_self.cacheCourse.classGroup);

				//--课程
				_self.$elements.$selectCourse.find('input').each(function(){
					var $this = $(this), _courseId = $this.val();
					for(var k = 0; k < 3; k++){
						if(_self.cacheData.courseGroup[k].courseId === _courseId){
							if((courseNum - 1) !== k){
								$this[0].disabled = true;
							}else{
								$this[0].checked = true;
							}
						}
					}
				});
			},
			setGradeMaster: function(_positionId){
				var _self = setPostion;
				_self.cacheData = _self.localData['id_' + _positionId];
				_self.cacheCourse = {};
				var classGroup_i = []
				/* 渲染当前数据 */
				for(var i = 0, ilen = _self.cacheData.classGroup.length; i < ilen; i++){
					classGroup_i.push(_self.cacheData.classGroup[i]);
				}
				_self.renderSelectGrade(classGroup_i);
				//显示对应模块
				//隐藏所有区域
				_self.$elements.$dutysection.hide();
				_self.$elements.$selectGradeWrap.show();
			},
			setOthers: function(_positionId, $this){
				var _self = setPostion;
				_self.cacheData = _self.localData['id_' + _positionId];
				//隐藏所有区域
				_self.$elements.$dutysection.hide();
				_self.$elements.$setOthers.show();
				$('.j-otherduty').html(_self.cacheData.positionName);

				if(_self.cacheData.hasPosition){
					_self.deletePosition({'middleList': '[{teacherId: ' + _self.constantData.teacherId + ',positionId: ' + _self.cacheData.positionId + ',positionName:"' + _self.cacheData.positionName + '"}]'}, $this, function($this){
						$this.removeClass('selected');
					});
				}else{
					_self.setPosition({teacherId: _self.constantData.teacherId, positionId: _self.cacheData.positionId, positionName: _self.cacheData.positionName}, $this, function($this){
						$this.addClass('selected');
					});
				}
			}
		}
	}

	setPostion.init();
});
