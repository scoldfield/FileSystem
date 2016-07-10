package com.cmcc.filesystem.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmcc.filesystem.dao.RegisterAuditMapper;
import com.cmcc.filesystem.entity.RegisterAudit;
import com.cmcc.filesystem.service.IRegisterAuditService;

@Service
public class RegisterAuditServiceImpl implements IRegisterAuditService {

    @Autowired
    private RegisterAuditMapper registerAuditMapper;
    
    public int deleteByPrimaryKey(Long id) {
        // TODO Auto-generated method stub
        return registerAuditMapper.deleteByPrimaryKey(id);
    }

    public int insert(RegisterAudit record) {
        // TODO Auto-generated method stub
        return registerAuditMapper.insert(record);
    }

    public int insertSelective(RegisterAudit record) {
        // TODO Auto-generated method stub
        return registerAuditMapper.insertSelective(record);
    }

    public RegisterAudit selectByPrimaryKey(Long id) {
        // TODO Auto-generated method stub
        return registerAuditMapper.selectByPrimaryKey(id);
    }

    public int updateByPrimaryKeySelective(RegisterAudit record) {
        // TODO Auto-generated method stub
        return registerAuditMapper.updateByPrimaryKeySelective(record);
    }

    public int updateByPrimaryKey(RegisterAudit record) {
        // TODO Auto-generated method stub
        return registerAuditMapper.updateByPrimaryKey(record);
    }

    public List<RegisterAudit> findSelective(RegisterAudit record) {
        // TODO Auto-generated method stub
        return registerAuditMapper.findSelective(record);
    }

	public RegisterAudit findByUserId(Long userId) {
		// TODO Auto-generated method stub
		return registerAuditMapper.findByUserId(userId);
	}

}
