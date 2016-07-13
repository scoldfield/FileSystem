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

	<form action="${pageContext.request.contextPath }/userMng/addPost" method="post">
		<table border="1" width="920" cellspacing="0" cellpadding="0" bgcolor="white" align="center">
			<tr align="center" height="40" >
				<td>
					用户编号：
				</td>
                <td>
                    <input name="jobId" placeholder="请输入用户编号" ><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					用户名：
				</td>
                <td>
                    <input name="username" placeholder="请输入用户名" ><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					密码：
				</td>
                <td>
                    <input name="password" placeholder="请输入密码" ><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					姓名：
				</td>
                <td>
                    <input name="name" placeholder="请输入姓名" ><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					性别：
				</td>
                <td>
                    <select name="sex">
                        <option value="1">男</option>
                        <option value="0">女</option>
                    </select><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					所属部门：
				</td>
                <td>
                    <select name="deptId">
                        <c:forEach items="${depts }" var="dept">
                            <option value="${dept.id }">${dept.deptName }</option>
                        </c:forEach>
                    </select><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					联系电话：
				</td>
                <td>
                    <input name="mobile" placeholder="请输入电话号码" ><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					职务：
				</td>
                <td>
                    <select name="roleId">
                        <c:forEach items="${roles }" var="role">
                            <option value="${role.id }">${role.name }</option>
                        </c:forEach>
                    </select><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					是否是部门管理员：
				</td>
                <td>
                    <select name="isDeptManager">
                        <option value="1">是</option>
                        <option value="0">否</option>
                    </select><br>
                </td>
            </tr>
            <tr align="center" height="40" >
				<td>
					是否是档案管理员：
				</td>
                <td>
                    <select name="isFileManager">
                        <option value="1">是</option>
                        <option value="0">否</option>
                    </select><br>
                </td>
            </tr>
            
			<tr align="center" height="40" >
                <td></td>
				<td>
					<input type="submit" value="提交">
				</td>
				
			</tr>
		</table>
		
	</form>

</body>
</html>