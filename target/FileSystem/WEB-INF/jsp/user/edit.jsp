<%@page import="org.springframework.ui.Model"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@page import="java.util.ArrayList"%>
<%@page import="com.cmcc.filesystem.entity.Dept"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>添加部门</title>
</head>
<body>

	<form action="${pageContext.request.contextPath }/userMng/editPost" method="post">
		<table border="1" width="920" cellspacing="0" cellpadding="0" bgcolor="white" align="center">
			<tr align="center" height="40" >
				<td>
					用户编号：
				</td>
                <td>
                    <input name="id" value="${userDto.id }" type="hidden">
                    <input name="jobId" value="${userDto.jobId }"><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					用户名：
				</td>
                <td>
                    <input name="username" value="${userDto.username }" ><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					密码：
				</td>
                <td>
                    <input name="password" value="${userDto.password }" ><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					姓名：
				</td>
                <td>
                    <input name="name" value="${userDto.name }" ><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					性别：
				</td>
                <td>
                    <select name="sex">
                        <option value="1" <c:if test="${userDto.sex==true }">selected="selected"</c:if> >男</option>
                        <option value="0" <c:if test="${userDto.sex==false }">selected="selected"</c:if>>女</option>
                    </select><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					所属部门：
				</td>
                <td>
                    <select name="deptId">
                            <%-- <option value="${userDto.deptId }" selected="selected">${userDto.dept } --%>
                        <c:forEach items="${depts }" var="dept">
                            <option value="${dept.id }" <c:if test="${dept.id==userDto.deptId }">selected="selected"</c:if>>${dept.deptName }</option>
                        </c:forEach>
                    </select><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					联系电话：
				</td>
                <td>
                    <input name="mobile" value="${userDto.mobile }" ><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					职务：
				</td>
                <td>
                    <select name="roleId">
                        <c:forEach items="${roles }" var="role">
                            <option value="${role.id }" <c:if test="${role.id==userDto.roleId }">selected="selected"</c:if>>${role.name }</option>
                        </c:forEach>
                    </select><br>
                    <%-- <input name="position" value="${userDto.position }" ><br> --%>
                </td>
            </tr>
            
			<tr align="center" height="40" >
				<td>
					<input type="submit" value="提交">&nbsp;
                    <a href="${pageContext.request.contextPath }/userMng/list" style="text-decoration-line: none">返回</a>
				</td>
				
			</tr>
		</table>
		
	</form>

</body>
</html>