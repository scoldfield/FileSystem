<%@page import="org.apache.shiro.SecurityUtils"%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>页眉</title>
</head>
<body>
    <table>
    	<center>
    		<h1>档案管理系统</h1>
    	</center>
        
        <tr align="right">
                            您好,<%=SecurityUtils.getSubject().getSession().getAttribute("name")%>
            <a href="${pageContext.request.contextPath }/logout">退出</a>
        </tr>
    </table>
</body>
</html>