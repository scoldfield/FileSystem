package com.cmcc.filesystem.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmcc.filesystem.dao.RoleMapper;
import com.cmcc.filesystem.entity.Role;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.service.IRoleService;
import com.cmcc.filesystem.service.IUserService;

@Service
public class RoleService implements IRoleService {

	@Autowired
	private RoleMapper roleMapper;

	public int deleteByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return roleMapper.deleteByPrimaryKey(id);
	}

	public int insert(Role record) {
		// TODO Auto-generated method stub
		return roleMapper.insert(record);
	}

	public int insertSelective(Role record) {
		// TODO Auto-generated method stub
		return roleMapper.insertSelective(record);
	}

	public Role selectByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return roleMapper.selectByPrimaryKey(id);
	}

	public int updateByPrimaryKeySelective(Role record) {
		// TODO Auto-generated method stub
		return roleMapper.updateByPrimaryKeySelective(record);
	}

	public int updateByPrimaryKey(Role record) {
		// TODO Auto-generated method stub
		return roleMapper.updateByPrimaryKey(record);
	}

    public List<Role> findAll() {
        // TODO Auto-generated method stub
        return roleMapper.findAll();
    }
	

}
