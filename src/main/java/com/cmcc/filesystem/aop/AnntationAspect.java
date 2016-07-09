package com.cmcc.filesystem.aop;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;

  
@Aspect  
public class AnntationAspect {  
	
	private final static Logger logger = Logger.getLogger(AnntationAspect.class);
	/*
	@Autowired
	private LogMapper logMapper;
	@Autowired
	private RedisUtil redisUtil;
	@Autowired
	private IWordsDetecService wordsDetecService;
	
    @Pointcut("execution(* com.cmcc.xxt.service.I*.*(..))")  
    private void pointCutMethod() {  
    }  
    @Pointcut("execution(* com.cmcc.xxt.service.I*.*(..)) && !execution(* com.cmcc.xxt.service.I*.find*(..))")  
    private void pointCutMethodForReturn() {  
    }
    
    //统计每日用户使用功能人数  
    @Pointcut("this(com.cmcc.xxt.service.IStatistics)")  
    private void statistic() {  
    }
    
    //用户积分增加之前的业务逻辑
    @Pointcut("this(com.cmcc.xxt.service.IPointsAdd)")  
    private void points() {  
    }
    
    // 统计每日每月活跃用户数量
    @Pointcut("execution(* com.cmcc.xxt.controller.teacher..*(..)) || execution(* com.cmcc.xxt.app.controller.BaseApiController.init(..))")  
    private void statistiscDayMonth() {  
    }
    
    //
    @Pointcut("execution(* com.cmcc.xxt.controller.teacher.*.*(..))")
    private void WordsDetect() {
    }
    
    //关键字检测
    @Before("WordsDetect()")
    public void doWordsDetect(JoinPoint point) {
        try {
            Object[] args = point.getArgs();
            
            if(args != null && args.length > 0) {
                for(Object obj : args) {
                    if(obj != null && obj.getClass() == Notice.class) {
                        Notice notice = (Notice) obj;
                        System.out.println("notice = " + notice);
                        String title = notice.getTitle();
                        String tmpContent = notice.getContent();
                        title = wordsDetecService.doDetect(title);
                        tmpContent = wordsDetecService.doDetect(tmpContent);
                        
                        notice.setTitle(title);
                        notice.setContent(tmpContent);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // 统计每日每月活跃用户数量
    @After("statistiscDayMonth()")  
    public void doCount(JoinPoint point) { 
    	MasterSlaveJedis jedis = null;
		try{
			Session s = SecurityUtils.getSubject().getSession();
			@SuppressWarnings("unchecked")
			List<User> userList = (List<User>)s.getAttribute("userList");
			if(userList == null || userList.size() < 1) {
			    return;
			}
			User user = userList.get(0);
			if(user == null) {
			    return;
			}
			if(user.getType() != Constants.TEACHER && user.getType() != Constants.STUDENTTYPE) {
			    return;
			}
			String userNo = user.getUsername()+Constants.ACTIVITY_WILDCARD+user.getType();
			if(userNo == null || "".equals(userNo)){
				return;
			}
			String key = Config.getString("statistics.perday.activity");
			if(key == null || "".equals(key)){
				return;
			}
			String day = key+Constants.ACTIVITY_WILDCARD+ DateFormatUtil.format(new Date());
			jedis = redisUtil.getMasterJedis();
		    jedis.sadd(day, userNo);
		    jedis.sadd(userNo, DateFormatUtil.format(new Date()));
			
		}catch(Exception e){
			logger.error(e.getMessage());
		}finally{
			redisUtil.returnResource(jedis);
		}
    	
    }
    
    // 统计每日用户使用功能的人数
    @After("statistic()")  
    public void doStatistic(JoinPoint point) { 
		MasterSlaveJedis jedis = null;
		try{
			jedis = redisUtil.getMasterJedis();
			Session s = SecurityUtils.getSubject().getSession();
			@SuppressWarnings("unchecked")
			List<User> userList = (List<User>)s.getAttribute("userList");
			User user = userList.get(0);
			if(user == null) {
			    return;
			}
			if(user.getType() != Constants.TEACHER && user.getType() != Constants.STUDENTTYPE) {
			    return;
			}
			String userNo = user.getUsername()+Constants.STATISTICS_WILDCARD+user.getType();
			logger.info("the userNo is :"+ userNo);
			if(userNo == null || "".equals(userNo)){
				
				return;
			}
			IStatistics instance = (IStatistics) Class.forName(point.getSignature().getDeclaringTypeName()).newInstance();  
			String key = instance.getName();
			logger.info("the key is :"+ key);
			if(key == null || "".equals(key)){
				return ;
			}
			String redisKey = Config.getString("statistics.allitem.key");
			logger.info("the redisKey is :"+ redisKey);
			if(redisKey == null || "".equals(redisKey)){
				return ;
			}
			jedis.sadd(redisKey, key);
			String day = key+Constants.STATISTICS_WILDCARD+ DateFormatUtil.format(new Date());
			//jedis.sadd(day, userNo);
			//jedis.rpush("admin"+Constants.STATISTICS_WILDCARD+day, userNo);
			jedis.rpush(userNo,day);
			
		}catch(Exception e){
			logger.error(e.getMessage());
		}finally{
			redisUtil.returnResource(jedis);
		}
    }
    
    //用户积分增加之前的业务逻辑
    @Before("points()")  
    public void doPoints(JoinPoint point) { 
    	try{
    		 Object[] args = point.getArgs();
    		 if(args[0] == null) {
    		     return;
    		 }
    		 User u = (User)args[0];
    		 if(u.getType() != Constants.STUDENTTYPE && u.getType() != Constants.TEACHER && u.getType() != Constants.SCHOOLADMIN) {
    		     return;
    		 }
		}catch(Exception e){
			logger.error(e.getMessage());
		}
    }
  
    //声明例外通知  
    @AfterThrowing(pointcut = "pointCutMethod()", throwing = "e")  
    public void doAfterThrowing(JoinPoint point,Exception e) {  
    	logger.error("在执行"+ point.getSignature().getDeclaringTypeName() + "." + point.getSignature().getName()+ "发送了异常，异常信息： "+e.getMessage());
    } 
    
    //声明最终通知
    @After("pointCutMethodForReturn()")  
    public void doAfter(JoinPoint point) {  
    	Log log = new Log();
    	String op = point.getSignature().getName();
    	Object[] args = point.getArgs();
    	String parameter = "";
         if (args != null && args.length > 0 ) {
        	 for(int i = 0 ; i < args.length ; i++) {
        	     if(args[i]  != null && !"".equals(args[i])) {
        	         parameter += args[i].toString()+ " ,";
        	     }
        	 }
         }
         if(parameter.length() > 0) {
             parameter = parameter.substring(0,parameter.length()-1);
         }
        log.setUser((String)SecurityUtils.getSubject().getPrincipal());
    	log.setOp(op);
    	//log.setParameter(parameter);
    	logMapper.insertSelective(log);
    }  
    
  
    //声明环绕通知  
    @Around("pointCutMethod()")  
    public Object doAround(ProceedingJoinPoint point) throws Throwable {
    	 logger.info("进入目标方法：" +  point.getSignature().getDeclaringTypeName() + "." + point.getSignature().getName());  
    	 long t1 = System.currentTimeMillis();
    	 Object[] args = point.getArgs();
    	 String parameter = "";
         if (args != null && args.length > 0 ) {
        	 for(int i = 0 ; i < args.length ; i++) {
        	     if(args[i]  != null && !"".equals(args[i])) {
        	         parameter += args[i].toString()+ " , ";
        	     }
        	 }
         }
         if(parameter.length() > 0) {
             parameter = parameter.substring(0,parameter.length()-1);
         }
         logger.info("执行目标方法的参数为："+parameter); 
    	
        Object o = point.proceed();  
        long t2 = System.currentTimeMillis();
        logger.info("执行目标方法的时间为：" + (t2-t1)+"ms");
        logger.info("退出目标方法：" +  point.getSignature().getDeclaringTypeName() + "." + point.getSignature().getName());  
        return o;  
    }  
    
    */
}