package com.cmcc.test;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import com.cmcc.filesystem.dao.DeptMapper;
import com.cmcc.filesystem.dao.UserMapper;
import com.cmcc.filesystem.entity.Dept;
import com.cmcc.filesystem.entity.User;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:spring/spring-config.xml" })
//@TransactionConfiguration(transactionManager = "transactionManager", defaultRollback = true)
//@Transactional
public class DeptDaoTest {
	
	@Autowired
	private DeptMapper deptMapper;
	
	@Test
	public void insertTest(){
		Dept dept = new Dept();
		dept.setDeptName("呵呵");
		dept.setDeptPhone("1234");
		dept.setPersonNum(10l);
		int num = deptMapper.insert(dept);
		System.out.println("num = " + num);
	}
	
	@Test
	public void findAllTest(){
	    List<Dept> depts = deptMapper.findAll();
	    System.out.println("depts.size() = " + depts.size());
	}
	
}
