package com.cmcc.filesystem.controller;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.cmcc.filesystem.entity.Log;
import com.cmcc.filesystem.service.ILogService;


@Component
@Aspect
public class LogMngAOPServiceImpl {
    
    private Logger logger = LoggerFactory.getLogger(LogMngAOPServiceImpl.class);
    
    @Autowired
    private ILogService logService;      //补充实现类
    
    @Pointcut("execution(* com.cmcc.filesystem.service..*.*(..)) && !execution(* com.cmcc.filesystem.service..*LogService*.*(..))")    //？？？？？？？？？？？？？这里还需要修改，监控的包要更具体点，否则会与biz那边的pointcut重合，导致死循环
    public void myPointcut() {}
    
    @Before(value = "myPointcut()")
    public void beforeService(JoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getClass().getName();
        Object[] params = joinPoint.getArgs();
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        String time = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(new Date());

        //params数组转成String
        String para = "";
        if (params.length > 0) {
            for (Object o : params) {
                if (o != null)
                    para += o.toString();
            }
        }
        
        //打印logger
        printLog(className, methodName, para, username, time);
    }
    
    @AfterReturning(value = "myPointcut()" , returning = "returnValue"/**/)
    public void afterService(JoinPoint joinPoint, Object returnValue/**/) {
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getClass().getName();
        Object[] params = joinPoint.getArgs();
        Object result = returnValue;
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        String time = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(new Date());

        //params数组转成String
        String para = "";
        if (params.length > 0) {
            for (Object o : params) {
                if (o != null)
                    para += o.toString();
            }
        }
        
        //打印logger
        printLog(className, methodName, para, username, time);

        //写到数据库中
        Log log = new Log();
        log.setClassName(className);
        log.setMethodName(methodName);
        log.setParams(para);
        log.setOperateUsername(username);
        log.setOperateTime(new Date());
        logService.insertSelective(log);
    }
    
    @AfterThrowing(value = "myPointcut()")
    public void throwService(JoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getClass().getName();
        Object[] params = joinPoint.getArgs();
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        String time = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(new Date());

        //params数组转成String
        String para = "";
        if (params.length > 0) {
            for (Object o : params) {
                if (o != null)
                    para += o.toString();
            }
        }
        
        //打印logger
        printLog(className, methodName, para, username, time);
        
      //写到数据库中
        Log log = new Log();
        log.setClassName(className);
        log.setMethodName(methodName);
        log.setParams(para);
        log.setOperateUsername(username);
        log.setOperateTime(new Date());
        logService.insertSelective(log);
    }
    
    private void printLog(String className, String methodName, String para, String username, String time) {
        logger.debug("用户名：" + username + "操作：" + className + "类中的" + methodName + "方法，" + "参数为：" + para + "，时间为：" + time);
    }
    
}
