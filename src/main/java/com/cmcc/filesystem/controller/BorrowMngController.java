package com.cmcc.filesystem.controller;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.shiro.SecurityUtils;
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
import com.cmcc.filesystem.entity.Role;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.entity.UserDeptRole;
import com.cmcc.filesystem.service.IBorrowAuditService;
import com.cmcc.filesystem.service.IDeptService;
import com.cmcc.filesystem.service.IFileService;
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
    
    @RequestMapping("/list")
    public String search() {
        return "borrow/list";
    }
    
    @RequestMapping(value = "/searchPost", method = RequestMethod.POST)
    public String searchPost(String generateWord , String fileTitle, Model model) throws IllegalAccessException, InvocationTargetException {
        File file = new File();
        if(StringUtils.hasText(generateWord)) {
            file.setGenerateWord("%" + generateWord + "%");
        }
        if(StringUtils.hasText(fileTitle)) {
            file.setFileTitle("%" + fileTitle + "%");
        }
        List<File> files = fileService.findLikeSelective(file);
        
        List<FileDto> fileDtos = new ArrayList<FileDto>();
        if(files.size() > 0) {
            for(File f : files) {
                FileDto fileDto = dtoUtils.fileToFileDto(f);
                fileDtos.add(fileDto);
            }
        }
        model.addAttribute("fileDtos", fileDtos);
        return "borrow/list";
    }
    
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
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        User user = userService.findByUsername(username);
        UserDeptRole udrLogin = userDeptRoleService.findByUserId(user.getId() + "");
        Long deptIdLogin = udrLogin.getDeptId();
        Dept deptLogin = deptService.selectByPrimaryKey(deptIdLogin);
        String deptNameLogin = deptLogin.getDeptName();
        
        if(StringUtils.hasText(fileId)) {
            File file = fileService.selectByPrimaryKey(fileId);
            if(file != null) {
                //找到该文件的密级
                String secretLevel = file.getSecretLevel();
                //该文件的密级对应的resourceId
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
                        User fileManager = userService.selectByPrimaryKey(Long.parseLong(uId));
                        UserDeptRole udr3 = userDeptRoleService.findByUserId(fileManager.getId() + "");
                        Long deptId = udr3.getDeptId();
                        Dept dept = deptService.selectByPrimaryKey(deptId);
                        String deptName = dept.getDeptName();
                        if(fileManager != null) {
                            BorrowAudit ba = new BorrowAudit();
                            ba.setDeptId(deptId);
                            ba.setDeptName(deptName);
                            ba.setDisabled("2");
                            ba.setFileId(Long.parseLong(fileId));
                            ba.setApplyDeptId(deptIdLogin);
                            ba.setApplyDeptName(deptNameLogin);
                            ba.setApplyTime(new Date());
                            ba.setApplyUserId(user.getId());
                            ba.setApplyUserName(user.getName());
                            ba.setFileId(file.getId());
                            
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
     * 档案管理员对借阅档案的审核
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
    public String auditPost(String fileId, String applyUserId, String deptId, String auditRes) {   //auditRes: 1同意; 0: 不同意
        BorrowAudit ba = new BorrowAudit();
        ba.setFileId(Long.parseLong(fileId));
        ba.setApplyUserId(Long.parseLong(applyUserId));
        ba.setDeptId(Long.parseLong(deptId));
        
        List<BorrowAudit> borrowAudits = borrowAuditService.findBySelective(ba);
        if(borrowAudits.size() > 0) {
            //正常情况下只有一个
            for(BorrowAudit ba2 : borrowAudits) {
                ba2.setDisabled(auditRes);
                borrowAuditService.updateByPrimaryKeySelective(ba2);
            }
        }
        
        return "redirect:list";
    }
    
}
