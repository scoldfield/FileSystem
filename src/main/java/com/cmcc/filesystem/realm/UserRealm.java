package com.cmcc.filesystem.realm;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.NullArgumentException;
import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

import com.cmcc.filesystem.constant.Constants;
import com.cmcc.filesystem.credentials.MySimpleAuthenticationInfo;
import com.cmcc.filesystem.dao.UserMapper;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.service.IRoleService;
import com.cmcc.filesystem.service.IUserService;


public class UserRealm extends AuthorizingRealm {

	private Logger logger = Logger.getLogger(getClass());

    @Autowired
    private UserMapper userService;
    
    @Autowired
    private IRoleService roleService;
    
	
	@SuppressWarnings("unchecked")
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        String username = (String)principals.getPrimaryPrincipal();
//        User user = userService.findByUsername(username);
//
//        logger.info("To obtain the username value is " +username);
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
//        
//        //根据登录用户类型，获取登录用户的角色
//        Integer type = user.getType();
//        Set<String> roles = new HashSet<String>();
//        Set<String> permissions = new HashSet<String>();
//        
//		List<Role> currentRoles = (List<Role>) SecurityUtils.getSubject().getSession(false).getAttribute("currentRoles");
//        
//        if(type ==  Constants.TEACHER) {
//            //教师、班主任、校长、副校长、教导主任、政务主任、总务主任、年级组长  登陆
//            //Teacher teacher = teacherService.findByTeachername(username);
//            
//            /*
//            //找出他们的职务对应的sys_role表中的角色
//            teacherRoles = teacherService.getTeacherRoles(teacher);
//            if(teacherRoles.size() > 0) {
//                for(Role r : teacherRoles) {
//                    roles.add(r.getRole());
//                }
//            }
//            permissions = roleService.findPermissionsByRoles(teacherRoles);
//            */
//            
//            //找出他们的职务对应的sys_role表中的角色
//            if(currentRoles.size() > 0) {
//                for(Role r : currentRoles) {
//                    roles.add(r.getRole());
//                }
//                
//                permissions = roleService.findPermissionsByRoles(currentRoles);
//            }
//        } else if(type ==  Constants.SCHOOLADMIN) {
//            //学校管理员登陆
//            //Person schAdmin = personService.findPersonByUsername(username);
//            
//            /*
//            //找出他们的职务对应的sys_role表中的角色
//            schooladminRole = schoolAdminService.getSchooladminRole(schAdmin);
//            if(schooladminRole != null) {
//                roles.add(schooladminRole.getRole());
//            }
//            */
//            
//            //找出他们的职务对应的sys_role表中的角色
//            if(currentRoles.size() > 0) {
//                roles.add(currentRoles.get(0).getRole());
//                permissions = roleService.findPermissionsByRoles(currentRoles);
//            }
//            
////            schooladminRoles.add(schooladminRole);
////            permissions = roleService.findPermissionsByRoles(schooladminRoles);
//        } else {
//            roles = userService.findRoles(username);
//            permissions = userService.findPermissions(username);
//        }
//        
////        authorizationInfo.setRoles(userService.findRoles(username));        //设置登录subject的role
////        authorizationInfo.setStringPermissions(userService.findPermissions(username));      //设置登录的subject的permissions
//        authorizationInfo.setRoles(roles);        //设置登录subject的role
//        authorizationInfo.setStringPermissions(permissions);      //设置登录的subject的permissions
        return authorizationInfo;
    }

    
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
    	
    	CaptchaUsernamePasswordToken formToken= (CaptchaUsernamePasswordToken)token;
    	
        String username = (String)formToken.getPrincipal();
        logger.info("To obtain the username value is " +username);
        SimpleAuthenticationInfo authenticationInfo =null;
        List<User> list = null;
