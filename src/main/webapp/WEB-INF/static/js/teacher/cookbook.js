/**
 * Document by wangshuyan@chinamobile.com on 2015/12/11 0011.
 */
require.config({
	paths: {
		'jquery': '../lib/jquery-1.8.3.min',
		'base': '../common/baseTeacher',
		'function': '../common/function',
		'mypannel': '../common/teacherSideBar',
		'ymPrompt': '../plug/ymPrompt/ymPrompt'
	},
	shim: {
		'base': {deps: ['jquery']},
		'function': {deps: ['jquery']},
		'ymPrompt': {deps: ['jquery']},
		'mypannel': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'base', 'ymPrompt', 'mypannel'], function(jquery){

	var TODAY = new Date();

	var $elements = {
		$textareaWrap: $('.m-recipestcontent'),
		$selectYear: $('.j-selectyear'),
		$selectMonth: $('.j-selectmonth'),
		$currentYear: $('.j-currentyear'),
		$currentMonth: $('.j-currentmonth'),
		$currentWeek: $('.j-currentweek'),
		$calculateWrap: $('.g-calendarWrap'),
		$dataWrap: $('#tab'),
		$content: $('.j-contentWrap'),
		$submit: $('.j-submit')
	}



	var recipest = {
		postData: {},
		weekNames: ['一 ', '二', '三', '四', '五', '六', '日'],
		tempData: {breakfast: [0, 0, 0, 0, 0, 0, 0], lunch: [0, 0, 0, 0, 0, 0], dinner: [0, 0, 0, 0, 0, 0, 0]},
		getData: function(_f, _t){
			var _self = this;
			var f = new Date(_f),
				t = new Date(_t),
				_from = f.getFullYear() + '-' + ((f.getMonth() + 1) < 10 ? '0' + (f.getMonth() + 1) : (f.getMonth() + 1)) + '-' + (f.getDate() < 10 ? '0' + f.getDate() : f.getDate()),
				_to = t.getFullYear() + '-' + ((t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : (t.getMonth() + 1)) + '-' + (t.getDate() < 10 ? '0' + t.getDate() : t.getDate());


			$.ajax({
				url: window.globalPath + '/recipess/day',
				type: 'POST',
				dataType: 'json',
				data: {from: _from, to: _to},
				success: function(res){
					if(res && res.result === true){
						_self.renderData(res.recipes || []);
					}else{
						alert('未能成功获取食谱数据')
					}
				}
			});
		},
		renderData: function(data){
			var _self = this;
			/* 按星期排序 */
			data.sort(function(v1, v2){
				return (+v1.num) - (+v2.num);
			});
			var recipestcontent = ''
			for(var i = 0, ilen = 7; i < ilen; i++){
				var dataSingle = data[i];
				recipestcontent += '<li data-id="' + (dataSingle && dataSingle.id || '') + '"><div class="header">周' + _self.weekNames[i] + '</div><div class="recipescnt"><textarea readonly="readonly" class="readonly">' + (dataSingle && dataSingle.breakfast || '') + '</textarea></div><div class="recipescnt"><textarea readonly="readonly" class="readonly">' + (dataSingle && dataSingle.lunch || '') + '</textarea></div><div class="recipescnt"><textarea readonly="readonly" class="readonly">' + (dataSingle && dataSingle.dinner || '') + '</textarea></div></li> ';
			}
			$('.m-recipestcontent').html(recipestcontent);
			document.querySelector('.j-submit').setAttribute('data-default', false);
			document.querySelector('.j-submit').innerHTML = '编辑食谱'
		},
		save: function(){
			var _self = this;
			var $list = $elements.$textareaWrap.children('li');
			/*_self.postData.recipes = [];*/
			var datahtml = '['
			var days = weedCom.days();
			for(var i = 0, ilen = $list.length; i < ilen; i++){
				datahtml += '{'
				var recipestSingle = $list.eq(i);
				(function(i){
					//var o={num:i+1};
					//recipestSingle.attr('data-id') && (o.id = recipestSingle.attr('data-id'));
					//var daySingle = new Date(days[i])
					//var $textarea = recipestSingle.find('textarea');
					//o.breakfast = $textarea.eq(0).val() || '';
					//o.lunch = $textarea.eq(1).val() || '';
					//o.dinner = $textarea.eq(2).val() || '';
					//o.timestr = daySingle.getFullYear() + '-' + ((daySingle.getMonth() + 1) < 10 ? '0' + (daySingle.getMonth() + 1) : (daySingle.getMonth() + 1)) + '-' + (daySingle.getDate() < 10 ? '0' + daySingle.getDate() : daySingle.getDate());
					//_self.postData.recipes.push(o);
					datahtml += ' "num":' + (i + 1) + ',';
					recipestSingle.attr('data-id') && (datahtml += '"id":' + recipestSingle.attr('data-id') + ',');
					var daySingle = new Date(days[i])
					var $textarea = recipestSingle.find('textarea');

					datahtml += '"breakfast":"' + ($textarea.eq(0).val() || '' ) + '",';
					datahtml += '"lunch":"' + ( $textarea.eq(1).val() || '') + '",';
					datahtml += '"dinner":"' + ($textarea.eq(2).val() || '') + '",';
					datahtml += '"timestr":"' + (daySingle.getFullYear() + '-' + ((daySingle.getMonth() + 1) < 10 ? '0' + (daySingle.getMonth() + 1) : (daySingle.getMonth() + 1)) + '-' + (daySingle.getDate() < 10 ? '0' + daySingle.getDate() : daySingle.getDate())) + '"';
					datahtml += '},'
				})(i);
			}
			datahtml += '0]'
			$.ajax({
				url: window.globalPath + '/recipess/save',
				type: 'POST',
				dataType: 'json',
				data: 'recipes=' + datahtml,
				success: function(res){
					if(res.result == true){
						$elements.$textareaWrap.find('textarea').removeClass('edit').attr('readonly', 'readonly');
						$elements.$submit.attr('data-default', 'false');
						$elements.$submit.html('编辑食谱');
					}else{
						ymPrompt.alert({
							message: ' <div class="ym-inContent ym-inContent-warning"><h2>修改失败！</h2><p> ' + res.msg + '</p></div>',
							titleBar: false
						})
					}
				}
			});
		}
	}

	var renderCalendar = (function(){
		var currentMonth = TODAY.getMonth() + 1,
			currentYear = TODAY.getFullYear(),
			currentDay = TODAY.getDate(),
			dfY = TODAY.getFullYear(),
			dfM = TODAY.getMonth() + 1,
			dfD = TODAY.getDate();

		/* 计算月天数 */
		function calculateMDays(year, month){
			var FebDays = (year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0) ? 29 : 28, mDays;
			/* 正常月长度 */
			switch(parseInt(month)){
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				mDays = 31;
				break;
			case 2:
				mDays = FebDays;
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				mDays = 30;
				break;
			}
			return mDays;
		}

		function siblingsMonth(year, month){
			var prevY, prevM, nextY, nextM;
			/*  常规  */
			prevM = month - 1;
			prevY = year;
			nextM = month + 1;
			nextY = year;
			/* 特殊计算覆盖 */
			if(month == 1){
				prevM = 12;
				prevY = year - 1;
			}
			if(month == 12){
				nextM = 1;
				nextY = year + 1
			}
			return {
				prevY: prevY, prevM: prevM, nextY: nextY, nextM: nextM
			}
		}

		return {
			render: function(year, month, monday){
				var normalDay = timeFunction.getTimes(year + '-' + month + '-' + '01').getDay(),
					firstDay = normalDay == 0 ? 7 : normalDay,
					mDays = calculateMDays(year, month),
					timeleave = (firstDay - 1 + mDays) % 7 === 0 ? 0 : 7 - (firstDay - 1 + mDays) % 7,
					fmDays = firstDay - 1 + mDays + timeleave;
				/* 定义前后日期 */
				var _ft = 0;
				var sibling = siblingsMonth(year, month),
					prevDateDays = calculateMDays(sibling.prevY, sibling.prevM),
					nextDateDays = calculateMDays(sibling.nextY, sibling.nextM);

				var trHtml = '<tr>';
				var _year = year, _month = month;
				for(var i = 1; i <= fmDays; i++){
					var tempDate = 0, isgray = '';
					if(i < firstDay){
						_year = sibling.prevY;
						_month = sibling.prevM
						tempDate = parseInt(prevDateDays - firstDay + 1 + i);
						( _ft > 0 && _ft < 7) ? (isgray = 'current', _ft++) : isgray = 'gray';
					}else if(i > (firstDay - 1 + mDays)){
						_year = sibling.nextY;
						_month = sibling.nextM
						tempDate = parseInt(i - mDays - firstDay + 1);
						( _ft > 0 && _ft < 7) ? (isgray = 'current', _ft++) : isgray = 'gray';
					}else{
						_year = year;
						_month = month;
						tempDate = parseInt(i - firstDay + 1);
						if(tempDate == monday || _ft > 0 && _ft < 7){
							isgray = 'current';
							_ft++;
						}
					}
					_year = +_year < 10 ? '0' + (+_year) : _year;
					_month = +_month < 10 ? '0' + (+_month) : _month;
					var _tempDate = tempDate < 10 ? '0' + tempDate : tempDate;
					trHtml += '<td><a href="javascript:void(0)" data-value="' + _year + '-' + _month + '-' + _tempDate + '" class="' + isgray + ' j-calday">' + tempDate + '</a></td>';
					if(i % 7 === 0 && i !== 1 && i !== fmDays){
						trHtml += '</tr><tr>'
					}
					if(i === fmDays){
						trHtml += '</tr>';
					}
				}
				$elements.$dataWrap.html(trHtml);
			},
			siblingsMonth: siblingsMonth,
			calculateMDays: calculateMDays
		}
	})();

	var weedCom = (function(){
		var _oneday = 86400000,
			_oneweek = 604800000,
			_m = function(m){
				m++;
				return m < 10 ? '0' + m : m
			}, _d = function(m){
				return m < 10 ? '0' + m : m
			};
		var o = {
			days: function(){
				var _self = this, ar = [];
				for(var i = 0; i < 7; i++){
					ar.push(_self.currentweek.from + _oneday * i);
				}
				return ar;
			},
			currentweek: {
				from: 0,
				to: 0
			},
			nextweek: function(){
				this.currentweek.from += _oneweek;
				this.currentweek.to += _oneweek;
				return this;
			},
			prevweek: function(){
				this.currentweek.from -= _oneweek;
				this.currentweek.to -= _oneweek;
				return this;
			},
			renderWeek: function(){
				var _from = new Date(this.currentweek.from), _to = new Date(this.currentweek.to);
				$elements.$currentWeek.val(_from.getFullYear() + '年 ' + _m(_from.getMonth()) + '月 ' + _d(_from.getDate()) + '日 -- ' + _to.getFullYear() + '年 ' + _m(_to.getMonth()) + '月 ' + _d(_to.getDate()) + '日');
				recipest.getData(this.currentweek.from, this.currentweek.to);
			},
			openCalendar: function(){
				var _from = new Date(this.currentweek.from), _to = new Date(this.currentweek.to);
				$elements.$currentYear.val(_from.getFullYear())
				$elements.$currentMonth.val(_m(_from.getMonth()))
				renderCalendar.render(_from.getFullYear(), _from.getMonth() + 1, _from.getDate());
				$elements.$calculateWrap.show();
			},
			getCurrentWeek: function(day){
				var _thisweek = day.getDay() == 0 ? 7 : day.getDay(),
					from = day.getTime() - (_thisweek - 1) * _oneday,
					to = day.getTime() + (7 - _thisweek ) * _oneday,
					_from = new Date(from),
					_to = new Date(to);
				this.currentweek.from = from;
				this.currentweek.to = to;
				$elements.$currentWeek.val(_from.getFullYear() + '年 ' + _m(_from.getMonth()) + '月 ' + _d(_from.getDate()) + '日 -- ' + _to.getFullYear() + '年 ' + _m(_to.getMonth()) + '月 ' + _d(_to.getDate()) + '日');
				recipest.getData(from, to);
			}
		}
		o.getCurrentWeek(TODAY);
		//var _from = new Date(this.currentweek.from), _to = new Date(this.currentweek.to);
		//$elements.$currentWeek.val(_from.getFullYear() + '年 ' + _m(_from.getMonth()) + '月 ' + _d(_from.getDate()) + '日 -- ' + _to.getFullYear() + '年 ' + _m(_to.getMonth()) + '月 ' + _d(_to.getDate()) + '日');
		return o;
	})();

	//事件集合
	$elements.$currentWeek.on('click', function(event){
		//拒绝冒泡
		var _e = event || window.event;
		if(_e.stopPropagation){
			_e.stopPropagation()
		}else{
			_e.cancelBubble = true;
		}
		weedCom.openCalendar();
	});

	$elements.$calculateWrap.delegate('a', 'click', function(event){
		var _e = event || window.event, _target = _e.target || _e.srcElement;
		if(_e.stopPropagation){
			_e.stopPropagation()
		}else{
			_e.cancelBubble = true;
		}
		var $this = $(_target);
		if($this.hasClass('y-prev')){
			$elements.$currentYear.val(+$elements.$currentYear.val() < 1970 ? 1970 : +$elements.$currentYear.val() - 1);
			renderCalendar.render(+$elements.$currentYear.val(), +$elements.$currentMonth.val());
		}
		if($this.hasClass('y-next')){
			$elements.$currentYear.val(+$elements.$currentYear.val() > 3000 ? 3000 : +$elements.$currentYear.val() + 1);
			renderCalendar.render(+$elements.$currentYear.val(), +$elements.$currentMonth.val());
		}

		if($this.hasClass('m-prev')){
			$elements.$currentMonth.val(+$elements.$currentMonth.val() <= 1 ? '01' : +$elements.$currentMonth.val() - 1);
			renderCalendar.render(+$elements.$currentYear.val(), +$elements.$currentMonth.val());
		}
		if($this.hasClass('m-next')){
			$elements.$currentMonth.val(+$elements.$currentMonth.val() >= 12 ? 12 : (+$elements.$currentMonth.val() + 1) < 10 ? '0' + (+$elements.$currentMonth.val() + 1) : +$elements.$currentMonth.val() + 1);
			renderCalendar.render(+$elements.$currentYear.val(), +$elements.$currentMonth.val());
		}
		if($this.hasClass('j-calday')){
			var _date = $this.attr('data-value');
			weedCom.getCurrentWeek(timeFunction.getTimes(_date));
			$elements.$calculateWrap.hide();
		}

	});


	$('.m-selectweek').delegate('a.toggle', 'click', function(event){
		var _e = event || window.event;
		if(_e.stopPropagation){
			_e.stopPropagation()
		}else{
			_e.cancelBubble = true;
		}
		weedCom[this.getAttribute('data-default')]().renderWeek();
		//weedCom.openCalendar();
		$elements.$calculateWrap.hide();
	});

	$(document).on('click', function(){
		$elements.$calculateWrap.hide();
	});


	if(window.couldEdit === '1'){
		$elements.$submit.on('click', function(){
			var _default = this.getAttribute('data-default');
			if(_default === 'false'){
				$elements.$textareaWrap.find('textarea').addClass('edit').removeAttr('readonly');
				this.setAttribute('data-default', true);
				this.innerHTML = '保存食谱'
			}else{
				this.setAttribute('data-default', 'empty');
				this.innerHTML = '保存中... ...'
				recipest.save();
			}
		});
	}

	$elements.$textareaWrap.delegate('textarea.edit', 'blur', function(){
		var $this = $(this), _val = $this.val();
		$this.val(_val !== '' ? (_val.length > 100 ? _val.substring(0, 100) : _val) : '');
	});

});