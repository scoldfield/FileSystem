package com.cmcc.filesystem.util;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.MissingResourceException;
import java.util.Random;
import java.util.ResourceBundle;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;

import com.cmcc.filesystem.util.pagehelper.PageInfo;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;


public class Utility<T> {
	private final static Logger logger = Logger.getLogger(Utility.class);
	public static final Boolean DEVELOPED = Boolean.parseBoolean(Utility.getConfigProperty("DEVELOPED"));
	
	private static ResourceBundle resources=null;
	
	public static String getConfigProperty(String key) {
		logger.info(" key :" +key);
		if(checkResources()){    	
    		try{
    			logger.info("The return value is : "+resources.getString(key));
	    		return resources.getString(key);	
    		}catch(Exception e){
    			
    		}
    	}
	    return null;
	}
	
	private static boolean checkResources(){
    	if(resources==null){
    		getBundle();
    		
    	}
    		
    	return (resources!=null);
	}
	
	private static void getBundle(){
        try {
            resources = ResourceBundle.getBundle("system", Locale.getDefault());
        } catch (MissingResourceException mre) {
           
        }
    }

	
	public static String createJsonStr(Map<String, Object> jsonMap) {
		if (jsonMap == null) {
			logger.info("The incoming parameter is empty . jsonMap is null");
			return null;
		}
		JSONObject json = new JSONObject();
		json.putAll(jsonMap);
		String ret = json.toString();
		json.clear();
		json=null;
		logger.info("ret : "+ret);
		return ret;
	}
	
	public static String createJsonStr(List<?> jsonList) {

		if (jsonList == null){
			logger.info("The incoming parameter is empty . jsonList is null");
			return null;
		}
			

		JSONArray json = new JSONArray();

		int i = 0;
		for (; i < jsonList.size(); i++){
			json.add(i, jsonList.get(i));
		}
			
		String ret = json.toString();
		json.clear();
		json=null;
		logger.info("ret : "+ret);
		return ret;
	}
	
	public static String createJsonStr(PageInfo<?> jsonList) {
		logger.info("The data returned is " +JSONObject.fromObject(jsonList).toString());
		return JSONObject.fromObject(jsonList).toString();
	}
	
	public static String createJsonString(List<?> jsonList) {
		logger.info("jsonList : " +jsonList);
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (int i = 0; i < jsonList.size(); i++){
			sb.append(jsonList.get(i)+",");
			}
		String ret  = sb.substring(0, sb.length()-1);
		ret = ret+"]";
		logger.info("ret : "+ret);
		return ret;
	}
	
	public static String getPassword(){
		//int code = (int)((Math.random()*9+1)*10000000);
		return "123456";
	}
	
	public static String getInvitecode(){
		int code = (int)((Math.random()*9+1)*100000000);
		return code+"";
	}

	public static boolean checkMobile(String mobile){
		String regExp = "^13\\d{9}$|^14\\d{9}$|^15\\d{9}$|^18\\d{9}$|^17\\d{9}$|^16\\d{9}$";
		Pattern p = Pattern.compile(regExp);
		Matcher m = p.matcher(mobile);
		return m.find();
	}
	
	public static boolean isNumeric(String str){
	    for (int i = str.length();--i>=0;){   
		   if (!Character.isDigit(str.charAt(i))){
			  return false;
		   }
	    }
	    return true;
	}
	
	public static String getRandomNumber(int n){
	     int temp = 0;
	     int min = (int) Math.pow(10, n-1);
	     int max = (int) Math.pow(10, n);
		 Random rand = new Random();
	     while(true){
		     temp = rand.nextInt(max);
			     if(temp >= min){
			    	 break;
			     }
			    	
		     }
	     return temp+"";
	 }
	
	
	public static String getJSONFromObject(Object o) {
		String ret = JSONObject.fromObject(o, cfg()).toString();
		logger.info("ret : "+ret);
		return ret;
	}
	
	public static JsonConfig cfg() {
		JsonConfig cfg = new JsonConfig();
		cfg.registerJsonValueProcessor(java.util.Date.class,
				new JsonValueProcessorImpl("yyyy-MM-dd HH:mm:ss"));
		cfg.registerJsonValueProcessor(java.sql.Date.class,
				new JsonValueProcessorImpl("yyyy-MM-dd HH:mm:ss"));
			return cfg;
	}
}
