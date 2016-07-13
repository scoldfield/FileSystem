package com.cmcc.filesystem.service;

import java.util.List;
import java.util.Set;

import com.cmcc.filesystem.entity.Resource;
import com.cmcc.filesystem.entity.User;

public interface IResourceService {
    int deleteByPrimaryKey(Long id);

    int insert(Resource record);

    int insertSelective(Resource record);

    Resource selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Resource record);

    int updateByPrimaryKey(Resource record);
    
    /*
     * 获取登录用户的所有权限Resource
     */
    List<Resource> getUserResources();

    List<Resource> findAll();
}
