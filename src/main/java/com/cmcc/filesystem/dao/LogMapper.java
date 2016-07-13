package com.cmcc.filesystem.dao;

import java.util.List;

import com.cmcc.filesystem.entity.Log;

public interface LogMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Log record);

    int insertSelective(Log record);

    Log selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Log record);

    int updateByPrimaryKey(Log record);
    
    List<Log> findAll();
}