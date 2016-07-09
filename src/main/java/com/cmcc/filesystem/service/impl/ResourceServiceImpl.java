package com.cmcc.filesystem.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmcc.filesystem.dao.ResourceMapper;
import com.cmcc.filesystem.entity.Resource;
import com.cmcc.filesystem.service.IResourceService;

@Service
public class ResourceServiceImpl implements IResourceService {

	@Autowired
	private ResourceMapper resourceMapper;
	
	public int deleteByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return resourceMapper.deleteByPrimaryKey(id);
	}

	public int insert(Resource record) {
		// TODO Auto-generated method stub
		return resourceMapper.insert(record);
	}

	public int insertSelective(Resource record) {
		// TODO Auto-generated method stub
		return resourceMapper.insertSelective(record);
	}

	public Resource selectByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return resourceMapper.selectByPrimaryKey(id);
	}

	public int updateByPrimaryKeySelective(Resource record) {
		// TODO Auto-generated method stub
		return resourceMapper.updateByPrimaryKeySelective(record);
	}

	public int updateByPrimaryKey(Resource record) {
		// TODO Auto-generated method stub
		return resourceMapper.updateByPrimaryKey(record);
	}

}
