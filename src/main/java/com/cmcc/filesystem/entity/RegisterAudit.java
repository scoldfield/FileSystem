package com.cmcc.filesystem.entity;

import java.io.Serializable;

public class RegisterAudit implements Serializable {
    private Long id;

    private Long userId;

    private Long deptId;

    private Boolean isPermitted;

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

    public Boolean getIsPermitted() {
        return isPermitted;
    }

    public void setIsPermitted(Boolean isPermitted) {
        this.isPermitted = isPermitted;
    }

    public Boolean getState() {
        return state;
    }

    public void setState(Boolean state) {
        this.state = state;
    }
}