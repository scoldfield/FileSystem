package com.cmcc.filesystem.util;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;


public class StringUtil extends StringUtils {
	 
	public static final String ALLCHAR = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	public static final String LETTERCHAR = "abcdefghijkllmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	public static final String NUMBERCHAR = "0123456789";
	
	private static final String SEP1 = ","; 
	public static String ListToString(List<?> list) {  
		       StringBuffer sb = new StringBuffer();  
		       if (list != null && list.size() > 0) {
		           for (int i = 0; i < list.size(); i++) {
		               if (list.get(i) == null){
		                   continue;  
		               }
		               // 如果值是list类型则调用自己  
		               if (list.get(i) instanceof List){  
		                   sb.append(ListToString((List<?>) list.get(i)));  
		                   sb.append(SEP1);  
		               } else if (list.get(i) instanceof Map){
		                   sb.append(MapToString((Map<?, ?>) list.get(i)));  
		                   sb.append(SEP1);  
		               } else {
		                   sb.append(list.get(i)); 
		                   sb.append(SEP1);  
		               }  
		           } 
		           return sb.toString().substring(0,sb.length()-1) ; 
		       }else{
		    	   return "";
		       }
		    	  
		        
		   }
	
	public static String MapToString(Map<?, ?> map){
        StringBuffer sb = new StringBuffer();  
        // 遍历map  
        for (Object obj : map.keySet()){
            if (obj == null){
                continue;  
            }  
            Object key = obj;  
            Object value = map.get(key);  
            if (value instanceof List<?>){
                sb.append(key.toString() + SEP1 + ListToString((List<?>) value));  
                sb.append(SEP1);  
            } else if (value instanceof Map<?, ?>){
                sb.append(key.toString() + SEP1   + MapToString((Map<?, ?>) value));  
                sb.append(SEP1);  
            } else {
                sb.append(key.toString() + SEP1 + value.toString());  
                sb.append(SEP1);  
            }
        }  
        return sb.toString();  
    }
	
	/**
	  * 判断字符串是否是整数
	  */
	 public static boolean isInteger(String value) {
	  try {
	   Integer.parseInt(value);
	   return true;
	  } catch (NumberFormatException e) {
	   return false;
	  }
	 }

	 /**
	  * 判断字符串是否是浮点数
	  */
	 public static boolean isDouble(String value) {
	  try {
	   Double.parseDouble(value);
	   if (value.contains(".")){
		   return true;
	   }
	   
	   return false;
	  } catch (NumberFormatException e) {
	   return false;
	  }
	 }

	 /**
	  * 判断字符串是否是数字
	  */
	 public static boolean isNumber(String value) {
	  return isInteger(value) || isDouble(value);
	 }
	 
	 /**
	  * 判断数字是否为空
	  * @param value
	  * @return
	  */
	 public static boolean isNullOrEmptyString(Number value){
		 return !(null == value || "".equals(String.valueOf(value)));
	 }
	 
	 /**
	  * 根据规则截取字符串
	  * @param str1 目标字符串
	  * @param str2 匹配的字符串
	  * @param str3 前缀字符串
	  * @param str4 后缀字符串
	  * @return
	  */
	 public static String returnSub(String str1,String str2,String str3,String str4){
		 if(StringUtil.isNotEmpty(str1)){
			 str2=str3+str2+str4;
			 if(str1.indexOf(str2)!=-1){
				 return str1.substring(str1.indexOf(str2)+str2.length(), str1.indexOf("|",str1.indexOf(str2)+1));
			 }else{
				 return null;
			 }
		 }else{
			 return null;
		 }
	 }
	 
	 /**
	  * 根据规则截取字符串
	  * @param str1 目标字符串
	  * @param str2 匹配的字符串
	  * @return
	  */
	 public static String returnSub(String str1,String str2){
		 return returnSub(str1,str2,"|","_");
	 }
  
	/**
	 * 返回一个定长的随机字符串(只包含大小写字母、数字)
	 * 
	 * @param length  随机字符串长度
	 * @return 随机字符串
	 */
	public static String generateString(int length) {
		StringBuffer sb = new StringBuffer();
		Random random = new Random();
		for (int i = 0; i < length; i++) {
			sb.append(ALLCHAR.charAt(random.nextInt(ALLCHAR.length())));
		}
		return sb.toString();
	}
	
	/**
	 * 返回一个定长的随机字符串(只包含大小写字母、数字)
	 * 
	 * @param length  随机字符串长度
	 * @return 随机字符串
	 */
	public static String generateNum(int length) {
		StringBuffer sb = new StringBuffer();
		Random random = new Random();
		for (int i = 0; i < length; i++) {
			sb.append(ALLCHAR.charAt(random.nextInt(NUMBERCHAR.length())));
		}
		return sb.toString();
	}

	/**
	 * 返回一个定长的随机纯字母字符串(只包含大小写字母)
	 * 
	 * @param length 随机字符串长度
	 * @return 随机字符串
	 */
	public static String generateMixString(int length) {
		StringBuffer sb = new StringBuffer();
		Random random = new Random();
		for (int i = 0; i < length; i++) {
			sb.append(LETTERCHAR.charAt(random.nextInt(LETTERCHAR.length())));
		}
		return sb.toString();
	}

	/**
	 * 返回一个定长的随机纯小写字母字符串(只包含大小写字母)
	 * 
	 * @param length  随机字符串长度
	 * @return 随机字符串
	 */
	public static String generateLowerString(int length) {
		return generateMixString(length).toLowerCase();
	}

	/**
	 * 返回一个定长的随机纯写大字母字符串(只包含大小写字母)
	 * 
	 * @param length 随机字符串长度
	 * @return 随机字符串
	 */
	public static String generateUpperString(int length) {
		return generateMixString(length).toUpperCase();
	}
	
	/**
	 * 判断字符串的字符编码
	 * @param str
	 * @return
	 */
	public static String getEncoding(String str) {   
        String encode = "GB2312";   
       try {   
           if (str.equals(new String(str.getBytes(encode), encode))) {   
                String s = encode;   
               return s;   
            }   
        } catch (Exception exception) {   
        }   
        encode = "ISO-8859-1";   
       try {   
           if (str.equals(new String(str.getBytes(encode), encode))) {   
                String s1 = encode;   
               return s1;   
            }   
        } catch (Exception exception1) {   
        }   
        encode = "UTF-8";   
       try {   
           if (str.equals(new String(str.getBytes(encode), encode))) {   
                String s2 = encode;   
               return s2;   
            }   
        } catch (Exception exception2) {   
        }   
        encode = "GBK";   
       try {   
           if (str.equals(new String(str.getBytes(encode), encode))) {   
                String s3 = encode;   
               return s3;   
            }   
        } catch (Exception exception3) {   
        }   
       return "";   
    }   
	
		 
    public static String replaceBlank(String str) {
        String dest = "";
        if (str!=null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(str);
            dest = m.replaceAll("");
        }
        return dest;
    }
	    
} 

