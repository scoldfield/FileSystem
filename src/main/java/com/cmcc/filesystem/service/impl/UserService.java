package com.cmcc.filesystem.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmcc.filesystem.dao.UserMapper;
import com.cmcc.filesystem.entity.Resource;
import com.cmcc.filesystem.entity.Role;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.service.IResourceService;
import com.cmcc.filesystem.service.IRoleService;
import com.cmcc.filesystem.service.IUserService;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private IRoleService roleService;

    @Autowired
    private IResourceService resourceService;

    public int deleteByPrimaryKey(Long id) {
        // TODO Auto-generated method stub
        return userMapper.deleteByPrimaryKey(id);
    }

    public int insert(User record) {
        // TODO Auto-generated method stub
        return userMapper.insert(record);
    }

    public int insertSelective(User record) {
        // TODO Auto-generated method stub
        return userMapper.insertSelective(record);
    }

    public User selectByPrimaryKey(Long id) {
        // TODO Auto-generated method stub
        return userMapper.selectByPrimaryKey(id);
    }

    public int updateByPrimaryKeySelective(User record) {
        // TODO Auto-generated method stub
        return userMapper.updateByPrimaryKeySelective(record);
    }

    public int updateByPrimaryKey(User record) {
        // TODO Auto-generated method stub
        return userMapper.updateByPrimaryKey(record);
    }

    public User findByUsername(String username) {
        // TODO Auto-generated method stub
        return userMapper.findByUsername(username);
    }

    public List<User> findAll() {
        // TODO Auto-generated method stub
        return userMapper.findAll();
    }

    public List<User> findBySelective(User user) {
        // TODO Auto-generated method stub
        return userMapper.findBySelective(user);
    }

    public User getCurrentUser() {
        User user = null;

        String username = (String) SecurityUtils.getSubject().getPrincipal();
        if (StringUtils.hasText(username)) {
            user = findByUsername(username);
        }

        return user;
    }

    public String getResourceIds(User user) {
        Long roleId = user.getRoleId();
        Role role = roleService.selectByPrimaryKey(roleId);
        String resourceIds = role.getResourceIds();
        
        return resourceIds;
    }

    public List<Resource> getResources(User user) {
        List<Resource> resources = new ArrayList<Resource>();
        
        String resourceIds = getResourceIds(user);
        if(StringUtils.hasText(resourceIds)) {
            String[] resIdArr = resourceIds.split(",");
            if(resIdArr.length > 0) {
                for(String resId : resIdArr) {
                    Resource resource = resourceService.selectByPrimaryKey(Long.parseLong(resId));
                    resources.add(resource);
                }
            }
        }
        
        return resources;
    }

    public List<String> getPermissions(User user) {
        List<String> permissions = new ArrayList<String>();
        
        List<Resource> resources = getResources(user);
        if(resources.size() > 0) {
            for(Resource r : resources) {
                String permission = r.getPermission();
                permissions.add(permission);
            }
        }
        
        return permissions;
    }
    
}
