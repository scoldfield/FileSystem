package com.cmcc.filesystem.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.cmcc.filesystem.dao.ResourceMapper;
import com.cmcc.filesystem.entity.Resource;
import com.cmcc.filesystem.entity.Role;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.service.IResourceService;
import com.cmcc.filesystem.service.IRoleService;
import com.cmcc.filesystem.service.IUserService;

@Service
public class ResourceServiceImpl implements IResourceService {

	@Autowired
	private ResourceMapper resourceMapper;
	
	@Autowired
	private IRoleService roleService;
	
	@Autowired
	private IUserService userService;
	
	public int deleteByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return resourceMapper.deleteByPrimaryKey(id);
	}

	public int insert(Resource record) {
		// TODO Auto-generated method stub
		return resourceMapper.insert(record);
	}

	public int insertSelective(Resource record) {
		// TODO Auto-generated method stub
		return resourceMapper.insertSelective(record);
	}

	public Resource selectByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return resourceMapper.selectByPrimaryKey(id);
	}

	public int updateByPrimaryKeySelective(Resource record) {
		// TODO Auto-generated method stub
		return resourceMapper.updateByPrimaryKeySelective(record);
	}

	public int updateByPrimaryKey(Resource record) {
		// TODO Auto-generated method stub
		return resourceMapper.updateByPrimaryKey(record);
	}

	public List<Resource> getUserResources() {
		List<Resource> resources = new ArrayList<Resource>();

		String username = (String) SecurityUtils.getSubject().getPrincipal();
		if(StringUtils.hasText(username)){
			User user = userService.findByUsername(username);
			Role role = roleService.selectByPrimaryKey(user.getRoleId());
			String resourceIds = role.getResourceIds();
			if(StringUtils.hasText(resourceIds)){
				String[] resourceIdArr = resourceIds.split(",");
				if(resourceIdArr.length > 0){
					for(String resId : resourceIdArr){
						Resource resource = selectByPrimaryKey(Long.parseLong(resId));
						if(resource != null){
							//该用户所拥有的所有resource
							resources.add(resource);
						}
					}
				}
			}
		}
		
		return resources;
	}

}
