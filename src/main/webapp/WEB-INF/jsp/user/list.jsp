<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>部门管理</title>
</head>
<body>

    <table border="1" align="center" width="1000">
        <tr>
            <td align="center">
                                                <b>用户编号</b>
            </td>
            <td align="center">
                                                <b>姓名</b>
            </td>
            <td align="center">
                                                <b>性别</b>
            </td>
            <td align="center">
                                                <b>所属部门</b>
            </td>
            <td align="center">
                                                <b>操作</b>
            </td>
        </tr>
        
        <c:forEach items="${users }" var="user">
            <tr>
                <td align="center">
                    ${user.jobId }
                </td>
                <td>
                    ${user.name }
                </td>
                <td>
                    <c:if test="${user.sex==false }">女</c:if>
                    <c:if test="${user.sex==true }">男</c:if>
                    
                </td>
                <td>
                    ${user.dept }
                </td>
                <td align="center">
                        <a href="${pageContext.request.contextPath }/userMng/detail?userId=${user.id}">查看详情&nbsp</a>
                        <a href="${pageContext.request.contextPath }/userMng/edit?userId=${user.id}">修改&nbsp</a>
                        <a href="${pageContext.request.contextPath }/userMng/delete?userId=${user.id}">删除</a>
                </td>
            </tr>
        </c:forEach>
    </table>

</body>
</html>