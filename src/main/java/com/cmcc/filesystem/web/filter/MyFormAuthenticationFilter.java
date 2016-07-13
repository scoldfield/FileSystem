package com.cmcc.filesystem.web.filter;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import com.cmcc.filesystem.util.StringUtil;


public class MyFormAuthenticationFilter extends FormAuthenticationFilter {
	
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
//	    Token token = (Token) req.getAttribute("token");
//	    StringBuffer requestURL = req.getRequestURL();
	    String username = null;
	    String password = null;
	    
//	    if(token == null || "".equals(token)) {
	        username = getUsername(request);
	        password = getPassword(request);
//	    } else {
//	        username = token.getUserName();
//	        String paramRole = token.getParamRole();
//	        //TODO: 查找出与用户名相对应的密码
//	        password = "";
//	    }
	    
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
		SecurityUtils.getSubject().getSession()
				.setAttribute("userList", tokenform.getUserList());// 将通过验证的用户列表存入session中
		SecurityUtils.getSubject().getSession()
				.setAttribute("login_ip", tokenform.getHost());         //登陆ip
		

//		//登陆成功后判断是否包含家长这个状态
//		if (tokenform.getUserList().size() > 1) {
//			//包含家长状态。跳转至选择角色页面
//			httpServletResponse.sendRedirect(httpServletRequest
//					.getContextPath() + "/chooseRole");
//			return false;
//		} else {
//			// 仅有一个角色。直接跳转至相应角色页面
//			String url = this.getSuccessUrl();
//			User u = tokenform.getUserList().get(0);
//			
//			
//			
//		    //同意使用协议
//			if(u.getType() < Constants.TEACHER) {        //<8
//			    //后台管理员登陆，即sys_person表中运营商、代理商登陆
//			    if(u.getType() == Constants.SECONDANGET) {
//                    //二级代理商登陆。暂时跳到审核"代理商页面"
////                    url = "/platform/agentAudit/list";
//                    url = "/platform/agentnotice/receiveNotice";
//                } else if(u.getType() == Constants.HYADMIN){
//                	//杭研管理员
//                    url = "/platform/version";
//                }else {
//                    //一级代理商登陆
////                  url = "/platform/agent/list";
//                  url = "/platform/agentnotice/receiveNotice";
//              }
//			}else if(u.getType() == Constants.SCHOOLADMIN) {   //9  
//		        //学校管理员登陆
//			    Person schoolAdmin = personService.findPersonByUsername(u.getUsername());    //找出学校管理员
//			    School school = new School();
//			    school.setPersonId(schoolAdmin.getId());
//			    List<School> schools = schoolService.findAll(school);
//			    int count = 0;
//			    if(schools.size() > 0) {
//			        for(School s : schools) {
//			            if(s.getDisable() == 1) {
//			                count++;
//			            }
//			        }
//			        
//			        if(count > 0) {
//			            //找到该管理员的学校，且启用的学校
//			            
//			            //获取登录人的角色(职位)信息。如sys_role中id=21
//	                    List<Role> currentPositions = new ArrayList<Role>();
//	                    //找出sys_role中存储的"学校管理员"的职位信息
//	                    Role r = new Role();
//	                    r.setRole("学校管理员");
//	                    r.setState(0);
//	                    List<Role> roles = roleService.findByRole(r);
//	                    Role role = null;
//	                    if(roles.size() > 0) {
//	                        //若找到，只可能有一个
//	                        role = roles.get(0);
//	                    }
//	                    currentPositions.add(role);
//	                    //将登录人的当前角色(职位)存储到session中
//	                    SecurityUtils.getSubject().getSession().setAttribute("currentPositions", currentPositions);
//	                    
//	                    
//	                    //获取登录人当前的具体角色(职位)信息，根据优先级
//	                    List<Role> currentRoles = new ArrayList<Role>();
//	                    Role currentRole = schoolAdminService.getSchooladminRole(schoolAdmin);
//	                    currentRoles.add(currentRole);
//	                    //将类似"校长(幼儿园)"括号中的去掉，存入roleName字段中
//	                    for(Role rr: currentRoles) {
//	                        roleService.getCutRoleName(rr);
//	                    }
//
//	                    //将登录人的当前角色(职位)存储到session中
//	                    SecurityUtils.getSubject().getSession().setAttribute("currentRoles", currentRoles);
//	                    
//	                    //将登录人的所有角色(职位)存储到session中
//	                    SecurityUtils.getSubject().getSession().setAttribute("roles", currentRoles);
//			            
//			            url = "/teacher/schoolnotice/sendNotice";    //成功找到即可，因为管理员只可能管理一个学校
//			        } else {
//			            //找到该管理员的学校，但是并没有启用的学校
//			            url = "/nullController/gotoNull";
//			            httpServletRequest.getSession().setAttribute("msg", "sys_school表中找到与该管理员相关的学校，但是该学校没有启用");
//			        }
//			        
//			    } else {
//			        url = "/nullController/gotoNull";
//			        httpServletRequest.getSession().setAttribute("msg", "sys_school表中没有找到与该管理员相关的学校");
//                }
//			    
//			}else if(u.getType() == Constants.TEACHER) {     //8
//                //教师、班主任、校长、副校长、教导主任、政务主任、总务主任、年级组长  登陆
//			    Teacher teacher = teacherService.findByTeachername(u.getUsername());
//			    
//			    //找出他们的职务对应的sys_role表中的角色
//			    List<Role> teacherRoles = teacherService.getTeacherRoles(teacher);
//			    if(teacherRoles != null && teacherRoles.size() > 0) {
//                    //有职务
//			        
//			        /*
//			        //1、获取sys_role中的role字段
//			        List<String> roleNames = new ArrayList<String>();
//			        for(Role r : teacherRoles) {
//			            roleNames.add(r.getRole());
//			        }
//			        //2、找出roleNames对应优先级表中的最高优先级的下标
//			        Integer minIndex = teacherService.getMinIndex(roleNames, Constants.ROLESEQUENCE);
//			        String sequenceName = Constants.ROLESEQUENCE[minIndex];
//			        //3、找出该下标对应的role
//			        Role currentRole = null;     //当前角色
//			        for(Role r : teacherRoles) {
//			            if(r.getRole().contains(sequenceName) || sequenceName.contains(r.getRole())) {
//			                currentRole = r;
//			            }
//			        }
//			        */
//			        			    
//			        //获取登录人的角色(职位)信息。如sys_role中id=21
//			        List<Role> positionRoles = teacherService.getPositionRole(teacher);
//			        List<Role> currentPositions = teacherService.getFirstPositions(positionRoles);   //只有该登录人角色中既有"教师"又有"班主任"的时候会存多个，其他都是存储一个
//			        //将登录人的当前角色(职位)存储到session中
//                    SecurityUtils.getSubject().getSession().setAttribute("currentPositions", currentPositions);
//			        
//			        
//			        //获取登录人当前的具体角色(职位)信息，根据优先级
//			        List<Role> currentRoles = teacherService.getFirstRoles(teacher);
//			        //将类似"校长(幼儿园)"括号中的去掉，存入roleName字段中
//			        for(Role r: currentRoles) {
//			            roleService.getCutRoleName(r);
//			        }
//
//			        //将登录人的当前角色(职位)存储到session中
//			        SecurityUtils.getSubject().getSession().setAttribute("currentRoles", currentRoles);
//			        
//			        //将登录人的所有角色(职位)存储到session中
//			        SecurityUtils.getSubject().getSession().setAttribute("roles", teacherRoles);
//			        
//			        //将currentPositions列表中的数据id存储到currentPositionIds列表中
//			        List<Long> currentPositionIds = new ArrayList<Long>();
//			        if(currentPositions.size() > 0) {
//			            for(Role r : currentPositions) {
//			                currentPositionIds.add(r.getId());
//			            }
//			            
//			        }
//			        
//			        if(currentPositionIds.contains(Long.parseLong(Constants.SCHOOLMASTERROLE + ""))
//			                || currentPositionIds.contains(Long.parseLong(Constants.VICESCHOOLMASTERROLE + ""))
//			                || currentPositionIds.contains(Long.parseLong(Constants.DEANROLE + ""))
//			                || currentPositionIds.contains(Long.parseLong(Constants.AOSROLE + ""))
//			                || currentPositionIds.contains(Long.parseLong(Constants.GENERALROLE + ""))
//			                || currentPositionIds.contains(Long.parseLong(Constants.GRADELEADERROLE + ""))) {
//			            
//			            //当前职务包含校长、副校长、主任等职务的时候，跳转的url
//			            url = "/teacher/schoolnotice/sendNotice";
//			        } else {
//			            //教师或者班主任登陆，跳转到的url
//			            url = "/teacher/schoolnotice/receiveNotice";
//			        }
//			        
//                } else {
//                    //没有职务
//                    //查找代理商为其赋予职务......
//                    //.....
//                    
//                    //暂时写成联系学校管理员
//                    School school = schoolService.findOne(teacher.getSchoolId());
//                    if(school != null) {
//                        //正常情况下一个老师只属于学校
//                        Long personId = school.getPersonId();  //学校管理员id
//                        Person schoolManager = personService.findById(personId); //学校管理员
//                        
////                      httpServletRequest.getServletContext().setAttribute("schoolManagerName", schoolManager.getName());
//                        
//                        httpServletRequest.getSession().getServletContext().setAttribute("type", Constants.TEACHER + "");    //8:teacher
//                        httpServletRequest.getSession().getServletContext().setAttribute("schoolManagerName", schoolManager.getName());
//                        httpServletRequest.getSession().getServletContext().setAttribute("schoolManagerMobile", schoolManager.getMobile());
//                    } else {
////                      httpServletRequest.setAttribute("schoolManagerName", "");
//                        httpServletRequest.getSession().getServletContext().setAttribute("schoolManagerName", "");
//                        httpServletRequest.getSession().getServletContext().setAttribute("schoolManagerMobile", "");
//                    }
//
//                    url = "/nullController/gotoNull";
//                }
//			    
//			    /*
//			     * ddli3修改于20160408
//			     * 
//			    Middle middle = new Middle();
//			    middle.setTeacherId(teacher.getId());
//			    List<Middle> middles = middleService.findAll(middle);
//			    if(middles != null && middles.size() > 0) {
//			        //有职务
//			        url = "/teacher/schoolnotice/receiveNotice";
//			    } else {
//			        //没有职务
//			        //查找代理商为其赋予职务......
//			        //.....
//			        
//			        //暂时写成联系学校管理员
//			        School school = schoolService.findOne(teacher.getSchoolId());
//			        if(school != null) {
//			            //正常情况下一个老师只属于学校
//			            Long personId = school.getPersonId();  //学校管理员id
//			            Person schoolManager = personService.findById(personId); //学校管理员
//			            
////			            httpServletRequest.getServletContext().setAttribute("schoolManagerName", schoolManager.getName());
//			            httpServletRequest.getSession().getServletContext().setAttribute("schoolManagerName", schoolManager.getName());
//			        } else {
////			            httpServletRequest.setAttribute("schoolManagerName", "");
//			            httpServletRequest.getSession().getServletContext().setAttribute("schoolManagerName", "");
//			        }
//
//			        url = "/nullController/gotoNull";
//			    }
//			    */
//			}else if(u.getType() == Constants.STUDENTTYPE) {
//			    //家长登陆~~~~~~~~~~~~??????????????????????????????先跳到404界面?????????????????????????????????~~~~~~~~~~~~~~~~~~~~~
//
//			    httpServletRequest.getSession().getServletContext().setAttribute("type", Constants.STUDENTTYPE + "");    //16:parent
//			    url = "/nullController/gotoNull";
//			}
//			
//			

//			String rule = Config.getString("login.add");
//			if(!StringUtil.isBlank(rule)){
////				iPointsAdd.add(tokenform.getUserList().get(0), Integer.valueOf(rule));
//			}
////			calculatePointsService.calculate(tokenform.getUserList().get(0));
//			String realURL = httpServletRequest.getContextPath() + url;
//			logger.info("redirecting to the url:"+realURL);
//			System.out.println(realURL);
//			httpServletResponse.sendRedirect(httpServletRequest
//					.getContextPath() + url);
			
			String url = "/start";
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
