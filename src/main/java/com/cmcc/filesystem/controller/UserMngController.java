package com.cmcc.filesystem.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.util.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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
@RequestMapping("/userMng")
public class UserMngController {
    
    @Autowired
    private IUserService userService;
    
    @Autowired
    private IDeptService deptService;
    
    @Autowired
    private DtoUtils dtoUtils;
    
    @Autowired
    private IRoleService roleService;
    
    @Autowired
    private IUserDeptRoleService userDeptRoleService;
    
    @Autowired
    private IRegisterAuditService registerAuditService;
    
    @RequestMapping("/list")
    public String list(Model model) {
        //找出所有用户，包括无效(未审核)用户，显示的时候会标记那些为无效用户
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        return "user/list";
    }
    
    @RequestMapping(value = "/add", method = RequestMethod.GET)
    public String add(Model model) {
        List<Dept> depts = deptService.findAll();
        model.addAttribute("depts", depts);
        
        List<Role> roles = roleService.findAll();
        model.addAttribute("roles", roles);
        return "user/add";
    }
    
    @RequestMapping(value = "/addPost", method = RequestMethod.POST)
    public String addPost(UserDto userDto, String isDeptManager, String isFileManager, HttpServletRequest req) {
//        Dept dept = deptService.selectByPrimaryKey(Long.parseLong(deptId));
//        if(dept != null) {
//            user.setDept(dept.getDeptName());
//        }
        
        User user = dtoUtils.userDtoToUser(userDto);
        if(user != null) {
            user.setCreateTime(new Date());
            user.setLastAccessTime(new Date());
            user.setIp(req.getRemoteHost());
            user.setState(Boolean.FALSE);       //新增用户后暂时不能被使用，state设为0，需要管理员审核后才能使用
            userService.insertSelective(user);
        }
        
        
        //TODO:是否是部门管理员、档案管理员？前端、后台交互，并写到sys_user_dept_role表中
        UserDeptRole udr = new UserDeptRole();
        udr.setUserId(user.getId());
        udr.setDeptId(Long.parseLong(userDto.getDeptId()));
        udr.setRoleId(userDto.getRoleId());
        udr.setIsDeptManager("1".equals(isDeptManager) ? Boolean.TRUE : Boolean.FALSE);
        udr.setIsFileManager("1".equals(isFileManager) ? Boolean.TRUE : Boolean.FALSE);
        userDeptRoleService.insertSelective(udr);
        
        //更新sys_register_audit表，用于新注册用户的审核
        RegisterAudit registerAudit = new RegisterAudit();
        registerAudit.setUserId(user.getId());
        registerAudit.setDeptId(user.getDeptId());
        registerAudit.setState(Boolean.FALSE);
        registerAuditService.insertSelective(registerAudit);
        
        return "redirect:list";
    }
    
    @RequestMapping("/edit")
    public String edit(String userId, Model model) {
        User user = userService.selectByPrimaryKey(Long.parseLong(userId));
        if(user != null) {
            UserDto userDto = dtoUtils.userToUserDto(user);
            model.addAttribute("userDto", userDto);
        }
        
        List<Dept> depts = deptService.findAll();
        model.addAttribute("depts", depts);
        
        return "user/edit";
    }
    
    @RequestMapping(value = "/editPost", method = RequestMethod.POST)
    public String editPost(UserDto userDto, Model model) {
        long deptId = Long.parseLong(userDto.getDeptId());
        Dept dept = deptService.selectByPrimaryKey(deptId);
        userDto.setDept(dept.getDeptName());
        
        User user = dtoUtils.userDtoToUser(userDto);
        userService.updateByPrimaryKeySelective(user);
        
        return "redirect:list";
    }
    
    @RequestMapping("/delete")
    public String delete(String userId) {
        if(StringUtils.hasText(userId)) {
//            User user = userService.selectByPrimaryKey(Long.parseLong(userId));
//            user.setState(Boolean.FALSE);
//            userService.updateByPrimaryKeySelective(user);
            UserDeptRole userDeptRole = userDeptRoleService.findByUserId(userId);
            userDeptRoleService.deleteByPrimaryKey(userDeptRole.getId());
            userService.deleteByPrimaryKey(Long.parseLong(userId));
        }
        
        return "redirect:list";
    }
    
    @RequestMapping("/detail")
    public String detail(String userId, Model model) {
        if(StringUtils.hasText(userId)) {
            User user = userService.selectByPrimaryKey(Long.parseLong(userId));
            UserDto userDto = dtoUtils.userToUserDto(user);
            model.addAttribute("userDto", userDto);

            String username = (String) SecurityUtils.getSubject().getSession().getAttribute("username");
            model.addAttribute("username", username);
        }
        
        return "user/detail";
    }

    /*
     * 新注册用户的审核
     */
    @RequestMapping("/userAudit")
    public String userAudit(Model model) {
        //新注册用户是由管理员admin来审核，与部门无关
        User user = new User();
        user.setState(Boolean.FALSE);
        List<User> users = userService.findBySelective(user);
        
        List<UserDto> userDtos = new ArrayList<UserDto>();
        UserDto userDto;
        if(users.size() > 0) {
            for(User u : users) {
                userDto = dtoUtils.userToUserDto(u);
                userDtos.add(userDto);
            }
        }
        
        model.addAttribute("userDtos", userDtos);
        return "user/auditList";
    } 

    @RequestMapping("/userAuditPost")
    public String userAuditPost(String userId, String result) {
        if(StringUtils.hasText(userId)) {
            User user = userService.selectByPrimaryKey(Long.parseLong(userId));
            if(user != null) {
                //更新sys_user表
                if("1".equals(result)){
                    user.setState(Boolean.TRUE);
                } else if("0".equals(result)){
                    user.setState(Boolean.FALSE);
                }
                userService.updateByPrimaryKeySelective(user);
                
                //更新sys_register_audit表
                RegisterAudit registerAudit = registerAuditService.findByUserId(user.getId());
                registerAudit.setState(Boolean.TRUE);
                registerAuditService.updateByPrimaryKeySelective(registerAudit);
            }
        }
        
        return "redirect:userAudit";
    }
    
}