//        if(username.length()==Constants.MOBILE_LENGTH){
//        	//用户类型为老师或者家长的时候，用手机号码登陆，长度为11。
//        	User loginUser=new User();
//        	loginUser.setMobile(username);
//        	if(formToken.getLogintype()!=null&&!"".equals(formToken.getLogintype())){
//        		loginUser.setType(Integer.parseInt(formToken.getLogintype()));
//        	}
//        	list=userService.findByTeaAndStu(loginUser);           
//        }else{
//        	//用户类型为代理商、运营商或者学校管理员的时候，用账号登陆；
//        	list = userService.findByLoginUser(username);
//        	
//        	if(list!=null&&list.size()>0){
//        		User us=(User)list.get(0);
//        		//判断一级代理商的状态
//        		if(us.getType()==3){
//        			Person person=new Person();
//            		//person.setType(new Integer(Constants.CITYADMIN));
//            		person.setId(us.getId());
//            		Long orgId=personService.findone(person).getOrganizationId();
//            		List<AgentArea> l=agentAreaService.findMaxStateByAgentId(orgId);
//            		if(l!=null&&l.size()>0){
//            			AgentArea agemtArea=(AgentArea)l.get(0);
//            			if(agemtArea.getAgentstate().equals(Constants.AGENT_STATUS_CONFIRM)||agemtArea.getAgentstate().equals(Constants.AGENT_STATUS_STOP)||agemtArea.getAgentstate().equals(Constants.AGENT_STATUS_NOUSE)){
//            				logger.info("The user object is empty " );
//            	            throw new AgentNotExistedException();//没找到帐号
//            			}
//            		}
//        		}
//        	}
//
//        	
//        }
//    	if(list==null||list.size()==0) {
//        	logger.info("The user object is empty " );
//            throw new UnknownAccountException();//没找到帐号
//        }
//    	
//    	MasterSlaveJedis jedis = redisUtil.getMasterJedis();
//    	
//    	try {
//			for(User u:list){
//				 if(Boolean.TRUE.equals(u.getLocked())) {
//					 logger.info("username:"+u.getUsername()+",type:"+u.getType()+" locked at "+DateFormatUtil.format("yyyy-MM-dd HH:mm:ss", u.getLocktime()));
//					 String dt = DateFormatUtil.format("yyyy-MM-dd HH:mm:ss", u.getLocktime());
//					 jedis.hset(u.getUsername(), "locktime", dt);
//					 throw new LockedAccountException(); //帐号锁定
//			     }
//			}
//		} catch (LockedAccountException e) {
//			logger.error(e.getMessage());
//			throw new LockedAccountException();
//		}finally{
//			redisUtil.returnResource(jedis);
//		}
    	
    	User user = userService.findByUsername(username);
    	if(user == null){
    		throw new NullArgumentException("该用户名" + username + "在sys_user表中没有找到相应的user");
    	}
    	
//    	formToken.setUserList(list);//返回同一个账号或者手机号码的用户列表
    	
    	SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(
    			username, 		//用户名
    			user.getPassword(), 	//密码
    			getName());
    	
    	
//    	authenticationInfo=new MySimpleAuthenticationInfo(
//    		  username, //用户名
//      		  list,
//              getName()  //realm name
//    	);//构建自定义的认证信息
        return simpleAuthenticationInfo;
    }

     
    public void clearCachedAuthorizationInfo(PrincipalCollection principals) {
        super.clearCachedAuthorizationInfo(principals);
    }

     
    public void clearCachedAuthenticationInfo(PrincipalCollection principals) {
        super.clearCachedAuthenticationInfo(principals);
    }

     
    public void clearCache(PrincipalCollection principals) {
        super.clearCache(principals);
    }

    public void clearAllCachedAuthorizationInfo() {
        getAuthorizationCache().clear();
    }

    public void clearAllCachedAuthenticationInfo() {
        getAuthenticationCache().clear();
    }

    public void clearAllCache() {
        clearAllCachedAuthenticationInfo();
        clearAllCachedAuthorizationInfo();
    }

}
