package com.cmcc.filesystem.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.entity.UserDeptRole;
import com.cmcc.filesystem.service.IUserDeptRoleService;
import com.cmcc.filesystem.service.IUserService;

@Component
public class ManagerUtils {
    
    @Autowired
    private IUserDeptRoleService userDeptRoleService;
    
    @Autowired
    private IUserService userService;

    public List<User> getCanBeDeptMngers() {
        List<User> canBeDeptMngers = new ArrayList<User>();
        List<User> users = userService.findAll();
        
        for(User u : users){
            UserDeptRole userDeptRole = userDeptRoleService.findByUserId(u.getId() + "");
            if(userDeptRole != null && (userDeptRole.getIsDeptManager() || userDeptRole.getIsFileManager())){
                continue;
            } else{
                canBeDeptMngers.add(u);
            }
        }
        return canBeDeptMngers;
    }

    public List<User> getCanBeFileMngers() {
        List<User> canBeFileMngers = new ArrayList<User>();
        List<User> users = userService.findAll();
        
        for(User u : users){
            UserDeptRole userDeptRole = userDeptRoleService.findByUserId(u.getId() + "");
            if(userDeptRole != null && (userDeptRole.getIsDeptManager() || userDeptRole.getIsFileManager())){
                continue;
            } else{
                canBeFileMngers.add(u);
            }
        }
        return canBeFileMngers;
    }
    
    public void updateDeptManager(long id, String deptId, String managerId) {
        UserDeptRole userDeptRole = new UserDeptRole();
        userDeptRole.setId(id);
        userDeptRole.setUserId(Long.parseLong(managerId));
        userDeptRole.setDeptId(Long.parseLong(deptId));
        userDeptRole.setIsDeptManager(Boolean.TRUE);
        userDeptRoleService.updateByPrimaryKeySelective(userDeptRole);
    }
    
    public void createDeptManager(long id, String deptId, String deptManagerId) {
        UserDeptRole userDeptRole = new UserDeptRole();
        userDeptRole.setId(id);
        userDeptRole.setUserId(Long.parseLong(deptManagerId));
        userDeptRole.setDeptId(Long.parseLong(deptId));
        userDeptRole.setIsDeptManager(Boolean.TRUE);
        userDeptRoleService.insertSelective(userDeptRole);
    }
    
    public void updateFileManager(long id, String deptId, String fileManagerId) {
        UserDeptRole userDeptRole = new UserDeptRole();
        userDeptRole.setId(id);
        userDeptRole.setUserId(Long.parseLong(fileManagerId));
        userDeptRole.setDeptId(Long.parseLong(deptId));
        userDeptRole.setIsFileManager(Boolean.TRUE);
        userDeptRoleService.updateByPrimaryKeySelective(userDeptRole);
    }
    
    public void createFileManager(long id, String deptId, String fileManagerId) {
        UserDeptRole userDeptRole = new UserDeptRole();
        userDeptRole.setId(id);
        userDeptRole.setUserId(Long.parseLong(fileManagerId));
        userDeptRole.setDeptId(Long.parseLong(deptId));
        userDeptRole.setIsFileManager(Boolean.TRUE);
        userDeptRoleService.insertSelective(userDeptRole);
    }
}
