package com.cmcc.filesystem.entity;

import java.io.Serializable;

public class Dept implements Serializable {
    private Long id;

    private String deptName;

    private String deptPhone;

    private Long personNum;
    
    private boolean state;

    public boolean isState() {
        return state;
    }

    public void setState(boolean state) {
        this.state = state;
    }

    private static final long serialVersionUID = 1L;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName == null ? null : deptName.trim();
    }

    public String getDeptPhone() {
        return deptPhone;
    }

    public void setDeptPhone(String deptPhone) {
        this.deptPhone = deptPhone == null ? null : deptPhone.trim();
    }

    public Long getPersonNum() {
        return personNum;
    }

    public void setPersonNum(Long personNum) {
        this.personNum = personNum;
    }
}