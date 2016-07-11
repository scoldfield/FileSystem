package com.cmcc.filesystem.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmcc.filesystem.dao.LogMapper;
import com.cmcc.filesystem.entity.Log;
import com.cmcc.filesystem.service.ILogService;

@Service
public class LogServiceImpl implements ILogService {

    @Autowired
    private LogMapper logMapper;
    
    public int deleteByPrimaryKey(Long id) {
        // TODO Auto-generated method stub
        return logMapper.deleteByPrimaryKey(id);
    }

    public int insert(Log record) {
        // TODO Auto-generated method stub
        return logMapper.insert(record);
    }

    public int insertSelective(Log record) {
        // TODO Auto-generated method stub
        return logMapper.insertSelective(record);
    }

    public Log selectByPrimaryKey(Long id) {
        // TODO Auto-generated method stub
        return logMapper.selectByPrimaryKey(id);
    }

    public int updateByPrimaryKeySelective(Log record) {
        // TODO Auto-generated method stub
        return logMapper.updateByPrimaryKeySelective(record);
    }

    public int updateByPrimaryKey(Log record) {
        // TODO Auto-generated method stub
        return logMapper.updateByPrimaryKey(record);
    }

}
