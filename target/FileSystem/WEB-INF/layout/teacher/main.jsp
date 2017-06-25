<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator" prefix="decorator" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ page language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="renderer" content="webkit">
    <title><decorator:title default="和校园-教育平台" /></title>
    <link href="${pageContext.request.contextPath}/static/images/favorite_ico.ico" rel="Shortcut Icon"/>
    <script>window.globalPath = '${pageContext.request.contextPath}/teacher';</script>
    <decorator:head/>
</head>
<body>
<div class="g-wrap">
    <%@ include file="/WEB-INF/layout/teacher/top.jsp" %>
    <%@ include file="/WEB-INF/layout/teacher/head.jsp" %>
    <decorator:body/>
</div>
<%--<%@ include file="/WEB-INF/layout/teacher/mypannel.jsp" %>--%>
</body>
</html>