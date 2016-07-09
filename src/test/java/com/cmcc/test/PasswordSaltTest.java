package com.cmcc.test;

import java.util.Random;

import org.junit.Test;

public class PasswordSaltTest {
	
	@Test
	public void generateSaltTest(){
		Random random = new Random(100);
		int nextInt = random.nextInt();
		System.out.println("+++++++++++++++++++++++++++++++++++++++++++");
		System.out.println("nextInt = " + nextInt);
		System.out.println("after toHexString()...");
		
		String hexString = Integer.toHexString(nextInt);
		System.out.println("hexString = " + hexString);
		System.out.println("+++++++++++++++++++++++++++++++++++++++++++");
	}

}
