<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>404</title>
    <style>
        body,html{ height:100%; margin:0; padding:0; background-color:#B5C2CF; }
        .wrap{ width:100%; max-width:1366px; min-width:840px; height:97%; margin:0 auto; padding-top:1%; background:url(${pageContext.request.contextPath}/static/images/i404.jpg)  center  -100px  no-repeat; }
        .content{ width: 305px; height: 226px; text-align: center; margin: 120px auto 0; padding-top: 37px; background: url(${pageContext.request.contextPath}/static/images/i404-png.png) no-repeat; font-family: "Microsoft YaHei", Tahoma, Helvetica Neue, Helvetica, Arial, Hiragino Sans GB, Microsoft Yahei, Simhei, sans-serif; line-height: 1.8em;}
        a{ text-decoration:none; color:#005E80}
    </style>
</head>
<body>
<div class="wrap">
    <c:if test="${applicationScope.type=='8' }">
        <p class="content">老师您好，请联系<br/>
                        管理员：${applicationScope.schoolManagerName }(电话: ${applicationScope.schoolManagerMobile })为您分配对应<br/>
                        的班级！<a href="${pageContext.request.contextPath}/logout">【退出】</a>
        </p>
    </c:if>  
      
    <c:if test="${applicationScope.type=='16' }">
        <p class="content">您好，网页版暂时不支持家长登录。<br/>
                        敬请期待。<a href="${pageContext.request.contextPath}/logout">【退出】</a>
        </p>
    </c:if>    
</div>
</body>
</html>