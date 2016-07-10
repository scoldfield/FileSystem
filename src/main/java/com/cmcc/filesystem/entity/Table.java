package com.cmcc.filesystem.entity;

import java.util.HashMap;
import java.util.Map;

public class Table {
	private Integer year;		//年份
//	private Integer secret1;    //绝密的个数
//    private Integer secret2;    //机密的个数
//    private Integer secret3;    //秘密的个数
//    private Integer secret4;    //内部的个数
//    private Integer secret5;    //普通的个数
    private Integer yearTotal;  //该年总计
    
    private Map<String, Integer> secret = new HashMap<String, Integer>();	//密级等级：个数，如：1:5
    
    
    public Map<String, Integer> getSecret() {
		return secret;
	}
	public void setSecret(Map<String, Integer> secret) {
		this.secret = secret;
	}
	public Integer getYear() {
		return year;
	}
	public void setYear(Integer year) {
		this.year = year;
	}
	public Integer getYearTotal() {
        return yearTotal;
    }
    public void setYearTotal(Integer yearTotal) {
        this.yearTotal = yearTotal;
    }
//    public Integer getSecret1() {
//        return secret1;
//    }
//    public void setSecret1(Integer secret1) {
//        this.secret1 = secret1;
//    }
//    public Integer getSecret2() {
//        return secret2;
//    }
//    public void setSecret2(Integer secret2) {
//        this.secret2 = secret2;
//    }
//    public Integer getSecret3() {
//        return secret3;
//    }
//    public void setSecret3(Integer secret3) {
//        this.secret3 = secret3;
//    }
//    public Integer getSecret4() {
//        return secret4;
//    }
//    public void setSecret4(Integer secret4) {
//        this.secret4 = secret4;
//    }
//    public Integer getSecret5() {
//        return secret5;
//    }
//    public void setSecret5(Integer secret5) {
//        this.secret5 = secret5;
//    }
}
