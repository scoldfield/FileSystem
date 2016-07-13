package com.cmcc.filesystem.entity;

import java.io.Serializable;

public class Resource implements Serializable {
    private Long id;

    private String name;

    private String type;
    
    private Boolean allDept;
    
    private String fileSecretLevel;

    private String url;

    private Long parentId;

    private String parentIds;

    private String permission;

    private Boolean state;

    private static final long serialVersionUID = 1L;
    
    public Boolean getAllDept() {
        return allDept;
    }

    public void setAllDept(Boolean allDept) {
        this.allDept = allDept;
    }

    public String getFileSecretLevel() {
        return fileSecretLevel;
    }

    public void setFileSecretLevel(String fileSecretLevel) {
        this.fileSecretLevel = fileSecretLevel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url == null ? null : url.trim();
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getParentIds() {
        return parentIds;
    }

    public void setParentIds(String parentIds) {
        this.parentIds = parentIds == null ? null : parentIds.trim();
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission == null ? null : permission.trim();
    }

    public Boolean getState() {
        return state;
    }

    public void setState(Boolean state) {
        this.state = state;
    }
}