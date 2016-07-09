package com.cmcc.filesystem.service;

import java.util.List;

import com.cmcc.filesystem.entity.Resource;

public interface IResourceService {
	int deleteByPrimaryKey(Long id);

    int insert(Resource record);

    int insertSelective(Resource record);

    Resource selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Resource record);

    int updateByPrimaryKey(Resource record);
    
}
