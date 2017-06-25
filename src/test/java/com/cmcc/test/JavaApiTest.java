package com.cmcc.test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.junit.Test;

public class JavaApiTest {
    
    @Test
    public void dateTest() throws ParseException {
        SimpleDateFormat formater = new SimpleDateFormat("yyyy-mm-dd");

        //String——>Date
        String date = "2016-07-04";
        Date parseDate = formater.parse(date);

        //Date——>String
        Date current = new Date();
        String formatDate = formater.format(current);
        System.out.println("parseDate = " + parseDate + ", formatDate = " + formatDate);

        //综合应用
//        String date2 = "Sat Jul 09 00:00:00 CST 2016";
        Date source = new Date("Sat Jul 09 00:00:00 CST 2016");
//        Date source = new SimpleDateFormat().parse(date2);
        String format = new SimpleDateFormat("yyyy-mm-dd HH:MM:SS").format(source);
        System.out.println("format = " + format);
    }
    
    @Test
    public void getYearTest() throws ParseException {
    	Calendar calendar = Calendar.getInstance();
    	int year = calendar.get(Calendar.YEAR);
    	System.out.println("year = " + year);
    }

}
