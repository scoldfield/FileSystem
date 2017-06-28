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

	<form action="${pageContext.request.contextPath }/deptMng/addPost" method="post">
		<table border="1" width="920" cellspacing="0" cellpadding="0" bgcolor="white" align="center">
			<tr align="center" height="40" >
				<td>
					部门名称：
				</td>
				<td>
					<input name="deptName" placeholder="请输入帐号名称或手机号码" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					负责人：
				</td>
				<td>
					<select name="deptMngerId" id="deptMnger">
						<c:forEach items="${notDeptMngers }" var="notDeptMnger">
							<option value="${notDeptMnger.id }">${notDeptMnger.name }</option>
						</c:forEach>
					</select><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					档案管理人：
				</td>
				<td>
					<select name="fileMngerId" id="fileMngerId">
						<c:forEach items="${notFileMngers }" var="notFileMnger">
							<option value="${notFileMnger.id }">${notFileMnger.name }</option>
						</c:forEach>
					</select><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					值班电话：
				</td>
				<td>
					<input name="deptPhone" placeholder="请输入电话号码" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					部门人数：
				</td>
				<td>
					<input name="personNum" placeholder="请输入部门人数" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
                <td></td>
				<td>
					<input type="submit" value="提交">&nbsp;
					<a href="${pageContext.request.contextPath }/deptMng/list" style="text-decoration: none">返回</a>
				</td>
				
			</tr>
		</table>
		
	</form>

</body>
</html>