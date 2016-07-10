package com.cmcc.filesystem.controller;

import org.apache.shiro.SecurityUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LogoutController {
	
	@RequestMapping("/logout")
	public String logout(){
		SecurityUtils.getSubject().logout();
		return "redirect:login";
	}
}
