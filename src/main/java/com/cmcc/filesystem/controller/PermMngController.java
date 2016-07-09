package com.cmcc.filesystem.controller;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.cmcc.filesystem.dto.RegisterAuditDto;
import com.cmcc.filesystem.dto.RoleDto;
import com.cmcc.filesystem.dto.UserDto;
import com.cmcc.filesystem.entity.Dept;
import com.cmcc.filesystem.entity.RegisterAudit;
import com.cmcc.filesystem.entity.Role;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.entity.UserDeptRole;
import com.cmcc.filesystem.service.IDeptService;
import com.cmcc.filesystem.service.IRegisterAuditService;
import com.cmcc.filesystem.service.IRoleService;
import com.cmcc.filesystem.service.IUserDeptRoleService;
import com.cmcc.filesystem.service.IUserService;
import com.cmcc.filesystem.util.DtoUtils;

@Controller
@RequestMapping("/permMng")
public class PermMngController {

    @Autowired
    private IRegisterAuditService raService;
    
    @Autowired
    private DtoUtils dtoUtils;
    
    @Autowired
    private IUserDeptRoleService userDeptRoleService;
    
    @Autowired
    private IRoleService roleService;
    
    @Autowired
    private IUserService userService;
    
    @Autowired
    private IDeptService deptService;
    
    /*
     * 显示所有未授权的用户
     */
    @RequestMapping("/list")
    public String list(Model model) throws IllegalAccessException, InvocationTargetException {
        /*
        RegisterAudit ra = new RegisterAudit();
        ra.setIsPermitted(Boolean.FALSE);
        ra.setState(Boolean.TRUE);
        List<RegisterAudit> ras = raService.findSelective(ra);
        
        List<RegisterAuditDto> rads = new ArrayList<RegisterAuditDto>();
        if(ras.size() > 0) {
            for(RegisterAudit ra2 : ras) {
                RegisterAuditDto rad = dtoUtils.registerAuditToRegisterAuditDto(ra2);
                rads.add(rad);
            }
        }
        
        model.addAttribute("rads", rads);
        */
        
        //显示所有用户。先从sys_user_dept_role表中找出所有数据
        List<UserDeptRole> userDeptRoles = userDeptRoleService.findAll();
        List<UserDto> userDtos = new ArrayList<UserDto>();
        if(userDeptRoles.size() > 0) {
            for(UserDeptRole udr : userDeptRoles) {
                Long userId = udr.getUserId();
                User user = userService.selectByPrimaryKey(userId);
                Long roleId = udr.getRoleId();
                Role role = roleService.selectByPrimaryKey(roleId);
                
                UserDto userDto = dtoUtils.userToUserDto(user);
                if(userDto != null) {
                    userDto.setRoleId(roleId);
                    userDto.setRoleName(role.getName());
                }

                userDtos.add(userDto);
            }
        }
        
        //将sys_dept_role表中的数据userId组成字符串，便于后面查漏补缺
        List<Long> userIds = new ArrayList<Long>();
        for(UserDto ud : userDtos) {
            userIds.add(ud.getId());
        }
        
        //从sys_user表中将上面没有查到的user添加进去
        List<User> users = userService.findAll();
        if(users.size() > 0) {
            for(User u : users) {
                if(!userIds.contains(u.getId())) {
                    UserDto ud = dtoUtils.userToUserDto(u);
                    userDtos.add(ud);
                }
            }
        }
        
        model.addAttribute("userDtos", userDtos);
        return "perm/list";
    }
    
    /*
     * 添加角色
     */
    @RequestMapping("/addRole")
    public String addRole(String userId, Model model) {
        User user = userService.selectByPrimaryKey(Long.parseLong(userId));
        UserDto userDto = new UserDto();
        List<Role> roles = new ArrayList<Role>();
        if(user != null) {
            roles = roleService.findAll();
            if(roles.size() > 0) {
                userDto = dtoUtils.userToUserDto(user);
            }
        }
        
        List<Dept> depts = deptService.findAll();
        
        model.addAttribute("userDto", userDto);
        model.addAttribute("roles", roles);
        model.addAttribute("depts", depts);
        
        return "perm/add";
    }
    
