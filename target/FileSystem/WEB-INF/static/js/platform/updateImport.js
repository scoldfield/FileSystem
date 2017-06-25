/**
 * Document by wangshuyan@chinamobile.com on 2015/11/12 0012.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'jqueryForm': '../lib/jquery.form',
		'base': '../common/base',
		'function': '../common/function',
		'ymPrompt': '../plug/ymPrompt/ymPrompt'
	},
	shim: {
		'base': {deps: ['jquery']},
		'jqueryForm': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']}
	},
	waitSeconds: 0
});

require(['jquery', 'jqueryForm', 'ymPrompt', 'base', 'function'], function(jquery){

	var updateImport = {
		$elements: {
			$getufbtn: $('.j-get-uf'),
			$upfiles: $('#upfileField'),
			$showUpfilesName: $('.j-showfilesName'),
			$uploadstart: $('.j-uploadstart'),
			$uploadcancel: $('.j-uploadcancel'),
			$classimportlist: $('#tab'),
			$addGrade: $('.j-addgrade'),
			$schooladdVal: $('.j-addschoolval'),
			$gradeaddVal: $('.j-addgradeval'),
			$schooladdText: $('.j-addschooltext'),
			$gradeaddText: $('.j-addgradetext'),
			$selectError: $('.selecterror')
		},
		addGradeList: [],
		isSubmit: false
	};
	//获取学校列表
	updateImport.getSchoolList = function(){
		$.ajax({
			url: window.globalPath + '/student/schoolList',
			type: 'POST',
			dataType: 'json',
			success: function(res){
				var school_html = '';
				if(res && res.slist && res.slist.length > 0){
					var i = 0, ilen = res.slist.length;
					for(; i < ilen; i++){
						school_html += '<li data-value="' + res.slist[i].id + '">' + res.slist[i].referredName + '</li>';
					}
				}else{
					school_html = '<li data-value="">没有可选择的学校</li>'
				}
				$('.j-schoolslist').html(school_html);
			}
		});
	}
	updateImport.getGradesList = function(val){
		$.ajax({
			url: window.globalPath + '/student/gradeList',
			type: 'POST',
			dataType: 'json',
			data: {schoolId: val},
			success: function(res){
				var grade_html = '';
				if(res && res.glist && res.glist.length > 0){
					var i = 0, ilen = res.glist.length;
					for(; i < ilen; i++){
						grade_html += '<li data-value="' + res.glist[i].id + '">' + res.glist[i].gradeName + '</li>';
					}
				}else{
					grade_html = '<li data-value="">没有可选择的年级</li>'
				}
				$('.j-gradeslist').html(grade_html);
			}
		})
	}
	updateImport.initStudent = function(){
		var _self = this;
		_self.getSchoolList();

		var shoollist = new SelectUi($('.j-selectui-schools'));
		var gradelist = new SelectUi($('.j-selectui-grades'));

		shoollist.bindE(function(val){
			updateImport.$elements.$selectError.empty();
			_self.getGradesList(val);
			gradelist.reset();
		});

		gradelist.bindE(function(){
			updateImport.$elements.$selectError.empty();
		});


		//添加年级到列表
		updateImport.$elements.$addGrade.on('click', function(){
			var sval = updateImport.$elements.$schooladdVal.val(),
				gval = updateImport.$elements.$gradeaddVal.val(),
				stext = updateImport.$elements.$schooladdText.val(),
				gtext = updateImport.$elements.$gradeaddText.val(),
				trhtml = '';
			var errorInf = ''
			switch(true){
			case sval === '':
				errorInf = '请选择学校';
				break;
			case gval === '':
				errorInf = '请选择班级';
				break;
			case updateImport.addGradeList.indexOf(gval) >= 0:
				errorInf = '您已经选择了这个年级';
				break;
			case updateImport.addGradeList.length >= 3:
				errorInf = '最多添加三个班级';
				break;
			}
			if(errorInf === ''){
				updateImport.$elements.$classimportlist.append('<tr><td>' + stext + '</td><td>' + gtext + '</td><td><a class="u-gbtn" data-value="' + gval + '" href="javascript:void(0)">删除</a></td></tr>');
				updateImport.addGradeList.push(gval);
			}else{
				updateImport.$elements.$selectError.html(errorInf);
			}

			$('.g-classimportlist').show();
		});

		//删除班级列表
		updateImport.$elements.$classimportlist.on('click', 'a', function(){
			var $this = $(this), val = $this.attr('data-value'), _index = updateImport.addGradeList.indexOf(val);
			updateImport.addGradeList.splice(_index, 1);
			$this.parents('tr').remove();
			if(updateImport.addGradeList.length == 0){
				$('.g-classimportlist').hide();
			}
		});
	};

	var cancelUrl = '';
	if(window.pageType === 'students'){
		updateImport.initStudent();
		cancelUrl = '/student/cancelStudent'
	}else{
		cancelUrl = '/teacher/cancelTeacher'
	}


	/* 选择文件 */
	updateImport.$elements.$getufbtn.bind('click', function(){
		if($(this).hasClass('disabled')) return;
		updateImport.$elements.$upfiles.click();
	});

	updateImport.$elements.$upfiles.bind('change', function(){
		var _val = $(this).val(), _msg, _tipcss = '', _valAr = _val.split('.'), _extendFile = _valAr[_valAr.length - 1], regex = /\/|\\/, filesNameAr = _val.split(regex);
		switch(true){
		case _extendFile !== 'xls' && _extendFile !== 'xlsx':
			_msg = '请上传正确格式的excel文件';
			_tipcss = 'error';
			break;
		default :
			_msg = '已选择文件：' + filesNameAr[filesNameAr.length - 1];
			_tipcss = 'ok';
		}

		if(_tipcss == 'ok'){
			updateImport.$elements.$uploadstart.removeAttr('disabled');
		}else{
			updateImport.$elements.$uploadstart.attr('disabled', 'disabled');
		}
		updateImport.$elements.$showUpfilesName.text(_msg).removeClass('error ok').addClass(_tipcss);
	});

	/* 上传 */
	updateImport.$elements.$uploadstart.bind('click', function(){
		if(updateImport.$elements.$upfiles.val() === ''){
			return false;
		}
		if(updateImport.isSubmit) return; //防止二次提交
		updateImport.isSubmit = true;

		if(window.pageType === 'students'){
			//获取班级
			var classAr = [];
			updateImport.$elements.$classimportlist.find('a').each(function(){
				classAr.push($(this).attr('data-value'));
			});
		}
		if(classAr.length === 0){
			ymPrompt.alert({
				message: '请选择分班设置的年级',
				titleBar: false,
			});
			updateImport.isSubmit = false;
			return false;
		}else{
			$('#gradeId').val(classAr.join());
		}

		// 表现层处理
		$(this).attr('disabled', 'disabled').val('上传中... ...'); //上传按钮置灰
		updateImport.$elements.$getufbtn.addClass('disabled'); //选择上传文件置灰
		updateImport.$elements.$uploadcancel.show(); //取消按钮显示

		// ajax表现
		var ajax_option = {
			url: window.ajaxUrl,      // override for form's 'action' attribute
			dateType: 'json',
			type: 'post',
			success: function(da){
				window.location.href = window.resultUrl;
				/*
				 检测网络是否链接，如果未链接则弹出检查网络的
				 var isOnline = setInterval(function(){
				 $.ajax({
				 url: window.globalPath + '/platform/student/verification',
				 type: 'POST',
				 dataType: 'json',
				 success: function(res){
				 }, error: function(){
				 clearInterval(isOnline);
				 }
				 });
				 }, 10000);
				 */
			}
		};
		$('#uploadfiles').ajaxSubmit(ajax_option);
	});

	/* 取消上传 */
	updateImport.$elements.$uploadcancel.bind('click', function(){
		ymPrompt.confirmInfo({
			message: '确认取消上传？',
			titleBar: false,
			handler: function(msg){
				if(msg == 'ok'){
					$.ajax({
						url: window.globalPath + cancelUrl,
						type: 'POST',
						dataType: 'json',
						success: function(res){
							if(res.result === 'success'){
								updateImport.$elements.$uploadstart.removeAttr('disabled').val('确定导入文件');
								updateImport.$elements.$getufbtn.removeClass('disabled');
								updateImport.$elements.$uploadcancel.hide();
								updateImport.isSubmit = false;
							}
						}
					});
				}
			}
		});
	});
});