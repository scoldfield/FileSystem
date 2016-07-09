/**
 * Document by wangshuyan@chinamobile.com on 2015/12/21 0021.
 */
require.config({
	paths: {
		'jquery': 'lib/jquery-1.8.3.min',
		'function': 'common/function',
		'Md5': 'lib/jQuery.md5'
	},
	shim: {
		'Md5': {deps: ['jquery']},
		'function': {deps: ['jquery']}
	},
	waitSeconds: 0
});
require(['jquery', 'function', 'Md5'], function(){

	var isGetUser = getUrlQuery('getUser');


	if(isGetUser){
		$('.j-getType').html('用户名');
	}

	/* 找回密码 */
	var getPwBiv = {
		$ipt: $('.j-ipt'), //所有输入框；
		$checkPhone: $('.j-checkPhone'), // 验证手机号码
		$checkCode: $('.j-checkCode'), // 验证验证码输入框
		$submitcheck: $('.j-submitcheck'), //下一步
		$submitSetNewPW: $($('.j-submitSetPw')), // 发送设置的密码
		$sectionSetCheck: $('.j-SectionGetCheck'), // 发送验证码区域
		$sectionChoseType: $('.j-SectionChoseType'), // 设置角色区域
		$sectionSetPw: $('.j-SectionSetPw'), //设置密码区域
		$sectionSuccess: $('.j-SectionSuccess'),
		$userType: $('.j-typelinks'),
		$errotips: $('.j-errotips'),
		$erroinf: $('.j-erroinf'),
		$getSecurityCode: $('.j-getSecurityCode'),
		$scdcount: $('.scdcount-p'),
		$sectionGetCheck: $('.j-SectionGetCheck'),

		userType: '',
		mobile: '',
		code: '',
	};


	/* 报错提示事件 */
	getPwBiv.showIptErro = function(inf, t, l){
		this.$errotips.html(inf).css({'left': l, top: t}).show();
	};
	getPwBiv.hideIptErro = function(){
		this.$errotips.empty().hide();
	};

	getPwBiv.setUserType = function(){
		var _self = this;
		getPwBiv.$sectionGetCheck.hide();
		getPwBiv.$sectionChoseType.hide();
		getPwBiv.$sectionSuccess.hide();
		if(isGetUser){
			_self.getUserName();
		}else{
			getPwBiv.$sectionSetPw.show();
			$('.j-getMethod').html('重置');
		}
	}
	getPwBiv.getUserType = function(){
		getPwBiv.$sectionSetPw.hide();
		getPwBiv.$sectionGetCheck.hide();
		getPwBiv.$sectionSuccess.hide();
		getPwBiv.$sectionChoseType.show();
	}

	getPwBiv.successPrint = function(){
		getPwBiv.$sectionSetPw.hide();
		getPwBiv.$sectionGetCheck.hide();
		getPwBiv.$sectionChoseType.hide();
		getPwBiv.$sectionSuccess.show();
		if(isGetUser){
			$('.j-successInfotips').html(' 已将登录名发送至对应的手机号,请注意查收！');
		}
		var $green = $('.j-green');
		var s_timer = 5;
		(function sfn(){
			if(s_timer > 0){
				s_timer--;
				$green.text(s_timer);
				setTimeout(sfn, 1000)
			}else{
				location.href = window.globalPath + '/login';
			}
		})();
	}

	getPwBiv.getUserName = function(){
		var _self = this;
		$.ajax({
			url: window.globalPath + '/securityCode/findUsername',
			type: "POST",
			dataType: "json",
			data: {mobile: getPwBiv.mobile, type: getPwBiv.userType},
			success: function(data){
				if(data.msg == "success"){
					getPwBiv.successPrint();
				}else{
					_self.$erroinf.removeAttr('style');
					_self.$erroinf.html(data.msg).show();
				}
			}
		});
	}


	/* 事件绑定方法 */
	getPwBiv.bindE = function(){
		var _self = this;
		/* 输入框事件 */
		_self.$ipt.bind({
			'focus': function(){
				var $upt = $(this).parent();
				$upt.removeClass('erro').addClass('focus');
				_self.hideIptErro();
				_self.$erroinf.empty();
			},
			'blur': function(){
				var $this = $(this),
					$upt = $this.parent();
				$upt.removeClass('focus');
			}
		});


		/* 发送验证码 */
		_self.$getSecurityCode.bind('click', function(){
			var $this = $(this)
			var mobile = _self.$checkPhone.val();
			var t = _self.$checkPhone.offset().top + 22, l = _self.$checkPhone.offset().left + 0;
			if(!mobile){
				_self.showIptErro('手机号码不能为空', t, l);
				_self.$checkPhone.parent('.iptwrap').addClass('erro');
				return false;
			}else if(!checkUtil.checkPhoneNumber(mobile)){
				_self.showIptErro('请输入正确的11位手机号码', t, l);
				_self.$checkPhone.parent('.iptwrap').addClass('erro');
				return false;
			}else{
				$.ajax({
					url: window.globalPath + '/securityCode/create',
					type: "POST",
					dataType: "json",
					data: {"mobile": mobile},
					success: function(data){
						if(data.msg == "success"){

							/* 再次发送的及时重置 */
							var isDisabledTimer = 60;
							(function isDisabledTimerFn(){
								if(isDisabledTimer > 0){
									isDisabledTimer--;
									$this.attr('disabled', 'disabled');
									$this.attr('disabled', 'disabled');
									$this.val('发送成功！(' + isDisabledTimer + ')后重新发送');
									setTimeout(isDisabledTimerFn, 1000);
								}else{
									$this.removeAttr('disabled').val('重新获取验证码');
								}
							})();
						}else{
							isDisabledTimer = 0
							_self.$erroinf.html(data.msg).show();
						}
					}
				});
			}
		});

		/* 下一步 */
		_self.$submitcheck.bind('click', function(){
			var $this = $(this);
			getPwBiv.mobile = getPwBiv.$checkPhone.val();
			getPwBiv.code = getPwBiv.$checkCode.val();
			$this.attr('disabled', 'disabled').val('发送中....');
			$.ajax({
				url: window.globalPath + '/securityCode/check',
				type: "post",
				dataType: "json",
				data: {"mobile": getPwBiv.mobile, "code": getPwBiv.code},
				success: function(resData){
					var msg = resData.msg;
					if(msg == 'success'){
						var resObj = resData.userlist;
						/* 单用户 */
						if(resObj && resObj.length > 0){
							if(resObj.length == 1){
								getPwBiv.userType = resObj[0].type;
								getPwBiv.setUserType();
								/* 多用户 */
							}else if(resObj.length > 1){
								var html = '';
								for(var i = 0, len = resObj.length; i < len; i++){
									html += '<li data-id="' + resObj[i].type + '"  ><div class="cnt"><b class="rt-' + resObj[i].type + '"></b><span>' + resObj[i].typename + '</span></div></li>'
								}
								$('.rolenumber').html(len);
								getPwBiv.$userType.append(html);
								getPwBiv.getUserType();
							}
						}else{
							_self.$erroinf.removeAttr('style');
							_self.$erroinf.html('数据返回失败！');
							$this.removeAttr('disabled').val('下一步');
						}
					}else if(msg == 'error'){
						_self.$erroinf.removeAttr('style');
						_self.$erroinf.html('数据返回失败！');
						$this.removeAttr('disabled').val('下一步');
					}else{
						_self.$erroinf.removeAttr('style');
						_self.$erroinf.html(msg);
						$this.removeAttr('disabled').val('下一步');
					}
				}
			});

		});

		getPwBiv.$userType.delegate('li', 'click', function(){
			var $this = $(this);
			getPwBiv.userType = $this.attr('data-id');
			if(isGetUser){
				getPwBiv.getUserName();
			}else{
				getPwBiv.setUserType();
			}
		});

		/*  修改密码  */
		_self.$submitSetNewPW.bind('click', function(){
			var _pw = $("#newPasswordnow").val();
			var _chkpw = $("#newPassWordcomfirm").val();
			if(_pw.length > 12 || _pw.length < 6){
				_self.$erroinf.html('密码长度需在6-12位之间，请勿包含空格！');
				return false;
			}
			if(_pw.indexOf(' ') >= 0){
				_self.$erroinf.html('密码不能包含空格！');
				return false;
			}
			if(!_pw){
				_self.$erroinf.html('请填写新密码！');
				return false;
			}
			if(!_chkpw){
				_self.$erroinf.html('请填写确认密码！');
				return false;
			}
			if(_pw != _chkpw){
				_self.$erroinf.html('两次密码输入不一致');
				return false;
			}
			var postpw = $.md5(_pw);
			$.ajax({
				url: window.globalPath + '/securityCode/save',
				type: "POST",
				dataType: "json",
				data: {mobile: getPwBiv.mobile, type: getPwBiv.userType, password: postpw,},
				success: function(data){
					if(data.msg == "success"){
						getPwBiv.successPrint();
					}else{
						_self.$erroinf.removeAttr('style');
						_self.$erroinf.html(data.msg).show();
					}
				}
			});
		})
	};

	getPwBiv.bindE();


})