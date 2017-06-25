package com.cmcc.filesystem.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.cmcc.filesystem.constant.Constants;
import com.cmcc.filesystem.dto.DeptDto;
import com.cmcc.filesystem.entity.Dept;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.entity.UserDeptRole;
import com.cmcc.filesystem.service.IDeptService;
import com.cmcc.filesystem.service.IUserDeptRoleService;
import com.cmcc.filesystem.service.IUserService;
import com.cmcc.filesystem.service.impl.UserService;
import com.cmcc.filesystem.util.DtoUtils;
import com.cmcc.filesystem.util.ManagerUtils;

/*
 * 部门管理模块
 */
@Controller
@RequestMapping("/deptMng")
public class DeptMngController {

	@Autowired
	private IDeptService deptService;
	
	@Autowired
	private IUserService userService;
	
	@Autowired
	private IUserDeptRoleService userDeptRoleService;
	
	@Autowired
    private ManagerUtils managerUtils;
	
	@Autowired
	private DtoUtils dtoUtils;
	
	/*
	 * 显示该部门信息
	 */
	@RequestMapping("/list")
	public String list(Model model){
	    List<DeptDto> deptDtos = new ArrayList<DeptDto>();
	    
	    List<Dept> depts = deptService.findAll();
	    if(depts.size() > 0) {
	        for(Dept d : depts) {
	            DeptDto deptDto = dtoUtils.deptToDeptDto(d);
	            
//	            //设置部门管理员名字
//	            UserDeptRole udr = new UserDeptRole();
//	            udr.setDeptId(d.getId());
//	            udr.setIsDeptManager(Boolean.TRUE);
//	            List<UserDeptRole> userDeptRoles = userDeptRoleService.findSelective(udr);
//	            if(userDeptRoles.size() > 0) {
//	                //若找到，那么只有一个
//	                UserDeptRole userDeptRole = userDeptRoles.get(0);
//	                
//	                Long userId = userDeptRole.getUserId();
//	                User user = userService.selectByPrimaryKey(userId);
//	                deptDto.setDeptManager(user.getName());
//	            }
//	            
//	            //设置部门档案管理员名字
//	            userDeptRoles.clear();
//	            udr = new UserDeptRole();
//	            udr.setDeptId(d.getId());
//	            udr.setIsFileManager(Boolean.TRUE);
//	            userDeptRoles = userDeptRoleService.findSelective(udr);
//	            if(userDeptRoles.size() > 0) {
//	                //若找到，那么只有一个
//	                UserDeptRole userDeptRole = userDeptRoles.get(0);
//	                
//	                Long userId = userDeptRole.getUserId();
//	                User user = userService.selectByPrimaryKey(userId);
//	                deptDto.setFileManager(user.getName());
//	            }
	            
	            deptDtos.add(deptDto);
	        }
	    }
	    
	    model.addAttribute("deptDtos", deptDtos);
		return "dept/list";
	}
	
	/*
	 * 跳转到添加页面
	 */
	@RequestMapping(value = "/add", method = RequestMethod.GET)
	public String add(Model model){
		/*
		 * 所有部门
		 */
		List<Dept> depts = deptService.findAll();
		model.addAttribute("depts", depts);
		
		List<User> users = userService.findAll();
		List<User> notDeptMngers = managerUtils.getCanBeDeptMngers();;
		List<User> notFileMngers = managerUtils.getCanBeFileMngers();
		
//		for(User u : users){
//			UserDeptRole userDeptRole = userDeptRoleService.findByUserId(u.getId() + "");
//			if(userDeptRole != null && (userDeptRole.getIsDeptManager() || userDeptRole.getIsFileManager())){
//				/*
//				 * 部门负责人&档案管理人
//				 */
////				if(!userDeptRole.getIsDeptManager() && !userDeptRole.getIsFileManager()){
////					
////				}
//				
//				/*
//				 * 档案管理人
//				 */
////				if(!userDeptRole.getIsFileManager()){
////					notFileMngers.add(u);
////				}
//				continue;
//			} else{
//				notDeptMngers.add(u);
//				notFileMngers.add(u);
//			}
//		}
        
		model.addAttribute("notDeptMngers", notDeptMngers);
		model.addAttribute("notFileMngers", notFileMngers);
		
		return "dept/add";
	}
	
