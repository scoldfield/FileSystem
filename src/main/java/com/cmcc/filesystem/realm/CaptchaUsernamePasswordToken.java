package com.cmcc.filesystem.realm;

import java.util.List;

import org.apache.shiro.authc.UsernamePasswordToken;

import com.cmcc.filesystem.entity.User;


public class CaptchaUsernamePasswordToken extends UsernamePasswordToken {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String captcha;
	
	private String logintype;
	
	private List<User> userList;

	
	
	
	public String getLogintype() {
		return logintype;
	}

	public void setLogintype(String logintype) {
		this.logintype = logintype;
	}

	public String getCaptcha() {
		return captcha;
	}

	public void setCaptcha(String captcha) {
		this.captcha = captcha;
	}

	public CaptchaUsernamePasswordToken(String username, char[] password,
			boolean rememberMe, String host, String captcha, String logintype) {
		super(username, password, rememberMe, host);
		this.captcha = captcha;
		this.logintype = logintype;
	}

	public List<User> getUserList() {
		return userList;
	}

	public void setUserList(List<User> userList) {
		this.userList = userList;
	}
}