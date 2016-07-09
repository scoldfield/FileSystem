package com.cmcc.filesystem.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmcc.filesystem.dao.FileMapper;
import com.cmcc.filesystem.entity.File;
import com.cmcc.filesystem.service.IFileService;

@Service
public class FileServiceImpl implements IFileService {

	@Autowired
	private FileMapper fileMapper;
	
	public int insert(File record) {
		// TODO Auto-generated method stub
		return fileMapper.insert(record);
	}

	public int insertSelective(File record) {
		// TODO Auto-generated method stub
		return fileMapper.insertSelective(record);
	}

    public List<File> findAll() {
        // TODO Auto-generated method stub
        return fileMapper.findAll();
    }

    public int updateSelective(File file) {
        return fileMapper.updateSelective(file);
    }

    public File selectByPrimaryKey(String id) {
        // TODO Auto-generated method stub
        return fileMapper.selectByPrimaryKey(id);
    }

    public List<File> findLikeSelective(File file) {
        // TODO Auto-generated method stub
        return fileMapper.findLikeSelective(file);
    }

    public List<File> findSelective(File file) {
        // TODO Auto-generated method stub
        return fileMapper.findSelective(file);
    }

}
