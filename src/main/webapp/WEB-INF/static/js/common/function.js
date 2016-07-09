/**
 * Document by wangshuyan@chinamobile.com on 2015/11/3.
 */

/* IE8 不知此indexOf方法的解决办法 */
if(!Array.prototype.indexOf){
	Array.prototype.indexOf = function(elt /*, from*/){
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if(from < 0)
			from += len;
		for(; from < len; from++){
			if(from in this &&
				this[from] === elt)
				return from;
		}
		return -1;
	}
}

/* 获取浏览器类型 */
function getOs(){
	var OsObject = "";
	if(isIE = navigator.userAgent.indexOf("MSIE") != -1){
		return "MSIE";
	}
	if(isFirefox = navigator.userAgent.indexOf("Firefox") != -1){
		return "Firefox";
	}
	if(isChrome = navigator.userAgent.indexOf("Chrome") != -1){
		return "Chrome";
	}
	if(isSafari = navigator.userAgent.indexOf("Safari") != -1){
		return "Safari";
	}
	if(isOpera = navigator.userAgent.indexOf("Opera") != -1){
		return "Opera";
	}
}
/* 解除IE下的$.ajax数据缓存 */
if(!-[1,] || !!window.ActiveXObject || "ActiveXObject" in window || getOs() === 'MSIE'){
	$.ajaxSetup({cache: false});
}


if(navigator.appName == 'Microsoft Internet Explorer' && navigator.userAgent.indexOf('MSIE 8') >= 0 || navigator.userAgent.indexOf('MSIE 7') >= 0 || navigator.userAgent.indexOf('MSIE 6') >= 0){
	$('body').prepend('<div class="s-browerChange">hi,您当前的浏览器版本过低，部分功能体验不佳设置不可用，并且存在安全风险，建议升级浏览器 <a href="https://www.google.cn/intl/zh-CN/chrome/browser/desktop/" target="_blank">chrome浏览器</a>或 <a href="http://windows.microsoft.com/zh-cn/internet-explorer/ie-9-worldwide-languages" target="_blank">IE9+浏览器</a></div>');
}

