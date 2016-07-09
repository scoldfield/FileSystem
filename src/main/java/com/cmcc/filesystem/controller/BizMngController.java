package com.cmcc.filesystem.controller;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cmcc.filesystem.dto.FileDto;
import com.cmcc.filesystem.entity.File;
import com.cmcc.filesystem.entity.Table;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.entity.UserDeptRole;
import com.cmcc.filesystem.service.IBorrowAuditService;
import com.cmcc.filesystem.service.IDeptService;
import com.cmcc.filesystem.service.IFileService;
import com.cmcc.filesystem.service.IRoleService;
import com.cmcc.filesystem.service.IUserDeptRoleService;
import com.cmcc.filesystem.service.IUserService;
import com.cmcc.filesystem.util.DtoUtils;

@Controller
@RequestMapping("/biz")
public class BizMngController {

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
    
    
    @RequestMapping("/receive")
    public String receive() {
        return null;
    }
    
    @RequestMapping("/list")
    public String list(Model model) throws IllegalAccessException, InvocationTargetException {
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        User user = userService.findByUsername(username);
        if(user != null) {
            UserDeptRole udr = userDeptRoleService.findByUserId(user.getId() + "");
            if(udr != null) {
                Long deptId = udr.getDeptId();
                File file = new File();
                file.setBelongedDeptId(deptId);
                file.setState(Boolean.TRUE);
                List<File> files = fileService.findSelective(file);
                if(files.size() > 0) {
                    List<FileDto> fileDtos = new ArrayList<FileDto>();
                    for(File f : files) {
                        FileDto fileDto = dtoUtils.fileToFileDto(f);
                        fileDtos.add(fileDto);
                    }
                    
                    model.addAttribute("fileDtos", fileDtos);
                }
            }
        }
        
        return "biz/list";
    }

    @RequestMapping("/detail")
    public String detail(String fileId, Model model) throws IllegalAccessException, InvocationTargetException {
        if(StringUtils.hasText(fileId)) {
            File file = fileService.selectByPrimaryKey(fileId);
            if(file != null) {
                FileDto fileDto = dtoUtils.fileToFileDto(file);
                model.addAttribute("fileDto", fileDto);
            }
        }
        return "biz/detail";
    }
    
    @RequestMapping("/audit")
    public String audit(String fileId, String res) {    //res:  1:审核通过; -1:审核不通过
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        User user = userService.findByUsername(username);
        
        if(StringUtils.hasText(fileId)) {
            File file = fileService.selectByPrimaryKey(fileId);
            if(file != null) {
                file.setAuditDate(new Date());
                file.setAuditorId(user.getId());
                file.setAuditResult(res);
                file.setAuditSerials(file.getId() + "");     //将audit_serials与file_id一样

                fileService.updateSelective(file);
            }
        }
        
        return "redirect:list";
    }
    
    @SuppressWarnings("deprecation")
    @RequestMapping("/fileStatic")
    public String fileStatic(Model model) {    
        List<File> files = fileService.findAll();
        if(files.size() > 0) {
            
            Map<Integer, Integer> years = new HashMap<Integer, Integer>();      //"2016--总计"这一空格应该填写的内容
            //绝密=1,机密=2,秘密=3,内部=4,普通=5，"用于2016--绝密"这一空格应该填写的内容
            Map<Integer, Integer> secret1 = new HashMap<Integer, Integer>();    
            Map<Integer, Integer> secret2 = new HashMap<Integer, Integer>();    
            Map<Integer, Integer> secret3 = new HashMap<Integer, Integer>();    
            Map<Integer, Integer> secret4 = new HashMap<Integer, Integer>();    
            Map<Integer, Integer> secret5 = new HashMap<Integer, Integer>();    
            for(File f : files) {
                Date generateDate = f.getGenerateDate();
                int year = generateDate.getYear();
                
                Integer yearNum = years.get(year);
                if(yearNum != null) {
                    years.put(year, (yearNum + 1));
                } else {
                    years.put(year, 1);
                }
                
                Integer secret1Num = secret1.get(year);
                Integer secret2Num = secret1.get(year);
                Integer secret3Num = secret1.get(year);
                Integer secret4Num = secret1.get(year);
                Integer secret5Num = secret1.get(year);
                if(secret1Num != null) {
                    secret1.put(year, (secret1Num + 1));
                } else {
                    secret1.put(year, 1);
                }
                if(secret2Num != null) {
                    secret2.put(year, (secret2Num + 1));
                } else {
                    secret2.put(year, 1);
                }
                if(secret3Num != null) {
                    secret3.put(year, (secret3Num + 1));
                } else {
                    secret3.put(year, 1);
                }
                if(secret4Num != null) {
                    secret4.put(year, (secret4Num + 1));
                } else {
                    secret4.put(year, 1);
                }
                if(secret5Num != null) {
                    secret5.put(year, (secret5Num + 1));
                } else {
                    secret5.put(year, 1);
                }
            }
            
//            Map<Integer, Table> tables = new HashMap<Integer, Table>();
            List<Table> tables = new ArrayList<Table>();
            Set<Integer> keys = years.keySet();
            Iterator<Integer> it = keys.iterator();
            while(it.hasNext()) {
                Integer year = it.next();
                Integer yearNum = years.get(year);
                Integer secret1Num = secret1.get(year);
                Integer secret2Num = secret2.get(year);
                Integer secret3Num = secret3.get(year);
                Integer secret4Num = secret4.get(year);
                Integer secret5Num = secret5.get(year);
                
                Table t = new Table();
                t.setYearTotal(yearNum);
                t.setSecret1(secret1Num);
                t.setSecret2(secret2Num);
                t.setSecret3(secret3Num);
                t.setSecret4(secret4Num);
                t.setSecret5(secret5Num);
                tables.add(t);
            }
            
            model.addAttribute("tables", tables);
        }
        
        return "user/tableList";
    }
}
