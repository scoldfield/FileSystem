package com.cmcc.filesystem.controller;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.cmcc.filesystem.constant.Constants;
import com.cmcc.filesystem.dto.BorrowAuditDto;
import com.cmcc.filesystem.dto.FileDto;
import com.cmcc.filesystem.entity.BorrowAudit;
import com.cmcc.filesystem.entity.Dept;
import com.cmcc.filesystem.entity.File;
import com.cmcc.filesystem.entity.Resource;
import com.cmcc.filesystem.entity.Role;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.entity.UserDeptRole;
import com.cmcc.filesystem.service.IBorrowAuditService;
import com.cmcc.filesystem.service.IDeptService;
import com.cmcc.filesystem.service.IFileService;
import com.cmcc.filesystem.service.IResourceService;
import com.cmcc.filesystem.service.IRoleService;
import com.cmcc.filesystem.service.IUserDeptRoleService;
import com.cmcc.filesystem.service.IUserService;
import com.cmcc.filesystem.service.impl.UserService;
import com.cmcc.filesystem.util.DtoUtils;

@Controller
@RequestMapping("/borrow")
public class BorrowMngController {

    @Autowired
    private IFileService fileService;
    
    @Autowired
    private DtoUtils dtoUtils;
    
    @Autowired
    private IUserDeptRoleService userDeptRoleService;
    
    @Autowired
    private IRoleService roleService;
    
    @Autowired
    private IUserService userService;
    
    @Autowired
    private IDeptService deptService;
    
    @Autowired
    private IBorrowAuditService borrowAuditService;
    
    @Autowired
    private IResourceService resourceService;
    
    @RequestMapping("/list")
    public String search() {
        return "borrow/list";
    }
    
    @RequestMapping(value = "/searchPost", method = RequestMethod.POST)
    public String searchPost(String generateWord , String fileTitle, Model model) throws IllegalAccessException, InvocationTargetException {
    	//获取登录用户的相关信息
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        User user = userService.findByUsername(username);
        UserDeptRole udrLogin = userDeptRoleService.findByUserId(user.getId() + "");
        Long deptIdLogin = udrLogin.getDeptId();
        Dept deptLogin = deptService.selectByPrimaryKey(deptIdLogin);
    	List<Resource> resources = resourceService.getUserResources();
    	
    	//根据权限中的"是否所有部门"、"密级"两个字段进行筛选
    	List<File> files = new ArrayList<File>();
    	for(Resource r : resources){
    		String secretLevel = r.getFileSecretLevel();
    		Boolean allDept = r.getAllDept();	//能否查看所有部门
    		
    		//设置搜索条件
    		File file = new File();
    		//设置权限信息
    		file.setSecretLevel(secretLevel);	//设置能够查看的档案密级
    		if(Boolean.FALSE.equals(allDept)){	//设置能否查看所有部门
    			//只能查看本部门
    			file.setBelongedDeptId(deptIdLogin);
    		}
    		//搜索的档案的关键字
    		if(StringUtils.hasText(generateWord)) {
    			file.setGenerateWord("%" + generateWord + "%");
    		}
    		if(StringUtils.hasText(fileTitle)) {
    			file.setFileTitle("%" + fileTitle + "%");
    		}
    		//设置"接收审核"已经通过的
    		file.setAuditResult(Constants.RECEIVE_AUDIT_RESULT1);	//"接收审核"通过
    		file.setState(Boolean.TRUE);	//设置档案未被删除
    		List<File> filesTmp = fileService.findLikeSelective(file);
    		files.addAll(filesTmp);
    	}
    	
        //删除还未"归档"的档案
        List<FileDto> fileDtos = new ArrayList<FileDto>();
        if(files.size() > 0) {
            for(File f : files) {
            	if(f.getFillingDate() != null){		//只能借阅已经"归档"的档案
            		FileDto fileDto = dtoUtils.fileToFileDto(f);
            		fileDtos.add(fileDto);
            	}
            }
        }
        
        
        model.addAttribute("fileDtos", fileDtos);
        model.addAttribute("currnetUserId", user.getId());
        return "borrow/list";
    }
    
    /*
     * "借阅档案"申请
     */
    @RequestMapping("/apply")
    public String apply(String fileId, Model model) throws IllegalAccessException, InvocationTargetException {
        if(StringUtils.hasText(fileId)) {
            File file = fileService.selectByPrimaryKey(fileId);
            if(file != null) {
                FileDto fileDto = dtoUtils.fileToFileDto(file);
                model.addAttribute("fileDto", fileDto);
            }
        }
        
        return "borrow/detail";
    }
    
