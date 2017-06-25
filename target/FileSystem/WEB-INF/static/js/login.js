$(function(){

    var loginBihv = {
        $ipt: $('.j-ipt'), /*  $输入框 */
        $usernumber: $('.j-usernumber'), /*  $用户名输入框 */
        $userpassword: $('.j-userpassword'), /* $密码输入框 */
        $login: $('.j-getlogin'), /*  $登录按钮*/
        $erroinf: $('.j-erroinf'), /* $错误消息 */
        loginform: $('#loginform'),
        $jcaptcha: $(".jcaptcha-btn"),
        msgype: {
            '20001': ['不存在的用户', 71],
            '20002': ['您输入登录名和密码不匹配，请重新输入，<br />是否 <a href="">找回密码</a> 或 <a href="">找回登录名</a> ', 100],
            '20003': ['用户密码输入错误超过10次，帐号已被锁，请30分钟后再试', 130],
            '20004': ['您的帐号已被锁定，请30分钟后再试或立即找回密码。', 100],
            '20005': ['您的帐号有效期有问题或者帐号不在有效期内，请联系管理员', 100],
            '20006': ['您的帐号所在的学校不存在，请联系管理员', 100],
            '20007': ['您没有输入验证码、或者输入错误！请核对后重新输入', 192],
            '20008': ['其他错误：系统出现异常，请联系管理员', 100],
            '20009': ['为了您的账户安全，请输入验证码', 192],
            '20010': ['您的账号处于待审核、已停用或审核未通过状态，当前不可登录。', 100]
        }
    };

    loginBihv.showErro = function(msg, $e, top){
        var _self = this;
        if(msg){
            _self.$erroinf.html(msg).show();
        }
        if($e){
            _self[$e].parent().addClass('erro');
        }
        if(top){
            _self.$erroinf.css('top', top + 'px');
        }
    };


    loginBihv.bindE = function(){
        var _self = this;
        /* 表单信息 */
        _self.$ipt.bind({
            'focus': function(){
                var $upt = $(this).parent();
                $upt.removeClass('erro').addClass('focus');
                _self.$erroinf.empty().hide();
            },
            'blur': function(){
                $(this).parent().removeClass('focus');
            },
            'keyup': function(event){
                var e = window.event || event;
                if(e.keyCode == 13){
                    _self.$login.click();
                }
            }
        });
        /* 验证码 */
        if(_self.$jcaptcha){
            _self.$jcaptcha.bind('click', function(){
                $(".captcha-img").attr("src", window.path + '/jcaptcha.jpg?' + new Date().getTime());
            });
        }
        /*  登录 */
        _self.$login.bind({
            'click': function(){
                var userNumber = _self.$usernumber.val(),
                    userPassword = _self.$userpassword.val();

                /* 登录名为空检查 */
                if(!userNumber){
                    _self.showErro('请输入登录名', '$usernumber', 71);
                    return false
                }
                /* 密码为空检查 */
                if(!userPassword){
                    _self.showErro('请输入密码', '$userpassword', 134);
                    return false
                }else{
                    /*  var isMd5 = $('#isMd5')[0].checked;*/
                    /*  var _val = isMd5 ? $.md5(userPassword) : userPassword;*/
                    _self.$userpassword.val(userPassword);
                }
                _self.loginform.submit();
            }
        })
    };


    loginBihv.init = function(){
        var _self = this;
        /* 页面载入后显示错误信息 */
        if(!!window.erroinf && parseInt(window.erroinf) !== 20000){
            var _n = window.tips || window.erroinf;
            var msg = (typeof _self.msgype[_n]) !== 'undefined' ? _self.msgype[_n][0] : _n
            _self.showErro(msg, false, _self.msgype[_n][1]);
        }
        _self.bindE();
    };

    loginBihv.init();
});