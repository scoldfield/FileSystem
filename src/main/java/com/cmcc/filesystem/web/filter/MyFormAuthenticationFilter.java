package com.cmcc.filesystem.web.filter;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cmcc.filesystem.entity.Role;
import com.cmcc.filesystem.service.IRoleService;
import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.cmcc.filesystem.app.util.Config;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.realm.CaptchaUsernamePasswordToken;
import com.cmcc.filesystem.service.IUserService;
import com.cmcc.filesystem.util.StringUtil;


public class MyFormAuthenticationFilter extends FormAuthenticationFilter {
    
    @Autowired
    private IUserService userService;

    @Autowired
    private IRoleService roleService;
    
    private Logger logger = Logger.getLogger(getClass());

    public static final String DEFAULT_CAPTCHA_PARAM = "captcha";

    private String captchaParam = DEFAULT_CAPTCHA_PARAM;

    public static final String DEFAULT_LOGINTYPE_PARAM = "logintype";

    private String logintypeParam = DEFAULT_LOGINTYPE_PARAM;


    public String getLogintypeParam() {
        return logintypeParam;
    }

    public void setLogintypeParam(String logintypeParam) {
        this.logintypeParam = logintypeParam;
    }

    public String getCaptchaParam() {
        return captchaParam;
    }

    public void setCaptchaParam(String captchaParam) {
        this.captchaParam = captchaParam;
    }

    protected String getCaptcha(ServletRequest request) {
        return WebUtils.getCleanParam(request, getCaptchaParam());
    }

    protected String getLogintype(ServletRequest request) {
        return WebUtils.getCleanParam(request, getLogintypeParam());
    }

    // 创建 Token
    protected CaptchaUsernamePasswordToken createToken(ServletRequest request,
            ServletResponse response) {

        HttpServletRequest req = (HttpServletRequest) request;
//      Token token = (Token) req.getAttribute("token");
//      StringBuffer requestURL = req.getRequestURL();
        String username = null;
        String password = null;
        
//      if(token == null || "".equals(token)) {
            username = getUsername(request);
            password = getPassword(request);
//      } else {
//          username = token.getUserName();
//          String paramRole = token.getParamRole();
//          //TODO: 查找出与用户名相对应的密码
//          password = "";
//      }
        
        String captcha = getCaptcha(request);
        String logintype = getLogintype(request);
        boolean rememberMe = isRememberMe(request);
        String host = getHost(request);

        
        return new CaptchaUsernamePasswordToken(username,
                password.toCharArray(), rememberMe, host, captcha, logintype);
    }

    /*
     * 登陆认证成功后(认证是由shiro框架完成的)，分两步：
     * 1、是否有多个角色。是的话跳转到chooseController去选择角色再处理
     * 2、唯一个角色，直接跳转到相应的页面
     * @see org.apache.shiro.web.filter.authc.FormAuthenticationFilter#onLoginSuccess(org.apache.shiro.authc.AuthenticationToken, org.apache.shiro.subject.Subject, javax.servlet.ServletRequest, javax.servlet.ServletResponse)
     */
    @Override
    protected boolean onLoginSuccess(AuthenticationToken token,
            Subject subject, ServletRequest request, ServletResponse response)
            throws Exception {

        CaptchaUsernamePasswordToken tokenform = (CaptchaUsernamePasswordToken) token;

        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        SecurityUtils.getSubject().getSession().setAttribute("userList", tokenform.getUserList());// 将通过验证的用户列表存入session中
        SecurityUtils.getSubject().getSession().setAttribute("login_ip", tokenform.getHost());         //登陆ip
        
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        User user = userService.findByUsername(username);
        if(user != null && !"".equals(user.getName())) {
            //向session中写入字段供前端使用
            SecurityUtils.getSubject().getSession().setAttribute("name", user.getName());
            SecurityUtils.getSubject().getSession().setAttribute("username", user.getUsername());
            Long roleId = user.getRoleId();
            if(roleId != null){
                Role role = roleService.selectByPrimaryKey(roleId);
                if(role != null){
                    SecurityUtils.getSubject().getSession().setAttribute("roleName", role.getName());
                }
            }
        }
        
        String url = "/index";
        httpServletResponse.sendRedirect(httpServletRequest.getContextPath() + url);
        
        return true;
    }

    @Override
    protected boolean onAccessDenied(ServletRequest request,
            ServletResponse response, Object mappedValue) throws Exception {
        if (request.getAttribute(getFailureKeyAttribute()) != null) {
            return true;
        }
        return super.onAccessDenied(request, response, mappedValue);
    }
    
}
