package com.cmcc.filesystem.service;

import java.util.List;

import com.cmcc.filesystem.entity.Resource;
import com.cmcc.filesystem.entity.User;

public interface IUserService {
    int deleteByPrimaryKey(Long id);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);
    
    User findByUsername(String username);
    
    List<User> findAll();
    
    List<User> findBySelective(User user);
    
    User getCurrentUser();
    
    String getResourceIds(User user);
    
    List<Resource> getResources(User user);
    
    List<String> getPermissions(User user);
}
