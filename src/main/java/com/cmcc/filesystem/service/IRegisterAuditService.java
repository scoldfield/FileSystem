package com.cmcc.filesystem.service;

import java.util.List;

import com.cmcc.filesystem.entity.RegisterAudit;

public interface IRegisterAuditService {
    int deleteByPrimaryKey(Long id);

    int insert(RegisterAudit record);

    int insertSelective(RegisterAudit record);

    RegisterAudit selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(RegisterAudit record);

    int updateByPrimaryKey(RegisterAudit record);
    
    List<RegisterAudit> findSelective(RegisterAudit record);
    
    RegisterAudit findByUserId(Long userId);
}
