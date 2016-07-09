package com.cmcc.filesystem.web.filter;

/*
 * 当用户关闭页面而不关闭浏览器的时候，用户session未删除，
 * 故依旧可以登陆，不需要输入用户名密码。
 * 当用户访问login页面的时候直接根据已登陆的用户角色重定向至相关页面
 */

import java.util.List;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.util.WebUtils;

import com.cmcc.filesystem.constant.Constants;
import com.cmcc.filesystem.entity.User;


public class AuthenticatedFilter extends AccessControlFilter {

	@SuppressWarnings("unchecked")
	@Override
	protected boolean isAccessAllowed(ServletRequest request,
			ServletResponse response, Object mappedValue) throws Exception {
		Subject subject = SecurityUtils.getSubject();
		
		if(isLoginRequest(request,response) && subject.isAuthenticated()){
			Session session = subject.getSession();
			//将存在的用户列表存入existed
			List<User> userList = (List<User>) session.getAttribute("userList");
			if(userList == null || userList.size() < 1){
				return false;
			} 
			User u = userList.get(0);
			String url = "/";
			
			/*
			if(u.getType() < Constants.TEACHER) {        //<8
			    //后台管理员登陆，即sys_person表中运营商、代理商登陆
			    if(u.getType() == Constants.SECONDANGET) {
                    //二级代理商登陆。暂时跳到审核"代理商页面"
                    url = "/platform/agentAudit/list";
                } else {
                    //一级代理商登陆
                    url = "/platform/agent/list";
                }
			}else if(u.getType() == Constants.SCHOOLADMIN) {   //9  
//			    //在sys_teacher表中找出该登陆教师
//			    if(u.getRoles().contains(Constants.SCHOOLADMINROLE+"")) {
		        //学校管理员登陆
		        url = "/teacher/schoolnotice/sendNotice";
			}else if(u.getType() == Constants.TEACHER) {     //8
                //教师或者班主任登陆
                url = "/teacher/schoolnotice/receiveNotice";
			}else if(u.getType() == Constants.STUDENTTYPE) {
			    //家长登陆~~~~~~~~~~~~??????????????????????????????先跳到404界面?????????????????????????????????~~~~~~~~~~~~~~~~~~~~~
			    url = "/nullController/gotoNull";
			}
			*/
			
			WebUtils.issueRedirect(request, response, url);
			
			
		}
		return true;
	}

	@Override
	protected boolean onAccessDenied(ServletRequest request,
			ServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		return true;
	}

}
