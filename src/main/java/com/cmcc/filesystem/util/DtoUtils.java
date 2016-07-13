package com.cmcc.filesystem.util;

import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.shiro.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.cmcc.filesystem.constant.Constants;
import com.cmcc.filesystem.dto.BorrowAuditDto;
import com.cmcc.filesystem.dto.DeptDto;
import com.cmcc.filesystem.dto.FileDto;
import com.cmcc.filesystem.dto.RegisterAuditDto;
import com.cmcc.filesystem.dto.RoleDto;
import com.cmcc.filesystem.dto.UserDto;
import com.cmcc.filesystem.entity.BorrowAudit;
import com.cmcc.filesystem.entity.Dept;
import com.cmcc.filesystem.entity.File;
import com.cmcc.filesystem.entity.RegisterAudit;
import com.cmcc.filesystem.entity.Resource;
import com.cmcc.filesystem.entity.Role;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.entity.UserDeptRole;
import com.cmcc.filesystem.service.IDeptService;
import com.cmcc.filesystem.service.IFileService;
import com.cmcc.filesystem.service.IResourceService;
import com.cmcc.filesystem.service.IRoleService;
import com.cmcc.filesystem.service.IUserDeptRoleService;
import com.cmcc.filesystem.service.IUserService;

@Component
public class DtoUtils {
    
    @Autowired
    private IUserDeptRoleService userDeptRoleService;
    
    @Autowired
    private IUserService userService;
    
    @Autowired
    private IDeptService deptService;
    
    @Autowired
    private IRoleService roleService;
    
    @Autowired
    private IResourceService resourceService;
    
    @Autowired
    private IFileService fileService;
    
    
    public DeptDto deptToDeptDto(Dept d) {
        DeptDto deptDto = new DeptDto(d);
        
        //设置部门管理员名字
        UserDeptRole udr = new UserDeptRole();
        udr.setDeptId(d.getId());
        udr.setIsDeptManager(Boolean.TRUE);
        List<UserDeptRole> userDeptRoles = userDeptRoleService.findSelective(udr);
        if(userDeptRoles.size() > 0) {
            //若找到，那么只有一个
            UserDeptRole userDeptRole = userDeptRoles.get(0);
            
            Long userId = userDeptRole.getUserId();
            User user = userService.selectByPrimaryKey(userId);
            deptDto.setDeptManager(user.getName());
            deptDto.setDeptManagerId(userId + "");
        }
        
        //设置部门档案管理员名字
        userDeptRoles.clear();
        udr = new UserDeptRole();
        udr.setDeptId(d.getId());
        udr.setIsFileManager(Boolean.TRUE);
        userDeptRoles = userDeptRoleService.findSelective(udr);
        if(userDeptRoles.size() > 0) {
            //若找到，那么只有一个
            UserDeptRole userDeptRole = userDeptRoles.get(0);
            
            Long userId = userDeptRole.getUserId();
            User user = userService.selectByPrimaryKey(userId);
            deptDto.setFileManager(user.getName());
            deptDto.setFileManagerId(userId + "");
        }
        
        return deptDto;
    }
    
    public Dept deptDtoToDept(DeptDto deptDto) {
        Dept dept = new Dept();
        dept.setId(deptDto.getId());
        dept.setDeptName(deptDto.getDeptName());
        dept.setDeptPhone(deptDto.getDeptPhone());
        dept.setPersonNum(deptDto.getPersonNum());
        
        return dept;
    }
    
    public UserDto userToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setCreateTime(user.getCreateTime());
        userDto.setDept(user.getDept());
        userDto.setId(user.getId());
        userDto.setIp(user.getIp());
        userDto.setJobId(user.getJobId());
        userDto.setLastAccessTime(user.getLastAccessTime());
        userDto.setMobile(user.getMobile());
        userDto.setName(user.getName());
        userDto.setPassword(user.getPassword());
        userDto.setPosition(user.getPosition());
        userDto.setSalt(user.getSalt());
        userDto.setSex(user.getSex());
        userDto.setState(user.getState());
        userDto.setUsername(user.getUsername());
        Long roleId = user.getRoleId();
        if(roleId != null) {
            Role role = roleService.selectByPrimaryKey(roleId);
            if(role != null) {
                String roleName = role.getName();
                userDto.setRoleName(roleName);
                userDto.setRoleId(roleId);
                
                String resourceIds = role.getResourceIds();
                List<String> resourceNames = new ArrayList<String>();
                if(StringUtils.hasText(resourceIds)) {
                    String[] resourceIdArr = resourceIds.split(",");
                    if(resourceIdArr.length > 0) {
                        for(String resId : resourceIdArr) {
                            Resource resource = resourceService.selectByPrimaryKey(Long.parseLong(resId));
                            if(resource != null) {
                                resourceNames.add(resource.getName());
                            }
                        }
                    }
                }
                
                userDto.setResourceIds(resourceIds);
                userDto.setResourceNames(resourceNames);
            }
        }