    @RequestMapping(value = "/applyPost", method = RequestMethod.GET)
    public String applyPost(String fileId, Model model) throws IllegalAccessException, InvocationTargetException {
    	//获取登录用户的相关信息
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        User user = userService.findByUsername(username);
        UserDeptRole udrLogin = userDeptRoleService.findByUserId(user.getId() + "");
        Long deptIdLogin = udrLogin.getDeptId();
        Dept deptLogin = deptService.selectByPrimaryKey(deptIdLogin);
        String deptNameLogin = deptLogin.getDeptName();
        
        //获取待审核的档案信息
        if(StringUtils.hasText(fileId)) {
            File file = fileService.selectByPrimaryKey(fileId);
            if(file != null) {
                //找到该文件的密级
                String secretLevel = file.getSecretLevel();
    			String fileManagerLevel = Constants.SECRET_LEVEL_FILEMANAGER_LEVEL.get(secretLevel);	//值为：一级、二级、
                
                //获取所有的角色
                List<Role> roles = roleService.findAll();
                Role needRole = null;		//借阅该档案，需要角色为needRole的档案管理员审核
                if(roles.size() > 0){
                	/*
                	 * 对找到的档案管理员进行筛选
                	 * 
                	 * 根据档案的密级向相应的档案管理员发送申请：
                	 * 绝密档案向一级档案管理员发送
                	 * 涉密级档案向二级档案管理员发送
                	 * 非涉密机档案向三级档案管理员发送
                	 */
                	for(Role r : roles){
                		String roleName = r.getName();
                		if(roleName.contains(fileManagerLevel)){
                			needRole = r;
                		}
                	}
                }
                
                //该文件的密级对应的resourceId：1 or 2 or 3 or 4 or 5
                String resourceId = Constants.SECRET_LEVEL_RESOURCE_ID.get(secretLevel);
                
                //找到该文件归属部门id
                Long belongedDeptId = file.getBelongedDeptId();
               
                //找到该文件所属部门的所有档案管理员
                UserDeptRole udr = new UserDeptRole();
                udr.setDeptId(belongedDeptId);
                udr.setIsFileManager(Boolean.TRUE);
                List<UserDeptRole> userDeptRoles = userDeptRoleService.findSelective(udr);
                //用于审核申请阅读的档案管理员userId
                List<String> fileManagerIds = new ArrayList<String>();     
                if(userDeptRoles.size() > 0) {
                    //在userDeptRoles中找到审核权限role_type在该文件的密级以上的userId
                    for(UserDeptRole udr2 : userDeptRoles) {
                        Long roleId = udr2.getRoleId();
                        Role role = roleService.selectByPrimaryKey(roleId);
                        String resourceIds = role.getResourceIds();
                        if(resourceIds.contains(resourceId)) {
                            fileManagerIds.add(udr2.getUserId() + "");
                        }
                    }
                }
                
                //向sys_borrow_audit表中的fileManagerIds用户发送请求
                List<BorrowAudit> bas = new ArrayList<BorrowAudit>();
                
                if(fileManagerIds.size() > 0) {
                    for(String uId : fileManagerIds) {
                    	//相应部门的档案管理员信息
                        User fileManager = userService.selectByPrimaryKey(Long.parseLong(uId));
                        Long roleId = fileManager.getRoleId();
                        
                        if(roleId == needRole.getId()){
                        	//找到该档案管理员，向该管理员发送请求
                        	UserDeptRole udr3 = userDeptRoleService.findByUserId(fileManager.getId() + "");
                        	Long deptId = udr3.getDeptId();
                        	Dept dept = deptService.selectByPrimaryKey(deptId);
                        	String deptName = dept.getDeptName();

                        	BorrowAudit ba = new BorrowAudit();
                        	ba.setDeptId(deptId);
                        	ba.setDeptName(deptName);
                        	ba.setDisabled("2");	//待审核
                        	ba.setFileId(Long.parseLong(fileId));
                        	ba.setApplyDeptId(deptIdLogin);
                        	ba.setApplyDeptName(deptNameLogin);
                        	ba.setApplyTime(new Date());
                        	ba.setApplyUserId(user.getId());
                        	ba.setApplyUserName(user.getName());
                        	ba.setOperatorId(uId);	//设定审核该档案的管理员id，当管理员登陆的时候就根据这个operate_id来查看自己有哪些档案要审核
                        	
                        	bas.add(ba);
                        }
                    }
                }
                
                //将BorrowAudit列表存入sys_borrow_audit表中
                for(BorrowAudit ba : bas) {
                    borrowAuditService.insertSelective(ba);
                }
                
                FileDto fileDto = dtoUtils.fileToFileDto(file);
                model.addAttribute("fileDto", fileDto);
                
                model.addAttribute("applied", true);    //表示已经申请
            }
        }
        
        return "borrow/detail";
    }
    
