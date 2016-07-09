package com.cmcc.filesystem.credentials;

import java.util.List;

import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.subject.SimplePrincipalCollection;

import com.cmcc.filesystem.entity.User;


/**
 * 登陆用户信息
 * @author chenwenyang
 *
 */
public class MySimpleAuthenticationInfo extends SimpleAuthenticationInfo {

	/**
	 * when user login with two different type, we use MySimpleAuthenticationInfo to 
	 * return AuthenticationInfo
	 */
	private static final long serialVersionUID = 1L;
	
    protected List<User> user;
    
    protected String realmName;

    
    public String getRealmName() {
		return realmName;
	}


	public void setRealmName(String realmName) {
		this.realmName = realmName;
	}


	public MySimpleAuthenticationInfo(Object principal, List<User> user, String realmName) {
		this.realmName = realmName;
        this.principals = new SimplePrincipalCollection(principal, realmName);
        this.user = user;
    }


	public List<User> getUser() {
		return user;
	}


	public void setUser(List<User> user) {
		this.user = user;
	}


}
