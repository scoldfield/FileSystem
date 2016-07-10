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



	<form action="${pageContext.request.contextPath }/fileMng/editPost" method="post">
		<table border="1" width="920" cellspacing="0" cellpadding="0" bgcolor="white" align="center">
			<tr align="center" height="40" >
				<td>
					档案编号：
				</td>
				<td>
                    <input name="id" value="${fileDto.id }" type="hidden">
					<input name="fileId" value="${fileDto.fileId }" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					档案标题：
				</td>
				<td>
					<input name="fileTitle" value="${fileDto.fileTitle }" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					签发人：
				</td>
				<td>
					<input name="issueUserName" value="${fileDto.issueUserName }" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文字号：
				</td>
				<td>
					<input name="generateWord" value="${fileDto.generateWord }" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文类型：
				</td>
				<td>
					<%-- <input name="generateType" value="${fileDto.generateType }" ><br> --%>
					<select name="generateType">
                        <c:forEach items="${generateTypes }" var="gtt">
                            <option value="${gtt }" <c:if test="${fileDto.generateType==gtt }">selected="selected"</c:if> >${gtt }
                        </c:forEach>
                    </select>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文机关：
				</td>
				<td>
					<input name="generateAgency" value="${fileDto.generateAgency }" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					发文地区：
				</td>
				<td>
					<input name="generateDistrict" value="${fileDto.generateDistrict }" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					页数：
				</td>
				<td>
					<input name="generatePage" value="${fileDto.generatePage }" ><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					附件：
				</td>
				<td>
					<c:if test="${fileDto.location!=null }">${fileDto.location }<br><a href="${pageContext.request.contextPath }/fileMng/upload?fileId=${fileDto.id }">重新上传</a></c:if>			
					<c:if test="${fileDto.location==null }"><a href="${pageContext.request.contextPath }/fileMng/upload?fileId=${fileDto.id }">上传附件</a></c:if>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					承办部门：
				</td>
				<td>
					<select name="belongedDeptId">
                            <%-- <option value="${fileDto.belongedDeptId}">${fileDto.belongedDeptName } --%>
                        <c:forEach items="${depts }" var="dept">
                            <option value="${dept.id }" <c:if test="${dept.id==fileDto.belongedDeptId }">selected="selected"</c:if>>${dept.deptName }</option>
                        </c:forEach>
                    </select><br>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					等级：
				</td>
				<td>
					<%-- <input name="emergencyLevel" value="${fileDto.emergencyLevel }" ><br> --%>
					<select name="emergencyLevel">
                        <c:forEach items="${emergencyLevels }" var="el">
                            <option value="${el }" <c:if test="${fileDto.emergencyLevel==el }">selected="selected"</c:if>  >${el }
                        </c:forEach>
                    </select>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					密级：
				</td>
				<td>
					<%-- <input name="secretLevel" value="${fileDto.secretLevel }" ><br> --%>
					<select name="secretLevel">
                        <c:forEach items="${secretLevels }" var="sl">
                            <option value="${sl }" <c:if test="${fileDto.secretLevel==sl }">selected="selected"</c:if> >${sl }
                        </c:forEach>
                    </select>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					<input type="submit" value="修改">
				</td>
				
			</tr>
		</table>
		
	</form>

</body>
</html>