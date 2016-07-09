package com.cmcc.filesystem.dao;

import java.util.List;

import com.cmcc.filesystem.entity.RegisterAudit;

public interface RegisterAuditMapper {
    int deleteByPrimaryKey(Long id);

    int insert(RegisterAudit record);

    int insertSelective(RegisterAudit record);

    RegisterAudit selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(RegisterAudit record);

    int updateByPrimaryKey(RegisterAudit record);

    List<RegisterAudit> findSelective(RegisterAudit record);
}