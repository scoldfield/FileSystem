package com.cmcc.filesystem.service;

import java.util.List;

import com.cmcc.filesystem.entity.UserDeptRole;

public interface IUserDeptRoleService {
	int deleteByPrimaryKey(Long id);

    int insert(UserDeptRole record);

    int insertSelective(UserDeptRole record);

    UserDeptRole selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(UserDeptRole record);

    int updateByPrimaryKey(UserDeptRole record);
    
    UserDeptRole findByUserId(String userId);
    
    List<UserDeptRole> findAll();
    
    List<UserDeptRole> findSelective(UserDeptRole userDeptRole);

    List<UserDeptRole> findByDeptIdAndIdDeptManager(Integer deptId, Boolean isDeptManager);

    List<UserDeptRole> findByDeptIdAndIsFileManager(Integer deptId, Boolean isFileManager);
}
