package com.cmcc.filesystem.controller;

import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.cmcc.filesystem.constant.Constants;
import com.cmcc.filesystem.dto.FileDto;
import com.cmcc.filesystem.entity.Dept;
import com.cmcc.filesystem.entity.File;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.service.IDeptService;
import com.cmcc.filesystem.service.IFileService;
import com.cmcc.filesystem.service.IUserService;
import com.cmcc.filesystem.util.DtoUtils;

import io.jsonwebtoken.lang.Collections;

@Controller
@RequestMapping("/fileMng")
public class FileMngController {
    
    @Autowired
    private IFileService fileService;
    
    @Autowired
    private IDeptService deptService;
    
    @Autowired
    private IUserService userService;
    
    @Autowired
    private DtoUtils dtoUtils;
    
    @RequestMapping("/list")
    public String list(Model model) throws IllegalAccessException, InvocationTargetException {
        List<FileDto> fileDtos = new ArrayList<FileDto>();
        List<File> files = fileService.findAll();
        if(files.size() > 0) {
            for(File f : files) {
                FileDto fileDto = dtoUtils.fileToFileDto(f);
                fileDtos.add(fileDto);
            }
        }
        
        model.addAttribute("fileDtos", fileDtos);
        return "file/list";
    }
    
    @RequestMapping("/add")
    public String add(Model model) {
        List<Dept> depts = deptService.findAll();
        model.addAttribute("depts", depts);
        
        //发文类型generate_type
        String[] generateTypes = Constants.GENERATE_TYPES.split(",");
        List<String> generateTypeList = Collections.arrayToList(generateTypes);
        if(generateTypes.length > 0) {
            model.addAttribute("generateTypes", generateTypeList);
        }
        
        //等级（特提、特急、加急、平级）
        String[] emergencyLevels = Constants.EMERGENCY_LEVEL.split(",");
        if(emergencyLevels.length > 0) {
            model.addAttribute("emergencyLevels", emergencyLevels);
        }
        
        //密级（绝密、机密、秘密、内部、普通）
        String[] secretLevels = Constants.SECRET_LEVEL.split(",");
        if(secretLevels.length > 0) {
            model.addAttribute("secretLevels", secretLevels);
        }
        
        return "file/add";
    }
    
    @RequestMapping(value = "/addPost", method = RequestMethod.POST)
    public String addPost(FileDto fileDto) throws IllegalAccessException, InvocationTargetException, ParseException {
        if(fileDto != null) {
            File file = dtoUtils.fileDtoToFile(fileDto);
            String username = (String) SecurityUtils.getSubject().getPrincipal();
            User user = userService.findByUsername(username);
            file.setReceiveUserId(user.getId());
            file.setState(Boolean.TRUE);
            fileService.insertSelective(file);
        }
        
        return "redirect:list";
    }
    
    @RequestMapping("/edit")
    public String edit(String fileId, Model model) throws IllegalAccessException, InvocationTargetException {
        File file = fileService.selectByPrimaryKey(fileId);
        if(file != null) {
            FileDto fileDto = dtoUtils.fileToFileDto(file);
            model.addAttribute("fileDto", fileDto);
        }
        
        List<Dept> depts = deptService.findAll();
        model.addAttribute("depts", depts);
        
        return "file/edit";
    }
    
    @RequestMapping(value = "/editPost", method = RequestMethod.POST)
    public String editPost(FileDto fileDto, Model model) throws IllegalAccessException, InvocationTargetException, ParseException {
        if(fileDto != null) {
            File file = dtoUtils.fileDtoToFile(fileDto);
            file.setState(Boolean.TRUE);
            fileService.updateSelective(file);
        }
        return "redirect:list";
    }
    
    @RequestMapping("/detail")
    public String detail(String fileId, Model model) throws IllegalAccessException, InvocationTargetException {
        File file = fileService.selectByPrimaryKey(fileId);
        if(file != null) {
            FileDto fileDto = dtoUtils.fileToFileDto(file);
            model.addAttribute("fileDto", fileDto);
        }
        
        return "file/detail";
    }
    
    @RequestMapping("/delete")
    public String delete(String fileId, Model model) {
        File file = fileService.selectByPrimaryKey(fileId);
        if(file != null) {
            file.setState(Boolean.FALSE);
            fileService.updateSelective(file);
        }
        
        return "redirect:list";
    }
}
