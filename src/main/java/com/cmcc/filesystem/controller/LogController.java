package com.cmcc.filesystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cmcc.filesystem.entity.Log;
import com.cmcc.filesystem.service.ILogService;

/*
 * 通过AOP来实现日志记录
 */
@Controller
@RequestMapping("/log")
public class LogController {

    @Autowired
    private ILogService logService;
    
    @RequestMapping("/list")
    public String list(Model model) {
        List<Log> logs = logService.findAll();
        model.addAttribute("logs", logs);
        return "log/list";
    }
}
