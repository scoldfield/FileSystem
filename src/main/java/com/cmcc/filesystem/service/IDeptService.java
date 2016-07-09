package com.cmcc.filesystem.service;

import java.util.List;

import com.cmcc.filesystem.entity.Dept;

public interface IDeptService {
	int deleteByPrimaryKey(Long id);

    int insert(Dept record);

    int insertSelective(Dept record);

    Dept selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Dept record);

    int updateByPrimaryKey(Dept record);
    
    List<Dept> findAll();
    
    Dept findByDeptName(String deptName);
}
