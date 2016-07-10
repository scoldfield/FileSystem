package com.cmcc.test;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import com.cmcc.filesystem.dao.FileMapper;
import com.cmcc.filesystem.dao.UserMapper;
import com.cmcc.filesystem.entity.File;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.util.ManagerUtils;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:spring/spring-config.xml" })
//@TransactionConfiguration(transactionManager = "transactionManager", defaultRollback = true)
//@Transactional
public class FileDaoTest {
	
	@Autowired
	private FileMapper fileMapper;
	
	
	@Test
	public void updateSelectiveTest(){
		String fileId = "1";
		File file = fileMapper.selectByPrimaryKey(fileId);
		if(file != null){
			file.setLocation("c:\\hehe");
			fileMapper.updateSelective(file);
		}
	}
	
}
