package com.cmcc.filesystem.ws;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;


@XmlAccessorType(XmlAccessType.FIELD) 
public class ContactInfo {
   Integer contactId;
   
   String contactName;
   
   String telephone;
   
   @XmlElement(name="ContactInfo")
   List<ContactInfo> contactInfo;
   
public Integer getContactId() {
	return contactId;
}

public void setContactId(Integer contactId) {
	this.contactId = contactId;
}

public String getContactName() {
	return contactName;
}

public void setContactName(String contactName) {
	this.contactName = contactName;
}

public String getTelephone() {
	return telephone;
}

public void setTelephone(String telephone) {
	this.telephone = telephone;
}

public List<ContactInfo> getContactInfo() {
	return contactInfo;
}

public void setContactInfo(List<ContactInfo> contactInfo) {
	this.contactInfo = contactInfo;
}


   
   
    
}
