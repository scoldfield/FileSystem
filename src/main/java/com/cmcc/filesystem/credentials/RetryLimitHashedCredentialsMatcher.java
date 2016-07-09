package com.cmcc.filesystem.credentials;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheManager;
import org.apache.shiro.util.ByteSource;
import org.quartz.JobDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

import com.cmcc.filesystem.app.util.Config;
import com.cmcc.filesystem.constant.Constants;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.realm.CaptchaUsernamePasswordToken;

public class RetryLimitHashedCredentialsMatcher extends HashedCredentialsMatcher {

    private Cache<String, AtomicInteger> passwordRetryCache;
    private Logger logger = Logger.getLogger(getClass());
    
    
    public RetryLimitHashedCredentialsMatcher(CacheManager cacheManager) {
        passwordRetryCache = cacheManager.getCache("passwordRetryCache");
    }

	
    /**
     * 验证登陆
     */
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
    	/*
    	 * 从token中取出数据
    	 */
    	CaptchaUsernamePasswordToken formToken= (CaptchaUsernamePasswordToken)token;
    	String usernameToken = (String)formToken.getPrincipal();
    	char[] pChar = formToken.getPassword();
    	String passwordToken = new String(pChar);
    	String userType = (String)formToken.getLogintype();
    	if(userType==null) {
    		userType  = "";
    	}
    	
    	/*
    	 * 从info中取出数据
    	 */
    	String username = (String) info.getPrincipals().getPrimaryPrincipal();
    	String password = (String) info.getCredentials();

        boolean matches = false;
        
//        matches = super.doCredentialsMatch(formToken, info);
        
        if(StringUtils.hasText(usernameToken) && StringUtils.hasText(passwordToken) && StringUtils.hasText(username) && StringUtils.hasText(password)){
        	if(username.equals(usernameToken) && password.equals(passwordToken)){
        		matches = true;
        	}
        }
        
        logger.info("the user enter the right password:  "+ matches);

        return matches;
    }
}
