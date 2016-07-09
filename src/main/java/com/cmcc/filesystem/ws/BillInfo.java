package com.cmcc.filesystem.ws;

import java.io.Serializable;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

import com.cmcc.filesystem.constant.Constants;



@XmlAccessorType(XmlAccessType.FIELD)  
public class BillInfo implements Serializable{
	
	Long id;
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@XmlElement(name = "streamNo",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private String streamNo;
	
	@XmlElement(name = "userNo",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private String userNo;
	
	@XmlElement(name = "telephone",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private String telephone;
	
	@XmlElement(name = "startTime",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private String startTime;
	
	@XmlElement(name = "usedSecond",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private String usedSecond;
	
	@XmlElement(name = "FA",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private String FA;
	
	@XmlElement(name="BillInfo",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private List<BillInfo> billInfo;


	public String getStreamNo() {
		return streamNo;
	}

	public void setStreamNo(String streamNo) {
		this.streamNo = streamNo;
	}

	public String getUserNo() {
		return userNo;
	}

	public void setUserNo(String userNo) {
		this.userNo = userNo;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getUsedSecond() {
		return usedSecond;
	}

	public void setUsedSecond(String usedSecond) {
		this.usedSecond = usedSecond;
	}

	public String getFA() {
		return FA;
	}

	public void setFA(String fA) {
		FA = fA;
	}

	public List<BillInfo> getBillInfo() {
		return billInfo;
	}

	public void setBillInfo(List<BillInfo> billInfo) {
		this.billInfo = billInfo;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	

}