	/*
	 * 添加部门
	 */
	@RequestMapping(value = "/addPost", method = RequestMethod.POST)
	public String addPost(Dept dept, String deptMngerId, String fileMngerId){
		int num = deptService.insert(dept);
		if(num > 0){
			Dept dept2 = deptService.findByDeptName(dept.getDeptName());
			if(dept2 != null){
				Long deptId = dept2.getId();

				UserDeptRole userDeptRole = userDeptRoleService.findByUserId(deptMngerId);
				if(userDeptRole != null){
					userDeptRole.setIsDeptManager(Boolean.TRUE);
					userDeptRoleService.updateByPrimaryKeySelective(userDeptRole);
				} else{
					UserDeptRole userDeptRole2 = new UserDeptRole();
					userDeptRole2.setUserId(Long.parseLong(deptMngerId));
					userDeptRole2.setDeptId(deptId);
					userDeptRole2.setRoleId(Constants.DEPT_MANAGER_ROLEID);	//部门负责人
					userDeptRole2.setIsDeptManager(Boolean.TRUE);
					userDeptRoleService.insertSelective(userDeptRole2);
					
				}
				
				UserDeptRole userDeptRole2 = userDeptRoleService.findByUserId(fileMngerId);
				if(userDeptRole2 != null){
					userDeptRole2.setIsFileManager(Boolean.TRUE);
					userDeptRoleService.updateByPrimaryKeySelective(userDeptRole2);
				} else{
					UserDeptRole userDeptRole3 = new UserDeptRole();
					userDeptRole3.setUserId(Long.parseLong(fileMngerId));
					userDeptRole3.setDeptId(deptId);
					userDeptRole3.setRoleId(Constants.PRIVILEDGE_MANAGER_ROLEID);	//授权档案管理员
					userDeptRole3.setIsFileManager(Boolean.TRUE);
					userDeptRoleService.insertSelective(userDeptRole3);
					
				}
			}
			
		}
		
		return "redirect:list";
	}
	
	@RequestMapping("/edit")
	public String edit(String deptId, Model model){
		Dept dept = deptService.selectByPrimaryKey(Long.parseLong(deptId));
		DeptDto deptDto = dtoUtils.deptToDeptDto(dept);
		model.addAttribute("deptDto", deptDto);
		
		List<User> canBeDeptMngers = managerUtils.getCanBeDeptMngers();
		List<User> canBeFileMngers = managerUtils.getCanBeFileMngers();
		model.addAttribute("canBeDeptMngers", canBeDeptMngers);
		model.addAttribute("canBeFileMngers", canBeFileMngers);
		
		return "dept/edit";
	}
	
	@RequestMapping(value = "/editPost", method = RequestMethod.POST)
	public String editPost(DeptDto deptDto, String deptManagerId, String fileManagerId){
	    Dept dept = dtoUtils.deptDtoToDept(deptDto);
	    dept.setState(Boolean.TRUE);
		deptService.updateByPrimaryKeySelective(dept);
		
		/*
		 * 每个人无论是领导、档案管理员还是普通用户，都会在sys_user_dept_role表中有一条且唯一一条记录
		 */
		UserDeptRole toBeDeptManager = userDeptRoleService.findByUserId(deptManagerId);
		toBeDeptManager.setDeptId(dept.getId());
		toBeDeptManager.setIsDeptManager(Boolean.TRUE);
		userDeptRoleService.updateByPrimaryKeySelective(toBeDeptManager);
		
		UserDeptRole toBeFileManager = userDeptRoleService.findByUserId(fileManagerId);
		toBeFileManager.setDeptId(dept.getId());
		toBeFileManager.setIsFileManager(Boolean.TRUE);
		userDeptRoleService.updateByPrimaryKey(toBeFileManager);
		
		/*
		UserDeptRole udr = new UserDeptRole();
		udr.setDeptId(dept.getId());
		udr.setIsDeptManager(Boolean.TRUE);
		List<UserDeptRole> udrs = userDeptRoleService.findSelective(udr);
		if(udrs.size() > 0) {
		    UserDeptRole userDeptRole = udrs.get(0);
		    managerUtils.updateDeptManager(userDeptRole.getId(), dept.getId() + "", deptManagerId);
		}
		
		udr = new UserDeptRole();
		udr.setDeptId(dept.getId());
		udr.setIsFileManager(Boolean.TRUE);
		udrs = userDeptRoleService.findSelective(udr);
		if(udrs.size() > 0) {
            UserDeptRole userDeptRole = udrs.get(0);
            managerUtils.updateFileManager(userDeptRole.getId(), dept.getId() + "", fileManagerId);
		}
		*/
		
		return "redirect:list";
	}
	
	@RequestMapping("/delete")
	public String delete(String deptId) {
	    Dept dept = deptService.selectByPrimaryKey(Long.parseLong(deptId));
	    if(dept != null) {
//	        dept.setState(Boolean.FALSE);
//	        deptService.updateByPrimaryKeySelective(dept);
			deptService.deleteByPrimaryKey(Long.parseLong(deptId));
	    }
	    
	    return "redirect:list";
	}
	
	@RequestMapping("/detail")
	public String detail(String deptId, Model model) {
	    Dept dept = deptService.selectByPrimaryKey(Long.parseLong(deptId));
	    if(dept != null) {
	        DeptDto deptDto = dtoUtils.deptToDeptDto(dept);
	        model.addAttribute("deptDto", deptDto);
	    }
	    
	    return "dept/detail";
	}
}
