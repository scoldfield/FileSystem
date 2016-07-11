package com.cmcc.filesystem.service;

import com.cmcc.filesystem.entity.Log;

public interface ILogService {
    int deleteByPrimaryKey(Long id);

    int insert(Log record);

    int insertSelective(Log record);

    Log selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Log record);

    int updateByPrimaryKey(Log record);
}
