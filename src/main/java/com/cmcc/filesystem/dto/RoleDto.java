package com.cmcc.filesystem.dto;

import java.util.Date;
import java.util.List;

import com.cmcc.filesystem.entity.Resource;

public class RoleDto {
    private Long id;

    private String name;

    private String description;

    private String resourceIds;

    private Integer type;

    private Date createTime;

    private Boolean state;

    //新增的字段
    private List<Resource> resources;
    private List<String> resourceNames;
    private String appendResourceIds;       //可选的resourceIds
    private List<Resource> appendResources; //可选的resources
    
    
    public List<String> getResourceNames() {
        return resourceNames;
    }

    public void setResourceNames(List<String> resourceNames) {
        this.resourceNames = resourceNames;
    }

    public String getAppendResourceIds() {
        return appendResourceIds;
    }

    public void setAppendResourceIds(String appendResourceIds) {
        this.appendResourceIds = appendResourceIds;
    }

    public List<Resource> getAppendResources() {
        return appendResources;
    }

    public void setAppendResources(List<Resource> appendResources) {
        this.appendResources = appendResources;
    }

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public String getResourceIds() {
        return resourceIds;
    }

    public void setResourceIds(String resourceIds) {
        this.resourceIds = resourceIds == null ? null : resourceIds.trim();
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Boolean getState() {
        return state;
    }

    public void setState(Boolean state) {
        this.state = state;
    }
}
