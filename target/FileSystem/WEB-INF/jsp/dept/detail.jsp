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

	<form action="${pageContext.request.contextPath }/deptMng/list" method="get">
		<table border="1" width="920" cellspacing="0" cellpadding="0" bgcolor="white" align="center">
			<tr align="center" height="40" >
				<td>
					部门名称：
				</td>
				<td>
					${deptDto.deptName }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					负责人：
				</td>
				<td>
                    ${deptDto.deptManager }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					档案管理人：
				</td>
				<td>
					${deptDto.fileManager }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					值班电话：
				</td>
				<td>
					${deptDto.deptPhone }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					部门人数：
				</td>
				<td>
					${deptDto.personNum }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td></td>
				<td>
					<input type="submit" value="确定">
				</td>
				
			</tr>
		</table>
		
	</form>

</body>
</html>