/* 验证组件与方法 */
var checkUtil = {
	isEmpty: function(val){
		return (val === '')
	},
	checkPhoneNumber: function(number){
		return (number.match(/^13\d{9}$|^14\d{9}$|^15\d{9}$|^18\d{9}$|^17\d{9}$|^16\d{9}$/));
	},
	checkSpecialChar: function(str){
		var _spStrRegExp = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]", "g");
		return (_spStrRegExp.test(str));
	},
	checkCharSize: function(str, m, n){
		var _len = str.length;
		return _len >= m && _len <= n;
	},
	checkMailFormat: function(emailStr){
		return emailStr.match(/^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/);
	},
	checkTelphoneFormat: function(number){
		return number.match(/^0\d{2,3}-?\d{7,8}$/);
	},
	checkPasswordFormat: function(password){
		return password.match(/[\w.,~!@#$%^&*()+]{6,12}/);
	},
	checkNameFormat: function(name){
		return name.match(/^[\u4e00-\u9fa5A-Za-z0-9-_]*$/);
	},
	checkCardNumber: function(number){
		return number.match(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/);
	},
	hasProperty: function(obj){
		var ar = [];
		for(var i in obj){
			if(obj.hasOwnProperty(i)){
				ar.push(i);
			}
		}
		if(ar.length > 0){
			return ar;
		}else{
			return false
		}
	},
	isRepeatAjax: function(url, val, fn){
		var result;
		$.ajax({
			url: url,
			data: val,
			dataType: "json",
			type: "POST",
			async: false,
			success: function(resData){
				result = resData.result;
			}
		});
		return result;
	}
};

/* 下拉框组件  */
function SelectUi($ele){
	this.$e = $ele;
	this.$list = this.$e.children('ul.optionwarp');
	this.$ipt = this.$e.children('input.intoval');
	this.$text = this.$e.children('input.intotext');
}
SelectUi.prototype.init = function(_val, _text, fn){
	this.$e.find('.intoval').val(_val);
	var text = _text || this.$e.find('li[data-value=' + _val + ']').html();
	this.$e.find('.intotext').val(text);
	if(fn){
		fn(_val, text);
	}
};

SelectUi.prototype.reset = function(val){
	var _val, _text;
	if(val){
		_val = val;
		_text = this.$e.find('li[data-value=' + _val + ']').html();
	}else{
		_val = '';
		_text = '';
	}
	this.$e.find('.intotext').val(_text);
	this.$e.find('.intoval').val(_val);
};

SelectUi.prototype.bindE = function(callback){
	var _self = this;

	_self.$text.on({
		'focus': function(){//focus 是为了让所有下拉框都消失

			//其他相关关闭
			$('.m-courseWrap').length > 0 && $('.m-courseWrap').hide();

			$('ul.optionwarp').hide();


			$('.m-selectui').removeClass('active');
		},
		'click': function(event){ // 点击后 让当前的下拉框显示出来
			var _ev = event || window.event;
			if(_ev.stopPropagation){
				_ev.stopPropagation();
			}else{
				_ev.cancelBubble = true;
			}
			var $this = _self.$e;
			if($this.is('.active')){
				_self.$list.hide();
				$this.removeClass('active');
			}else{
				_self.$list.show();
				$this.addClass('active')
			}
		}

	});

	_self.$list.delegate('li', 'click', function(event){
		var _ev = event || window.event;
		if(_ev.stopPropagation){
			_ev.stopPropagation();
		}else{
			_ev.cancelBubble = true;
		}
		var $target = $(this), _val = $target.attr('data-value'), _text = $target.html(), _defaultValue = _self.$ipt.val();
		_self.$ipt.val(_val);
		_self.$text.val(_text);
		_self.$list.hide();
		_self.$e.removeClass('active');
		if(callback && _defaultValue !== _val){
			callback(_val, _text);
		}
	})

	function slideUpList(){
		_self.$list.hide();
		_self.$e.removeClass('active');
	}

	$(document).bind('click', slideUpList);
};

/*  输入计数 */
function CountInput($_ipt){
	this.$ipt = $_ipt;
	this.frequency = 200;
}
CountInput.prototype.bindE = function(showFn){
	var _self = this,
		timeReader = null;
	showFn(_self.$ipt.val().length);
	var readerFn = (function readerCallee(){
		showFn(_self.$ipt.val().length);
		timeReader = setTimeout(readerCallee, _self.frequency);
	});

	_self.$ipt.bind({
		'focus': readerFn,
		'blur': function(){
			clearTimeout(timeReader);
		}
	});
};
CountInput.prototype.init = function(options){
	var _self = this;
	_self.frequency = (options && !!options.frequency) ? options.frequency : _self.frequency;
	_self.showFn = (options && !!options.callback) ? options.callback : function(){
	};

	var _vlen = _self.$ipt.val().length;
	_self.bindE(_self.showFn);
};



/* 单选 & 多选 控件 */
function ChooseIpt($ele){
	this.$ele = $ele;
	this.data = [];
	this.temData = {isFigure: false, value: ''};
	this.defaultParameter = {
		hasChosed: '',
		choseType: 'checkbox',
		initCallback: null,
		bindECallback: null
	};
	this.isBindE = false;
}
/*
 * _hasChosed 必须是字符串，或者以英文逗号隔开的字符串
 * _choseType 字符串checkbox || radio
 */
ChooseIpt.prototype.init = function(parameter){
	var _self = this;
	if(parameter){
		( typeof  parameter.hasChosed !== 'undefined') && (_self.defaultParameter.hasChosed = parameter.hasChosed);
		( typeof  parameter.choseType !== 'undefined') && (_self.defaultParameter.choseType = parameter.choseType);
		( typeof  parameter.initCallback !== 'undefined') && (_self.defaultParameter.initCallback = parameter.initCallback);
		( typeof  parameter.bindECallback !== 'undefined') && (_self.defaultParameter.bindECallback = parameter.bindECallback);
	}
	_self.data = _self.defaultParameter.choseType == 'checkbox' ? [] : '';
	this.defaultParameter = _self.defaultParameter;
	var $a = this.$ele.find('a:not(.all)');
	this.$ele.find('a').removeClass('figure');
	if(_self.defaultParameter.hasChosed && _self.defaultParameter.hasChosed.length > 0){
		/* 参数转换成 数组 */
		var hasChosedAr;
		if(_self.defaultParameter.hasChosed.indexOf(',') >= 0){
			hasChosedAr = _self.defaultParameter.hasChosed.split(',');
		}else{
			hasChosedAr = [];
			hasChosedAr.push(_self.defaultParameter.hasChosed);
		}
		if(_self.defaultParameter.choseType == 'checkbox'){
			_self.data = hasChosedAr
		}else{
			_self.data = hasChosedAr[0];
		}
		/* 循环数组，设置已选*/
		for(var i = 0, len = hasChosedAr.length; i < len; i++){
			$a.each(function(){
				var $this = $(this), _valIndex = $this.attr('data-value');
				if(_valIndex == hasChosedAr[i]){
					$this.addClass('figure');
				}
			});

			/* 如果是全选 */
			if($a.length == hasChosedAr.length){
				this.$ele.find('a.all').addClass('figure');
			}
		}
	}
	if(_self.defaultParameter.initCallback){
		_self.defaultParameter.initCallback();
	}
	if(!this.isBindE){
		this.bindE(_self.defaultParameter.bindECallback);
		this.isBindE = true;
	}
}


ChooseIpt.prototype.reset = function(){
	var _self = this;
	_self.data = _self.defaultParameter.choseType == 'checkbox' ? [] : '';
	this.$ele.find('a').removeClass('figure');
};

/* 字符串或数组 */
ChooseIpt.prototype.renderDisabled = function(disableddata){
	var _type = typeof disableddata, disabledDataAr, $a = this.$ele.find('a');
	if(_type === 'string' && disableddata !== ''){
		if(disableddata.indexOf(',') >= 0){
			disabledDataAr = disableddata.split(',');
		}else{
			disabledDataAr = [];
			disabledDataAr.push(disableddata);
		}
	}else if(_type === 'array' && disableddata.length > 0){
		disabledDataAr = disableddata;
	}
	for(var disabledi = 0, disabledlen = disabledDataAr.length; disabledi < disabledlen; disabledi++){
		$a.each(function(){
			var $this = $(this);
			if($this.attr('data-value') == disabledDataAr[disabledi]){
				$this.addClass('disabled')
			}
		})
	}
};

ChooseIpt.prototype.bindE = function(callback){
	var _self = this;

	function isAll(){
		if(_self.$ele.find('a:not(.all)').length > _self.data.length){
			_self.$ele.find('a.all').removeClass('figure')
		}else{
			_self.$ele.find('a.all').addClass('figure')
		}
	}

	_self.$ele.delegate('a:not(.disabled)', 'click', function(){
		var $this = $(this), _$val = $this.attr('data-value'), _$vindex = _self.data.indexOf(_$val);
		var $sibilings = null;
		if(_self.defaultParameter.choseType === 'checkbox'){
			/* **多选** */
			if($this.is('.figure')){//取消
				/*全选*/
				if($this.is('.all')){
					/* 遍历选中*/
					$sibilings = $this.siblings('a');
					$sibilings.each(function(){
						var _$this = $(this), _val = _$this.attr('data-value'), _vindex = _self.data.indexOf(_val);
						if((_vindex >= 0) && _$this.is('.figure')){
							_$this.removeClass('figure');
							_self.data.splice(_vindex, 1);
						}
					});
					$this.removeClass('figure');
				}else{
					$this.removeClass('figure');
					if(_$vindex >= 0){
						_self.data.splice(_$vindex, 1);
					}
					_self.$ele.find('a.all').removeClass('figure');
				}
				_self.temData.isFigure = false;
			}else{//选中
				if($this.is('.all')){
					/* 遍历选中*/
					$sibilings = $this.siblings('a');
					$sibilings.each(function(){
						var _$this = $(this), _val = _$this.attr('data-value'), _vindex = _self.data.indexOf(_val);
						if(_vindex < 0 && !_$this.is('.figure')){
							_$this.addClass('figure');
							_self.data.push(_val);
						}
					});
					$this.addClass('figure');
				}else{
					$this.addClass('figure');
					if(_$vindex < 0){
						_self.data.push(_$val);
					}
					isAll();
					_self.temData.isFigure = true;
					_self.temData.value = _$val
				}
			}
		}else if(_self.defaultParameter.choseType === 'radio'){
			/* **单选** */
			if(!$this.is('.figure') && !$this.is('.all')){//取消
				_self.data = _$val;
				$this.siblings('a').removeClass('figure');
				$this.addClass('figure');
			}
		}

		if(callback){
			callback(_self.data);
		}
	});
};


/* 获取url参数 */
function getUrlQuery(name){
	var searcheAr = location.search.substr(1).split('&');
	var searchObj = {};
	for(var i = 0, len = searcheAr.length; i < len; i++){
		var searchElement = searcheAr[i];
		if(typeof  searchElement === 'string'){
			if(typeof searchElement !== 'undefined'){
				if(searchElement.indexOf('=') >= 0){
					var propertyElement = searchElement.split('=');
					searchObj[propertyElement[0]] = unescape(propertyElement[1]);
				}else{
					searchObj[searchElement] = true;
				}
			}
		}
	}
	if(typeof searchObj[name] !== 'undefined'){
		return searchObj[name];
	}else{
		return false;
	}
}

/* 图片浏览 */
function ImgFloatCompane(){
	this.isBindE = true;
}

ImgFloatCompane.prototype.init = function(initObj){
	var _self = this;
	/*  获取触点 */
	_self.dataLength = initObj.dataLength;
	_self.container = $(initObj.container);
	_self.imgwidth = initObj.imgwidth;
	_self.currentIndex = initObj.currentIndex;
	_self.leftCtl = initObj.leftCtrl;
	_self.rightCtrl = initObj.rightCtrl;
	_self.content = $(initObj.imgwrap);
	_self.mask = $(initObj.mask);
	/* 获取数据 */

	/* 初始化位置 */
	_self.content.css('left', _self.imgwidth * (-1) * _self.currentIndex + 'px');
	/* 绑定事件 */
	if(_self.isBindE){
		_self.bindE();
		_self.isBindE = false;
	}
};

ImgFloatCompane.prototype.showImg = function(currentIndex){
	var _self = this;
	_self.currentIndex = currentIndex;
	_self.content.css('left', _self.imgwidth * (-1) * _self.currentIndex + 'px');
	_self.mask.fadeIn(150);
	_self.container.fadeIn(150);

	var currentImg = _self.content.find('img').eq(_self.currentIndex).attr('src');
	_self.container.find('.download').attr('href', currentImg);
	_self.container.find('.j-floatimgnum').html((_self.currentIndex + 1) + '/' + _self.dataLength);

};
ImgFloatCompane.prototype.closeWin = function(){
	var _self = this;
	_self.mask.fadeOut(150);
	_self.container.fadeOut(150);
	setTimeout(function(){
		_self.content.removeAttr('style');
	}, 150);

};
ImgFloatCompane.prototype.bindE = function(){
	var _self = this;
	_self.container.bind({
		'click': function(event){
			var e = event || window.event,
				$e = $(e.target || e.srcElement);
			/* 左右联动 */
			if($e.hasClass('aleft') || $e.hasClass('aright') || $e.is('img') || $e.is('a')){
				if($e.hasClass('aright')){
					if(_self.currentIndex < _self.dataLength - 1){
						_self.currentIndex++;
					}else{
						_self.currentIndex = 0;
					}
				}else if($e.hasClass('aleft')){
					if(_self.currentIndex <= 0){
						_self.currentIndex = _self.dataLength - 1;
					}else{
						_self.currentIndex--
					}
				}
				_self.content.css('left', _self.imgwidth * (-1) * _self.currentIndex + 'px');
				_self.container.find('.j-floatimgnum').html((_self.currentIndex + 1) + '/' + _self.dataLength);
			}else{
				_self.closeWin();
			}
			/* 关闭*/
			if($e.hasClass('closeWin')){
				_self.closeWin();
			}

			var currentImg = _self.content.find('img').eq(_self.currentIndex).attr('src');
			_self.container.find('.download').attr('href', currentImg)
		}
	});

	_self.mask.on('click', function(){
		_self.closeWin();
	})

};

/*  教师web端 公告  考试等弹窗问题 代理模式  */

function SelectRecipient(initObj){
	this.$triggerEle = initObj.triggerEle;
	this.$mask = initObj.mask;
	this.$selectRecipientWrap = initObj.selectRecipientWrap;
	this.selectRecipientContent = initObj.selectRecipientContent;
	this.$closeRecipient = initObj.closeRecipient
	this.data = [];
}

SelectRecipient.prototype.init = function(resCall){
	var _self = this;
	if(resCall){
		resCall(_self);
	}
}

SelectRecipient.prototype.closeClassGroup = function(){
	var _self = this;
	_self.$mask.fadeOut(200);
	_self.$selectRecipientWrap.fadeOut(200);
}
SelectRecipient.prototype.showClassGroup = function(){
	var _self = this;
	_self.$mask.fadeIn(200);
	_self.$selectRecipientWrap.fadeIn(200);
}

SelectRecipient.prototype.bindE = function(insideBind){
	var _self = this;

	_self.$triggerEle.bind('click', function(){
		_self.showClassGroup();
	});
	_self.$closeRecipient.bind('click', function(){
		_self.closeClassGroup();
	});
	if(insideBind){
		insideBind(_self);
	}
}


var timeFunction = {
	getTimes: function(time){
		if(isNaN(new Date(time))){
			var timeAr1 = time.split(' ');
			var ymd = timeAr1[0].split('-');
			var hms = null;
			if(timeAr1[1] !== undefined){
				hms = timeAr1[1].split(':');
			}else{
				hms = [0, 0, 0]
			}
			return new Date(+ymd[0], parseInt(ymd[1]) - 1, +ymd[2], +hms[0] || 0, +hms[1] || 0, +hms[2] || 0);
		}else{
			return new Date(time);
		}
	}
}
//检测是否支持HTML5
function checkVideo(){
	if(!!document.createElement('video').canPlayType){
		var vidTest = document.createElement("video");
		oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
		if(!oggTest){
			h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
			if(!h264Test){
				return false;
			}
			else{
				if(h264Test == "probably"){
					return true;
				}
				else{
					return false;
				}
			}
		}
		else{
			if(oggTest == "probably"){
				return true;
			}
			else{
				return false;
			}
		}
	}
	else{
		return false;
	}
}
/* 常量 */
var gradeCategory = [
	{schoolType: '幼儿园', gradeList: ['小小班', '小班', '中班', '大班']},
	{schoolType: '6年制小学', gradeList: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']},
	{schoolType: '5年制小学', gradeList: ['一年级', '二年级', '三年级', '四年级', '五年级']},
	{schoolType: '初级中学(3年)', gradeList: ['七年级', '八年级', '九年级']},
	{schoolType: '初级中学(4年)', gradeList: ['六年级', '七年级', '八年级', '九年级']},
	{schoolType: '高级中学(3年)', gradeList: ['高一', '高二', '高三']},
	{schoolType: '完全中学(3+3)', gradeList: ['七年级', '八年级', '九年级', '高一', '高二', '高三']},
	{schoolType: '完全中学(4+3)', gradeList: ['	六年级', '七年级', '八年级', '九年级', '高一', '高二', '高三']},
	{schoolType: '一贯制学校(6+3)', gradeList: ['	一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级']},
	{schoolType: '一贯制学校(5+4)', gradeList: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级']},
	{schoolType: '幼儿园+小学', gradeList: ['	小小班', '小班', '中班', '大班', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级']},
	{schoolType: '全年级学校(6+3+3)', gradeList: ['	一年级', '二年级', '三年级', '四年级', '五年级', '六年级']},
	{schoolType: '12年级学校', gradeList: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高一', '高二', '高三']}
];