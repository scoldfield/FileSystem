package com.cmcc.test;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import com.cmcc.filesystem.dao.UserMapper;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.util.ManagerUtils;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:spring/spring-config.xml" })
//@TransactionConfiguration(transactionManager = "transactionManager", defaultRollback = true)
//@Transactional
public class UserDaoTest {
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private ManagerUtils managerUtils;
	
	@Test
	public void insertTest(){
		User user = new User();
		user.setName("ldd");
		int num = userMapper.insertSelective(user);
		System.out.println("num = " + num);
	}

	@Test
	public void findByUsernameTest(){
		String username = "ldd";
		User user = userMapper.findByUsername(username);
		System.out.println("+++++++++++++++++++++ user = " + user.getUsername());
	}
	
	@Test
	public void findAllTest(){
		List<User> users = userMapper.findAll();
				
		System.out.println("+++++++++++++++++++++ users = " + users.size());
	}
	
	@Test
	public void managerUtilsTest() {
	    List<User> canBeDeptMngers = managerUtils.getCanBeDeptMngers();
	    System.out.println("canBeDeptMngers.size() = " + canBeDeptMngers.size());
	}
	
	@Test
	public void insertAndGetIdTest() {
	    User user = new User();
        user.setName("光煜");
        System.out.println("插入前userId = " + user.getId());
        userMapper.insertSelective(user);
        System.out.println("插入后userId = " + user.getId());
	}
	
}
