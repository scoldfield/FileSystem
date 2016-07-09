package com.cmcc.test;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import com.cmcc.filesystem.dao.UserDeptRoleMapper;
import com.cmcc.filesystem.dao.UserMapper;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.entity.UserDeptRole;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:spring/spring-config.xml" })
//@TransactionConfiguration(transactionManager = "transactionManager", defaultRollback = true)
//@Transactional
public class UserDeptRoleDaoTest {
	
	@Autowired
	private UserDeptRoleMapper userDeptRoleMapper;
	
	@Test
	public void findByUserIdTest(){
		String userId = "7";
		UserDeptRole userDeptRole = userDeptRoleMapper.findByUserId(userId);
		System.out.println("userDeptRole = " + userDeptRole);
	}
	
	@Test
	public void insertSelectiveTest(){
	    UserDeptRole udr = new UserDeptRole();
	    udr.setUserId(1l);
	    udr.setDeptId(1l);
	    udr.setRoleId(1l);
	    udr.setIsDeptManager(Boolean.TRUE);
	    udr.setIsFileManager(Boolean.TRUE);
	    int num = userDeptRoleMapper.insertSelective(udr);
	    System.out.println("num = " + num);
	}

	
}
