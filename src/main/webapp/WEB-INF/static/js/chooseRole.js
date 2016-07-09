$(function(){
	var $roleType = $('.j-roletype');
	if(window.usertype){
		var userInf = JSON.parse(window.usertype);
		var $html = '';
		if(userInf.length > 0){
			for(var i = 0, len = userInf.length; i < len; i++){
				var _type = userInf[i].type;
				$html += '<li style="width:' + 100 / len + '%" ><a href="' + window.path + '/choose?type=' + _type + '" class="cnt"><b class="rt-' + _type + '"></b><span>' + userInf[i].typename + '</span></a></li>'
			}
			$('.rolenumber').html(len)
		}else{
			$html = '未检测到该帐号有多个角色，请直接<a href="' + window.path + '/index/">点击登录</a>'
		}
		$roleType.find('ul.j-typelinks').append($html);

	}else{
		alert('载入错误，请刷新重新登录，或与管理员联系！')
	}
});