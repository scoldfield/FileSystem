package com.cmcc.test;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import com.cmcc.filesystem.dao.BorrowAuditMapper;
import com.cmcc.filesystem.dao.DeptMapper;
import com.cmcc.filesystem.dao.UserMapper;
import com.cmcc.filesystem.entity.BorrowAudit;
import com.cmcc.filesystem.entity.Dept;
import com.cmcc.filesystem.entity.User;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:spring/spring-config.xml" })
//@TransactionConfiguration(transactionManager = "transactionManager", defaultRollback = true)
//@Transactional
public class BorrowAuditMapperTest {
	
	@Autowired
	private BorrowAuditMapper badm;
	
	@Test
	public void findBySelectiveTest(){
	    BorrowAudit ba = new BorrowAudit();
	    ba.setDeptId(1l);
	    List<BorrowAudit> bas = badm.findBySelective(ba);
	    System.out.println("bas.size() = " + bas.size());
	}
	
}
