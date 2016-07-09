package com.cmcc.filesystem.app.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.NoSuchElementException;
import java.util.Properties;
import java.util.ResourceBundle;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

/**
 * 加载system.properties
 * @author zhuxy
 *
 */
public class Config {
	private static Logger logger = LoggerFactory.getLogger(Config.class);
	private static ResourceBundle resources=null;
	private static ResourceBundle namedResources = null;
	
	private static String configFilePath="classpath:/system.properties";
	private static ResourceLoader resourceLoader = new DefaultResourceLoader();
	private static Properties properties=null;

	public Config(String... resourcesPaths) {
		properties = loadProperties(resourcesPaths);
	}
	
	/**
	 * 获取配置文件
	 * @return
	 */
	public static Properties loadDefaultConfig() {
		return properties = loadProperties(configFilePath);
	}
	
	/**
	 * 载入多个文件, 文件路径使用Spring Resource格式.
	 */
	private static Properties loadProperties(String... resourcesPaths) {
		Properties props = new Properties();

		for (String location : resourcesPaths) {

			logger.debug("Loading properties file from path:{}", location);

			InputStream is = null;
			try {
				Resource resource = resourceLoader.getResource(location);
				is = resource.getInputStream();
				props.load(is);
			} catch (IOException ex) {
				logger.info("Could not load properties from path:{}, {} ", location, ex.getMessage());
			} finally {
				IOUtils.closeQuietly(is);
			}
		}
		return props;
	}
	
	/**
	 * 取出Property。
	 */
	private String getValue(String key) {
		String systemProperty = System.getProperty(key);
		if (systemProperty != null) {
			return systemProperty;
		}
		return properties.getProperty(key);
	}

	/**
	 * 取出String类型的Property,如果都為Null则抛出异常.
	 */
	public String getProperty(String key) {
		String value = getValue(key);
		if (value == null) {
			throw new NoSuchElementException();
		}
		return value;
	}
	
	private static void getBundle(){
        try {
            resources = ResourceBundle.getBundle("system", Locale.getDefault());
        } catch (MissingResourceException mre) {
        	logger.error("No resauce exist!");
        }
    }
	
	private static void getNamedBundle(String filename){
		try {
			namedResources = ResourceBundle.getBundle(filename, Locale.getDefault());
        } catch (MissingResourceException mre) {
        	logger.error("Can't find this file:{}", filename);;
        }
	}
	
	public static String getValue(String key, String filename){
		getNamedBundle(filename);
    	try{
    		return namedResources.getString(key);	
		}catch(Exception e){
			return null;
		}
    }
    
    private static boolean checkResources(){
    	if(resources==null){
    		getBundle();
    	}
    		
    	return (resources!=null);
    }
    
    
    private static boolean changeToBoolean(String str)throws Exception{
    	String tmp = str.toLowerCase();
    	if("true".equals(tmp)){
    		return true;
    	}else if("false".equals(tmp)){
    		return false;
    	}else{
    		throw new Exception("不能找到资源文件");
    	}
    		
    }
    
    public static boolean getBoolean(String key){
    	String str = getString(key);
    	try{
    		return changeToBoolean(str);
    	}catch(Exception e){
    		return false;
    	}
    }
    
    public static boolean getBoolean(String key,boolean defaultValue){
    	String str = getString(key);
    	try{
    		return changeToBoolean(str);
    	}catch(Exception e){
    		return defaultValue;
    	}
    }
    
    
    private static int changeToInt(String str)throws Exception {
    	return Integer.parseInt(str);
    }
    
    public static int getInt(String key){
    	String str = getString(key);    	
    	try{
    		return changeToInt(str);
    	}catch(Exception e){
    		return 0;
    	}   		
    }
    
    public static int getInt(String key,int defaultValue){
    	String str = getString(key);    	
    	try{
    		return changeToInt(str);
    	}catch(Exception e){
    		return defaultValue;
    	}   		
    }
    
    
    
    public static String getString(String key,String defaultValue){
    	String tmp = null;
    	if(checkResources()){
    		try{
	    		tmp = resources.getString(key);	
    		}catch(Exception e){
    			tmp = defaultValue;
    		}
    	}    
	    return tmp;
    }
    
    public static String getString(String key){
    	if(checkResources()){    	
    		try{
	    		return resources.getString(key);	
    		}catch(Exception e){
    			;
    		}
    	}
	    return null;
    }
    
    public static String[] getStringArray(String key){
    	if(checkResources()){
    		return resources.getStringArray(key);	    
    	}
	    	
	    return null;
    }
    
    public static Enumeration<String> getKeys(){
    	return resources.getKeys()	;
    }
    
}
