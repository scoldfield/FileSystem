package com.cmcc.filesystem.dao;

import java.util.List;

import com.cmcc.filesystem.entity.UserDeptRole;
import org.apache.ibatis.annotations.Param;

public interface UserDeptRoleMapper {
    int deleteByPrimaryKey(Long id);

    int insert(UserDeptRole record);

    int insertSelective(UserDeptRole record);

    UserDeptRole selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(UserDeptRole record);

    int updateByPrimaryKey(UserDeptRole record);
    
    UserDeptRole findByUserId(String userId);
    
    List<UserDeptRole> findAll();

    List<UserDeptRole> findSelective(UserDeptRole userDeptRole);

    List<UserDeptRole> findByDeptIdAndIdDeptManager(@Param("deptId") Integer deptId, @Param("isDeptManager") Boolean isDeptManager);

    List<UserDeptRole> findByDeptIdAndIsFileManager(@Param("deptId") Integer deptId, @Param("isDeptManager") Boolean isFileManager);
}