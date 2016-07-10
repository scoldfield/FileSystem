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
				<td>
					审核人：
				</td>
				<td>
                    <c:if test="${fileDto.auditorName==null }">未被审核</c:if>
                    <c:if test="${fileDto.auditorName!=null }">${fileDto.auditorName }</c:if>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					审核序列号：
				</td>
				<td>
                    <c:if test="${fileDto.auditSerials==null }">未被审核</c:if>
                    <c:if test="${fileDto.auditSerials!=null }">${fileDto.auditSerials }</c:if>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					审核时间：
				</td>
				<td>
                    <c:if test="${fileDto.auditDate==null }">未被审核</c:if>
                    <c:if test="${fileDto.auditDate!=null }">${fileDto.auditDate }</c:if>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					审核结果：
				</td>
				<td>
                    <c:if test="${fileDto.auditResult=='1' }">审核通过</c:if>
                    <c:if test="${fileDto.auditResult=='0' }">未被审核</c:if>
                    <c:if test="${fileDto.auditResult=='-1' }">审核不通过</c:if>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					归档日期：
				</td>
				<td>
                    <c:if test="${fileDto.fillingDate==null }">未被归档</c:if>
                    <c:if test="${fileDto.fillingDate!=null }">${fileDto.fillingDate }</c:if>
				</td>
			</tr>
			<tr align="center" height="40" >
				<td>
					借阅人：
				</td>
				<td>
                <!-- 改成审核通过、审核不通过 -->
                    <!-- 未被审核  -->
                    <c:if test="${fileDto.auditResult=='0' }">
                       <a href="${pageContext.request.contextPath }/biz/receiveAudit?fileId=${fileDto.id}&res=1"> 审核通过&nbsp</a>
                        <a href="${pageContext.request.contextPath }/biz/receiveAudit?fileId=${fileDto.id}&res=-1">审核不通过</a>
                    </c:if>
                    
                    <!-- 审核不通过 -->
                    <%-- <c:if test="${fileDto.auditResult=='-1' }">审核不通过</c:if> --%>
                    
                    <!-- 已经审核过，且审核通过 -->
                    <%-- <c:if test="${fileDto.auditResult=='1' }"> 
                        <c:if test="${fileDto.isBorrowed==false }">可以借阅</c:if>
                        <c:if test="${fileDto.isBorrowed==true }">已经被借出，借阅人为${fileDto.borrowedName }</c:if>
                    </c:if> --%>
				</td>
			</tr>
		</table>
		
	</form>

</body>
</html>