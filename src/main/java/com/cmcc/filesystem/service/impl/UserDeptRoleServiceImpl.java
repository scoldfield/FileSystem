package com.cmcc.filesystem.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmcc.filesystem.dao.UserDeptRoleMapper;
import com.cmcc.filesystem.entity.UserDeptRole;
import com.cmcc.filesystem.service.IUserDeptRoleService;

@Service
public class UserDeptRoleServiceImpl implements IUserDeptRoleService {

	@Autowired
	private UserDeptRoleMapper userDeptRoleMapper;
	
	public int deleteByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return userDeptRoleMapper.deleteByPrimaryKey(id);
	}

	public int insert(UserDeptRole record) {
		// TODO Auto-generated method stub
		return userDeptRoleMapper.insert(record);
	}

	public int insertSelective(UserDeptRole record) {
		// TODO Auto-generated method stub
		return userDeptRoleMapper.insertSelective(record);
	}

	public UserDeptRole selectByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return userDeptRoleMapper.selectByPrimaryKey(id);
	}

	public int updateByPrimaryKeySelective(UserDeptRole record) {
		// TODO Auto-generated method stub
		return userDeptRoleMapper.updateByPrimaryKeySelective(record);
	}

	public int updateByPrimaryKey(UserDeptRole record) {
		// TODO Auto-generated method stub
		return userDeptRoleMapper.updateByPrimaryKey(record);
	}

	public UserDeptRole findByUserId(String userId) {
		// TODO Auto-generated method stub
		return userDeptRoleMapper.findByUserId(userId);
	}
	
	public List<UserDeptRole> findAll(){
	    return userDeptRoleMapper.findAll();
	}

    public List<UserDeptRole> findSelective(UserDeptRole userDeptRole) {
        // TODO Auto-generated method stub
        return userDeptRoleMapper.findSelective(userDeptRole);
    }

}
