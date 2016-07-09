package com.cmcc.filesystem.entity;

import java.io.Serializable;

public class UserDeptRole implements Serializable {
    private Long id;

    private Long userId;

    private Long deptId;

    private Long roleId;

    private Boolean isDeptManager;

    private Boolean isFileManager;

    private Boolean state;

    private static final long serialVersionUID = 1L;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getDeptId() {
        return deptId;
    }

    public void setDeptId(Long deptId) {
        this.deptId = deptId;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public Boolean getIsDeptManager() {
        return isDeptManager;
    }

    public void setIsDeptManager(Boolean isDeptManager) {
        this.isDeptManager = isDeptManager;
    }

    public Boolean getIsFileManager() {
        return isFileManager;
    }

    public void setIsFileManager(Boolean isFileManager) {
        this.isFileManager = isFileManager;
    }

    public Boolean getState() {
        return state;
    }

    public void setState(Boolean state) {
        this.state = state;
    }
}