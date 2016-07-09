package com.cmcc.filesystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LoginController {

	@RequestMapping("/login")
	public String login(){
		return "login";
	}
	
	@RequestMapping("/start")
	public String start(){
		return "main";
	}
}
