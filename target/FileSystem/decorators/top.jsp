<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@page import="org.apache.shiro.SecurityUtils"%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="renderer" content="webkit">
    <title>档案管理系统</title>
    
    <script language="JavaScript">
//        function show() {
//            $("#showLogout").style.display = "";
//        }
    </script>

</head>
<body style="background-image: url(${pageContext.request.contextPath}/static/images/bgpic.jpg);background-size: cover">
    <table>
    	<center>
    		<h1>
                <div style="font-family: STZhongsong">乌兰察布市委办公厅文件档案管理系统</div>
            </h1>
    	</center>
        
        <tr align="right">
            您好,<%=SecurityUtils.getSubject().getSession().getAttribute("name")%>【<%=SecurityUtils.getSubject().getSession().getAttribute("roleName")%>】
            <a href="${pageContext.request.contextPath }/logout" style="text-decoration-line: none;">退出</a>
            <%--<img src="${pageContext.request.contextPath}/static/logout.png" onclick="location.href='${pageContext.request.contextPath }/logout'" onmouseover="show()">--%>
            <%--<div id="showLogout" style="display: none"></div>--%>
        </tr>
    </table>
</body>
</html>