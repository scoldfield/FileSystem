package com.cmcc.filesystem.dto;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.cmcc.filesystem.entity.Dept;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.entity.UserDeptRole;
import com.cmcc.filesystem.service.IUserDeptRoleService;
import com.cmcc.filesystem.service.IUserService;

public class DeptDto {
    private Long id;

    private String deptName;
    
    private String deptManager;

    private String deptManagerId;
    
    private String fileManager;

    private String fileManagerId;

    private String deptPhone;

    private Long personNum;

    private static final long serialVersionUID = 1L;
    

    public DeptDto() {
        
    }
    
    public DeptDto(Dept dept) {
        this.id = dept.getId();
        this.deptName = dept.getDeptName();
        this.deptPhone = dept.getDeptPhone();
        this.personNum = dept.getPersonNum();
    }
    
    public String getDeptManagerId() {
        return deptManagerId;
    }

    public void setDeptManagerId(String deptManagerId) {
        this.deptManagerId = deptManagerId;
    }

    public String getFileManagerId() {
        return fileManagerId;
    }

    public void setFileManagerId(String fileManagerId) {
        this.fileManagerId = fileManagerId;
    }

    public String getDeptManager() {
        return deptManager;
    }

    public void setDeptManager(String deptManager) {
        this.deptManager = deptManager;
    }

    public String getFileManager() {
        return fileManager;
    }

    public void setFileManager(String fileManager) {
        this.fileManager = fileManager;
    }

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
