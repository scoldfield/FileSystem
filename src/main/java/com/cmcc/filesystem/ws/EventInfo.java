package com.cmcc.filesystem.ws;

import java.io.Serializable;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

import com.cmcc.filesystem.constant.Constants;



@XmlAccessorType(XmlAccessType.FIELD)  
public class EventInfo implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@XmlElement(name = "userNo",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private String userNo;
	
	@XmlElement(name = "userType",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private Integer userType;
	
	@XmlElement(name = "occurTime",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private String occurTime;
	
	@XmlElement(name = "machineNo",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private String machineNo;
	
	@XmlElement(name = "stateFlag",namespace=Constants.ATTENDANCE_TARGETSPACE)
	private Integer stateFlag;
	
	@XmlElement(name="EventInfo",namespace=Constants.ATTENDANCE_TARGETSPACE)
	List<EventInfo> eventlist;

	public List<EventInfo> getEventlist() {
		return eventlist;
	}

	public void setEventlist(List<EventInfo> eventlist) {
		this.eventlist = eventlist;
	}

	public String getUserNo() {
		return userNo;
	}

	public void setUserNo(String userNo) {
		this.userNo = userNo;
	}

	public Integer getUserType() {
		return userType;
	}

	public void setUserType(Integer userType) {
		this.userType = userType;
	}

	public String getOccurTime() {
		return occurTime;
	}

	public void setOccurTime(String occurTime) {
		this.occurTime = occurTime;
	}

	public String getMachineNo() {
		return machineNo;
	}

	public void setMachineNo(String machineNo) {
		this.machineNo = machineNo;
	}

	public Integer getStateFlag() {
		return stateFlag;
	}

	public void setStateFlag(Integer stateFlag) {
		this.stateFlag = stateFlag;
	}
	
	
	
	

}
