package com.cmcc.filesystem.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmcc.filesystem.dao.BorrowAuditMapper;
import com.cmcc.filesystem.entity.BorrowAudit;
import com.cmcc.filesystem.service.IBorrowAuditService;

@Service
public class BorrowAuditServiceImpl implements IBorrowAuditService {

    @Autowired
    private BorrowAuditMapper borrowAuditMapper;
    
    public int deleteByPrimaryKey(Long id) {
        // TODO Auto-generated method stub
        return borrowAuditMapper.deleteByPrimaryKey(id);
    }

    public int insert(BorrowAudit record) {
        // TODO Auto-generated method stub
        return borrowAuditMapper.insert(record);
    }

    public int insertSelective(BorrowAudit record) {
        // TODO Auto-generated method stub
        return borrowAuditMapper.insertSelective(record);
    }

    public BorrowAudit selectByPrimaryKey(Long id) {
        // TODO Auto-generated method stub
        return borrowAuditMapper.selectByPrimaryKey(id);
    }

    public int updateByPrimaryKeySelective(BorrowAudit record) {
        // TODO Auto-generated method stub
        return borrowAuditMapper.updateByPrimaryKeySelective(record);
    }

    public int updateByPrimaryKey(BorrowAudit record) {
        // TODO Auto-generated method stub
        return borrowAuditMapper.updateByPrimaryKey(record);
    }

    public List<BorrowAudit> findBySelective(BorrowAudit record) {
        // TODO Auto-generated method stub
        return borrowAuditMapper.findBySelective(record);
    }

    public List<BorrowAudit> findByFileId(Long fileId) {
        // TODO Auto-generated method stub
        return borrowAuditMapper.findByFileId(fileId);
    }

	public List<BorrowAudit> findAll() {
		// TODO Auto-generated method stub
		return borrowAuditMapper.findAll();
	}

}
