package com.cmcc.filesystem.dao;

import java.util.List;

import com.cmcc.filesystem.entity.File;

public interface FileMapper {
    int insert(File record);

    int insertSelective(File record);
    
    List<File> findAll();
    
    int updateSelective(File file);
    
    File selectByPrimaryKey(String id);
    
    List<File> findLikeSelective(File file);

    List<File> findSelective(File file);
}