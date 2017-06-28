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

<script language="javascript" type="text/javascript" src="${pageContext.request.contextPath}/static/My97DatePicker/WdatePicker.js"></script>

</head>
<body>



		<table border="1" width="920" cellspacing="0" cellpadding="0" bgcolor="white" align="center">
			<tr align="center" height="40" >
				<td>
					档案编号：
				</td>
				<td>
                    ${fileDto.fileId }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					档案标题：
				</td>
				<td>
					${fileDto.fileTitle }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					签发人：
				</td>
				<td>
					${fileDto.issueUserName }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文字号：
				</td>
				<td>
					${fileDto.generateWord }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文类型：
				</td>
				<td>
					${fileDto.generateType }
			</tr>
			<tr align="center" height="40" >
				<td>
					发文机关：
				</td>
				<td>
					${fileDto.generateAgency }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文地区：
				</td>
				<td>
					${fileDto.generateDistrict }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					页数：
				</td>
				<td>
					${fileDto.generatePage }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					签发日期：
				</td>
				<td>
                    ${fileDto.generateDate }
                    
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					接收人：
				</td>
				<td>
					${fileDto.receiveUserName }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					承办部门：
				</td>
				<td>
					${fileDto.belongedDeptName }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					等级：
				</td>
				<td>
					${fileDto.emergencyLevel }
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					密级：
				</td>
				<td>
					${fileDto.secretLevel }
				</td>
			</tr>
			<tr align="center" height="40" >
                <td></td>
				<td>
                    <c:if test="${applied==true }">申请已经提交</c:if>
                    <c:if test="${applied==null || applied==false }"><a href="${pageContext.request.contextPath }/borrow/applyPost?fileId=${fileDto.id}">借阅申请</a></c:if>
					<%--授权阅读--%>
				</td>
				
			</tr>
		</table>
		

</body>
</html>