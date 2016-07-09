package com.cmcc.filesystem.ws;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

@XmlAccessorType(XmlAccessType.FIELD)  
public class WsContactInfoResultInfo implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	String streamNo;
	
	String resultCode;
	
	String resultMessage;
	
	Integer useSecond;
	
	Integer usedSecond;
	
	@XmlElement(name="contacts")
	ContactInfo contacts;

	public String getResultCode() {
		return resultCode;
	}

	public void setResultCode(String resultCode) {
		this.resultCode = resultCode;
	}

	public String getResultMessage() {
		return resultMessage;
	}

	public void setResultMessage(String resultMessage) {
		this.resultMessage = resultMessage;
	}



	public String getStreamNo() {
		return streamNo;
	}

	public void setStreamNo(String streamNo) {
		this.streamNo = streamNo;
	}

	public Integer getUsedSecond() {
		return usedSecond;
	}

	public void setUsedSecond(Integer usedSecond) {
		this.usedSecond = usedSecond;
	}

	public Integer getUseSecond() {
		return useSecond;
	}

	public void setUseSecond(Integer useSecond) {
		this.useSecond = useSecond;
	}

	public ContactInfo getContacts() {
		return contacts;
	}

	public void setContacts(ContactInfo contacts) {
		this.contacts = contacts;
	}

	
	
	
	
	

}
