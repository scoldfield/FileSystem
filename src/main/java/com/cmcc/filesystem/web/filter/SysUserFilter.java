package com.cmcc.filesystem.web.filter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.web.filter.PathMatchingFilter;

import com.cmcc.filesystem.constant.Constants;


public class SysUserFilter extends PathMatchingFilter {

    protected boolean onPreHandle(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {

        String username = (String)SecurityUtils.getSubject().getPrincipal();
        if(username == null || "".equals(username)){
        	return true;
        } 
        request.setAttribute(Constants.CURRENT_USER, SecurityUtils.getSubject().getSession().getAttribute("userList"));
        return true;
    }
}
