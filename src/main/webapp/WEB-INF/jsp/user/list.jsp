<%@ page import="org.apache.shiro.SecurityUtils" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://shiro.apache.org/tags" prefix="shiro" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>部门管理</title>
    <script type="javascript">
        var name = <%=SecurityUtils.getSubject().getSession().getAttribute("name")%>;
    </script>
</head>
<body>

    <div align="right">
        <shiro:hasPermission name="user:add">
            <a href="${pageContext.request.contextPath }/userMng/add" style="text-decoration: none">新增</a>
        <%--<img src="${pageContext.request.contextPath}/static/new.ico" onclick="location.href='${pageContext.request.contextPath }/userMng/add'"/>--%>
        </shiro:hasPermission>
    </div>
    <table border="1" align="center" width="95%">
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
                                                <b>备注</b>
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
                <td align="center">
                    ${user.name }
                </td>
                <td align="center">
                    <c:if test="${user.sex==false }">女</c:if>
                    <c:if test="${user.sex==true }">男</c:if>
                    
                </td>
                <td align="center">
                    ${user.dept }
                </td>
                <td align="center">
                        ${user.comment }
                </td>
                <td align="center">
                    <c:if test="${user.state==false }">
                                                            该用户尚未审核，请联系管理员
                    </c:if>
                    <c:if test="${user.state==true }">
                        <shiro:hasPermission name="user:detail"><a href="${pageContext.request.contextPath }/userMng/detail?userId=${user.id}" style="text-decoration-line: none">查看&nbsp</a></shiro:hasPermission>
                        <shiro:hasPermission name="user:edit"><a href="${pageContext.request.contextPath }/userMng/edit?userId=${user.id}" style="text-decoration-line: none">修改&nbsp</a></shiro:hasPermission>
                        <!--允许修改自己-->
                        <c:if test="${user.state==true}">
                            <c:if test="${user.name==name}">
                                <c:if test="${user.username!='admin'}">
                                    <a href="${pageContext.request.contextPath }/userMng/edit?userId=${user.id}" style="text-decoration-line: none">修改&nbsp</a>
                                </c:if>
                            </c:if>
                        </c:if>
                        <shiro:hasPermission name="user:del"><a href="${pageContext.request.contextPath }/userMng/delete?userId=${user.id}" style="text-decoration-line: none">删除</a></shiro:hasPermission>
                    </c:if>
                </td>
            </tr>
        </c:forEach>
    </table>

</body>
</html>