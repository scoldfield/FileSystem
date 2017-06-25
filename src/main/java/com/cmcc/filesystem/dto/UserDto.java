package com.cmcc.filesystem.dto;

import java.util.Date;
import java.util.List;

public class UserDto {
    private Long id;
    private String jobId;
    private String username;
    private String password;
    private String salt;
    private String name;
    private Boolean sex;
    private String dept;
    private String deptId;
    private String mobile;
    private String position;
    private Date createTime;
    private Date lastAccessTime;
    private String ip;
    private Boolean state;
    private String comment;

    //新增属性
    private Long roleId;
    private String roleName;
    private boolean isDeptManager;
    private boolean isFileManager;
    private String resourceIds;
    private List<String> resourceNames;

    public String getResourceIds() {
        return resourceIds;
    }
    public void setResourceIds(String resourceIds) {
        this.resourceIds = resourceIds;
    }
    public List<String> getResourceNames() {
        return resourceNames;
    }
    public void setResourceNames(List<String> resourceNames) {
        this.resourceNames = resourceNames;
    }
    public boolean isDeptManager() {
        return isDeptManager;
    }
    public void setDeptManager(boolean isDeptManager) {
        this.isDeptManager = isDeptManager;
    }
    public boolean isFileManager() {
        return isFileManager;
    }
    public void setFileManager(boolean isFileManager) {
        this.isFileManager = isFileManager;
    }
    public Long getRoleId() {
        return roleId;
    }
    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
    public String getRoleName() {
        return roleName;
    }
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
    public String getDeptId() {
        return deptId;
    }
    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }
    public String getJobId() {
        return jobId;
    }
    public void setJobId(String jobId) {
        this.jobId = jobId;
    }
    public String getSalt() {
        return salt;
    }
    public void setSalt(String salt) {
        this.salt = salt;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }
    public Boolean getSex() {
        return sex;
    }
    public void setSex(Boolean sex) {
        this.sex = sex;
    }
    public String getDept() {
        return dept;
    }
    public void setDept(String dept) {
        this.dept = dept == null ? null : dept.trim();
    }
    public String getMobile() {
        return mobile;
    }
    public void setMobile(String mobile) {
        this.mobile = mobile == null ? null : mobile.trim();
    }
    public String getPosition() {
        return position;
    }
    public void setPosition(String position) {
        this.position = position == null ? null : position.trim();
    }
    public Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
    public Date getLastAccessTime() {
        return lastAccessTime;
    }
    public void setLastAccessTime(Date lastAccessTime) {
        this.lastAccessTime = lastAccessTime;
    }
    public String getIp() {
        return ip;
    }
    public void setIp(String ip) {
        this.ip = ip == null ? null : ip.trim();
    }
    public Boolean getState() {
        return state;
    }
    public void setState(Boolean state) {
        this.state = state;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