        Long deptId = user.getDeptId();
        if(deptId != null) {
            Dept dept = deptService.selectByPrimaryKey(deptId);
            if(dept != null) {
                userDto.setDeptId(deptId + "");
                userDto.setDept(dept.getDeptName());
            }
        }
        
        UserDeptRole udr = userDeptRoleService.findByUserId(user.getId() + "");
        if(udr != null) {
            Boolean isDeptManager = udr.getIsDeptManager();
            Boolean isFileManager = udr.getIsFileManager();
            
            userDto.setDeptManager(isDeptManager);
            userDto.setFileManager(isFileManager);
        }
        
        return userDto;
    }
    
    public User userDtoToUser(UserDto userDto) {
        User user = new User();
        user.setCreateTime(userDto.getCreateTime());
        user.setDept(userDto.getDept());
        user.setId(userDto.getId());
        user.setIp(userDto.getIp());
        user.setJobId(userDto.getJobId());
        user.setLastAccessTime(userDto.getLastAccessTime());
        user.setMobile(userDto.getMobile());
        user.setName(userDto.getName());
        user.setPassword(userDto.getPassword());
        user.setPosition(userDto.getPosition());
        user.setSalt(userDto.getSalt());
        user.setSex(userDto.getSex());
        user.setState(userDto.getState());
        user.setUsername(userDto.getUsername());
        user.setDeptId(Long.parseLong(userDto.getDeptId()));
        user.setRoleId(userDto.getRoleId());
        
        return user;
    }
    
    public FileDto fileToFileDto(File file) throws IllegalAccessException, InvocationTargetException {
        FileDto fileDto = new FileDto();
        BeanUtils.copyProperties(fileDto, file);
        //设置字符串格式generateDateStr字段
        Date generateDate = file.getGenerateDate();
        if(generateDate != null) {
            fileDto.setGenerateDateStr(new SimpleDateFormat("yyyy-mm-dd").format(generateDate));
        }
        
        User receiveUser = userService.selectByPrimaryKey(file.getReceiveUserId());
        Dept belongedDept = deptService.selectByPrimaryKey(file.getBelongedDeptId());
        User auditorUser = userService.selectByPrimaryKey(file.getAuditorId());
        User borrowerUser = userService.selectByPrimaryKey(file.getBorrowerId());
        
        if(receiveUser != null) {
            fileDto.setReceiveUserName(receiveUser.getName());
        }
        if(belongedDept != null) {
            fileDto.setBelongedDeptName(belongedDept.getDeptName());
        }
        if(auditorUser != null) {
            fileDto.setAuditorName(auditorUser.getName());
        }
        if(borrowerUser != null) {
            fileDto.setBorrowedName(borrowerUser.getName());
        }
        
        return fileDto;
    }

    @SuppressWarnings("deprecation")
    public File fileDtoToFile(FileDto fileDto) throws IllegalAccessException, InvocationTargetException, ParseException {
        File file = new File();
        BeanUtils.copyProperties(file, fileDto);
        
        String receiveUserName = fileDto.getReceiveUserName();
//        String auditorName = fileDto.getAuditorName();    //审核人名字
        String borrowedName = fileDto.getBorrowedName();
        String generateDateStr = fileDto.getGenerateDateStr();
        
        
        if(StringUtils.hasText(receiveUserName)) {
            User receiveUser = userService.findByUsername(receiveUserName);
            file.setReceiveUserId(receiveUser.getId());
        }
//        if(StringUtils.hasText(auditorName)) {
//            User auditorUser = userService.findByUsername(auditorName);
//            file.setAuditorId(auditorUser.getId());
//        }
        if(StringUtils.hasText(borrowedName)) {
            User borrowedUser = userService.findByUsername(borrowedName);
            file.setBorrowerId(borrowedUser.getId());
        }
        if(StringUtils.hasText(generateDateStr)) {
            Date parseDate = new SimpleDateFormat("yyyy-mm-dd").parse(generateDateStr);
            file.setGenerateDate(parseDate);
        }
        
        return file;
    }
    
    public RegisterAuditDto registerAuditToRegisterAuditDto(RegisterAudit ra) throws IllegalAccessException, InvocationTargetException {
        RegisterAuditDto rad = new RegisterAuditDto();
        if(ra != null) {
            BeanUtils.copyProperties(rad, ra);
            
            User user = userService.selectByPrimaryKey(ra.getUserId());
            Dept dept = deptService.selectByPrimaryKey(ra.getDeptId());
            if(user != null) {
                rad.setUserName(user.getName());
            }
            if(dept != null) {
                rad.setDeptName(dept.getDeptName());
            }
        }
        
        return rad;
    }
    
    public RegisterAudit registerAuditDtoToRegisterAudit(RegisterAuditDto rad) throws IllegalAccessException, InvocationTargetException {
        RegisterAudit ra = new RegisterAudit();
        if(rad != null) {
            BeanUtils.copyProperties(ra, rad);
        }
        
        return ra;
    }
    
    public RoleDto roleToRoleDto(Role role) throws IllegalAccessException, InvocationTargetException {
        RoleDto roleDto = new RoleDto();
        if(role != null) {
            BeanUtils.copyProperties(roleDto, role);
        }
        
        //已选的resourceIds设置
        String resourceIds = role.getResourceIds();
        List<Resource> resources = new ArrayList<Resource>();
        if(StringUtils.hasText(resourceIds)) {
            String[] resourceIdArr = resourceIds.split(",");
            if(resourceIdArr.length > 0) {
                for(String resId : resourceIdArr) {
                    Resource resource = resourceService.selectByPrimaryKey(Long.parseLong(resId));
                    resources.add(resource);
                }
            }
        }
        roleDto.setResources(resources);
        
        //可选的resourceIds设置
        String allResourceIds = Constants.ROLE_RESOURCEIDS.get(role.getId() + "");
        String appendResourceIds = getAppendResourceIds(allResourceIds, role.getResourceIds());
        roleDto.setAppendResourceIds(appendResourceIds);
        
        List<Resource> appendresources = new ArrayList<Resource>();
        if(StringUtils.hasText(appendResourceIds)) {
            String[] appendResourceIdArr = appendResourceIds.split(",");
            if(appendResourceIdArr.length > 0) {
                for(String resId : appendResourceIdArr) {
                    Resource resource = resourceService.selectByPrimaryKey(Long.parseLong(resId));
                    appendresources.add(resource);
                }
            }
        }
        roleDto.setAppendResources(appendresources);
        
        return roleDto;
    }
    
    public Role roleDtoToRole(RoleDto roleDto) throws IllegalAccessException, InvocationTargetException {
        Role role = new Role();
        BeanUtils.copyProperties(role, roleDto);
        
        return role;
    }
    
    //从allResourceIds中去除已经存在的origResourceIds
    private String getAppendResourceIds(String allResourceIds, String origResourceIds){
        String[] allResourceIdArr = allResourceIds.split(",");
        StringBuilder sb = new StringBuilder();
        if(allResourceIdArr.length > 0) {
            for(String resId : allResourceIdArr) {
                if(!origResourceIds.contains(resId)) {
                    sb.append(resId + ",");
                }
            }
        }
        String appendResorceIds = sb.toString();
        if(appendResorceIds.length() > 0) {
            appendResorceIds = appendResorceIds.substring(0, appendResorceIds.length() - 1);
        }
        
        return appendResorceIds;
    }
    
    public BorrowAuditDto borrowAuditToBorrowAuditDto(BorrowAudit ba) throws IllegalAccessException, InvocationTargetException {
        BorrowAuditDto bad = new BorrowAuditDto();
        if(ba != null) {
            BeanUtils.copyProperties(bad, ba);
        }
        
        File file = fileService.selectByPrimaryKey(ba.getFileId() + "");
        bad.setFileName(file.getFileTitle());
        bad.setSecretLevel(file.getSecretLevel());
        bad.setGenerateWord(file.getGenerateWord());
        bad.setFileTitle(file.getFileTitle());
        
        return bad;
    }
    
    public BorrowAudit borrowAuditDtoToBorrowAudit(BorrowAuditDto bad) throws IllegalAccessException, InvocationTargetException {
        BorrowAudit ba = new BorrowAudit();
        if(bad != null) {
            BeanUtils.copyProperties(ba, bad);
        }
        
        return ba;
    }
    
}
