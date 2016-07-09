package com.cmcc.filesystem.dto;

public class RegisterAuditDto {
    private Long id;

    private Long userId;

    private Long deptId;

    private Boolean isPermitted;

    private Boolean state;

    private static final long serialVersionUID = 1L;
    
    //添加的字段
    private String userName;    //用户名字
    
    private String deptName;    //部门名字

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

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
