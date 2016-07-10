package com.cmcc.test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.junit.Test;

public class JavaApiTest {
    
    @Test
    public void dateTest() throws ParseException {
        String date = "2016-07-04";
        Date parseDate = new SimpleDateFormat("yyyy-mm-dd").parse(date);
        
        System.out.println("parseDate = " + parseDate);
    }
    
    @Test
    public void getYearTest() throws ParseException {
    	Calendar calendar = Calendar.getInstance();
    	int year = calendar.get(Calendar.YEAR);
    	System.out.println("year = " + year);
    }

}
