<%@page import="org.springframework.ui.Model"%>
<%@ page import="org.apache.shiro.SecurityUtils" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://shiro.apache.org/tags" prefix="shiro" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>添加部门</title>
    
    <script type="javascript">
        var loginUsername = <%=SecurityUtils.getSubject().getSession().getAttribute("username")%>;
        alert("username = " + username);
    </script>
</head>
<body>

	<form action="${pageContext.request.contextPath }/userMng/list" method="get">
		<table border="1" width="920" cellspacing="0" cellpadding="0" bgcolor="white" align="center">
			<tr align="center" height="40" >
				<td>
					用户编号：
				</td>
                <td>
                    ${userDto.jobId }
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					用户名：
				</td>
                <td>
                    <%--username表示登陆账户名--%>
                    <c:if test="${username!='admin'}">
                        <c:if test="${userDto.username==username}">
                            ${userDto.username}
                        </c:if>
                        <c:if test="${userDto.username!=username}">
                            ***
                        </c:if>
                    </c:if>
                        <c:if test="${username=='admin'}">
                            ${userDto.username}
                        </c:if>
                    <%--<shiro:hasAnyRoles name="系统管理员">--%>
                        <%--hahahahh--%>
                    <%--</shiro:hasAnyRoles>--%>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					密码：
				</td>
                <td>
                    <c:if test="${username!='admin'}">
                        <c:if test="${userDto.username==username}">
                            ${userDto.password }
                        </c:if>
                        <c:if test="${userDto.username!=username}">
                            ***
                        </c:if>
                    </c:if>
                    <c:if test="${username=='admin'}">
                        ${userDto.password}
                    </c:if>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					姓名：
				</td>
                <td>
                    ${userDto.name }
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					性别：
				</td>
                <td>
                    <c:if test="${userDto.sex==true }">男</c:if>
                    <c:if test="${userDto.sex==false }">女</c:if>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					所属部门：
				</td>
                <td>
                    ${userDto.dept }
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					联系电话：
				</td>
                <td>
                    ${userDto.mobile }
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					职务：
				</td>
                <td>
                    ${userDto.position }
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					创建时间：
				</td>
                <td>
                    ${userDto.createTime }
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					最后访问时间：
				</td>
                <td>
                    ${userDto.lastAccessTime }
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					访问IP：
				</td>
                <td>
                    ${userDto.ip }
                </td>
            </tr>
            
			<tr align="center" height="40" >
                <td></td>
				<td>
					<input type="submit" value="返回">
				</td>

			</tr>
		</table>
		
	</form>

</body>
</html>