package com.cmcc.filesystem.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmcc.filesystem.dao.DeptMapper;
import com.cmcc.filesystem.entity.Dept;
import com.cmcc.filesystem.service.IDeptService;

@Service
public class DeptServiceImpl implements IDeptService {

	@Autowired
	private DeptMapper deptMapper;
	
	public int deleteByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return deptMapper.deleteByPrimaryKey(id);
	}

	public int insert(Dept record) {
		// TODO Auto-generated method stub
		return deptMapper.insert(record);
	}

	public int insertSelective(Dept record) {
		// TODO Auto-generated method stub
		return deptMapper.insertSelective(record);
	}

	public Dept selectByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return deptMapper.selectByPrimaryKey(id);
	}

	public int updateByPrimaryKeySelective(Dept record) {
		// TODO Auto-generated method stub
		return deptMapper.updateByPrimaryKeySelective(record);
	}

	public int updateByPrimaryKey(Dept record) {
		// TODO Auto-generated method stub
		return deptMapper.updateByPrimaryKey(record);
	}

	public List<Dept> findAll() {
		// TODO Auto-generated method stub
		return deptMapper.findAll();
	}

	public Dept findByDeptName(String deptName) {
		// TODO Auto-generated method stub
		return deptMapper.findByDeptName(deptName);
	}

}