    @RequestMapping(value = "/addPost", method = RequestMethod.POST)
    public String addPost(UserDto userDto, Model model) {
        if(userDto != null) {
            Long roleId = userDto.getRoleId();
            
            UserDeptRole udr = new UserDeptRole();
            udr.setUserId(userDto.getId());
            udr.setRoleId(roleId);
            udr.setDeptId(Long.parseLong(userDto.getDeptId()));
            udr.setIsDeptManager(userDto.isDeptManager());
            udr.setIsFileManager(userDto.isFileManager());
            userDeptRoleService.insertSelective(udr);
        }
        
        return "redirect:list";
    }
    
    /*
     * 修改角色
     */
    @RequestMapping("/editRole")
    public String editRole(String userId, Model model) {
        User user = userService.selectByPrimaryKey(Long.parseLong(userId));
        UserDto userDto = new UserDto();
        List<Role> roles = new ArrayList<Role>();
        if(user != null) {
            roles = roleService.findAll();
            if(roles.size() > 0) {
                userDto = dtoUtils.userToUserDto(user);
            }
        }
        
        model.addAttribute("userDto", userDto);
        model.addAttribute("roles", roles);
        
        return "perm/edit";
    }
    
    @RequestMapping(value = "/editPost", method = RequestMethod.POST)
    public String editPost(UserDto userDto, Model model) {
        if(userDto != null) {
            Long roleId = userDto.getRoleId();
            
            UserDeptRole udr = userDeptRoleService.findByUserId(userDto.getId() + "");
            udr.setUserId(userDto.getId());
            udr.setRoleId(roleId);
            udr.setIsDeptManager(userDto.isDeptManager());
            udr.setIsFileManager(userDto.isFileManager());
            userDeptRoleService.updateByPrimaryKeySelective(udr);
        }
        
        return "redirect:list";
    }
    
    /*
     * 显示所有角色
     */
    @RequestMapping("/listRoles")
    public String listRoles(Model model) throws IllegalAccessException, InvocationTargetException {
        List<Role> roles = roleService.findAll();
        List<RoleDto> roleDtos = new ArrayList<RoleDto>();
        if(roles.size() > 0) {
            for(Role r : roles) {
                RoleDto roleDto = dtoUtils.roleToRoleDto(r);
                roleDtos.add(roleDto);
            }
            
        }
        
        model.addAttribute("roleDtos", roleDtos);
        return "perm/roleList";
    }
    
    /*
     * 编辑修改角色的权限
     */
    @RequestMapping("/editPerm")
    public String editPerm(String roleId, Model model) throws IllegalAccessException, InvocationTargetException {
        Role role = roleService.selectByPrimaryKey(Long.parseLong(roleId));
        RoleDto roleDto = new RoleDto();
        if(role != null) {
            roleDto = dtoUtils.roleToRoleDto(role);
        }
        
        model.addAttribute("roleDto", roleDto);
        return "perm/editPerm";
    }
    
    @RequestMapping(value = "/editPermPost", method = RequestMethod.POST)
    public String editPermPost(RoleDto roleDto, Model model) throws IllegalAccessException, InvocationTargetException {
        String appendResourceIds = roleDto.getAppendResourceIds();
        Long roleId = roleDto.getId();
        Role role = roleService.selectByPrimaryKey(roleId);
        String resourceIds = role.getResourceIds();
        if(StringUtils.hasText(resourceIds) && StringUtils.hasText(appendResourceIds)) {
            resourceIds = resourceIds + appendResourceIds + ",";
        }
        role.setResourceIds(resourceIds);
        
        roleService.updateByPrimaryKeySelective(role);
        
        return "perm/roleList";
    }
    
    
    
}