    /*
     * 档案管理员对"借阅档案"申请的审核
     */
    @RequestMapping("/borrowList")
    public String borrowList(Model model) throws IllegalAccessException, InvocationTargetException {
        List<BorrowAuditDto> borrowAuditDtoList = new ArrayList<BorrowAuditDto>(); 
                
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        if(StringUtils.hasText(username)) {
            User user = userService.findByUsername(username);
            if(user != null && (Constants.ROLEID4.equals(user.getRoleId() + "") || 
                                Constants.ROLEID5.equals(user.getRoleId() + "") || 
                                Constants.ROLEID6.equals(user.getRoleId() + ""))) {
                //登陆用户是档案管理员
                Long deptId = user.getDeptId();
                BorrowAudit borrowAudit = new BorrowAudit();
                borrowAudit.setDeptId(deptId);
                borrowAudit.setDisabled("2");	//待审核
                borrowAudit.setOperatorId(user.getId() + "");	//审核发送给自己的待审核的档案
                List<BorrowAudit> borrowList = borrowAuditService.findBySelective(borrowAudit);
                
                BorrowAuditDto bad = null;
                if(borrowList.size() > 0) {
                    for(BorrowAudit ba : borrowList) {
                        bad = dtoUtils.borrowAuditToBorrowAuditDto(ba);
                        borrowAuditDtoList.add(bad);
                    }
                }
            }
        }
        
        model.addAttribute("borrowAuditDtoList", borrowAuditDtoList);
        return "borrow/borrowList";
    }
    
    @RequestMapping("/auditPost")
    public String auditPost(String fileId, String applyUserId, String deptId, String auditRes) {   //auditRes: 2：待审核；1：同意; 0：已归还； -1: 不同意
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        User user = userService.findByUsername(username); 
        
        if(user != null){
        	BorrowAudit ba = new BorrowAudit();
        	ba.setFileId(Long.parseLong(fileId));
        	ba.setApplyUserId(Long.parseLong(applyUserId));
        	ba.setDeptId(Long.parseLong(deptId));
        	ba.setOperatorId(user.getId() + "");
        	
        	List<BorrowAudit> borrowAudits = borrowAuditService.findBySelective(ba);
        	if(borrowAudits.size() > 0) {
        		//正常情况下只有一个
        		for(BorrowAudit ba2 : borrowAudits) {
        			//审核借阅后，修改sys_borrow_audit表
        			ba2.setDisabled(auditRes);
        			ba2.setAuditTime(new Date());
        			ba2.setOperatorName(user.getName());
        			borrowAuditService.updateByPrimaryKeySelective(ba2);
        			
        			//审核借阅后，修改sys_file表中的is_borrowed和borrow_id字段
        			File file = fileService.selectByPrimaryKey(fileId);
        			file.setIsBorrowed(Boolean.TRUE);
        			file.setBorrowerId(Long.parseLong(applyUserId));
        			fileService.updateSelective(file);
        		}
        	}
        }
        
        return "redirect:borrowList";
    }
    
    /*
     * 阅读档案
     */
    @RequestMapping("/readFile")
    public String readFile(String fileId, Model model){
    	return null;
    }
    
    /*
     * 归还档案
     */
    @RequestMapping("/returnFile")
    public String returnFile(String fileId){
    	//修改sys_file表中的该file的状态
    	File file = fileService.selectByPrimaryKey(fileId);
    	if(file != null){
    		file.setIsBorrowed(Boolean.FALSE);
    		file.setBorrowerId(0l);
    		fileService.updateSelective(file);
    	}
    	
    	//修改sys_borrow_audit表
    	List<BorrowAudit> bas = borrowAuditService.findByFileId(Long.parseLong(fileId));
    	if(bas.size() > 0){
    		for(BorrowAudit ba : bas){
    			ba.setDisabled("0");	//0表示已归还
    			ba.setReturnTime(new Date());
    			borrowAuditService.updateByPrimaryKeySelective(ba);
    		}
    	}
    	
    	return null;
    }
    
    /*
     * 借阅记录：显示所有人的借阅记录统计
     */
    @RequestMapping("/borrowRecord")
    public String borrowRecord(Model model) throws IllegalAccessException, InvocationTargetException{
    	List<BorrowAuditDto> borrowAuditDtos = new ArrayList<BorrowAuditDto>();
    	
    	List<BorrowAudit> borrowAudits = borrowAuditService.findAll();
    	if(borrowAudits.size() > 0){
    		for(BorrowAudit ba : borrowAudits){
    			BorrowAuditDto bad = dtoUtils.borrowAuditToBorrowAuditDto(ba);
    			borrowAuditDtos.add(bad);
    		}
    	}
    	
    	model.addAttribute("borrowAuditDtos", borrowAuditDtos);
    	return "borrow/borrowRecord";
    }
    
}
