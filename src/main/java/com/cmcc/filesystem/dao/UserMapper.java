package com.cmcc.filesystem.dao;

import java.util.List;

import com.cmcc.filesystem.entity.User;

public interface UserMapper {
    int deleteByPrimaryKey(Long id);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);
    
    User findByUsername(String username);
    
    List<User> findAll();
    
    List<User> findBySelective(User user);
}