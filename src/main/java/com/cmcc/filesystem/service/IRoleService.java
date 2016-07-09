package com.cmcc.filesystem.service;

import java.util.List;

import com.cmcc.filesystem.entity.Role;

public interface IRoleService {
	int deleteByPrimaryKey(Long id);

    int insert(Role record);

    int insertSelective(Role record);

    Role selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Role record);

    int updateByPrimaryKey(Role record);
    
    List<Role> findAll();
}
