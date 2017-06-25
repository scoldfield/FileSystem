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
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel', 'jqueryForm'], function(jquery){

	/* 获取考试ID */
	var examId = getUrlQuery('examid');
	document.getElementById('examId').value = examId;


	var updateFunction = {
		$elements: {
			$updateTranscript: $('.j-updateTranscript'),
			$updateFiles: $('#updateFiles'),
			$fileName: $('.j-fileName'),
			$submitUpdate: $('.j-forExel'),
			$forExelCancel: $('.j-forExelCancel'),
			$tab: $('#checkwrap')
		},
		updateFile: '',
	}

	/* 返回跳转操作 */
	updateFunction.consoleRes = function(resData){
		switch(resData.result){
		case '0':
			ymPrompt.alert({
				message: '上传文件的格式不正确',
				titleBar: false
			});
			updateFunction.$elements.$submitUpdate.removeAttr('disabled').val('确定');
			break;
		case '3':
			ymPrompt.alert({
				message: '成绩超过15个字',
				titleBar: false
			});
			updateFunction.$elements.$submitUpdate.removeAttr('disabled').val('确定');
			break;
		case '4':
			ymPrompt.alert({
				message: 'excel表格为空',
				titleBar: false
			});
			updateFunction.$elements.$submitUpdate.removeAttr('disabled').val('确定');
			break;
		case '1':
			setTimeout(function(){
				location.href = window.globalPath + '/score/list?examId=' + examId;
			}, 3000);
			ymPrompt.succeedInfo({
				message: '导入成功！',
				width: 360,
				height: 240,
				handler: function(){
					location.href = window.globalPath + '/score/list?examId=' + examId;
				}
			})
			break;
		case '2':
			ymPrompt.alert({
				message: '考试不存在！',
				width: 360,
				height: 240,
				handler: function(){
					location.href = window.globalPath + '/exam/examlist'
				}
			});
			setTimeout(function(){
				location.href = window.globalPath + '/exam/examlist';
			}, 3000);
			break;
		case '5':
			$('.j-upForm').hide();
			$('.j-checkwrap').show();
			updateFunction.$elements.$tab.empty();
			if(resData.resultList && resData.resultList.length > 0){
				var $trlist = '';
				updateFunction.postData = [];
				for(var i in resData.resultList){
					var resultSingle = resData.resultList[i];
					$trlist += '<tr data-id="' + i + '">' +
						'<td><label class="checkbox-ui"><input type="checkbox" class="j-checkfordel" data-num="' + resultSingle.num + '" value="' + i + '"><b></b></label></td>' +
						'<td><input type="text"   autocomplete="off"   class="u-gipt j-ckwgradename" value="' + resultSingle.gradeName + '"></td>' +
						'<td><input type="text"   autocomplete="off"   class="u-gipt j-ckwclassname" value="' + resultSingle.className + '"></td>' +
						'<td><input type="text"   autocomplete="off"   class="u-gipt j-ckwstuno" value="' + resultSingle.stuno + '"></td>' +
						' <td><input type="text"   autocomplete="off"   class="u-gipt j-ckwstuname" value="' + resultSingle.stuname + '"></td>' +
						'<td><input type="text"   autocomplete="off"   class="u-gipt j-ckwscore" value="' + resultSingle.score + '"></td>' +
						'<td><span class="tips error">' + resultSingle.resultName + '</span></td>' +
						'</tr>';
				}
				updateFunction.$elements.$tab.append($trlist);
			}
			$("#count").html(resData.count);
			$("#savecount").html(resData.savecount);
			break;
		}
	}

	updateFunction.$elements.$updateTranscript.bind('click', function(){
		updateFunction.$elements.$updateFiles.click();
	});

	updateFunction.$elements.$updateFiles.bind('change', function(){
		var _val = $(this).val(), _msg, valAr = _val.split('\\');
		if(_val){
			_msg = '已选择文件：  ' + _val;
			updateFunction.$elements.$submitUpdate.removeAttr('disabled');
			updateFunction.updateFile = valAr[valAr.length - 1];
		}else{
			updateFunction.$elements.$submitUpdate.attr('disabled', 'disabled');
			_msg = '未选择任何文件';
			updateFunction.updateFile = ''
		}
		updateFunction.$elements.$fileName.html(_msg);
	});

	updateFunction.$elements.$submitUpdate.on('click', function(){
		if(updateFunction.updateFile){
			var uploadfilesAr = updateFunction.updateFile.split('.'),
				uploadfiles = uploadfilesAr[uploadfilesAr.length - 1];
			if(uploadfiles !== 'xls' && uploadfiles !== 'xlsx'){
				ymPrompt.succeedInfo({
					message: '上传文件格式不正确',
					titleBar: false,
					width: 300,
					height: 220
				});
				return false
			}
		}else{
			ymPrompt.succeedInfo({
				message: '未选择任何文件',
				titleBar: false,
				width: 300,
				height: 220
			});
			return false
		}

		$(this).attr('disabled', 'disabled').val('上传中... ...');
		if(updateFunction.updateFile){
			$('#uploadFiles').ajaxSubmit({
				url: window.globalPath + '/exam/forExcel.html',
				dateType: 'json',
				type: 'post',
				async: false,
				success: function(res){
					var resData = JSON.parse(res);
					updateFunction.consoleRes(resData);
				}
			});
		}
	});

	updateFunction.$elements.$forExelCancel.on('click', function(){
		var html = '<div class="ym-inContent ym-inContent-warning">' +
			'<div class="content">' +
			'<h2>是否取消上传成绩？</h2>' +
			'</div></div>';
		ymPrompt.confirmInfo({
			message: html,
			width: 450,
			height: 260,
			handler: function(res){
				if(res === 'ok'){
					location.href = window.globalPath + '/exam/examlist';
				}
			}
		});
	});

	/* 全选 */
	$('.j-selectAll').bind('change', function(){
		var $this = $(this);
		var isAllCheck = $this.attr('checked');
		updateFunction.$elements.$tab.find('input[type=checkbox]').each(function(){
			var _$this = $(this);
			if(_$this.is(':checked')){
				if(!isAllCheck){
					_$this.removeAttr('checked');
				}
			}else{
				if(isAllCheck){
					_$this.attr('checked', 'checked');
				}
			}
		});
	});
	updateFunction.$elements.$tab.on('click', 'input[type=checkbox]', function(){
		if(updateFunction.$elements.$tab.find('input[type=checkbox]').length === updateFunction.$elements.$tab.find('input[type=checkbox]:checked').length){
			$('.j-selectAll').attr('checked', 'checked');
		}else{
			$('.j-selectAll').removeAttr('checked');
		}
	});

	/* 批量删除*/
	$('.j-batchDelete').bind('click', function(){
		var deleteAr = [], deleteStr = ''
		$('.m-transcriptUpdateFallback').find('input[type=checkbox].j-checkfordel').each(function(){
			var _$this = $(this);
			if(_$this.is(':checked')){
				deleteAr.push(_$this.val());
			}
		});
		if(deleteAr.length > 0){
			var html = '<div class="ym-inContent ym-inContent-warning oneline">' +
				'<h2>确认删除？</h2>' +
				'</div>';
			ymPrompt.confirmInfo({
				message: html,
				width: 450, height: 260,
				handler: function(res){
					if(res === 'ok'){
						var idsAr = [];
						updateFunction.$elements.$tab.find('input[type=checkbox]:checked').each(function(){
							idsAr.push($(this).val())
						});

						for(var i in idsAr){
							$('#checkwrap tr[data-id=' + parseInt(idsAr[i]) + ']').remove();
						}
					}
				}
			});
		}else{
			ymPrompt.succeedInfo({
				message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>未勾选任何学生</h2></div>',
				width: 260,
				height: 200,
				titleBar: false
			})
		}
	});

	$('.j-submitCkw').on('click', function(){
		$('#checkwrap tr').each(function(){
			var $thisTr = $(this), _index = $thisTr.index('#checkwrap tr');
			var singleObj = {}
			singleObj.num = $thisTr.find('.j-checkfordel').attr('data-num');
			singleObj.gradeName = $thisTr.find('.j-ckwgradename').val();
			singleObj.className = $thisTr.find('.j-ckwclassname').val();
			singleObj.stuno = $thisTr.find('.j-ckwstuno').val();
			singleObj.stuname = $thisTr.find('.j-ckwstuname').val();
			singleObj.score = $thisTr.find('.j-ckwscore').val();
			updateFunction.postData.push(singleObj);
		});
		var errorAr = []
		for(var i = 0, ilen = updateFunction.postData.length; i < ilen; i++){
			if(isNaN(updateFunction.postData[i].score) || updateFunction.postData[i].score < 0){
				errorAr.push('成绩只能为数字，且必须大于等于0')
				break
			}
		}
		if(errorAr.length > 0){
			ymPrompt.alert({
				message: '<div class="ym-inContent ym-inContent-warning oneline"><h2>' + errorAr.join() + '</h2></div>',
				width: 420,
				height: 200,
				titleBar: false
			});
		}else{
			var postObj = {scorelist: updateFunction.postData};
			var postObjStr = JSON.stringify(postObj)
			$.ajax({
				url: window.globalPath + '/exam/saveBatch',
				type: 'POST',
				dataType: 'json',
				data: "scoreList=" + postObjStr,
				success: function(resData){
					updateFunction.consoleRes(resData);
				}
			});
		}
	});
	/*取消*/
	$('.j-cancelCkw').on('click', function(){
		ymPrompt.confirmInfo({
			message: '是否取消编辑考试成绩?',
			width: 360,
			height: 200,
			titleBar: false,
			handler: function(res){
				if(res === 'ok'){
					location.href = window.globalPath + '/score/list?examId=' + examId
				}
			}
		});
	});

});