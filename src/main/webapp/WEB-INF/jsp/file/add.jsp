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



	<form action="${pageContext.request.contextPath }/fileMng/addPost" method="post">
		<table border="1" width="920" cellspacing="0" cellpadding="0" bgcolor="white" align="center">
			<tr align="center" height="40" >
				<td>
					档案编号：
				</td>
				<td>
					<input name="fileId" placeholder="请输入档案编号" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					档案标题：
				</td>
				<td>
					<input name="fileTitle" placeholder="请输入档案标题" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					签发人：
				</td>
				<td>
					<input name="issueUserName" placeholder="请输入签发人名字" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文字号：
				</td>
				<td>
					<input name="generateWord" placeholder="请输发文字号" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文类型：
				</td>
				<td>
                    <select name="generateType">
                        <c:forEach items="${generateTypes }" var="gtt">
                            <option value="${gtt }">${gtt }
                        </c:forEach>
                    </select>
    
					<!-- <input name="generateType" placeholder="请输入发文类型" ><br> -->
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文机关：
				</td>
				<td>
					<input name="generateAgency" placeholder="请输入发文机关" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文地区：
				</td>
				<td>
					<input name="generateDistrict" placeholder="请输入发文地区" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					页数：
				</td>
				<td>
					<input name="generatePage" placeholder="请输入页数" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					签发日期：
				</td>
				<td>
                    <input name="generateDateStr" class="Wdate" type="text" onClick="WdatePicker()" width='270px'>
                    <%-- 
					<input id="d12" name="generateDate" type="text" >
                    <img onclick="WdatePicker({el:'d12'})" src="${pageContext.request.contextPath}/static/My97DatePicker/skin/datePicker.gif" width="16" height="22" align="absmiddle">
                     --%>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					承办部门：
				</td>
				<td>
					<select name="belongedDeptId">
                        <c:forEach items="${depts }" var="dept">
                            <option value="${dept.id }">${dept.deptName }</option>
                        </c:forEach>
                    </select><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					等级：
				</td>
				<td>
                    <select name="emergencyLevel">
                        <c:forEach items="${emergencyLevels }" var="el">
                            <option value="${el }">${el }
                        </c:forEach>
                    </select>
                    
					<!-- <input name="emergencyLevel" placeholder="请输入等级" ><br> -->
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					密级：
				</td>
				<td>
                    <select name="secretLevel">
                        <c:forEach items="${secretLevels }" var="sl">
                            <option value="${sl }">${sl }
                        </c:forEach>
                    </select>
                
					<!-- <input name="secretLevel" placeholder="请输入密级" ><br> -->
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					<input type="submit" value="提交">
				</td>
				
			</tr>
		</table>
		
	</form>

</body>
</html>